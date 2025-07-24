import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

import { useToast } from '@/components/ui/use-toast';

// Define the type for a resume template based on Prisma schema
interface ResumeTemplateType {
  id: number;
  name: string;
  description?: string | null; // Prisma String? can be string or null
  code: string;
  structure: any; // Prisma Json
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null; // Added for enhanced thumbnails
  uploadedImageUrl?: string | null; // Added for uploaded images
  thumbnailType?: 'standard' | 'enhanced3d' | null; // Added to track which thumbnail type is active
  displayMode?: 'thumbnail' | 'uploaded_image' | null; // Added to track display preference
  enhanced3DMetadata?: any | null; // Added for enhanced thumbnail metadata
  isDefault: boolean;
  createdAt: string; // Dates will be stringified in JSON
  updatedAt: string;
  // category?: string; // Removed as it's not in the Prisma schema
}

export default function TemplatesManagement() {
  const { data: templates = [], isLoading, error, isError } = useQuery<ResumeTemplateType[]>({
    queryKey: ['/api/templates/snap'],
    // queryFn will be automatically inferred by react-query if key is a URL
    // but to be explicit and ensure it fetches correctly:
    queryFn: async () => {
      const response = await fetch('/api/templates/snap');
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
    mutationFn: async (id: number) => { // ID is number
      await fetch(`/api/templates/snap/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/templates/snap'] }),
  });

  // Filter logic for search only
  const filteredTemplates = templates.filter((t) => {
    if (search && t.name && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Template Management</h1>
          <p className="text-gray-500">Manage and customize resume templates</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setLocation('/admin/templates/new')} className="bg-primary text-white">+ Create New Template</Button>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Resume Templates</h2>
        <div className="flex items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search templates..."
            className="border rounded px-3 py-2 ml-auto"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {isLoading && <div className="text-center py-8">Loading templates...</div>}
        {isError && <div className="text-center py-8 text-red-500">Error loading templates: {error?.message}</div>}
        {!isLoading && !isError && (
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Preview</th>
                <th className="px-3 py-2 text-left">Name</th>
                {/* <th className="px-3 py-2 text-left">Category</th> */} {/* Removed Category column */}
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">No templates found.</td>
                </tr>
              ) : filteredTemplates.map((template) => (
                <tr key={template.id} className="border-t">
                  <td className="px-3 py-2">{template.id}</td>
                  <td className="px-3 py-2 w-28">
                    <div className="w-24 h-32 bg-gray-100 border rounded overflow-hidden flex items-center justify-center">
                      {(() => {
                        // Check display mode preference first
                        let displayUrl;
                        if (template.displayMode === 'uploaded_image' && template.uploadedImageUrl) {
                          displayUrl = template.uploadedImageUrl;
                        } else {
                          // Default to thumbnail mode - check for enhanced thumbnail first, then fallback to standard
                          displayUrl = template.thumbnailType === 'enhanced3d' && template.enhanced3DThumbnailUrl 
                                      ? template.enhanced3DThumbnailUrl 
                                      : template.thumbnailUrl;
                        }

                        if (displayUrl) {
                          return (
                            <img 
                              src={displayUrl}
                              alt={`${template.name} thumbnail`}
                              className="w-full h-full object-contain" // Changed to object-contain for better aspect ratio handling
                            />
                          );
                        } else {
                          return <span className="text-xs text-gray-400">No Preview</span>;
                        }
                      })()}
                    </div>
                  </td>
                  <td className="px-3 py-2">{template.name}</td>
                  {/* <td className="px-3 py-2">{template.category || '-'}</td> */} {/* Removed Category data */}
                  <td className="px-3 py-2">{template.createdAt ? new Date(template.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <Button size="sm" onClick={() => setLocation(`/admin/templates/view/${template.id}`)}>View</Button>
                    <Button size="sm" variant="secondary" onClick={() => setLocation(`/admin/templates/edit/${template.id}`)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(template.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}