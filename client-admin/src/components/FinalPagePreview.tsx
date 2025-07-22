import React, { useMemo } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import MultiPageProTemplate from './MultiPageProTemplate';

const FinalPagePreview: React.FC = () => {
  const { 
    resumeData, 
    proTemplates,
    isLoadingProTemplates,
    activeProTemplateId,
    getProTemplateById
  } = useResume();

  // Debug logging for understanding the state
  console.log('🔍 FinalPagePreview Debug:', {
    proTemplatesCount: proTemplates?.length,
    proTemplates: proTemplates?.map(t => ({ id: t.id, name: t.name })),
    isLoadingProTemplates,
    activeProTemplateId,
    hasResumeData: !!resumeData
  });

  const activeTemplate = getProTemplateById ? getProTemplateById(activeProTemplateId) : null;

  const templateCode = useMemo(() => {
    if (!activeTemplate) {
      console.log('❌ No active template found');
      return null;
    }

    // Enhanced logging for debugging
    console.log('📋 FinalPagePreview - Template details:', {
      templateId: activeTemplate.id,
      templateName: activeTemplate.name,
      hasCode: !!activeTemplate.code,
      codeLength: activeTemplate.code?.length,
      codePreview: activeTemplate.code?.substring(0, 100) + '...',
      activeProTemplateId,
      activeTemplate: activeTemplate.name
    });

    return activeTemplate.code;
  }, [activeTemplate, activeProTemplateId]);

  if (isLoadingProTemplates) {
    console.log('⏳ Loading Pro templates...');
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!activeTemplate) {
    console.log('❌ No active template available');
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No template selected</p>
        </div>
      </div>
    );
  }

  if (!templateCode) {
    console.log('❌ No template code available');
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Template code not available</p>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering template with code');

  const templateScope = {
    React,
    userData: resumeData,
    resumeData,
    MultiPageProTemplate,
    customColors: resumeData.customization?.colors
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-full"
    >
      <LiveProvider code={templateCode} scope={templateScope} noInline>
        <LivePreview className="w-full min-h-full" />
        <LiveError className="text-red-600 bg-red-100 p-2 text-xs" />
      </LiveProvider>
    </motion.div>
  );
};

export default FinalPagePreview;