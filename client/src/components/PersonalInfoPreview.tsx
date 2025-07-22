import React, { useState, useEffect } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { Button } from '@/components/ui/button';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { MultiPageRender } from '@/lib/multi-page-template-utils';

interface PersonalInfoPreviewProps {
  resumeData: any;
}

const PersonalInfoPreview: React.FC<PersonalInfoPreviewProps> = ({ 
  resumeData, 
}) => {
  // Connect to ResumeStore with stable selectors
  const proTemplates = useResumeStore(state => state.proTemplates);
  const isLoadingProTemplates = useResumeStore(state => state.isLoadingProTemplates);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);

  const activeTemplate = proTemplates.find(t => t.id === activeProTemplateId);

  if (!activeTemplate || isLoadingProTemplates) {
    return (
      <div className="w-full h-full">
        <div className="w-full aspect-[8.5/11] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <div className="text-purple-400 mb-4">
              {isLoadingProTemplates ? (
                <Sparkles className="w-16 h-16 mx-auto animate-spin" />
              ) : (
                <FileText className="w-16 h-16 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {isLoadingProTemplates ? 'Loading Templates...' : 'No Template Available'}
            </h3>
            <p className="text-gray-300 mb-6 text-sm">
              {isLoadingProTemplates ? 'Please wait while we load the templates' : 'A Pro template will be selected automatically'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Template scope for react-live
  const templateScope = {
    React,
    userData: resumeData,
    resumeData,
    MultiPageRender,
    customColors: resumeData.customization?.colors || {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#60a5fa',
      text: '#111827',
      background: '#ffffff',
      sidebarText: '#ffffff',
      sidebarBackground: '#333333'
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-11/12 mx-auto aspect-[8.5/11] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden relative">
        <div className="w-full h-full overflow-hidden">
          <div 
            className="w-full h-full origin-top-left"
            style={{
              transform: 'scale(0.45)',
              width: '222.2%',
              height: '222.2%'
            }}
          >
            {activeTemplate.code ? (
              <LiveProvider code={activeTemplate.code} scope={templateScope} noInline>
                <LivePreview />
                <LiveError className="text-red-600 bg-red-100 p-2 text-xs" />
              </LiveProvider>
            ) : (
              <MultiPageRender resumeData={resumeData} />
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-purple-400 font-semibold text-sm">
          {activeTemplate.name}
        </p>
        <p className="text-gray-300 text-xs mt-1">
          Pro Template
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoPreview;