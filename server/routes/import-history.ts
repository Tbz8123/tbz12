import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';

// Use global prisma instance to ensure consistency with other routes
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (global.prisma) {
    prisma = global.prisma;
  } else {
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    if (process.env.NODE_ENV === "development") global.prisma = prisma;
  }
}

const router = Router();

// Get all import history records with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = (page - 1) * limit;

    const status = req.query.status as string || null;
    const uploadedBy = req.query.uploadedBy as string || null;
    const search = req.query.search as string || null;
    const startDate = req.query.startDate as string || null;
    const endDate = req.query.endDate as string || null;
    const importType = req.query.importType as string || null;

    // Build where clause
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (uploadedBy) {
      where.uploadedBy = uploadedBy;
    }
    if (search) {
      where.fileName = {
        contains: search,
        mode: 'insensitive'
      };
    }
    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) {
        where.startedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.startedAt.lte = new Date(endDate);
      }
    }
    if (importType && importType !== 'all') {
      where.importType = importType;
    }

    // Get total count
    const totalCount = await prisma.importHistory.count({ where });

    // Get import history records
    const imports = await prisma.importHistory.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // Transform data to match frontend expectations
    const transformedImports = imports.map((imp) => ({
      id: imp.id,
      fileName: imp.fileName,
      fileSize: imp.fileSize,
      fileType: imp.fileType,
      status: imp.status,
      totalRecords: imp.totalRecords || 0,
      processedRecords: imp.processedRecords || 0,
      successCount: imp.successCount || 0,
      errorCount: imp.errorCount || 0,
      errors: imp.errors ? (Array.isArray(imp.errors) ? imp.errors : []) : [],
      progress: imp.progress || 0,
      currentOperation: (imp.metadata as Record<string, any>)?.currentOperation || null,
      uploadedBy: (imp.metadata as Record<string, any>)?.uploadedBy || 'admin',
      uploadedAt: imp.startedAt.toISOString(),
      startedAt: imp.startedAt.toISOString(),
      completedAt: imp.completedAt?.toISOString() || null,
      metadata: imp.metadata
    }));

    res.json({
      data: transformedImports,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching import history:', error);
    res.status(500).json({ error: 'Failed to fetch import history' });
  }
});

// Create a new import record
router.post('/', async (req: Request, res: Response) => {
  try {
    const createSchema = z.object({
      fileName: z.string(),
      fileSize: z.number(),
      fileType: z.string(),
      uploadedBy: z.string().optional(),
      status: z.string().optional().default('pending'),
      totalRecords: z.number().optional().default(0),
      processedRecords: z.number().optional().default(0),
      successCount: z.number().optional().default(0),
      errorCount: z.number().optional().default(0),
      progress: z.number().optional().default(0),
      errors: z.any().optional(),
      currentOperation: z.string().optional(),
      metadata: z.any().optional(),
    });

    const data = createSchema.parse(req.body);

    // Set importType based on metadata if available
    const importType = data.metadata?.importType || 'job_titles';

    const importRecord = await prisma.importHistory.create({
      data: {
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        importType: importType,
        status: data.status || 'pending',
        progress: Math.round(data.progress || 0),
        totalRecords: data.totalRecords || 0,
        processedRecords: data.processedRecords || 0,
        successCount: data.successCount || 0,
        errorCount: data.errorCount || 0,
        errors: data.errors || null,
        metadata: {
          ...data.metadata,
          uploadedBy: data.uploadedBy || 'admin',
          currentOperation: data.currentOperation || 'File uploaded, queued for processing...'
        }
      },
    });

    res.status(201).json(importRecord);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating import record:', error);
    res.status(500).json({ error: 'Failed to create import record' });
  }
});

