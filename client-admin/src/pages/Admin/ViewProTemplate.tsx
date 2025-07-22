import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

// Sample user data for preview
const sampleUserData = {
  personalInfo: {
    firstName: 'JOHNSON',
    lastName: 'SMITH',
    title: 'Graphic Designer',
    email: 'johnson.smith@email.com',
    phone: '+1 234 567 8901',
    address: '1234 Street Address, Level-5',
    profileImageUrl: '',
    contactDetails: {
      linkedin: 'linkedin.com/in/johnsonsmith',
      website: 'www.johnson-design.com',
      drivingLicense: 'Class B License'
    }
  },
  summary: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
  experience: [
    {
      company: 'Company Name Here',
      position: 'Job Position Here',
      startDate: '2010-2013',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.',
    },
    {
      company: 'Company Name Here',
      position: 'Job Position Here',
      startDate: '2013-2015',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.',
    },
  ],
  education: [
    {
      degree: 'University Name',
      startDate: '2003-2005',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ],
  skills: [
    { name: "Adobe Illustrator", level: 80 },
    { name: "Microsoft Word", level: 90 },
    { name: "Adobe Photoshop", level: 75 },
    { name: "Adobe InDesign", level: 85 }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
    { name: "French", level: "Conversational" },
    { name: "Arabic", level: "Basic" }
  ],
};

export default function ViewProTemplate() {
  const [location, setLocation] = useLocation();
  const id = location.split('/').pop();

  const { data: template, isLoading } = useQuery({
    queryKey: ['/api/pro-templates', id],
    queryFn: async () => {
      const res = await fetch(`/api/pro-templates/${id}`);
      if (!res.ok) throw new Error('Failed to fetch pro template');
      return res.json();
    },
    enabled: !!id,
  });

  const scope = { 
    React, 
    motion, 
    userData: sampleUserData,
    useState: React.useState,
    useEffect: React.useEffect,
    render: (ui: React.ReactNode) => ui
  };

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
        <Button 
          onClick={() => setLocation('/admin/pro/templates/management')}
          className="mt-4 bg-purple-600 hover:bg-purple-700"
        >
          Back to Templates
        </Button>
      </div>
    </div>
  );

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
              onClick={() => setLocation('/admin/pro/templates/management')}
              className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{template.name}</h1>
              <p className="text-gray-300 mt-1">Pro Template Preview</p>
            </div>
          </div>
          <Button 
            onClick={() => setLocation(`/admin/pro-templates/edit/${template.id}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Template
          </Button>
        </div>

        {/* Template Info */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">Template Name</h3>
              <p className="text-white">{template.name}</p>
            </div>
            {template.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">Description</h3>
                <p className="text-white">{template.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">Created</h3>
              <p className="text-white">{new Date(template.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Live Preview</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <LiveProvider code={template.code} scope={scope} noInline={true}>
              <LiveError className="text-red-600 bg-red-100 p-4 rounded mb-4 font-mono text-sm whitespace-pre-wrap" />
              <div className="min-h-[600px]">
                <LivePreview className="w-full h-full" />
              </div>
            </LiveProvider>
          </div>
        </div>
      </div>
    </div>
  );
} 