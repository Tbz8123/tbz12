import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ResumePreview from '@/components/resume/ResumePreview';
// Define ResumeData type locally to avoid import issues
interface ResumeData {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    title: string;
    summary: string;
    contactDetails: any;
  };
  education: any[];
  experience: any[];
  skills: any[];
  certifications: any[];
  languages: any[];
  customSections: any[];
  templateId: string;
  createdAt: string;
  updatedAt: string;
}
import { ArrowLeft, Download, Share2 } from 'lucide-react';

export default function Preview() {
  const [match, params] = useRoute('/preview/:id');
  const resumeId = params?.id;

  const { data: resume, isLoading, error } = useQuery<ResumeData>({
    queryKey: [`/api/resumes/${resumeId}`],
    enabled: !!resumeId,
  });

  // Fetch template based on resume's templateId
  const { data: template } = useQuery<{id: number, code: string}>({
    queryKey: [`/api/templates/${resume?.templateId}`],
    enabled: !!resume?.templateId,
  });

  useEffect(() => {
    // Set the document title
    if (resume) {
      document.title = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName} - Resume | TbzResumeBuilder`;
    } else {
      document.title = 'Resume Preview | TbzResumeBuilder';
    }
  }, [resume]);

  if (isLoading) {
    return (
      <div className="bg-muted min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-card h-12 w-40 rounded mb-6"></div>
            <div className="bg-card h-[1100px] rounded shadow-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="bg-muted min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Resume Not Found</h1>
            <p className="text-muted-foreground mb-6">The resume you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/resume-builder">
              <Button>Create a New Resume</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/resume-builder">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Editor
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ResumePreview 
            resumeData={resume}
            templateCode={template?.code || ''}
          />
        </div>
      </div>
    </div>
  );
}