// Trigger import processing on server side
router.post('/:id/process', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Starting server-side processing for job: ${id}`);
    const job = await prisma.importHistory.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Import job not found' });
    }
    // Start processing in background
    setImmediate(() => processImportJob(id, job));
    res.json({ message: 'Import processing started on server' });
  } catch (error: unknown) {
    console.error('Error starting import processing:', error);
    res.status(500).json({ error: 'Failed to start import processing' });
  }
});

// Get a single import record by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const record = await prisma.importHistory.findUnique({ where: { id } });

    if (!record) {
      return res.status(404).json({ error: 'Import record not found' });
    }

    const transformedRecord = {
      id: record.id,
      fileName: record.fileName,
      fileSize: record.fileSize,
      fileType: record.fileType,
      status: record.status,
      totalRecords: record.totalRecords || 0,
      processedRecords: record.processedRecords || 0,
      successCount: record.successCount || 0,
      errorCount: record.errorCount || 0,
      errors: record.errors ? (Array.isArray(record.errors) ? record.errors : []) : [],
      progress: record.progress || 0,
      currentOperation: (record.metadata as Record<string, any>)?.currentOperation || null,
      uploadedBy: (record.metadata as Record<string, any>)?.uploadedBy || 'admin',
      uploadedAt: record.startedAt.toISOString(),
      startedAt: record.startedAt.toISOString(),
      completedAt: record.completedAt?.toISOString() || null,
      metadata: record.metadata
    };

    res.json(transformedRecord);
  } catch (error: unknown) {
    console.error('Error fetching import record:', error);
    res.status(500).json({ error: 'Failed to fetch import record' });
  }
});

// Update import record
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Get current record state before update
    const currentRecord = await prisma.importHistory.findUnique({
      where: { id }
    });

    if (!currentRecord) {
      return res.status(404).json({ error: "Import record not found" });
    }

    // Prepare update data, merging with existing metadata
    const currentMeta = (currentRecord.metadata as Record<string, any>) || {};
    const newMeta = (updateData.metadata as Record<string, any>) || {};
    const updatedMetadata = {
      ...currentMeta,
      ...newMeta,
      currentOperation: updateData.currentOperation || currentMeta.currentOperation
    };

    const updatePayload: any = {};

    if (updateData.status !== undefined) updatePayload.status = updateData.status;
    if (updateData.progress !== undefined) {
      // Ensure progress is stored as an integer (Postgres integer column)
      updatePayload.progress = Math.round(updateData.progress);
    }
    if (updateData.totalRecords !== undefined) updatePayload.totalRecords = updateData.totalRecords;
    if (updateData.processedRecords !== undefined) updatePayload.processedRecords = updateData.processedRecords;
    if (updateData.successCount !== undefined) updatePayload.successCount = updateData.successCount;
    if (updateData.errorCount !== undefined) updatePayload.errorCount = updateData.errorCount;
    if (updateData.errors !== undefined) updatePayload.errors = updateData.errors;
    if (updateData.completedAt !== undefined) updatePayload.completedAt = new Date(updateData.completedAt);
    if (updateData.startedAt !== undefined) updatePayload.startedAt = new Date(updateData.startedAt);

    updatePayload.metadata = updatedMetadata;
    updatePayload.updatedAt = new Date();

    const updatedRecord = await prisma.importHistory.update({
      where: { id },
      data: updatePayload,
    });

    res.json(updatedRecord);
  } catch (error: unknown) {
    console.error('Error updating import record:', error);
    res.status(500).json({ error: 'Failed to update import record' });
  }
});

// Delete import record
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete import history record: ${id}`);

    // Check if the record exists
    const existingRecord = await prisma.importHistory.findUnique({
      where: { id }
    });

    if (!existingRecord) {
      console.log(`Import record ${id} not found`);
      return res.status(404).json({ error: "Import record not found" });
    }

    // Delete the record
    await prisma.importHistory.delete({
      where: { id }
    });

    console.log(`Import record ${id} deleted successfully`);
    res.status(204).send();
  } catch (error: unknown) {
    console.error('Error deleting import record:', error);
    res.status(500).json({ error: 'Failed to delete import record' });
  }
});

