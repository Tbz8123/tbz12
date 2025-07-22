import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { ResumeData } from '@shared/schema';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateCode?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateCode = '' }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  console.log('[ResumePreview] useEffect triggered. templateCode:', templateCode ? templateCode.substring(0, 50) + '...' : 'EMPTY', 'resumeData:', resumeData);
  console.log('[ResumePreview] Template code length:', templateCode.length);
  console.log('[ResumePreview] Template code exists:', !!templateCode);

  // Clean responsive template that never adds container scrolling
  const getResponsiveTemplateCode = (originalCode: string) => {
    if (!originalCode || originalCode.trim() === '') return originalCode;

    // Simple responsive wrapper that only scales, never scrolls
    const responsiveWrapper = `
      const ResponsiveWrapper = ({ children }) => {
        const [scale, setScale] = React.useState(1);
        const [isMobile, setIsMobile] = React.useState(false);
        const wrapperRef = React.useRef(null);

        React.useEffect(() => {
          const updateScale = () => {
            if (wrapperRef.current) {
              const containerWidth = wrapperRef.current.offsetWidth;
              const containerHeight = wrapperRef.current.offsetHeight;

              const isMobileDevice = containerWidth < 768;
              setIsMobile(isMobileDevice);

              // Always scale to fit within container - no scrolling
              const scaleX = (containerWidth - 20) / 800;  // 10px padding each side
              const scaleY = (containerHeight - 20) / 1131; // 10px padding top/bottom

              const finalScale = Math.min(scaleX, scaleY, 1); // Never scale up
              setScale(Math.max(0.1, finalScale)); // Minimum scale to prevent too small
            }
          };

          updateScale();

          const resizeObserver = new ResizeObserver(updateScale);
          if (wrapperRef.current) {
            resizeObserver.observe(wrapperRef.current);
          }

          return () => resizeObserver.disconnect();
        }, []);

        return React.createElement('div', {
          ref: wrapperRef,
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden', // CRITICAL: No scrolling in container
            backgroundColor: 'white'
          }
        }, React.createElement('div', {
          style: {
            width: '800px',
            height: '1131px',
            transform: 'scale(' + scale + ')',
            transformOrigin: 'center',
            overflow: 'hidden' // CRITICAL: No content overflow
          }
        }, children));
      };

      // Original template code
      ${originalCode}

      // Wrap the rendered content
      const originalRender = render;
      render = (content) => {
        originalRender(React.createElement(ResponsiveWrapper, {}, content));
      };
    `;

    return responsiveWrapper;
  };

  const scope = {
    React,
    userData: resumeData,
    resumeData,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreviewReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [templateCode, resumeData]);

  // Show placeholder if no template code
  if (!templateCode || templateCode.trim() === '' || templateCode === 'EMPTY' || templateCode === 'STILL EMPTY') {
    console.log('[ResumePreview] No template code available, showing placeholder');
                return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Template Selected</h3>
          <p className="text-gray-500">Please select a template to preview your resume</p>
        </div>
      </div>
    );
  }

  const processedCode = getResponsiveTemplateCode(templateCode);

  return (
    <div ref={previewRef} className="w-full h-full bg-white overflow-hidden">
      {isPreviewReady && (
        <LiveProvider code={processedCode} scope={scope} noInline>
          <div className="w-full h-full overflow-hidden">
            <LivePreview className="w-full h-full" />
          </div>
          <LiveError className="hidden" />
        </LiveProvider>
      )}
    </div>
  );
};

export default ResumePreview;