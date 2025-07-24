import React from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProTemplateEditor from './ProTemplateEditor';

export default function EditProTemplate() {
  const [location] = useLocation();
  const id = location.split('/').pop();
  const queryClient = useQueryClient();

  const { data: template, isLoading } = useQuery({
    queryKey: ['/api/pro-templates', id],
    queryFn: async () => {
      const res = await fetch(`/api/pro-templates/${id}`);
      if (!res.ok) throw new Error('Failed to fetch pro template');
      return res.json();
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (updated: any) => {
      const response = await fetch(`/api/pro-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!response.ok) {
        throw new Error('Failed to update pro template');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/pro-templates'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/pro-templates', id] });
      setTimeout(() => {
        window.location.href = '/admin/pro/templates/management';
      }, 200);
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-300 mt-4">Loading pro template...</p>
      </div>
    </div>
  );

  if (!template) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 mb-4">Pro template not found</div>
        <p className="text-gray-300">The requested template could not be found.</p>
      </div>
    </div>
  );

  return (
    <ProTemplateEditor
      initialData={template}
      onSave={updateMutation.mutate}
      isEditing
    />
  );
} 