// Server-side import processing function
async function processImportJob(jobId: string, job: Record<string, any>) {
  const updateJob = async (data: Record<string, any>) => {
    try {
      const { currentOperation, ...otherData } = data;
      const updateData: Prisma.ImportHistoryUpdateInput = {
        ...otherData,
        updatedAt: new Date()
      };

      // Store currentOperation in metadata if provided
      if (currentOperation !== undefined) {
        const currentJob = await prisma.importHistory.findUnique({
          where: { id: jobId },
          select: { metadata: true }
        });

        const currentMetadata = (currentJob?.metadata as Record<string, any>) || {};
        updateData.metadata = {
          ...currentMetadata,
          currentOperation
        };
      }

      await prisma.importHistory.update({
        where: { id: jobId },
        data: updateData
      });
    } catch (error: unknown) {
      console.error('Failed to update import job:', error);
    }
  };

  try {
    console.log(`🚀 Processing import job ${jobId}: ${job.fileName}`);

    const metadata = (job.metadata as Record<string, any>) || {};

    // Update status to processing
    await updateJob({
      status: 'processing',
      startedAt: new Date(),
      currentOperation: 'Server-side processing started...'
    });
    const csvData = metadata?.csvData;
    const importType = metadata?.importType || 'job_titles';

    console.log(`📋 Import type: ${importType}`);
    console.log(`📄 CSV data length: ${csvData?.length || 0} characters`);

    if (!csvData) {
      throw new Error('No CSV data found in job metadata');
    }

    if (importType === 'job_titles') {
      console.log('🔧 Starting job titles import processing...');
      await processJobTitlesImportServerSide(csvData, jobId, updateJob);
    } else if (importType === 'skills') {
      console.log('🎯 Starting skills import processing...');
      await processSkillsImportServerSide(csvData, jobId, updateJob);
    } else if (importType === 'professional_summaries' || importType === 'professional-summaries') {
      console.log('📝 Starting professional summaries import processing...');
      await processProfessionalSummariesImportServerSide(csvData, jobId, updateJob);
    } else {
      throw new Error(`Unknown import type: ${importType}`);
    }

    console.log(`✅ Import job ${jobId} completed successfully`);

  } catch (error: unknown) {
    console.error(`❌ Import job ${jobId} failed:`, error);
    await updateJob({
      status: 'failed',
      completedAt: new Date(),
      currentOperation: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

// Define interface for update job callback
interface UpdateJobCallback {
  (data: Record<string, any>): Promise<void>;
}

async function processJobTitlesImportServerSide(csvData: string, jobId: string, updateJob: UpdateJobCallback) {
  console.log('🚀 Starting job titles import processing...');

  // Get deleteMissingTitles setting from job metadata
  let deleteMissingTitles = false;
  try {
    const job = await prisma.importHistory.findUnique({
      where: { id: jobId }
    });
    const metadata = job?.metadata;
    if (metadata && typeof metadata === 'object' && 'deleteMissingTitles' in metadata) {
      deleteMissingTitles = Boolean(metadata.deleteMissingTitles);
    }
    console.log('🗑️ Delete missing titles setting:', deleteMissingTitles);
  } catch (err: unknown) {
    console.error('Failed to get job metadata:', err);
  }

  // Parse CSV data
  const lines = csvData.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  if (lines.length < 2) {
    throw new Error('File must contain at least one data row');
  }

  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  // Group data by job title
  const groupedData = new Map();

  rows.forEach((row, index) => {
    if (!row.title) {
      console.warn(`Row ${index + 2}: Missing title, skipping`);
      return;
    }

    const titleKey = row.title.toLowerCase().trim();

    if (!groupedData.has(titleKey)) {
      groupedData.set(titleKey, {
        titleInfo: {
          title: row.title.trim(),
          category: row.category || 'General'
        },
        descriptions: []
      });
    }

    if (row.description && row.description.trim()) {
      groupedData.get(titleKey).descriptions.push({
        content: row.description.trim(),
        isRecommended: row.isRecommended === 'true' || row.isRecommended === '1'
      });
    }
  });

  const totalGroups = groupedData.size;
  let processedCount = 0;

  console.log(`Processing ${totalGroups} job title groups`);

  // Handle deleteMissingTitles logic
  if (deleteMissingTitles) {
    console.log('🗑️ Handling deleteMissingTitles logic...');

    await updateJob({
      currentOperation: 'Checking for job titles to delete...'
    });

    try {
      // Get all existing job titles
      const existingTitles = await prisma.jobTitle.findMany({
        select: { id: true, title: true }
      });

      // Build a Set of normalized titles that are present in the uploaded file
      const uploadedTitleSet = new Set(
        Array.from(groupedData.values()).map((g: Record<string, any>) => g.titleInfo.title.toLowerCase().trim())
      );

      // Identify titles that are NOT in the uploaded file
      const titlesToDelete = existingTitles.filter((t) => !uploadedTitleSet.has(t.title.toLowerCase().trim()));

      if (titlesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${titlesToDelete.length} job titles not present in uploaded file:`);
        titlesToDelete.forEach((t) => console.log(`  - "${t.title}" (ID: ${t.id})`));

        // Delete job descriptions first, then job titles
        for (const title of titlesToDelete) {
          const descriptionsDeleted = await prisma.jobDescription.deleteMany({
            where: { jobTitleId: title.id }
          });
          console.log(`🗑️ Deleted ${descriptionsDeleted.count} job descriptions for: ${title.title}`);
        }

        const deletedTitles = await prisma.jobTitle.deleteMany({
          where: {
            id: { in: titlesToDelete.map(t => t.id) }
          }
        });

        console.log(`🗑️ Successfully deleted ${deletedTitles.count} job titles`);
      } else {
        console.log('✅ No job titles to delete (all existing titles are present in uploaded file)');
      }
    } catch (deleteError: unknown) {
      console.error('❌ Error during deletion process:', deleteError);
      // Continue with import even if deletion fails
    }
  }

  await updateJob({
    totalRecords: totalGroups,
    processedRecords: 0,
    progress: 0,
    currentOperation: `Processing ${totalGroups} job titles...`
  });

  for (const [titleKey, group] of Array.from(groupedData.entries())) {
    const { titleInfo, descriptions } = group;
    processedCount++;

    const currentProgress = (processedCount / totalGroups) * 100;

    await updateJob({
      totalRecords: totalGroups,
      processedRecords: processedCount,
      progress: currentProgress,
      currentOperation: `Processing "${titleInfo.title}" with ${descriptions.length} description(s)...`
    });

    try {
      // Create or find job title
      let jobTitle = await prisma.jobTitle.findFirst({
        where: {
          title: {
            equals: titleInfo.title,
            mode: 'insensitive'
          }
        }
      });

      if (!jobTitle) {
        console.log(`📝 Creating new JobTitle: "${titleInfo.title}" with category: "${titleInfo.category}"`);
        jobTitle = await prisma.jobTitle.create({
          data: {
            title: titleInfo.title,
            category: titleInfo.category
          }
        });
        console.log(`✅ Created new JobTitle: ${titleInfo.title} with ID: ${jobTitle.id}`);
      } else {
        console.log(`✅ Found existing JobTitle: ${titleInfo.title} with ID: ${jobTitle.id}`);

        // Clear existing job descriptions for this title
        const deleteResult = await prisma.jobDescription.deleteMany({
          where: { jobTitleId: jobTitle.id }
        });
        console.log(`🗑️ Cleared ${deleteResult.count} existing job descriptions for: ${titleInfo.title}`);
      }

      // Add descriptions
      console.log(`📊 Adding ${descriptions.length} job descriptions for: ${titleInfo.title}`);

      for (let i = 0; i < descriptions.length; i++) {
        const desc = descriptions[i];
        try {
          console.log(`📝 Creating job description ${i + 1}/${descriptions.length}: "${desc.content.substring(0, 50)}..." (recommended: ${desc.isRecommended})`);

          const newDescription = await prisma.jobDescription.create({
            data: {
              jobTitleId: jobTitle.id,
              content: desc.content,
              isRecommended: desc.isRecommended
            }
          });

          console.log(`✅ Created job description with ID: ${newDescription.id}`);
        } catch (error: unknown) {
          // Ignore duplicate descriptions
          const prismaError = error as { code?: string };
          if (prismaError?.code !== 'P2002') {
            console.error(`❌ Failed to create description for ${titleInfo.title}:`, error);
          } else {
            console.log(`⚠️ Duplicate description skipped for ${titleInfo.title}`);
          }
        }
      }

      console.log(`✅ Successfully processed ${descriptions.length} descriptions for ${titleInfo.title}`);

    } catch (error: unknown) {
      console.error(`Error processing ${titleInfo.title}:`, error);
    }

    // Small delay to prevent overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Complete the import
  await updateJob({
    status: 'completed',
    completedAt: new Date(),
    progress: 100,
    successCount: processedCount,
    currentOperation: `Import completed successfully! Processed ${processedCount} job titles.`
  });
}

async function processSkillsImportServerSide(csvData: string, jobId: string, updateJob: UpdateJobCallback) {
  console.log('🚀 Starting skills import processing...');

  // Test database connection first
  try {
    const testCount = await prisma.skillsJobTitle.count();
    console.log(`✅ Database connection test passed. Current SkillsJobTitle count: ${testCount}`);
  } catch (error: unknown) {
    console.error('❌ Database connection test failed:', error);
    throw new Error('Database connection failed');
  }

  // Get deleteMissingTitles setting from job metadata
  let deleteMissingTitles = false;
  try {
    const job = await prisma.importHistory.findUnique({
      where: { id: jobId }
    });
    const metadata = job?.metadata;
    if (metadata && typeof metadata === 'object' && 'deleteMissingTitles' in metadata) {
      deleteMissingTitles = Boolean(metadata.deleteMissingTitles);
    }
    console.log('🗑️ Delete missing titles setting:', deleteMissingTitles);
  } catch (err) {
    console.error('Failed to get job metadata:', err);
  }

  // Parse CSV data using a more robust approach
  const lines = csvData.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    throw new Error('File must contain at least one data row');
  }

  // Parse headers and normalize them
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
  console.log('CSV Headers found:', headers);

  const rows = lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex] || '';
    });
    return row;
  });

  console.log(`Parsed ${rows.length} data rows`);

  // Group data by skills job title
  const groupedData = new Map<string, { title: string; category: string; skills: Array<{ content: string; isRecommended: boolean }> }>();

  rows.forEach((row, index) => {
    if (!row.title) {
      console.warn(`Row ${index + 2}: Missing title, skipping`);
      return;
    }

    const titleKey = row.title.toLowerCase().trim();

    if (!groupedData.has(titleKey)) {
      groupedData.set(titleKey, {
        title: row.title.trim(),
        category: row.category || 'General',
        skills: []
      });
    }

    // Accept multiple column names for skill content
    const contentVal = row.content || row.description || row.desc || row.skill || row.skills;
    if (contentVal && contentVal.trim()) {
      // Handle isRecommended flag with multiple possible column names
      const rawFlag = row.isrecommended || row.isrecommended || row.recommended || row.is_rec || row.isrec || '';
      const isRecBool = String(rawFlag).toLowerCase() === 'true' || String(rawFlag) === '1';

      groupedData.get(titleKey)!.skills.push({
        content: String(contentVal).trim(),
        isRecommended: isRecBool
      });
    }
  });

  const totalGroups = groupedData.size;
  let processedCount = 0;

  console.log(`Processing ${totalGroups} skill job title groups`);

  // Handle deleteMissingTitles logic
  if (deleteMissingTitles) {
    console.log('🗑️ Handling deleteMissingTitles logic...');

    await updateJob({
      currentOperation: 'Checking for skills job titles to delete...'
    });

    try {
      // Get all existing skills job titles
      const existingTitles = await prisma.skillsJobTitle.findMany({
        select: { id: true, title: true }
      });

      // Build a Set of normalized titles that are present in the uploaded file
      const uploadedTitleSet = new Set(
        Array.from(groupedData.values()).map((g) => g.title.toLowerCase().trim())
      );

      // Identify titles that are NOT in the uploaded file
      const titlesToDelete = existingTitles.filter((t) => !uploadedTitleSet.has(t.title.toLowerCase().trim()));

      if (titlesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${titlesToDelete.length} skills job titles not present in uploaded file:`);
        titlesToDelete.forEach((t) => console.log(`  - "${t.title}" (ID: ${t.id})`));

        // Delete skill categories first, then job titles
        for (const title of titlesToDelete) {
          const skillCategoriesDeleted = await prisma.skillCategory.deleteMany({
            where: { skillsJobTitleId: title.id }
          });
          console.log(`🗑️ Deleted ${skillCategoriesDeleted.count} skill categories for: ${title.title}`);
        }

        const deletedTitles = await prisma.skillsJobTitle.deleteMany({
          where: {
            id: { in: titlesToDelete.map((t: any) => t.id) }
          }
        });

        console.log(`🗑️ Successfully deleted ${deletedTitles.count} skills job titles`);
      } else {
        console.log('✅ No skills job titles to delete (all existing titles are present in uploaded file)');
      }
    } catch (deleteError) {
      console.error('❌ Error during deletion process:', deleteError);
      // Continue with import even if deletion fails
    }
  }

  await updateJob({
    totalRecords: totalGroups,
    processedRecords: 0,
    progress: 0,
    currentOperation: `Processing ${totalGroups} skills job titles...`
  });

  // Process each skills job title group
  for (const [titleKey, group] of Array.from(groupedData.entries())) {
    processedCount++;

    const currentProgress = Math.round((processedCount / totalGroups) * 100);

    await updateJob({
      totalRecords: totalGroups,
      processedRecords: processedCount,
      progress: currentProgress,
      currentOperation: `Processing "${group.title}" with ${group.skills.length} skill(s)...`
    });

    console.log(`Processing group ${processedCount}/${totalGroups}: ${group.title} with ${group.skills.length} skills`);

    try {
      console.log(`🔍 Looking for existing SkillsJobTitle: "${group.title}"`);

      // Create or find skills job title
      let skillsJobTitle = await prisma.skillsJobTitle.findFirst({
        where: {
          title: {
            equals: group.title,
            mode: 'insensitive'
          }
        }
      });

      if (!skillsJobTitle) {
        console.log(`📝 Creating new SkillsJobTitle: "${group.title}" with category: "${group.category}"`);

        skillsJobTitle = await prisma.skillsJobTitle.create({
          data: {
            title: group.title,
            category: group.category
          }
        });
        console.log(`✅ Created new SkillsJobTitle: ${group.title} with ID: ${skillsJobTitle.id}`);
      } else {
        console.log(`✅ Found existing SkillsJobTitle: ${group.title} with ID: ${skillsJobTitle.id}`);

        // Clear existing skill categories for this title
        const deleteResult = await prisma.skillCategory.deleteMany({
          where: { skillsJobTitleId: skillsJobTitle.id }
        });
        console.log(`🗑️ Cleared ${deleteResult.count} existing skill categories for: ${group.title}`);
      }

      // Add skill categories
      console.log(`📊 Adding ${group.skills.length} skill categories for: ${group.title}`);

      for (let i = 0; i < group.skills.length; i++) {
        const skill = group.skills[i];
        try {
          console.log(`📝 Creating skill category ${i + 1}/${group.skills.length}: "${skill.content}" (recommended: ${skill.isRecommended})`);

          const newSkillCategory = await prisma.skillCategory.create({
            data: {
              skillsJobTitleId: skillsJobTitle.id,
              content: skill.content,
              isRecommended: skill.isRecommended
            }
          });

          console.log(`✅ Created skill category with ID: ${newSkillCategory.id}`);

        } catch (error: unknown) {
          console.error(`❌ Failed to create skill category "${skill.content}" for ${group.title}:`, error);

          // Log more details about the error
          if (error instanceof Error) {
            console.error(`Error message: ${error.message}`);
            console.error(`Error stack: ${error.stack}`);
          }
        }
      }

      console.log(`✅ Successfully processed ${group.skills.length} skills for ${group.title}`);

    } catch (error: unknown) {
      console.error(`❌ Error processing skills job title ${group.title}:`, error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
      }
    }

    // Small delay to prevent overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Complete the import
  await updateJob({
    status: 'completed',
    completedAt: new Date(),
    progress: 100,
    successCount: processedCount,
    currentOperation: `Import completed successfully! Processed ${processedCount} skills job titles.`
  });

  console.log(`Skills import completed successfully. Processed ${processedCount} skills job titles.`);
}

async function processProfessionalSummariesImportServerSide(csvData: string, jobId: string, updateJob: UpdateJobCallback) {
  console.log('🚀 Starting professional summaries import processing...');

  // Test database connection first
  try {
    const testCount = await prisma.professionalSummaryJobTitle.count();
    console.log(`✅ Database connection test passed. Current ProfessionalSummaryJobTitle count: ${testCount}`);
  } catch (error: unknown) {
    console.error('❌ Database connection test failed:', error);
    throw new Error('Database connection failed');
  }

  // Get deleteMissingTitles setting from job metadata
  let deleteMissingTitles = false;
  try {
    const job = await prisma.importHistory.findUnique({
      where: { id: jobId }
    });
    const metadata = job?.metadata;
    if (metadata && typeof metadata === 'object' && 'deleteMissingTitles' in metadata) {
      deleteMissingTitles = Boolean(metadata.deleteMissingTitles);
    }
    console.log('🗑️ Delete missing titles setting:', deleteMissingTitles);
  } catch (error: unknown) {
    console.error('Failed to get job metadata:', error);
  }

  // Parse CSV data
  const lines = csvData.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    throw new Error('File must contain at least one data row');
  }

  // Parse headers and normalize them
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
  console.log('CSV Headers found:', headers);

  const rows = lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex] || '';
    });
    return row;
  });

  console.log(`Parsed ${rows.length} data rows`);

  // Group data by professional summary job title
  const groupedData = new Map<string, { title: string; category: string; summaries: any[] }>();

  rows.forEach((row, index) => {
    if (!row.title) {
      console.warn(`Row ${index + 2}: Missing title, skipping`);
      return;
    }

    const titleKey = row.title.toLowerCase().trim();

    if (!groupedData.has(titleKey)) {
      groupedData.set(titleKey, {
        title: row.title.trim(),
        category: row.category || 'General',
        summaries: []
      });
    }

    // Accept multiple column names for summary content
    const contentVal = row.content || row.description || row.summary || row.text;
    if (contentVal && contentVal.trim()) {
      // Handle isRecommended flag with multiple possible column names
      const rawFlag = row.isrecommended || row.recommended || row.is_rec || row.isrec || '';
      const isRecBool = String(rawFlag).toLowerCase() === 'true' || String(rawFlag) === '1';

      groupedData.get(titleKey)!.summaries.push({
        content: String(contentVal).trim(),
        isRecommended: isRecBool
      });
    }
  });

  const totalGroups = groupedData.size;
  let processedCount = 0;

  console.log(`Processing ${totalGroups} professional summary job title groups`);

  // Handle deleteMissingTitles logic
  if (deleteMissingTitles) {
    console.log('🗑️ Handling deleteMissingTitles logic...');

    await updateJob({
      currentOperation: 'Checking for professional summary job titles to delete...'
    });

    try {
      // Get all existing professional summary job titles
      const existingTitles = await prisma.professionalSummaryJobTitle.findMany({
        select: { id: true, title: true }
      });

      // Build a Set of normalized titles that are present in the uploaded file
      const uploadedTitleSet = new Set(
        Array.from(groupedData.values()).map((g: any) => g.title.toLowerCase().trim())
      );

      // Identify titles that are NOT in the uploaded file
      const titlesToDelete = existingTitles.filter((t: any) => 
        !uploadedTitleSet.has(t.title.toLowerCase().trim())
      );

      if (titlesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${titlesToDelete.length} professional summary job title(s) not present in uploaded file`);

        await updateJob({
          currentOperation: `Deleting ${titlesToDelete.length} professional summary job title(s) not present in uploaded file...`
        });

        for (const title of titlesToDelete) {
          try {
            console.log(`🗑️ Deleting professional summary job title: ${title.title} (ID: ${title.id})`);
            await prisma.professionalSummaryJobTitle.delete({
              where: { id: title.id }
            });
          } catch (delErr: unknown) {
            console.error(`❌ Failed to delete professional summary job title ${title.title}:`, delErr);
          }
        }

        console.log(`✅ Successfully deleted ${titlesToDelete.length} professional summary job title(s)`);
      } else {
        console.log('✅ No professional summary job titles to delete');
      }
    } catch (delError: unknown) {
      console.error('❌ Error during deleteMissingTitles processing:', delError);
    }
  }

  await updateJob({
    totalRecords: totalGroups,
    processedRecords: 0,
    progress: 0,
    currentOperation: `Processing ${totalGroups} professional summary job titles...`
  });

  // Process each professional summary job title group
  for (const [titleKey, group] of Array.from(groupedData.entries())) {
    processedCount++;

    const currentProgress = Math.round((processedCount / totalGroups) * 100);

    await updateJob({
      totalRecords: totalGroups,
      processedRecords: processedCount,
      progress: currentProgress,
      currentOperation: `Processing "${group.title}" with ${group.summaries.length} professional summary(s)...`
    });

    console.log(`Processing group ${processedCount}/${totalGroups}: ${group.title} with ${group.summaries.length} summaries`);

    try {
      console.log(`🔍 Looking for existing ProfessionalSummaryJobTitle: "${group.title}"`);

      // Create or find professional summary job title
      let professionalSummaryJobTitle = await prisma.professionalSummaryJobTitle.findFirst({
        where: {
          title: {
            equals: group.title,
            mode: 'insensitive'
          }
        }
      });

      if (!professionalSummaryJobTitle) {
        console.log(`📝 Creating new ProfessionalSummaryJobTitle: "${group.title}" with category: "${group.category}"`);

        professionalSummaryJobTitle = await prisma.professionalSummaryJobTitle.create({
          data: {
            title: group.title,
            category: group.category
          }
        });
        console.log(`✅ Created new ProfessionalSummaryJobTitle: ${group.title} with ID: ${professionalSummaryJobTitle.id}`);
      } else {
        console.log(`✅ Found existing ProfessionalSummaryJobTitle: ${group.title} with ID: ${professionalSummaryJobTitle.id}`);

        // Clear existing professional summaries for this title
        const deleteResult = await prisma.professionalSummary.deleteMany({
          where: { professionalSummaryJobTitleId: professionalSummaryJobTitle.id }
        });
        console.log(`🗑️ Cleared ${deleteResult.count} existing professional summaries for: ${group.title}`);
      }

      // Add professional summaries
      console.log(`📊 Adding ${group.summaries.length} professional summaries for: ${group.title}`);

      for (let i = 0; i < group.summaries.length; i++) {
        const summary = group.summaries[i];
        try {
          console.log(`📝 Creating professional summary ${i + 1}/${group.summaries.length}: "${summary.content.substring(0, 50)}..." (recommended: ${summary.isRecommended})`);

          const newProfessionalSummary = await prisma.professionalSummary.create({
            data: {
              professionalSummaryJobTitleId: professionalSummaryJobTitle.id,
              content: summary.content,
              isRecommended: summary.isRecommended
            }
          });

          console.log(`✅ Created professional summary with ID: ${newProfessionalSummary.id}`);

        } catch (error: unknown) {
          console.error(`❌ Failed to create professional summary "${summary.content.substring(0, 50)}..." for ${group.title}:`, error);

          // Log more details about the error
          if (error instanceof Error) {
            console.error(`Error message: ${error.message}`);
            console.error(`Error stack: ${error.stack}`);
          }
        }
      }

      console.log(`✅ Successfully processed ${group.summaries.length} professional summaries for ${group.title}`);

    } catch (error: unknown) {
      console.error(`❌ Error processing professional summary job title ${group.title}:`, error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
      }
    }

    // Small delay to prevent overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Complete the import
  await updateJob({
    status: 'completed',
    completedAt: new Date(),
    progress: 100,
    successCount: processedCount,
    currentOperation: `Import completed successfully! Processed ${processedCount} professional summary job titles.`
  });

  console.log(`Professional summaries import completed successfully. Processed ${processedCount} professional summary job titles.`);
}

export { router as importHistoryRouter };