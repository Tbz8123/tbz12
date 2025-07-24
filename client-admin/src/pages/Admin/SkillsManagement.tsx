import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  StarOff,
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


interface SkillsJobTitle {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface SkillCategory {
  id: number;
  skillsJobTitleId: number;
  content: string;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SkillsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [selectedSkillsJobTitle, setSelectedSkillsJobTitle] = useState<SkillsJobTitle | null>(null);
  const [searchTitles, setSearchTitles] = useState('');
  const [searchCategories, setSearchCategories] = useState('');
  const [isAddingTitle, setIsAddingTitle] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<SkillCategory | null>(null);

  // Import/Export states
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [deleteMissingTitles, setDeleteMissingTitles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form states
  const [titleForm, setTitleForm] = useState({ title: '', category: '' });
  const [categoryForm, setCategoryForm] = useState({ content: '', isRecommended: false });

  // Fetch skills job titles
  const { data: skillsJobTitlesResponse, isLoading: isLoadingTitles } = useQuery({
    queryKey: ['skills-job-titles', searchTitles],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTitles) params.append('search', searchTitles);
      const response = await fetch(`/api/skills/skillsjobtitles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch skills job titles');
      return response.json();
    },
  });

  // Fetch skill categories for selected title
  const { data: skillCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['skill-categories', selectedSkillsJobTitle?.id, searchCategories],
    queryFn: async () => {
      if (!selectedSkillsJobTitle) return [];
      const params = new URLSearchParams();
      params.append('skillsJobTitleId', selectedSkillsJobTitle.id.toString());
      if (searchCategories) params.append('search', searchCategories);
      const response = await fetch(`/api/skills/categories?${params}`);
      if (!response.ok) throw new Error('Failed to fetch skill categories');
      return response.json();
    },
    enabled: !!selectedSkillsJobTitle,
  });

  const skillsJobTitles = skillsJobTitlesResponse?.data || [];

  // Mutations for skills job titles
  const createTitleMutation = useMutation({
    mutationFn: async (data: { title: string; category: string }) => {
      const response = await fetch('/api/skills/skillsjobtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create skills job title');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-job-titles'] });
      setIsAddingTitle(false);
      setIsEditingTitle(false);
      setTitleForm({ title: '', category: '' });
      toast({ title: 'Success', description: 'Skills job title created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; category: string }) => {
      const response = await fetch(`/api/skills/skillsjobtitles/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, category: data.category }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update skills job title');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-job-titles'] });
      setIsEditingTitle(false);
      setTitleForm({ title: '', category: '' });
      toast({ title: 'Success', description: 'Skills job title updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteTitleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/skills/skillsjobtitles/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete skills job title');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-job-titles'] });
      if (selectedSkillsJobTitle) setSelectedSkillsJobTitle(null);
      toast({ title: 'Success', description: 'Skills job title deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Mutations for skill categories
  const createCategoryMutation = useMutation({
    mutationFn: async (data: { skillsJobTitleId: number; content: string; isRecommended: boolean }) => {
      const response = await fetch('/api/skills/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create skill category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-categories'] });
      setIsAddingCategory(false);
      setCategoryForm({ content: '', isRecommended: false });
      toast({ title: 'Success', description: 'Skill category created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; content: string; isRecommended: boolean }) => {
      const response = await fetch(`/api/skills/categories/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content, isRecommended: data.isRecommended }),
      });
      if (!response.ok) throw new Error('Failed to update skill category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-categories'] });
      setIsEditingCategory(null);
      setCategoryForm({ content: '', isRecommended: false });
      toast({ title: 'Success', description: 'Skill category updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/skills/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete skill category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-categories'] });
      toast({ title: 'Success', description: 'Skill category deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Event handlers
  const handleCreateTitle = () => {
    createTitleMutation.mutate(titleForm);
  };

  const handleUpdateTitle = () => {
    if (selectedSkillsJobTitle) {
      updateTitleMutation.mutate({ ...titleForm, id: selectedSkillsJobTitle.id });
    }
  };

  const handleCreateCategory = () => {
    if (selectedSkillsJobTitle) {
      createCategoryMutation.mutate({ 
        ...categoryForm, 
        skillsJobTitleId: selectedSkillsJobTitle.id 
    });
    }
  };

  const handleUpdateCategory = () => {
    if (isEditingCategory) {
      updateCategoryMutation.mutate({ ...categoryForm, id: isEditingCategory.id });
    }
  };

  const startEditTitle = (title: SkillsJobTitle) => {
    setTitleForm({ title: title.title, category: title.category });
    setIsEditingTitle(true);
  };

  const startEditCategory = (category: SkillCategory) => {
    setCategoryForm({ content: category.content, isRecommended: category.isRecommended });
    setIsEditingCategory(category);
  };

  const exportData = async (format: 'csv' | 'excel' | 'json') => {
    try {
      console.log(`Starting ${format.toUpperCase()} export for skills...`);

      // Fetch all skills job titles with their categories
      const allTitlesResponse = await fetch('/api/skills/skillsjobtitles?limit=1000');
      if (!allTitlesResponse.ok) {
        console.error('Failed to fetch skills job titles:', allTitlesResponse.status, allTitlesResponse.statusText);
        throw new Error('Failed to fetch data for export');
      }
      const allTitlesData = await allTitlesResponse.json();
      console.log(`Fetched ${allTitlesData.data?.length || 0} skills job titles`);

      const exportData = [];

      for (const title of allTitlesData.data) {
        console.log(`Processing skills for title: ${title.title} (ID: ${title.id})`);

        const categoriesResponse = await fetch(`/api/skills/categories?skillsJobTitleId=${title.id}&limit=1000`);
        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json();
          console.log(`  Found ${categories.length} skill categories for ${title.title}`);

          if (categories.length === 0) {
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
            categories.forEach((skillCategory: SkillCategory) => {
              exportData.push({
                id: title.id,
                title: title.title,
                category: title.category,
                content: skillCategory.content,
                isRecommended: skillCategory.isRecommended,
                createdAt: title.createdAt,
                updatedAt: title.updatedAt
              });
            });
          }
        } else {
          console.error(`Failed to fetch categories for ${title.title}:`, categoriesResponse.status);
          // Still add the title without categories
          exportData.push({
            id: title.id,
            title: title.title,
            category: title.category,
            content: '',
            isRecommended: false,
            createdAt: title.createdAt,
            updatedAt: title.updatedAt
          });
        }
      }

      console.log(`Prepared ${exportData.length} records for export`);

      if (exportData.length === 0) {
        toast({ title: 'Warning', description: 'No data available to export', variant: 'destructive' });
        return;
      }

      if (format === 'json') {
        console.log('Creating JSON blob...');
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, 'skills-categories.json');
      } else if (format === 'csv') {
        console.log('Converting to CSV...');
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, 'skills-categories.csv');
      } else if (format === 'excel') {
        console.log('Converting to Excel format...');
        // For Excel, we'll use CSV format but with .xlsx extension
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        downloadFile(blob, 'skills-categories.xlsx');
      }

      console.log(`✅ ${format.toUpperCase()} export completed successfully`);
      toast({ title: 'Success', description: `Data downloaded as ${format.toUpperCase()} successfully` });
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to download data';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
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
    setSelectedFile(file);
  };

  const handleSubmitImport = async () => {
    if (!selectedFile) {
      toast({ title: 'Error', description: 'Please select a file first', variant: 'destructive' });
      return;
    }

    try {
      // Read file content
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(selectedFile);
      });

      // Create import history record
      const resp = await fetch('/api/import-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type || 'text/csv',
          uploadedBy: 'admin',
          status: 'pending',
          metadata: {
            csvData: text,
            deleteMissingTitles: deleteMissingTitles,
            importType: 'skills'
          }
        })
      });

      if (!resp.ok) throw new Error('Failed to create import job');

      const job = await resp.json();

      // Close dialog
      setShowImportDialog(false);
      setSelectedFile(null);

      // Tell server to start processing
      await fetch(`/api/import-history/${job.id}/process`, {
        method: 'POST'
      });

      // Redirect user to import history page
      setLocation('/admin/import-history');

    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Import failed', variant: 'destructive' });
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
              <h1 className="text-3xl font-bold text-white">Skills & Categories</h1>
              <p className="text-gray-300 mt-1">Manage skill categories and their associated skills for the resume wizard.</p>
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
              onClick={() => setIsAddingTitle(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skills Job Title
            </Button>
          </div>
        </div>

        {/* Main Content - Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Skills Job Titles */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-white text-lg">Skills Job Titles</CardTitle>
                </div>
                <Button
                  onClick={() => setIsAddingTitle(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Title
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search skills job titles..."
                  value={searchTitles}
                  onChange={(e) => setSearchTitles(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {isLoadingTitles ? (
                  <div className="p-6 text-center text-gray-400">Loading skills job titles...</div>
                ) : skillsJobTitles.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">No skills job titles found</div>
                ) : (
                  <div className="space-y-2 p-4">
                    {skillsJobTitles.map((skillsJobTitle: SkillsJobTitle) => (
                      <div
                        key={skillsJobTitle.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedSkillsJobTitle?.id === skillsJobTitle.id
                            ? 'bg-purple-500/20 border-purple-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedSkillsJobTitle(skillsJobTitle)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white">{skillsJobTitle.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {skillsJobTitle.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditTitle(skillsJobTitle);
                              }}
                              className="text-gray-400 hover:text-white hover:bg-white/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this skills job title?')) {
                                  deleteTitleMutation.mutate(skillsJobTitle.id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Skills */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-white text-lg">Skills</CardTitle>
                </div>
                {selectedSkillsJobTitle && (
                  <Button
                    onClick={() => setIsAddingCategory(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                )}
              </div>

              {!selectedSkillsJobTitle ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Search className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Select a Skill Category</h3>
                  <p className="text-gray-300">Choose a skill category from the left panel to view, add, or edit its skills.</p>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search skills..."
                    value={searchCategories}
                    onChange={(e) => setSearchCategories(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {!selectedSkillsJobTitle ? (
                  <div className="p-6 text-center text-gray-400">
                    Select a skill category to view skills
                  </div>
                ) : isLoadingCategories ? (
                  <div className="p-6 text-center text-gray-400">Loading skills...</div>
                ) : !skillCategories || skillCategories.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">No skills found for this category</div>
                ) : (
                  <div className="space-y-3 p-4">
                    {skillCategories.map((category: SkillCategory) => (
                      <div
                        key={category.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={category.isRecommended ? "default" : "secondary"} className="text-xs">
                                {category.isRecommended ? (
                                  <>
                                    <Star className="h-3 w-3 mr-1" />
                                    Recommended
                                  </>
                                ) : (
                                  <>
                                    <StarOff className="h-3 w-3 mr-1" />
                                    Standard
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{category.content}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditCategory(category)}
                              className="text-gray-400 hover:text-white hover:bg-white/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this skill?')) {
                                  deleteCategoryMutation.mutate(category.id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Skills Job Title Dialog */}
        <Dialog open={isAddingTitle || isEditingTitle} onOpenChange={(open) => {
          if (!open) {
            setIsAddingTitle(false);
            setIsEditingTitle(false);
            setTitleForm({ title: '', category: '' });
          }
        }}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isAddingTitle ? 'Add New Skills Job Title' : 'Edit Skills Job Title'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {isAddingTitle 
                  ? 'Create a new skills job title to organize skill categories.'
                  : 'Update the skills job title information.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <Input
                  value={titleForm.title}
                  onChange={(e) => setTitleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Programming Skills, Design Skills"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <Input
                  value={titleForm.category}
                  onChange={(e) => setTitleForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Technology, Creative, Management"
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

        {/* Add/Edit Skill Category Dialog */}
        <Dialog open={isAddingCategory || !!isEditingCategory} onOpenChange={(open) => {
          if (!open) {
            setIsAddingCategory(false);
            setIsEditingCategory(null);
            setCategoryForm({ content: '', isRecommended: false });
          }
        }}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isAddingCategory ? 'Add New Skill Category' : 'Edit Skill Category'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {isAddingCategory 
                  ? 'Create a new skill category to organize related skills.'
                  : 'Update the skill category information.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Category</label>
                <Input
                  value={categoryForm.content}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the skill category details..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecommended"
                  checked={categoryForm.isRecommended}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, isRecommended: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10"
                />
                <label htmlFor="isRecommended" className="text-sm text-gray-300 cursor-pointer">
                  Mark as recommended skill category
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setIsEditingCategory(null);
                    setCategoryForm({ content: '', isRecommended: false });
                  }}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={isAddingCategory ? handleCreateCategory : handleUpdateCategory}
                  disabled={!categoryForm.content}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAddingCategory ? 'Create' : 'Update'}
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
              <DialogTitle>Import Skills Data</DialogTitle>
              <DialogDescription className="text-gray-300">
                Select a file to import skill categories and skills. Progress will be shown in the Import History page.
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
                  <li>• <strong>title</strong>: Skill category title (required)</li>
                  <li>• <strong>category</strong>: Category name (required)</li>
                  <li>• <strong>content</strong>: Skill content (optional)</li>
                  <li>• <strong>isRecommended</strong>: true/false for recommended skills (optional)</li>
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
                    Delete skill categories not present in uploaded file
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
