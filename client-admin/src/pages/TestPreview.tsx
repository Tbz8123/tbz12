import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import TestResumePreview from '@/components/resume/TestResumePreview';

export default function TestPreview() {
  return (
    <div className="bg-muted min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TestResumePreview />
        </div>
      </div>
    </div>
  );
}