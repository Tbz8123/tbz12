import React, { useState } from 'react';
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
import Papa from 'papaparse';

interface ProfessionalSummaryJobTitle {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfessionalSummary {
  id: number;
  professionalSummaryJobTitleId: number;
  content: string;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfessionalSummaryManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [selectedProfessionalSummaryJobTitle, setSelectedProfessionalSummaryJobTitle] = useState<ProfessionalSummaryJobTitle | null>(null);
  const [searchTitles, setSearchTitles] = useState('');
  const [searchSummaries, setSearchSummaries] = useState('');
  const [isAddingTitle, setIsAddingTitle] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingSummary, setIsAddingSummary] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState<ProfessionalSummary | null>(null);

  // Import/Export states
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [deleteMissingTitles, setDeleteMissingTitles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form states
  const [titleForm, setTitleForm] = useState({ title: '', category: '' });
  const [summaryForm, setSummaryForm] = useState({ content: '', isRecommended: false });

  // Fetch professional summary job titles
  const { data: professionalSummaryJobTitlesResponse, isLoading: isLoadingTitles } = useQuery({
    queryKey: ['professional-summary-job-titles', searchTitles],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTitles) params.append('search', searchTitles);
      const response = await fetch(`/api/professional-summaries/jobtitles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch professional summary job titles');
      return response.json();
    },
  });

  // Fetch professional summaries for selected title
  const { data: professionalSummaries, isLoading: isLoadingSummaries } = useQuery({
    queryKey: ['professional-summaries', selectedProfessionalSummaryJobTitle?.id, searchSummaries],
    queryFn: async () => {
      if (!selectedProfessionalSummaryJobTitle) return [];
      const params = new URLSearchParams();
      params.append('professionalSummaryJobTitleId', selectedProfessionalSummaryJobTitle.id.toString());
      if (searchSummaries) params.append('search', searchSummaries);
      const response = await fetch(`/api/professional-summaries/summaries?${params}`);
      if (!response.ok) throw new Error('Failed to fetch professional summaries');
      return response.json();
    },
    enabled: !!selectedProfessionalSummaryJobTitle,
  });

  const professionalSummaryJobTitles = professionalSummaryJobTitlesResponse?.data || [];

  // Mutations for professional summary job titles
  const createTitleMutation = useMutation({
    mutationFn: async (data: { title: string; category: string }) => {
      const response = await fetch('/api/professional-summaries/jobtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create professional summary job title');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-summary-job-titles'] });
      setIsAddingTitle(false);
      setIsEditingTitle(false);
      setTitleForm({ title: '', category: '' });
      toast({ title: 'Success', description: 'Professional summary job title created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; category: string }) => {
      const response = await fetch(`/api/professional-summaries/jobtitles/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, category: data.category }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update professional summary job title');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-summary-job-titles'] });
      setIsEditingTitle(false);
      setTitleForm({ title: '', category: '' });
      toast({ title: 'Success', description: 'Professional summary job title updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteTitleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/professional-summaries/jobtitles/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete professional summary job title');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-summary-job-titles'] });
      if (selectedProfessionalSummaryJobTitle) setSelectedProfessionalSummaryJobTitle(null);
      toast({ title: 'Success', description: 'Professional summary job title deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Mutations for professional summaries
  const createSummaryMutation = useMutation({
    mutationFn: async (data: { professionalSummaryJobTitleId: number; content: string; isRecommended: boolean }) => {
      const response = await fetch('/api/professional-summaries/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create professional summary');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-summaries'] });
      setIsAddingSummary(false);
      setSummaryForm({ content: '', isRecommended: false });
      toast({ title: 'Success', description: 'Professional summary created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateSummaryMutation = useMutation({
    mutationFn: async (data: { id: number; content: string; isRecommended: boolean }) => {
      const response = await fetch(`/api/professional-summaries/summaries/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content, isRecommended: data.isRecommended }),
      });
      if (!response.ok) throw new Error('Failed to update professional summary');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-summaries'] });
      setIsEditingSummary(null);
      setSummaryForm({ content: '', isRecommended: false });
      toast({ title: 'Success', description: 'Professional summary updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteSummaryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/professional-summaries/summaries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete professional summary');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-summaries'] });
      toast({ title: 'Success', description: 'Professional summary deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Handler functions
  const handleCreateTitle = () => {
    createTitleMutation.mutate(titleForm);
  };

  const handleUpdateTitle = () => {
    if (selectedProfessionalSummaryJobTitle) {
      updateTitleMutation.mutate({ id: selectedProfessionalSummaryJobTitle.id, ...titleForm });
    }
  };

  const handleCreateSummary = () => {
    if (selectedProfessionalSummaryJobTitle) {
      createSummaryMutation.mutate({
        professionalSummaryJobTitleId: selectedProfessionalSummaryJobTitle.id,
        ...summaryForm
      });
    }
  };

  const handleUpdateSummary = () => {
    if (isEditingSummary) {
      updateSummaryMutation.mutate({ id: isEditingSummary.id, ...summaryForm });
    }
  };

  const startEditTitle = (title: ProfessionalSummaryJobTitle) => {
    setTitleForm({ title: title.title, category: title.category });
    setIsEditingTitle(true);
  };

  const startEditSummary = (summary: ProfessionalSummary) => {
    setSummaryForm({ content: summary.content, isRecommended: summary.isRecommended });
    setIsEditingSummary(summary);
  };

  // Export functionality
  const exportData = async (format: 'csv' | 'excel' | 'json') => {
    try {
      // Fetch all professional summary job titles with their summaries
      const allTitlesResponse = await fetch('/api/professional-summaries/jobtitles?limit=1000');
      if (!allTitlesResponse.ok) throw new Error('Failed to fetch data for export');
      const allTitlesData = await allTitlesResponse.json();

      const exportData = [];

      for (const title of allTitlesData.data) {
        const summariesResponse = await fetch(`/api/professional-summaries/summaries?professionalSummaryJobTitleId=${title.id}&limit=1000`);
        if (summariesResponse.ok) {
          const summaries = await summariesResponse.json();

          if (summaries.length === 0) {
            exportData.push({
              id: title.id,
              title: title.title,
              category: title.category,
              content: '',
              isRecommended: false,
              createdAt: title.createdAt,
              updatedAt: title.updatedAt
            });
          } else {
            summaries.forEach((summary: ProfessionalSummary) => {
              exportData.push({
                id: title.id,
                title: title.title,
                category: title.category,
                content: summary.content,
                isRecommended: summary.isRecommended,
                createdAt: title.createdAt,
                updatedAt: title.updatedAt
              });
            });
          }
        }
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, 'professional-summaries.json');
      } else if (format === 'csv') {
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, 'professional-summaries.csv');
      } else if (format === 'excel') {
        // For Excel, we'll use CSV format but with .xlsx extension
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        downloadFile(blob, 'professional-summaries.xlsx');
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

  // Import functionality
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitImport = async () => {
    if (!selectedFile) {
      toast({ title: 'Error', description: 'Please select a file first', variant: 'destructive' });
      return;
    }

    try {
      console.log('=== STARTING PROFESSIONAL SUMMARY IMPORT PROCESS ===');
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
            importType: 'professional-summaries'
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
      console.log('=== BACKGROUND PROFESSIONAL SUMMARY IMPORT STARTING ===');
      console.log('Job ID received:', jobId);

      // Update job status to processing
      console.log('Updating job status to processing...');
      const updateResponse = await fetch(`/api/import-history/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'processing',
          startedAt: new Date(),
          currentOperation: 'Starting professional summary import process...'
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

  const processImportFromData = async (csvData: string, _fileName: string, jobId?: string) => {
    console.log('=== PROCESSING PROFESSIONAL SUMMARY IMPORT DATA ===');
    console.log('Job ID:', jobId);

    // Helper function to update import job with explicit job ID
    const updateJob = async (data: any) => {
      console.log('=== UPDATE JOB CALLED ===');
      console.log('Using jobId:', jobId);
      console.log('Data to update:', data);

      if (!jobId) {
        console.log('No jobId available, skipping update');
        return;
      }

      try {
        console.log('Sending update request to:', `/api/import-history/${jobId}`);

        const response = await fetch(`/api/import-history/${jobId}`, {
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
          const errorText = await response.text();
          console.error('Failed to update import job:', response.status, errorText);
          return;
        }

        const result = await response.json();
        console.log('Job updated successfully:', result);
      } catch (error) {
        console.error('Error updating job:', error);
      }
    };

    try {
      const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      const data = result.data as any[];

      console.log('Parsed CSV data:', data.length, 'rows');

      // Get deleteMissingTitles setting from metadata
      let deleteMissingTitles = false;
      if (jobId) {
        try {
          const jobResponse = await fetch(`/api/import-history/${jobId}`);
          if (jobResponse.ok) {
            const job = await jobResponse.json();
            deleteMissingTitles = job.metadata?.deleteMissingTitles || false;
            console.log('Delete missing titles setting:', deleteMissingTitles);
          }
        } catch (error) {
          console.error('Failed to get job metadata:', error);
        }
      }

      // Update job with total records
      await updateJob({
        totalRecords: data.length,
        currentOperation: `Processing ${data.length} professional summary records...`
      });

      // ===== DELETE MISSING TITLES LOGIC =====
      if (deleteMissingTitles) {
        try {
          console.log('=== DELETING MISSING PROFESSIONAL SUMMARY TITLES ===');

          // Update job to indicate deletion is happening
          await updateJob({
            currentOperation: 'Checking for professional summary titles to delete...'
          });

          // Fetch all existing professional summary job titles
          const allTitlesResp = await fetch('/api/professional-summaries/jobtitles?limit=10000');
          if (allTitlesResp.ok) {
            const allTitlesJson = await allTitlesResp.json();
            const existingTitles: any[] = allTitlesJson.data || [];
            console.log('Found', existingTitles.length, 'existing professional summary titles');

            // Build a Set of normalized titles that are present in the uploaded file
            const uploadedTitleSet = new Set(
              data.filter(row => row.title && row.title.trim())
                  .map(row => row.title.toLowerCase().trim())
            );
            console.log('Uploaded titles:', Array.from(uploadedTitleSet));

            // Identify titles that are NOT in the uploaded file
            const titlesToDelete = existingTitles.filter(t => !uploadedTitleSet.has(t.title.toLowerCase().trim()));
            console.log('Titles to delete:', titlesToDelete.map(t => t.title));

            if (titlesToDelete.length > 0) {
              // Update job to indicate deletion is happening
              await updateJob({
                currentOperation: `Deleting ${titlesToDelete.length} professional summary title(s) not present in uploaded file...`
              });

              for (const title of titlesToDelete) {
                try {
                  console.log('Deleting professional summary title:', title.title);
                  const deleteResponse = await fetch(`/api/professional-summaries/jobtitles/${title.id}`, { 
                    method: 'DELETE' 
                  });
                  if (deleteResponse.ok) {
                    console.log('Successfully deleted:', title.title);
                  } else {
                    console.error('Failed to delete:', title.title, deleteResponse.status);
                  }
                } catch (delErr) {
                  console.error(`Failed to delete title ${title.title}:`, delErr);
                }
              }

              console.log('Finished deleting missing titles');
            } else {
              console.log('No titles to delete - all existing titles are present in uploaded file');
            }
          } else {
            console.error('Failed to fetch existing professional summary titles for deletion logic');
          }
        } catch (delError) {
          console.error('Error during deleteMissingTitles processing:', delError);
        }
      }
      // ===== END DELETE MISSING TITLES LOGIC =====

      let processedRecords = 0;
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        console.log(`Processing row ${i + 1}/${data.length}:`, row);

        try {
          if (!row.title || !row.category || !row.content) {
            console.warn('Skipping row with missing required fields:', row);
            errorCount++;
            errors.push(`Row ${i + 1}: Missing required fields (title, category, or content)`);
            continue;
          }

          // Create or get professional summary job title
          let professionalSummaryJobTitle;
          try {
            const response = await fetch('/api/professional-summaries/jobtitles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: row.title,
                category: row.category
              }),
            });

            if (response.ok) {
              professionalSummaryJobTitle = await response.json();
              console.log('Created new professional summary job title:', professionalSummaryJobTitle);
            } else if (response.status === 409) {
              // Title already exists, fetch it
              const searchResponse = await fetch(`/api/professional-summaries/jobtitles?search=${encodeURIComponent(row.title)}`);
              const searchResult = await searchResponse.json();
              professionalSummaryJobTitle = searchResult.data.find((t: any) => t.title === row.title);
              console.log('Found existing professional summary job title:', professionalSummaryJobTitle);
            } else {
              throw new Error('Failed to create/fetch professional summary job title');
            }
          } catch (error) {
            console.error('Error with professional summary job title:', error);
            errorCount++;
            errors.push(`Row ${i + 1}: Failed to create/fetch job title "${row.title}"`);
            continue;
          }

          if (!professionalSummaryJobTitle) {
            console.warn('Could not create or find professional summary job title for:', row.title);
            errorCount++;
            errors.push(`Row ${i + 1}: Could not create or find job title "${row.title}"`);
            continue;
          }

          // Create professional summary
          const summaryResponse = await fetch('/api/professional-summaries/summaries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              professionalSummaryJobTitleId: professionalSummaryJobTitle.id,
              content: row.content,
              isRecommended: row.isRecommended === 'true' || row.isRecommended === true
            }),
          });

          if (summaryResponse.ok) {
            const createdSummary = await summaryResponse.json();
            console.log('Created professional summary:', createdSummary);
            successCount++;
          } else {
            const errorText = await summaryResponse.text();
            console.error('Failed to create professional summary:', errorText);
            errorCount++;
            errors.push(`Row ${i + 1}: Failed to create professional summary`);
          }

        } catch (error) {
          console.error('Error processing row:', row, error);
          errorCount++;
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        processedRecords++;

        // Update progress every 5 records or on the last record
        if (processedRecords % 5 === 0 || processedRecords === data.length) {
          const progress = Math.round((processedRecords / data.length) * 100);
          await updateJob({
            processedRecords,
            successCount,
            errorCount,
            progress,
            currentOperation: `Processed ${processedRecords}/${data.length} records (${successCount} successful, ${errorCount} errors)`,
            errors: errors.length > 0 ? errors : null
          });
        }
      }

      // Mark as completed
      await updateJob({
        status: 'completed',
        completedAt: new Date(),
        processedRecords,
        successCount,
        errorCount,
        progress: 100,
        currentOperation: `Import completed: ${successCount} successful, ${errorCount} errors`,
        errors: errors.length > 0 ? errors : null
      });

      console.log('Professional summary import completed successfully');

    } catch (error) {
      console.error('Import processing failed:', error);

      await updateJob({
        status: 'failed',
        completedAt: new Date(),
        currentOperation: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });

      throw error;
    }
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
              <h1 className="text-3xl font-bold text-white">Professional Summaries</h1>
              <p className="text-gray-300 mt-1">Manage professional summaries and their associated job titles for the resume wizard.</p>
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
          {/* Left Panel - Professional Summary Job Titles */}
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
                ) : professionalSummaryJobTitles.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No job titles found.</p>
                  </div>
                ) : (
                  professionalSummaryJobTitles.map((title: ProfessionalSummaryJobTitle) => (
                    <div
                      key={title.id}
                      onClick={() => setSelectedProfessionalSummaryJobTitle(title)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProfessionalSummaryJobTitle?.id === title.id
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
                              deleteTitleMutation.mutate(title.id);
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

          {/* Right Panel - Professional Summaries */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-white">Professional Summaries</CardTitle>
                </div>
                <div className="flex gap-2">
                  {selectedProfessionalSummaryJobTitle && (
                    <Button
                      size="sm"
                      onClick={() => setIsAddingSummary(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Summary
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedProfessionalSummaryJobTitle ? (
                <div className="text-center py-8 text-gray-400">
                  Select a job title to view professional summaries
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search summaries..."
                      value={searchSummaries}
                      onChange={(e) => setSearchSummaries(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {isLoadingSummaries ? (
                      <div className="text-center py-4 text-gray-400">Loading...</div>
                    ) : !professionalSummaries || professionalSummaries.length === 0 ? (
                      <div className="text-center py-4 text-gray-400">No professional summaries found</div>
                    ) : (
                      professionalSummaries.map((summary: ProfessionalSummary) => (
                        <Card key={summary.id} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="text-white text-sm leading-relaxed">{summary.content}</p>
                                {summary.isRecommended && (
                                  <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                                    <Star className="h-3 w-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditSummary(summary)}
                                  className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteSummaryMutation.mutate(summary.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {isEditingTitle ? 'Edit Job Title' : 'Add New Job Title'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {isEditingTitle ? 'Update the job title details.' : 'Create a new job title for professional summaries.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Title</label>
                <Input
                  value={titleForm.title}
                  onChange={(e) => setTitleForm({ ...titleForm, title: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                <Input
                  value={titleForm.category}
                  onChange={(e) => setTitleForm({ ...titleForm, category: e.target.value })}
                  placeholder="e.g., Software Development"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingTitle(false);
                    setIsEditingTitle(false);
                    setTitleForm({ title: '', category: '' });
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={isEditingTitle ? handleUpdateTitle : handleCreateTitle}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isEditingTitle ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Professional Summary Dialog */}
        <Dialog open={isAddingSummary || !!isEditingSummary} onOpenChange={(open) => {
          if (!open) {
            setIsAddingSummary(false);
            setIsEditingSummary(null);
            setSummaryForm({ content: '', isRecommended: false });
          }
        }}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {isEditingSummary ? 'Edit Professional Summary' : 'Add New Professional Summary'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {isEditingSummary ? 'Update the professional summary content.' : 'Create a new professional summary.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Content</label>
                <Textarea
                  value={summaryForm.content}
                  onChange={(e) => setSummaryForm({ ...summaryForm, content: e.target.value })}
                  placeholder="Enter professional summary content..."
                  rows={4}
                  className="bg-gray-800 border-gray-600 text-white resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecommended"
                  checked={summaryForm.isRecommended}
                  onChange={(e) => setSummaryForm({ ...summaryForm, isRecommended: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isRecommended" className="text-sm text-gray-300">
                  Mark as recommended
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingSummary(false);
                    setIsEditingSummary(null);
                    setSummaryForm({ content: '', isRecommended: false });
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={isEditingSummary ? handleUpdateSummary : handleCreateSummary}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isEditingSummary ? 'Update' : 'Create'}
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
              <DialogTitle>Import Professional Summary Data</DialogTitle>
              <DialogDescription className="text-gray-300">
                Select a file to import professional summary job titles and summaries. Progress will be shown in the Import History page.
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
                  <li>• <strong>content</strong>: Professional summary content (optional)</li>
                  <li>• <strong>isRecommended</strong>: true/false for recommended summaries (optional)</li>
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
                    Delete professional summary job titles not present in uploaded file
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