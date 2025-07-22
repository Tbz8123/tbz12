
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const sampleUserData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State 12345",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.com"
  },
  summary: "Experienced professional with a strong background in technology and innovation.",
  experience: [
    {
      id: "1",
      company: "Tech Company",
      position: "Senior Developer",
      startDate: "2020-01",
      endDate: "Present",
      description: "Led development of key features and mentored junior developers."
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.8"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
  projects: [
    {
      id: "1",
      name: "Portfolio Website",
      description: "Built a responsive portfolio website using React and TypeScript",
      technologies: ["React", "TypeScript", "CSS3"],
      url: "https://johndoe.com"
    }
  ],
  certifications: [],
  languages: [],
  awards: []
};

export default function ViewTemplate() {
  const [match, params] = useRoute('/admin/templates/:id');
  const templateId = params?.id;

  const { data: template, isLoading, error } = useQuery({
    queryKey: [`/api/templates/${templateId}`],
    enabled: !!templateId,
    retry: 2,
    staleTime: 0
  });

  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    motion,
    useAnimation,
    useInView,
    userData: sampleUserData,
    resumeData: sampleUserData
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/snap/templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/snap/templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Template Not Found</h2>
            <p className="text-gray-500 mb-6">The template you're looking for doesn't exist or couldn't be loaded.</p>
            <Link href="/admin/snap/templates">
              <Button>Back to Templates</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!template.code || template.code.trim() === '') {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/snap/templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{template.name} Preview</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Template Code</h2>
            <p className="text-gray-500 mb-6">This template doesn't have any code to display.</p>
            <Link href={`/admin/snap/templates/edit/${template.id}`}>
              <Button>Edit Template</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/snap/templates">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{template.name} Preview</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <LiveProvider 
          code={template.code} 
          scope={scope} 
          noInline={true}
          key={`view-${template.id}-${template.code?.length || 0}`}
        >
          <LiveError className="text-red-600 bg-red-100 p-4 rounded mb-4 font-mono text-sm whitespace-pre-wrap" />
          <div 
            className="border border-gray-200 rounded-lg overflow-hidden"
            style={{
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '800 / 1131',
              margin: '0 auto',
              backgroundColor: 'white'
            }}
          >
            <LivePreview 
              className="w-full h-full" 
              style={{ 
                minHeight: '400px',
                display: 'block'
              }}
            />
          </div>
        </LiveProvider>
      </div>
    </div>
  );
}
