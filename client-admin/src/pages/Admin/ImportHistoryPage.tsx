import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  RefreshCw,
  Play,
  Square,
  Eye,
  Trash2,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
  Plus,
  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ImportJob {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  errors?: string[];
  progress: number;
  currentOperation?: string;
  uploadedBy?: string;
  uploadedAt: string;
  startedAt?: string;
  completedAt?: string;
  metadata?: any;
}

interface ImportHistoryResponse {
  data: ImportJob[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function ImportHistoryPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Force refresh when component mounts (useful when navigating from Skills page)
  useEffect(() => {
    console.log('📄 ImportHistoryPage mounted, forcing initial refresh...');
    // Small delay to ensure any pending server operations have started
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['import-history'] });
    }, 500);
  }, [queryClient]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<ImportJob | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Import/Upload states
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [deleteMissingTitles, setDeleteMissingTitles] = useState(false);
  const [importJobId, setImportJobId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'job_titles' | 'skills' | 'professional_summaries'>('job_titles');

  // Fetch import history with filters
  const { data: importHistoryResponse, isLoading, refetch } = useQuery<ImportHistoryResponse>({
    queryKey: ['import-history', currentPage, searchTerm, statusFilter, userFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (userFilter) params.append('uploadedBy', userFilter);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      console.log('🔄 Fetching import history with params:', params.toString());

      const response = await fetch(`/api/import-history?${params}`);
      if (!response.ok) throw new Error('Failed to fetch import history');
      const data = await response.json();

      // Debug: Log the received data
      console.log('📊 Import history data received:', data);
      console.log('📊 Total records:', data.data?.length || 0);
      if (data.data && data.data.length > 0) {
        console.log('📊 First job status:', data.data[0].status, 'progress:', data.data[0].progress);
      }

      return data;
    },
    // Always refetch when window gains focus
    refetchOnWindowFocus: true,
    // Don't cache stale data
    staleTime: 0
  });

  // Handle auto-refresh for active jobs
  useEffect(() => {
    const hasActiveJobs = importHistoryResponse?.data?.some((job: ImportJob) => 
      ['pending', 'processing'].includes(job.status)
    );

    console.log('🔄 Active jobs check:', hasActiveJobs);

    if (hasActiveJobs) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing import history...');
        refetch();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [importHistoryResponse, refetch]);

  // Show notifications for status changes
  useEffect(() => {
    if (importHistoryResponse?.data) {
      const completedJobs = importHistoryResponse.data.filter((job: ImportJob) => 
        job.status === 'completed' && 
        job.completedAt && 
        new Date(job.completedAt).getTime() > Date.now() - 10000 // Completed in last 10 seconds
      );

      const failedJobs = importHistoryResponse.data.filter((job: ImportJob) => 
        job.status === 'failed' && 
        job.completedAt && 
        new Date(job.completedAt).getTime() > Date.now() - 10000 // Failed in last 10 seconds
      );

      completedJobs.forEach((job: ImportJob) => {
        toast({
          title: 'Import Completed',
          description: `${job.fileName} has been imported successfully with ${job.successCount} records.`,
        });
      });

      failedJobs.forEach((job: ImportJob) => {
        toast({
          title: 'Import Failed',
          description: `${job.fileName} import failed. Check the error log for details.`,
          variant: 'destructive',
        });
      });
    }
  }, [importHistoryResponse, toast]);

  // Cancel import job mutation (now pause)
  const pauseJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/import-history/${jobId}/cancel`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to pause import job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'import-history'
      });
      toast({ title: 'Success', description: 'Import job paused successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Resume import job mutation
  const resumeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/import-history/${jobId}/resume`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to resume import job');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'import-history'
      });
      toast({ title: 'Success', description: 'Import job resumed successfully' });

      // Trigger the actual import process by navigating to job management with resume flag
      // This will tell the JobTitlesManagement component to resume the specific job
      window.postMessage({ 
        type: 'RESUME_IMPORT_JOB', 
        jobId: data.id 
      }, '*');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Terminate import job mutation
  const terminateJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/import-history/${jobId}/terminate`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to terminate import job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'import-history'
      });
      toast({ title: 'Success', description: 'Import job terminated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Re-run import job mutation (for completed/failed jobs)
  const rerunJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/import-history/${jobId}/rerun`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to re-run import job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'import-history'
      });
      toast({ title: 'Success', description: 'Import job queued for re-run' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Delete import job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      console.log('🗑️ Starting delete operation for job:', jobId);
      setIsDeleting(true);

      // First get the job to check its status
      const jobResponse = await fetch(`/api/import-history/${jobId}`);
      let job = null;
      if (jobResponse.ok) {
        job = await jobResponse.json();
        console.log('📄 Job data before delete:', job);
      }

      console.log('🚀 Sending DELETE request...');
      const response = await fetch(`/api/import-history/${jobId}`, {
        method: 'DELETE',
      });
      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text first to see what we're actually getting
      const responseText = await response.text();
      console.log('📡 Delete response body:', responseText);

      if (!response.ok) {
        console.error('❌ Delete failed with status:', response.status);
        console.error('❌ Error response body:', responseText);
        throw new Error(`Failed to delete import job. Server returned: ${responseText.substring(0, 200)}`);
      }

      console.log('✅ Delete successful');
      return { job };
    },
    onSuccess: ({ job }) => {
      console.log('🎉 Delete successful, forcing complete refresh...');

      // Force a complete refresh by removing all cached data and refetching
      queryClient.removeQueries({ queryKey: ['import-history'] });

      // Wait a moment then refetch and re-enable auto-refresh
      setTimeout(() => {
        refetch();
        setIsDeleting(false);
      }, 100);

      // Show toast
      if (job && (job.status === 'processing' || job.status === 'pending' || job.status === 'paused')) {
        toast({ 
          title: 'Import Terminated & Deleted', 
          description: `Running import job "${job.fileName}" has been terminated and deleted successfully.`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Success', 
          description: 'Import job deleted successfully' 
        });
      }
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation failed:', error);
      setIsDeleting(false); // Re-enable auto-refresh on error
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'paused':
        return <Square className="h-4 w-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      paused: 'bg-orange-100 text-orange-800 border-orange-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <Badge className={`${variants[status] || variants.pending} capitalize`}>
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleViewLog = (job: ImportJob) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handlePauseJob = (jobId: string) => {
    pauseJobMutation.mutate(jobId);
  };

  const handleResumeJob = (jobId: string) => {
    resumeJobMutation.mutate(jobId);
  };

  const handleTerminateJob = (jobId: string) => {
    if (confirm('Are you sure you want to permanently cancel this import job? This action cannot be undone.')) {
      terminateJobMutation.mutate(jobId);
    }
  };

  const handleRerunJob = (jobId: string) => {
    rerunJobMutation.mutate(jobId);
  };

  const handleDeleteJob = (jobId: string) => {
    const job = importHistoryResponse?.data.find(j => j.id === jobId);
    const isRunning = job && (job.status === 'processing' || job.status === 'pending' || job.status === 'paused');

    console.log('🎯 Delete button clicked for job:', jobId);
    console.log('🎯 Current jobs count:', importHistoryResponse?.data.length);
    console.log('🎯 Job to delete:', job);

    const confirmMessage = isRunning 
      ? `Are you sure you want to delete "${job?.fileName}"? This will TERMINATE the running import process and permanently delete the job record. This action cannot be undone.`
      : 'Are you sure you want to delete this import job? This action cannot be undone.';

    if (confirm(confirmMessage)) {
      console.log('🎯 User confirmed deletion, starting mutation...');
      deleteJobMutation.mutate(jobId);
    } else {
      console.log('🎯 User cancelled deletion');
    }
  };

  // Upload/Import handlers
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
      console.log('Import type:', importType);

      // Read file content
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(selectedFile);
      });

      console.log('File content read, length:', text.length);

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
            importType: importType
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

      // Refresh the import history table
      refetch();

      // Start the import process on the server side
      console.log('Starting server-side import processing...');
      setTimeout(async () => {
        try {
          const processResponse = await fetch(`/api/import-history/${importJob.id}/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });

          if (processResponse.ok) {
            console.log('Server-side processing started successfully');
          } else {
            console.error('Failed to start server-side processing');
          }
        } catch (error) {
          console.error('Error starting server-side processing:', error);
        }
      }, 1000);

    } catch (error) {
      console.error('Import failed:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Import failed',
        variant: 'destructive' 
      });
    }
  };

  const processImportInBackground = async (jobId: string, csvData: string, fileName: string) => {
    try {
      console.log('=== BACKGROUND IMPORT STARTING ===');
      console.log('Job ID received:', jobId);

      setImportJobId(jobId);

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
      }

      // Process the import based on type
      console.log('Starting data processing for type:', importType);
      if (importType === 'job_titles') {
        await processJobTitlesImport(csvData, fileName, jobId);
      } else if (importType === 'skills') {
        await processSkillsImport(csvData, fileName, jobId);
      } else if (importType === 'professional_summaries') {
        await processProfessionalSummariesImport(csvData, fileName, jobId);
      }

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

  const processJobTitlesImport = async (csvData: string, fileName: string, jobId: string) => {
    // Similar logic to Job Titles Management page
    const updateJob = async (data: any) => {
      try {
        await fetch(`/api/import-history/${jobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Failed to update import job:', error);
      }
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

      // Process each job title with its descriptions
      let processedCount = 0;
      const totalGroups = groupedData.size;

      await updateJob({
        totalRecords: totalGroups,
        processedRecords: processedCount,
        progress: 0,
        currentOperation: `Processing ${totalGroups} job titles...`
      });

      const groupedDataArray = Array.from(groupedData.entries());

      for (let i = 0; i < groupedDataArray.length; i++) {
        const [_titleKey, group] = groupedDataArray[i];
        processedCount++;

        const row = group.titleInfo;
        const descriptions = group.descriptions;

        const currentProgress = Math.round((processedCount / totalGroups) * 100);

        await updateJob({
          totalRecords: totalGroups,
          processedRecords: processedCount,
          progress: currentProgress,
          currentOperation: `Processing "${row.title}" with ${descriptions.length} description(s)...`
        });

        try {
          // Create or update job title
          let jobTitle;

          // Try to find existing title first
          const existingResponse = await fetch(`/api/jobs/titles?search=${encodeURIComponent(row.title)}`);
          if (existingResponse.ok) {
            const existingTitles = await existingResponse.json();
            jobTitle = existingTitles.data.find((t: any) => t.title.toLowerCase() === row.title.toLowerCase());
          }

          if (!jobTitle) {
            // Create new title
            const createResponse = await fetch('/api/jobs/titles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: row.title, category: row.category })
            });

            if (createResponse.ok) {
              jobTitle = await createResponse.json();
            } else if (createResponse.status === 409) {
              // Title already exists, try to get it again
              const retryResponse = await fetch(`/api/jobs/titles?search=${encodeURIComponent(row.title)}`);
              if (retryResponse.ok) {
                const retryTitles = await retryResponse.json();
                jobTitle = retryTitles.data.find((t: any) => t.title.toLowerCase() === row.title.toLowerCase());
              }
            }
          }

          if (!jobTitle) {
            throw new Error(`Failed to create or find job title: ${row.title}`);
          }

          // Add descriptions
          for (const desc of descriptions) {
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

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Complete the import
      await updateJob({
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
        successCount: processedCount,
        currentOperation: `Import completed successfully! Processed ${processedCount} job titles.`
      });

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['job-titles'] });
      queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
      queryClient.invalidateQueries({ queryKey: ['import-history'] });

    } catch (error) {
      console.error('Job titles import processing failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Import processing failed';

      await updateJob({
        status: 'failed',
        completedAt: new Date(),
        currentOperation: `Import failed: ${errorMessage}`
      });
    }
  };

  const processSkillsImport = async (csvData: string, fileName: string, jobId: string) => {
    // Similar logic for skills import
    const updateJob = async (data: any) => {
      try {
        await fetch(`/api/import-history/${jobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Failed to update import job:', error);
      }
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
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Group data by skills job title
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
            categories: []
          });
        }

        if (row.content && row.content.trim()) {
          groupedData.get(titleKey).categories.push({
            content: row.content.trim(),
            isRecommended: row.isRecommended === 'true' || row.isRecommended === '1'
          });
        }
      });

      // Process each skills job title with its categories
      let processedCount = 0;
      const totalGroups = groupedData.size;

      await updateJob({
        totalRecords: totalGroups,
        processedRecords: processedCount,
        progress: 0,
        currentOperation: `Processing ${totalGroups} skills job titles...`
      });

      const groupedDataArray = Array.from(groupedData.entries());

      for (let i = 0; i < groupedDataArray.length; i++) {
        const [titleKey, group] = groupedDataArray[i];
        processedCount++;

        const row = group.titleInfo;
        const categories = group.categories;

        const currentProgress = Math.round((processedCount / totalGroups) * 100);

        await updateJob({
          totalRecords: totalGroups,
          processedRecords: processedCount,
          progress: currentProgress,
          currentOperation: `Processing "${row.title}" with ${categories.length} categories...`
        });

        try {
          // Create or find skills job title
          let skillsJobTitle;

          const existingResponse = await fetch(`/api/skills/skillsjobtitles?search=${encodeURIComponent(row.title)}`);
          if (existingResponse.ok) {
            const existingTitles = await existingResponse.json();
            skillsJobTitle = existingTitles.data?.find((t: any) => t.title.toLowerCase() === row.title.toLowerCase());
          }

          if (!skillsJobTitle) {
            const createResponse = await fetch('/api/skills/skillsjobtitles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: row.title, category: row.category })
            });

            if (createResponse.ok) {
              skillsJobTitle = await createResponse.json();
            }
          }

          if (!skillsJobTitle) {
            throw new Error(`Failed to create or find skills job title: ${row.title}`);
          }

          // Add categories
          for (const cat of categories) {
            try {
              await fetch('/api/skills/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  skillsJobTitleId: skillsJobTitle.id,
                  content: cat.content,
                  isRecommended: cat.isRecommended
                })
              });
            } catch (error) {
              console.error(`Failed to create category for ${row.title}:`, error);
            }
          }

        } catch (error) {
          console.error(`Error processing ${row.title}:`, error);
        }

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

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skill-categories'] });
      queryClient.invalidateQueries({ queryKey: ['import-history'] });

    } catch (error) {
      console.error('Skills import processing failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Import processing failed';

      await updateJob({
        status: 'failed',
        completedAt: new Date(),
        currentOperation: `Import failed: ${errorMessage}`
      });
    }
  };

  const processProfessionalSummariesImport = async (csvData: string, _fileName: string, jobId: string) => {
    // Similar logic to Professional Summary Management page
    const updateJob = async (data: any) => {
      try {
        await fetch(`/api/import-history/${jobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Failed to update import job:', error);
      }
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
              id: row.id ? parseInt(row.id) : null,
              title: row.title.trim(),
              category: row.category || 'General'
            },
            summaries: []
          });
        }

        if (row.content && row.content.trim()) {
          groupedData.get(titleKey).summaries.push({
            content: row.content.trim(),
            isRecommended: row.isRecommended === 'true' || row.isRecommended === '1'
          });
        }
      });

      // Process each job title with its professional summaries
      let processedCount = 0;
      const totalGroups = groupedData.size;

      await updateJob({
        totalRecords: totalGroups,
        processedRecords: processedCount,
        progress: 0,
        currentOperation: `Processing ${totalGroups} professional summary job titles...`
      });

      const groupedDataArray = Array.from(groupedData.entries());

      for (let i = 0; i < groupedDataArray.length; i++) {
        const [titleKey, group] = groupedDataArray[i];
        processedCount++;

        const row = group.titleInfo;
        const summaries = group.summaries;

        const currentProgress = Math.round((processedCount / totalGroups) * 100);

        await updateJob({
          totalRecords: totalGroups,
          processedRecords: processedCount,
          progress: currentProgress,
          currentOperation: `Processing "${row.title}" with ${summaries.length} professional summary(s)...`
        });

        try {
          // Create or update professional summary job title
          let jobTitle;

          // Try to find existing title first
          const existingResponse = await fetch(`/api/professional-summaries/jobtitles?search=${encodeURIComponent(row.title)}`);
          if (existingResponse.ok) {
            const existingTitles = await existingResponse.json();
            jobTitle = existingTitles.data.find((t: any) => t.title.toLowerCase() === row.title.toLowerCase());
          }

          if (!jobTitle) {
            // Create new title
            const createResponse = await fetch('/api/professional-summaries/jobtitles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: row.title, category: row.category })
            });

            if (createResponse.ok) {
              jobTitle = await createResponse.json();
            } else if (createResponse.status === 409) {
              // Title already exists, try to get it again
              const retryResponse = await fetch(`/api/professional-summaries/jobtitles?search=${encodeURIComponent(row.title)}`);
              if (retryResponse.ok) {
                const retryTitles = await retryResponse.json();
                jobTitle = retryTitles.data.find((t: any) => t.title.toLowerCase() === row.title.toLowerCase());
              }
            }
          }

          if (!jobTitle) {
            throw new Error(`Failed to create or find professional summary job title: ${row.title}`);
          }

          // Add professional summaries
          for (const summary of summaries) {
            try {
              await fetch('/api/professional-summaries/summaries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  professionalSummaryJobTitleId: jobTitle.id,
                  content: summary.content,
                  isRecommended: summary.isRecommended
                })
              });
            } catch (error) {
              console.error(`Failed to create professional summary for ${row.title}:`, error);
            }
          }

        } catch (error) {
          console.error(`Error processing ${row.title}:`, error);
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Mark as completed
      await updateJob({
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
        currentOperation: 'Import completed successfully',
        successCount: totalGroups,
        errorCount: 0
      });

      console.log('Professional summaries import completed successfully');

    } catch (error) {
      console.error('Professional summaries import processing failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Import processing failed';

      await updateJob({
        status: 'failed',
        completedAt: new Date(),
        currentOperation: `Import failed: ${errorMessage}`
      });
    }
  };

  const importJobs = importHistoryResponse?.data || [];
  const meta = importHistoryResponse?.meta;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto pt-20 pb-10 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/admin/pro')}
              className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content Management
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Import History</h1>
              <p className="text-gray-300 mt-1">
                Track and manage all job data import operations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
            onClick={() => refetch()}
            variant="outline"
            className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Search Files</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Start */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">From Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              {/* Date Range End */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">To Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Jobs Table */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Import Jobs
                {meta && (
                  <Badge variant="outline" className="ml-2 text-white border-white/20">
                    {meta.totalCount} total
                  </Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
                <span className="ml-2 text-white">Loading import history...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">Job ID</TableHead>
                      <TableHead className="text-gray-300">File Name</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Progress</TableHead>
                      <TableHead className="text-gray-300">Records</TableHead>
                      <TableHead className="text-gray-300">Uploaded At</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importJobs.map((job) => (
                      <TableRow key={job.id} className="border-white/10">
                        <TableCell className="text-white font-mono text-sm">
                          {job.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{job.fileName}</div>
                              <div className="text-sm text-gray-400">
                                {formatFileSize(job.fileSize)} • {job.fileType}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(job.status)}
                          {job.currentOperation && job.status === 'processing' && (
                            <div className="text-xs text-gray-400 mt-1">
                              {job.currentOperation}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {job.status === 'processing' || job.status === 'pending' ? (
                            <div className="space-y-2">
                              <Progress value={job.progress} className="w-full" />
                              <div className="text-xs text-gray-400">
                                {job.processedRecords}/{job.totalRecords} records
                                {/* Debug info */}
                                <div className="text-xs text-red-400">
                                  Debug: progress={job.progress}, total={job.totalRecords}, processed={job.processedRecords}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">
                              {job.status === 'completed' ? '100%' : 
                               job.status === 'failed' ? `${job.progress}%` : '-'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="space-y-1">
                            <div className="text-sm">
                              Total: {job.totalRecords}
                            </div>
                            {job.status !== 'pending' && (
                              <div className="text-xs text-gray-400">
                                ✓ {job.successCount} • ✗ {job.errorCount}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="text-sm">{formatDate(job.uploadedAt)}</div>
                          {job.uploadedBy && (
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <User className="h-3 w-3 mr-1" />
                              {job.uploadedBy}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewLog(job)}
                              className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>

                            {/* Pause button for processing/pending jobs */}
                            {(job.status === 'processing' || job.status === 'pending') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePauseJob(job.id)}
                                className="bg-transparent border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                                title="Pause"
                              >
                                <Square className="h-3 w-3" />
                              </Button>
                            )}

                            {/* Resume button for paused jobs */}
                            {job.status === 'paused' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResumeJob(job.id)}
                                className="bg-transparent border-green-500/50 text-green-400 hover:bg-green-500/20"
                                title="Resume"
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}

                            {/* Terminate button for active jobs */}
                            {(job.status === 'processing' || job.status === 'pending' || job.status === 'paused') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTerminateJob(job.id)}
                                className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20"
                                title="Terminate"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            )}

                            {/* Re-run button for completed/failed/cancelled jobs */}
                            {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRerunJob(job.id)}
                                className="bg-transparent border-green-500/50 text-green-400 hover:bg-green-500/20"
                                title="Re-run"
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            )}

                            {/* Delete button for all jobs */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteJob(job.id)}
                              className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {importJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">No Import Jobs Found</h3>
                    <p className="text-gray-400">
                      No import jobs match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-400">
                      Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.totalCount)} of {meta.totalCount} jobs
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(meta.page - 1)}
                        disabled={meta.page <= 1}
                        className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
                      >
                        Previous
                      </Button>
                      <span className="text-white px-3 py-1">
                        Page {meta.page} of {meta.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(meta.page + 1)}
                        disabled={meta.page >= meta.totalPages}
                        className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Import Job Details
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Detailed information and logs for import job
              </DialogDescription>
            </DialogHeader>

            {selectedJob && (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Job Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Job ID</label>
                    <div className="font-mono text-sm bg-white/5 p-2 rounded">
                      {selectedJob.id}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Status</label>
                    <div>{getStatusBadge(selectedJob.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">File Name</label>
                    <div className="text-sm">{selectedJob.fileName}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">File Size</label>
                    <div className="text-sm">{formatFileSize(selectedJob.fileSize)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Uploaded At</label>
                    <div className="text-sm">{formatDate(selectedJob.uploadedAt)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Uploaded By</label>
                    <div className="text-sm">{selectedJob.uploadedBy || 'Unknown'}</div>
                  </div>
                </div>

                {/* Progress Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Progress Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">{selectedJob.totalRecords}</div>
                      <div className="text-sm text-gray-400">Total Records</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{selectedJob.successCount}</div>
                      <div className="text-sm text-gray-400">Successful</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-400">{selectedJob.errorCount}</div>
                      <div className="text-sm text-gray-400">Errors</div>
                    </div>
                  </div>
                  {selectedJob.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white">{selectedJob.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={selectedJob.progress} className="w-full" />
                      {selectedJob.currentOperation && (
                        <div className="text-sm text-gray-400">
                          Current: {selectedJob.currentOperation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Log */}
                {selectedJob.errors && selectedJob.errors.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                      Error Log ({selectedJob.errors.length} errors)
                    </h3>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                      {selectedJob.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-300 mb-2 font-mono">
                          {index + 1}. {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedJob.metadata && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Import Settings</h3>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(selectedJob.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowJobDetails(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
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
                Select a file to import job titles or skills data. Progress will be tracked in the Import History table below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Import Type Selection */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Import Type</label>
                <Select value={importType} onValueChange={(value: 'job_titles' | 'skills' | 'professional_summaries') => setImportType(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                    <SelectItem value="job_titles" className="text-white hover:bg-white/10 focus:bg-white/10">Job Titles & Descriptions</SelectItem>
                    <SelectItem value="skills" className="text-white hover:bg-white/10 focus:bg-white/10">Skills & Categories</SelectItem>
                    <SelectItem value="professional_summaries" className="text-white hover:bg-white/10 focus:bg-white/10">Professional Summaries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload Area */}
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

              {/* File Format Information */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">File Format Requirements:</h4>
                {importType === 'job_titles' ? (
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>title</strong>: Job title name (required)</li>
                    <li>• <strong>category</strong>: Job category (optional)</li>
                    <li>• <strong>description</strong>: Job description content (optional)</li>
                    <li>• <strong>isRecommended</strong>: true/false for recommended descriptions (optional)</li>
                  </ul>
                ) : importType === 'skills' ? (
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>title</strong>: Skills job title name (required)</li>
                    <li>• <strong>category</strong>: Skills category (optional)</li>
                    <li>• <strong>content</strong>: Skill category content (optional)</li>
                    <li>• <strong>isRecommended</strong>: true/false for recommended skills (optional)</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>title</strong>: Professional summary job title name (required)</li>
                    <li>• <strong>category</strong>: Job category (optional)</li>
                    <li>• <strong>content</strong>: Professional summary content (optional)</li>
                    <li>• <strong>isRecommended</strong>: true/false for recommended summaries (optional)</li>
                  </ul>
                )}

                {(importType === 'job_titles' || importType === 'professional_summaries') && (
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="deleteMissingTitles"
                      checked={deleteMissingTitles}
                      onChange={(e) => setDeleteMissingTitles(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 bg-transparent rounded"
                    />
                    <label htmlFor="deleteMissingTitles" className="text-sm text-gray-300 cursor-pointer">
                      Delete {importType === 'job_titles' ? 'job titles' : 'professional summary job titles'} not present in uploaded file
                    </label>
                  </div>
                )}

                <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                  <p className="text-xs text-blue-300">
                    <strong>💡 Tip:</strong> After uploading, you'll see the import progress tracked in real-time in the table below.
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
