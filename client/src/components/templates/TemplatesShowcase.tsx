import React from "react";
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ResumeTemplateRecord } from '@shared/schema';

export default function TemplatesShowcase() {
  const { data: templates = [], isLoading } = useQuery<ResumeTemplateRecord[]>({
    queryKey: ['/api/templates'],
  });

  // Display only the first 4 templates, the full list is available on the templates page
  const displayTemplates = templates.slice(0, 4);

  return (
    <section id="templates" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Professional Resume Templates</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our library of ATS-friendly templates designed by HR professionals
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loading state
            <>
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Actual template display
            displayTemplates.map((template) => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm template-card">
                {/* Template preview image */}
                <div className="h-64 overflow-hidden">
                  <img 
                    src={template.previewImageUrl} 
                    alt={template.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  <Link href={`/resume-builder?template=${template.id}`}>
                    <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
                      Use This Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/templates">
            <Button variant="outline" className="inline-flex items-center gap-2">
              View All Templates
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
