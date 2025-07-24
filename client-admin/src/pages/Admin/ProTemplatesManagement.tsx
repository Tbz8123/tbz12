import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Eye, Edit, Trash2, Search } from 'lucide-react';

// Define the type for a pro template based on Prisma schema
interface ProTemplateType {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  structure: any;
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null;
  uploadedImageUrl?: string | null;
  thumbnailType?: 'standard' | 'enhanced3d' | null;
  displayMode?: 'thumbnail' | 'uploaded_image' | null;
  thumbnailFormat?: string | null;
  thumbnailMetadata?: any | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProTemplatesManagement() {
  const { data: templates = [], isLoading, error, isError } = useQuery<ProTemplateType[]>({
    queryKey: ['/api/pro-templates'],
    queryFn: async () => {
      const response = await fetch('/api/pro-templates');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/pro-templates/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pro-templates'] });
      toast({
        title: "Template Deleted",
        description: "Pro template has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete template.",
        variant: "destructive",
      });
    },
  });

  // Filter logic for search
  const filteredTemplates = templates.filter((t) => {
    if (search && t.name && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getThumbnailUrl = (template: ProTemplateType) => {
    if (template.displayMode === 'uploaded_image' && template.uploadedImageUrl) {
      return template.uploadedImageUrl;
    }
    if (template.thumbnailType === 'enhanced3d' && template.enhanced3DThumbnailUrl) {
      return template.enhanced3DThumbnailUrl;
    }
    return template.thumbnailUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(147,51,234,0.03)_50%,transparent_65%)]"></div>
      </div>

      <div className="container mx-auto py-10 px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/admin/pro')}
              className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Pro Templates Management</h1>
              <p className="text-gray-300 mt-1">Manage and customize Pro tier resume templates</p>
            </div>
          </div>
          <Button 
            onClick={() => setLocation('/admin/templates/pro-editor')} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Pro Template
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search pro templates..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-300">
              {filteredTemplates.length} of {templates.length} templates
            </div>
          </div>
        </div>

        {/* Templates List */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Pro Resume Templates</h2>

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading pro templates...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">Error loading pro templates</div>
              <p className="text-gray-300">{error?.message}</p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No pro templates found</div>
                  <Button 
                    onClick={() => setLocation('/admin/templates/pro-editor')} 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Pro Template
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="bg-white/5 border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-colors">
                      {/* Template Thumbnail */}
                      <div className="aspect-[3/4] bg-white/10 rounded-lg mb-4 overflow-hidden">
                        {getThumbnailUrl(template) ? (
                          <img
                            src={getThumbnailUrl(template)!}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-2xl mb-2">📄</div>
                              <div className="text-sm">No Preview</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                        {template.description && (
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{template.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                          {template.thumbnailType === 'enhanced3d' && (
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">3D</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/admin/pro-templates/view/${template.id}`)}
                          className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/admin/pro-templates/edit/${template.id}`)}
                          className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(template.id)}
                          className="bg-transparent border-red-500/50 text-red-300 hover:bg-red-500/20"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 