import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Briefcase,
  FileText,
  Star,

  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface JobTitle {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface JobDescription {
  id: number;
  jobTitleId: number;
  content: string;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function JobTitlesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
  const [searchTitles, setSearchTitles] = useState('');
  const [searchDescriptions, setSearchDescriptions] = useState('');
  const [isAddingTitle, setIsAddingTitle] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState<JobDescription | null>(null);

  // Import/Export states
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [deleteMissingTitles, setDeleteMissingTitles] = useState(false);
  const [importJobId, setImportJobId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form states
  const [titleForm, setTitleForm] = useState({ title: '', category: '' });
  const [descriptionForm, setDescriptionForm] = useState({ content: '', isRecommended: false });

  // Listen for resume import job messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'RESUME_IMPORT_JOB') {
        const jobId = event.data.jobId;
        console.log('Received resume import job message for job:', jobId);
        handleResumedImport(jobId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch job titles
  const { data: jobTitlesResponse, isLoading: isLoadingTitles } = useQuery({
    queryKey: ['job-titles', searchTitles],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTitles) params.append('search', searchTitles);
      const response = await fetch(`/api/jobs/titles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch job titles');
      return response.json();
    },
  });

  // Fetch job descriptions for selected title
  const { data: jobDescriptions, isLoading: isLoadingDescriptions } = useQuery({
    queryKey: ['job-descriptions', selectedJobTitle?.id, searchDescriptions],
    queryFn: async () => {
      if (!selectedJobTitle) return [];
      const params = new URLSearchParams();
      params.append('jobTitleId', selectedJobTitle.id.toString());
      if (searchDescriptions) params.append('search', searchDescriptions);
      const response = await fetch(`/api/jobs/descriptions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch job descriptions');
      return response.json();
    },
    enabled: !!selectedJobTitle,
  });

  const jobTitles = jobTitlesResponse?.data || [];

  // Mutations
  const createTitleMutation = useMutation({
    mutationFn: async (data: { title: string; category: string }) => {
      const response = await fetch('/api/jobs/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create job title');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-titles'] });
      setIsAddingTitle(false);
      setTitleForm({ title: '', category: '' });
      toast({ title: 'Success', description: 'Job title created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; category: string }) => {
      const response = await fetch(`/api/jobs/titles/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, category: data.category }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update job title');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-titles'] });
      setIsEditingTitle(false);
      setTitleForm({ title: '', category: '' });
      toast({ title: 'Success', description: 'Job title updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteTitleMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting job title with ID:', id);
      const response = await fetch(`/api/jobs/titles/${id}`, { method: 'DELETE' });
      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        throw new Error(`Failed to delete job title: ${errorText}`);
      }

      const result = await response.json();
      console.log('Delete successful:', result);
      return result;
    },
    onSuccess: (_data, variables) => {
      console.log('onSuccess triggered for ID:', variables);
      queryClient.invalidateQueries({ queryKey: ['job-titles'] });
      if (selectedJobTitle && selectedJobTitle.id === variables) {
        setSelectedJobTitle(null);
      }
      toast({ title: 'Success', description: 'Job title deleted successfully' });
    },
    onError: (error: Error, variables) => {
      console.error('onError triggered for ID:', variables, 'Error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const createDescriptionMutation = useMutation({
    mutationFn: async (data: { jobTitleId: number; content: string; isRecommended: boolean }) => {
      const response = await fetch('/api/jobs/descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create description');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
      setIsAddingDescription(false);
      setDescriptionForm({ content: '', isRecommended: false });
      toast({ title: 'Success', description: 'Description created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async (data: { id: number; content: string; isRecommended: boolean }) => {
      const response = await fetch(`/api/jobs/descriptions/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content, isRecommended: data.isRecommended }),
      });
      if (!response.ok) throw new Error('Failed to update description');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
      setIsEditingDescription(null);
      setDescriptionForm({ content: '', isRecommended: false });
      toast({ title: 'Success', description: 'Description updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteDescriptionMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting job description with ID:', id);
      const response = await fetch(`/api/jobs/descriptions/${id}`, { method: 'DELETE' });
      console.log('Delete description response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete description failed:', errorText);
        throw new Error(`Failed to delete description: ${errorText}`);
      }

      const result = await response.json();
      console.log('Delete description successful:', result);
      return result;
    },
    onSuccess: (_data, variables) => {
      console.log('onSuccess triggered for description ID:', variables);
      queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
      toast({ title: 'Success', description: 'Description deleted successfully' });
    },
    onError: (error: Error, variables) => {
      console.error('onError triggered for description ID:', variables, 'Error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Export/Import Functions
  const exportData = async (format: 'csv' | 'excel' | 'json') => {
    try {
      // Fetch all job titles with their descriptions
      const allTitlesResponse = await fetch('/api/jobs/titles?limit=1000');
      if (!allTitlesResponse.ok) throw new Error('Failed to fetch data for export');
      const allTitlesData = await allTitlesResponse.json();

      const exportData = [];

      for (const title of allTitlesData.data) {
        const descriptionsResponse = await fetch(`/api/jobs/descriptions?jobTitleId=${title.id}&limit=1000`);
        if (descriptionsResponse.ok) {
          const descriptions = await descriptionsResponse.json();

          if (descriptions.length === 0) {
            exportData.push({
              id: title.id,
              title: title.title,
              category: title.category,
              description: '',
              isRecommended: false,
              createdAt: title.createdAt,
              updatedAt: title.updatedAt
            });
          } else {
            descriptions.forEach((desc: JobDescription) => {
              exportData.push({
                id: title.id,
                title: title.title,
                category: title.category,
                description: desc.content,
                isRecommended: desc.isRecommended,
                createdAt: title.createdAt,
                updatedAt: title.updatedAt
              });
            });
          }
        }
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, 'job-titles-descriptions.json');
      } else if (format === 'csv') {
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, 'job-titles-descriptions.csv');
      } else if (format === 'excel') {
        // For Excel, we'll use CSV format but with .xlsx extension
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        downloadFile(blob, 'job-titles-descriptions.xlsx');
      }

      toast({ title: 'Success', description: `Data downloaded as ${format.toUpperCase()} successfully` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download data', variant: 'destructive' });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header]?.toString() || '';
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Just set the selected file, don't process yet
    setSelectedFile(file);
  };

  const handleSubmitImport = async () => {
    if (!selectedFile) {
      toast({ title: 'Error', description: 'Please select a file first', variant: 'destructive' });
      return;
    }

    try {
      console.log('=== STARTING IMPORT PROCESS ===');
      console.log('Selected file:', selectedFile.name, selectedFile.size);

      // Read file content
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(selectedFile);
      });

      console.log('File content read, length:', text.length);
      console.log('File preview:', text.substring(0, 200) + '...');

      // Create import job record
      console.log('Creating import job record...');
      const importJobResponse = await fetch('/api/import-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type || 'text/csv',
          uploadedBy: 'admin', // You can get this from auth context
          status: 'pending',
          totalRecords: 0,
          processedRecords: 0,
          successCount: 0,
          errorCount: 0,
          progress: 0,
          errors: null,
          currentOperation: 'File uploaded, queued for processing...',
          metadata: {
            csvData: text,
            deleteMissingTitles: deleteMissingTitles,
            importType: 'job_titles'
          }
        })
      });

      if (!importJobResponse.ok) {
        const errorText = await importJobResponse.text();
        console.error('Failed to create import job:', importJobResponse.status, errorText);
        throw new Error('Failed to create import job');
      }

      const importJob = await importJobResponse.json();
      console.log('Import job created successfully:', importJob);

      // Close the import dialog and reset file selection
      setShowImportDialog(false);
      setSelectedFile(null);

      // Navigate to Import History page immediately
      console.log('Navigating to import history page...');
      setLocation('/admin/import-history');

      // Trigger server-side processing
      console.log('Triggering server-side processing...');
      try {
        const processResponse = await fetch(`/api/import-history/${importJob.id}/process`, {
          method: 'POST'
        });

        if (processResponse.ok) {
          console.log('Server-side processing triggered successfully');
        } else {
          console.error('Failed to trigger server-side processing:', processResponse.status);
        }
      } catch (triggerError) {
        console.error('Error triggering server-side processing:', triggerError);
      }

    } catch (error) {
      console.error('Import failed:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Import failed',
        variant: 'destructive' 
      });
    }
  };

  const _processImportInBackground = async (jobId: string, csvData: string, fileName: string) => {
    try {
      console.log('=== BACKGROUND IMPORT STARTING ===');
      console.log('Job ID received:', jobId);
      console.log('Setting importJobId state...');
      setImportJobId(jobId);
      console.log('importJobId state set to:', jobId);

      // Update job status to processing
      console.log('Updating job status to processing...');
      const updateResponse = await fetch(`/api/import-history/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'processing',
          startedAt: new Date(),
          currentOperation: 'Starting import process...'
        })
      });

      if (!updateResponse.ok) {
        console.error('Failed to update job status to processing:', updateResponse.status);
        const errorText = await updateResponse.text();
        console.error('Error response:', errorText);
      } else {
        console.log('Job status updated to processing successfully');
        const result = await updateResponse.json();
        console.log('Update result:', result);
      }

      // Process the import
      console.log('Starting data processing...');
      await processImportFromData(csvData, fileName, jobId);

    } catch (error) {
      console.error('Background import failed:', error);

      if (jobId) {
        try {
          await fetch(`/api/import-history/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'failed',
              completedAt: new Date(),
              currentOperation: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
          });
        } catch (updateError) {
          console.error('Failed to update job status to failed:', updateError);
        }
      }
    }
  };

  const handleResumedImport = async (jobId: string) => {
    // This function will be called when a job is resumed
    // It should get the job details and continue processing
    try {
      const response = await fetch(`/api/import-history/${jobId}`);
      if (!response.ok) throw new Error('Failed to get job details');

      const job = await response.json();

      // Set the current import job ID
      setImportJobId(jobId);

      // Update job status to processing
      await fetch(`/api/import-history/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'processing',
          currentOperation: 'Resuming import process...'
        })
      });

      // Get the original file data from metadata and continue processing
      if (job.metadata && job.metadata.csvData) {
        await processImportFromData(job.metadata.csvData, job.fileName, jobId);
      } else {
        throw new Error('Cannot resume: original file data not found');
      }
    } catch (error) {
      console.error('Failed to resume import:', error);
      // Since we're not showing progress in this component anymore, just log the error
      // The Import History page will handle showing the error status
    }
  };

  const processImportFromData = async (csvData: string, _fileName: string, jobId?: string) => {
    const currentJobId = jobId || importJobId;
    console.log('processImportFromData called with jobId:', currentJobId);

    // Helper function to update import job with explicit job ID
    const updateJob = async (data: any) => {
      console.log('=== UPDATE JOB CALLED ===');
      console.log('Using jobId:', currentJobId);
      console.log('Data to update:', data);

      if (!currentJobId) {
        console.log('No jobId available, skipping update');
        return;
      }

      try {
        console.log('Sending update request to:', `/api/import-history/${currentJobId}`);

        const response = await fetch(`/api/import-history/${currentJobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        console.log('Update response status:', response.status);

        if (response.status === 404) {
          console.log('Import job was deleted, skipping update');
          return;
        }

        if (!response.ok) {
          console.error('Failed to update import job:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        } else {
          const result = await response.json();
          console.log('Import job updated successfully:', result);
        }
      } catch (error) {
        console.error('Failed to update import job:', error);
      }
      console.log('=== UPDATE JOB COMPLETE ===\n');
    };

    try {
      // Parse CSV data
      const lines = csvData.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

      if (lines.length < 2) {
        throw new Error('File must contain at least one data row');
      }

      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header: string, index: number) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Group data by job title
      const groupedData = new Map();

      rows.forEach((row: any, index: number) => {
        if (!row.title) {
          console.warn(`Row ${index + 2}: Missing title, skipping`);
          return;
        }

        const titleKey = row.title.toLowerCase().trim();

        if (!groupedData.has(titleKey)) {
          groupedData.set(titleKey, {
            titleInfo: {
              id: row.id ? parseInt(row.id) : null,
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

      // ===== NEW LOGIC: Delete missing job titles =====
      if (deleteMissingTitles) {
        try {
          // Fetch all existing job titles (large limit to ensure all are retrieved)
          const allTitlesResp = await fetch('/api/jobs/titles?limit=10000');
          if (allTitlesResp.ok) {
            const allTitlesJson = await allTitlesResp.json();
            const existingTitles: any[] = allTitlesJson.data || [];

            // Build a Set of normalized titles that are present in the uploaded file
            const uploadedTitleSet = new Set(
              Array.from(groupedData.values()).map((g: any) => g.titleInfo.title.toLowerCase().trim())
            );

            // Identify titles that are NOT in the uploaded file
            const titlesToDelete = existingTitles.filter(t => !uploadedTitleSet.has(t.title.toLowerCase().trim()));

            if (titlesToDelete.length > 0) {
              // Update job to indicate deletion is happening
              await updateJob({
                currentOperation: `Deleting ${titlesToDelete.length} job title(s) not present in uploaded file...`
              });

              for (const title of titlesToDelete) {
                try {
                  await fetch(`/api/jobs/titles/${title.id}`, { method: 'DELETE' });
                } catch (delErr) {
                  console.error(`Failed to delete title ${title.title}:`, delErr);
                }
              }

              // Refresh query cache after deletion
              queryClient.invalidateQueries({ queryKey: ['job-titles'] });
            }
          } else {
            console.error('Failed to fetch existing job titles for deletion logic');
          }
        } catch (delError) {
          console.error('Error during deleteMissingTitles processing:', delError);
        }
      }
      // ===== END NEW LOGIC =====

      // Second pass: Process each job title with its descriptions
      let processedCount = 0;

      // Check if this is a resumed job and get the last processed count
      let startFromIndex = 0;
      if (currentJobId) {
        try {
          const statusResponse = await fetch(`/api/import-history/${currentJobId}`);
          if (statusResponse.ok) {
            const jobStatus = await statusResponse.json();
            if (jobStatus.processedRecords > 0) {
              startFromIndex = jobStatus.processedRecords;
              processedCount = startFromIndex;
              console.log(`Resuming import from record ${startFromIndex}`);
            }
          }
        } catch (error) {
          console.error('Failed to get resume position:', error);
        }
      }

      // Update import job with total count
      const totalGroups = groupedData.size;
      console.log('Total groups to process:', totalGroups);
      console.log('Starting from index:', startFromIndex, 'Processed count:', processedCount);

      await updateJob({
        totalRecords: totalGroups,
        processedRecords: processedCount, // Show current progress from start
        progress: processedCount > 0 ? (processedCount / totalGroups) * 100 : 0,
        currentOperation: `Processing ${totalGroups} job titles...`
      });

      const groupedDataArray = Array.from(groupedData.entries());

      for (let i = startFromIndex; i < groupedDataArray.length; i++) {
        const [_titleKey, group] = groupedDataArray[i];

        // Check for pause before processing each item
        if (currentJobId) {
          try {
            const statusResponse = await fetch(`/api/import-history/${currentJobId}`);
            if (statusResponse.ok) {
              const jobStatus = await statusResponse.json();
              if (jobStatus.status === 'paused') {
                console.log(`Import paused at record ${i + 1}/${groupedDataArray.length}`);
                await updateJob({
                  status: 'paused',
                  processedRecords: processedCount,
                  progress: (processedCount / totalGroups) * 100,
                  currentOperation: `Paused at record ${processedCount}/${totalGroups}`,
                  metadata: JSON.stringify({ 
                    currentIndex: i,
                    totalRecords: groupedDataArray.length 
                  })
                });
                return;
              }
              if (jobStatus.status === 'cancelled') {
                console.log(`Import cancelled at record ${i + 1}/${groupedDataArray.length}`);
                await updateJob({
                  status: 'cancelled',
                  processedRecords: processedCount,
                  progress: (processedCount / totalGroups) * 100,
                  currentOperation: `Cancelled at record ${processedCount}/${totalGroups}`,
                  completedAt: new Date()
                });
                return;
              }
            } else if (statusResponse.status === 404) {
              console.log('Import job was deleted, stopping import process');
              return;
            }
          } catch (error) {
            console.error('Failed to check job status:', error);
          }
        }

        processedCount++;
        const row = group.titleInfo;
        const descriptions = group.descriptions;

        const currentProgress = (processedCount / totalGroups) * 100;

        // Update import job progress for every record to show real-time progress
        await updateJob({
          totalRecords: totalGroups,
          processedRecords: processedCount,
          progress: currentProgress,
          currentOperation: `Processing "${row.title}" with ${descriptions.length} description(s)...`,
          metadata: JSON.stringify({ 
            currentIndex: i,
            totalRecords: groupedDataArray.length 
          })
        });

        try {
          // Create or update job title
          let jobTitle;
          if (row.id) {
            // Update existing title
            const updateResponse = await fetch(`/api/jobs/titles/${row.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: row.title, category: row.category })
            });

            if (updateResponse.ok) {
              jobTitle = await updateResponse.json();
            } else {
              throw new Error(`Failed to update job title: ${row.title}`);
            }
          } else {
            // Create new title
            const createResponse = await fetch('/api/jobs/titles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: row.title, category: row.category })
            });

            if (createResponse.ok) {
              jobTitle = await createResponse.json();
            } else if (createResponse.status === 409) {
              // Title already exists, get it
              const existingResponse = await fetch(`/api/jobs/titles?search=${encodeURIComponent(row.title)}`);
              if (existingResponse.ok) {
                const existingTitles = await existingResponse.json();
                jobTitle = existingTitles.data.find((t: any) => t.title.toLowerCase() === row.title.toLowerCase());
              }

              if (!jobTitle) {
                throw new Error(`Failed to create or find job title: ${row.title}`);
              }
            } else {
              throw new Error(`Failed to create job title: ${row.title}`);
            }
          }

          // Add descriptions with pause checks between each description
          for (const desc of descriptions) {
            // Check for pause before each description
            if (currentJobId) {
              try {
                const statusResponse = await fetch(`/api/import-history/${currentJobId}`);
                if (statusResponse.ok) {
                  const jobStatus = await statusResponse.json();
                  if (jobStatus.status === 'paused') {
                    console.log('Import paused during description processing');
                    await updateJob({
                      status: 'paused',
                      processedRecords: processedCount,
                      progress: (processedCount / totalGroups) * 100,
                      currentOperation: `Paused while processing descriptions for "${row.title}"`,
                      metadata: JSON.stringify({ 
                        currentIndex: i,
                        totalRecords: groupedDataArray.length 
                      })
                    });
                    return;
                  }
                  if (jobStatus.status === 'cancelled') {
                    console.log('Import cancelled during description processing');
                    await updateJob({
                      status: 'cancelled',
                      processedRecords: processedCount,
                      progress: (processedCount / totalGroups) * 100,
                      currentOperation: `Cancelled while processing descriptions for "${row.title}"`,
                      completedAt: new Date()
                    });
                    return;
                  }
                } else if (statusResponse.status === 404) {
                  console.log('Import job was deleted during description processing, stopping import');
                  return;
                }
              } catch (error) {
                console.error('Failed to check job status during description processing:', error);
              }
            }

            try {
              await fetch('/api/jobs/descriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jobTitleId: jobTitle.id,
                  content: desc.content,
                  isRecommended: desc.isRecommended
                })
              });
            } catch (error) {
              console.error(`Failed to create description for ${row.title}:`, error);
            }
          }

        } catch (error) {
          console.error(`Error processing ${row.title}:`, error);
        }

        // Small delay to prevent overwhelming the server and allow pause checks
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Complete the import
      const finalProgress = {
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
        currentOperation: `Import completed successfully! Processed ${processedCount} job titles.`
      };

      await updateJob(finalProgress);

      // Refresh the job titles list
      queryClient.invalidateQueries({ queryKey: ['job-titles'] });
      queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });

      // Navigate to import history after completion
      setTimeout(() => {
        setLocation('/admin/import-history');
      }, 2000);

    } catch (error) {
      console.error('Import processing failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Import processing failed';

      if (currentJobId) {
        await updateJob({
          status: 'failed',
          completedAt: new Date(),
          currentOperation: `Import failed: ${errorMessage}`
        });
      }
    }
  };

  // Event handlers
  const handleCreateTitle = () => {
    if (!titleForm.title || !titleForm.category) return;
    createTitleMutation.mutate(titleForm);
  };

  const handleUpdateTitle = () => {
    if (!selectedJobTitle || !titleForm.title || !titleForm.category) return;
    updateTitleMutation.mutate({ id: selectedJobTitle.id, ...titleForm });
  };

  const handleCreateDescription = () => {
    if (!selectedJobTitle || !descriptionForm.content) return;
    createDescriptionMutation.mutate({
      jobTitleId: selectedJobTitle.id,
      ...descriptionForm
    });
  };

  const handleUpdateDescription = () => {
    if (!isEditingDescription || !descriptionForm.content) return;
    updateDescriptionMutation.mutate({
      id: isEditingDescription.id,
      ...descriptionForm
    });
  };

  const startEditTitle = (title: JobTitle) => {
    setTitleForm({ title: title.title, category: title.category });
    setIsEditingTitle(true);
  };

  const startEditDescription = (description: JobDescription) => {
    setDescriptionForm({ content: description.content, isRecommended: description.isRecommended });
    setIsEditingDescription(description);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(147,51,234,0.03)_50%,transparent_65%)]"></div>
      </div>

      <div className="container mx-auto pt-20 pb-10 px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/admin/pro')}
              className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Job Titles & Descriptions</h1>
              <p className="text-gray-300 mt-1">Manage job titles and their associated descriptions for the resume wizard.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-white/20 text-white">
                <DropdownMenuItem onClick={() => exportData('csv')} className="text-white hover:bg-white/10 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportData('excel')} className="text-white hover:bg-white/10 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Excel Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportData('json')} className="text-white hover:bg-white/10 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  JSON Format
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Import Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-white/20 text-white">
                <DropdownMenuItem onClick={() => setShowImportDialog(true)} className="text-white hover:bg-white/10 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setLocation('/admin/import-history')}
              variant="outline"
              className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              Import History
            </Button>

            <Button
              onClick={() => setIsAddingTitle(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Job Title
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Job Titles */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Search Job Titles</CardTitle>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddingTitle(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Title
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search job titles..."
                  value={searchTitles}
                  onChange={(e) => setSearchTitles(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Job Titles List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoadingTitles ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-300 mt-2">Loading...</p>
                  </div>
                ) : jobTitles.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No job titles found.</p>
                  </div>
                ) : (
                  jobTitles.map((title: JobTitle) => (
                    <div
                      key={title.id}
                      onClick={() => setSelectedJobTitle(title)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedJobTitle?.id === title.id
                          ? 'bg-purple-600/30 border border-purple-500'
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{title.title}</h4>
                          <Badge variant="secondary" className="mt-1 bg-white/10 text-gray-300">
                            {title.category}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditTitle(title);
                            }}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete "${title.title}"? This will also delete all associated job descriptions.`)) {
                                deleteTitleMutation.mutate(title.id);
                              }
                            }}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Job Descriptions */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-white">Job Descriptions</CardTitle>
                </div>
                <div className="flex gap-2">
                  {selectedJobTitle && (
                    <Button
                      size="sm"
                      onClick={() => setIsAddingDescription(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Description
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedJobTitle ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Job Title</h3>
                  <p className="text-gray-300">Choose a job title from the left panel to view, add, or edit its descriptions.</p>
                </div>
              ) : (
                <>
                  {/* Search Descriptions */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search descriptions..."
                      value={searchDescriptions}
                      onChange={(e) => setSearchDescriptions(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  {/* Descriptions List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {isLoadingDescriptions ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-gray-300 mt-2">Loading descriptions...</p>
                      </div>
                    ) : !jobDescriptions || jobDescriptions.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300 mb-4">No descriptions found for this job title.</p>
                        <Button
                          onClick={() => setIsAddingDescription(true)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Description
                        </Button>
                      </div>
                    ) : (
                      jobDescriptions.map((description: JobDescription) => (
                        <div
                          key={description.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            description.isRecommended 
                              ? 'bg-purple-500/10 border-purple-400/30 hover:bg-purple-500/20' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {description.isRecommended && (
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              )}
                              <Badge 
                                variant={description.isRecommended ? "default" : "secondary"} 
                                className={`text-xs ${
                                  description.isRecommended 
                                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                                }`}
                              >
                                {description.isRecommended ? '⭐ Recommended' : 'Standard'}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditDescription(description)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this job description?')) {
                                    deleteDescriptionMutation.mutate(description.id);
                                  }
                                }}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{description.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Job Title Dialog */}
        <Dialog open={isAddingTitle || isEditingTitle} onOpenChange={(open) => {
          if (!open) {
            setIsAddingTitle(false);
            setIsEditingTitle(false);
            setTitleForm({ title: '', category: '' });
          }
        }}>
          <DialogContent className="bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>{isAddingTitle ? 'Add New Job Title' : 'Edit Job Title'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {isAddingTitle ? 'Create a new job title with category.' : 'Update the job title and category.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                <Input
                  value={titleForm.title}
                  onChange={(e) => setTitleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Software Engineer"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <Input
                  value={titleForm.category}
                  onChange={(e) => setTitleForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Software Development, Marketing, Sales..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingTitle(false);
                    setIsEditingTitle(false);
                    setTitleForm({ title: '', category: '' });
                  }}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={isAddingTitle ? handleCreateTitle : handleUpdateTitle}
                  disabled={!titleForm.title || !titleForm.category}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAddingTitle ? 'Create' : 'Update'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Job Description Dialog */}
        <Dialog open={isAddingDescription || !!isEditingDescription} onOpenChange={(open) => {
          if (!open) {
            setIsAddingDescription(false);
            setIsEditingDescription(null);
            setDescriptionForm({ content: '', isRecommended: false });
          }
        }}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isAddingDescription ? 'Add New Description' : 'Edit Description'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {isAddingDescription 
                  ? `Add a description for "${selectedJobTitle?.title}"`
                  : 'Update the job description content and settings.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description Content</label>
                <Textarea
                  value={descriptionForm.content}
                  onChange={(e) => setDescriptionForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter job description with responsibilities, requirements, and skills..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecommended"
                  checked={descriptionForm.isRecommended}
                  onChange={(e) => setDescriptionForm(prev => ({ ...prev, isRecommended: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10"
                />
                <label htmlFor="isRecommended" className="text-sm text-gray-300 cursor-pointer">
                  Mark as recommended description
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingDescription(false);
                    setIsEditingDescription(null);
                    setDescriptionForm({ content: '', isRecommended: false });
                  }}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={isAddingDescription ? handleCreateDescription : handleUpdateDescription}
                  disabled={!descriptionForm.content}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAddingDescription ? 'Create' : 'Update'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import File Selection Dialog */}
        <Dialog open={showImportDialog} onOpenChange={(open) => {
          if (!open) {
            setShowImportDialog(false);
            setSelectedFile(null);
          }
        }}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import Job Data</DialogTitle>
              <DialogDescription className="text-gray-300">
                Select a file to import job titles and descriptions. Progress will be shown in the Import History page.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-green-400 font-medium">✓ File Selected</p>
                    <p className="text-white">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'text/csv'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFile(null)}
                      className="bg-transparent border-white/20 text-white hover:bg-white/10 mt-2"
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-300 mb-4">Choose a CSV, Excel, or JSON file to import</p>
                    <input
                      id="import-file-dialog"
                      type="file"
                      accept=".csv,.json,.xlsx"
                      onChange={handleImport}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('import-file-dialog')?.click()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">File Format Requirements:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <strong>title</strong>: Job title name (required)</li>
                  <li>• <strong>category</strong>: Job category (optional)</li>
                  <li>• <strong>description</strong>: Job description (optional)</li>
                  <li>• <strong>isRecommended</strong>: true/false for recommended descriptions (optional)</li>
                </ul>

                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="deleteMissingTitles"
                    checked={deleteMissingTitles}
                    onChange={(e) => setDeleteMissingTitles(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 bg-transparent rounded"
                  />
                  <label htmlFor="deleteMissingTitles" className="text-sm text-gray-300 cursor-pointer">
                    Delete job titles not present in uploaded file
                  </label>
                </div>

                <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                  <p className="text-xs text-blue-300">
                    <strong>💡 Tip:</strong> After uploading, you'll be redirected to Import History to track progress.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportDialog(false);
                  setSelectedFile(null);
                }}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitImport}
                disabled={!selectedFile}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
