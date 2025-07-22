import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, FileText, File, Download as DownloadIcon } from 'lucide-react';
import { exportAsPdf } from '@/lib/export/pdf';
import { exportAsTxt } from '@/lib/export/txt';
import { exportAsDocx } from '@/lib/export/docx';
import { trackTemplateDownload } from '@/services/googleAnalytics';

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

interface DownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateCode: string;
  templateId?: number;
  templateName?: string;
  templateType?: 'snap' | 'pro';
}

type ExportFormat = 'pdf' | 'docx' | 'txt';

// Helper function to get user ID from localStorage or Firebase
const getCurrentUserId = () => {
  try {
    // Check for mock user first (for admin pages)
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const user = JSON.parse(mockUser);
      return user.id || null;
    }

    // Check for Firebase user
    const firebaseUser = localStorage.getItem('firebaseUser');
    if (firebaseUser) {
      const user = JSON.parse(firebaseUser);
      return user.uid || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Helper function to generate anonymous ID
const getAnonymousId = () => {
  let anonymousId = localStorage.getItem('anonymousId');
  if (!anonymousId) {
    anonymousId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('anonymousId', anonymousId);
  }
  return anonymousId;
};

// Helper function to track download
const trackDownload = async (templateId: number | string, templateType: 'snap' | 'pro', templateName: string, downloadType: string) => {
  try {
    const userId = getCurrentUserId();
    const anonymousId = userId ? null : getAnonymousId();

    console.log('🔍 Download tracking debug:', {
      templateId,
      templateType,
      templateName,
      downloadType,
      userId,
      anonymousId,
      userAgent: navigator.userAgent
    });

    const response = await fetch('/api/downloads/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: templateId.toString(),
        templateType,
        templateName,
        downloadType,
        userId,
        anonymousId,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Download tracking failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Download tracked successfully:', result);

    // Track with Google Analytics 4
    try {
      trackTemplateDownload({
        templateId: templateId.toString(),
        templateName,
        templateType,
        downloadType: downloadType as 'pdf' | 'docx' | 'txt',
        userId,
        tier: userId ? 'registered' : 'free' // Basic tier detection
      });
      console.log('✅ GA4 tracking successful');
    } catch (gaError) {
      console.error('GA4 tracking failed:', gaError);
    }
  } catch (error) {
    console.error('Download tracking error:', error);
  }
};

export default function DownloadOptionsModal({ 
  isOpen, 
  onClose, 
  resumeData, 
  templateCode, 
  templateId, 
  templateName, 
  templateType = 'pro' 
}: DownloadOptionsModalProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [fileName, setFileName] = useState('Resume_1');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    const finalFileName = `${fileName.trim() || 'resume'}.${format}`;

    try {
      // Track the download
      if (templateId) {
        await trackDownload(
          templateId,
          templateType,
          templateName || `Template ${templateId}`,
          format
        );
      }

      // Perform the actual download
      switch (format) {
        case 'pdf':
          await exportAsPdf(resumeData, templateCode, finalFileName);
          break;
        case 'docx':
          await exportAsDocx(resumeData, finalFileName);
          break;
        case 'txt':
          exportAsTxt(resumeData, finalFileName);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error during download:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatOptions = [
    { 
      value: 'pdf', 
      label: 'Adobe PDF', 
      description: 'Perfect for printing and sharing',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      value: 'docx', 
      label: 'MS Word Document', 
      description: 'Editable format for further customization',
      icon: File,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'txt', 
      label: 'Plain Text', 
      description: 'Simple text format, universally compatible',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <DownloadIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Download Resume</h2>
              <p className="text-purple-100 text-sm">
                {templateName ? `Using ${templateName} (${templateType?.toUpperCase()})` : 'Choose your preferred format'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Format Selection */}
          <div className="space-y-4 mb-8">
            {formatOptions.map(({ value, label, description, icon: Icon, color, bgColor, borderColor }) => (
              <label 
                key={value} 
                className={`block cursor-pointer transition-all duration-200 ${
                  format === value ? 'transform scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={value}
                  checked={format === value}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="sr-only"
                />
                <div className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                  format === value 
                    ? `${borderColor} ${bgColor} shadow-lg ring-2 ring-offset-2 ring-blue-500/30` 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-xl ${format === value ? bgColor : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${format === value ? color : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{label}</h3>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          format === value 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {format === value && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* File Name Input */}
          <div className="space-y-3 mb-8">
            <label htmlFor="resume-name" className="block text-sm font-medium text-gray-800 uppercase tracking-wider">
              RESUME NAME
            </label>
            <input 
              id="resume-name" 
              type="text"
              value={fileName} 
              onChange={(e) => setFileName(e.target.value)} 
              className="w-full px-4 py-3 text-base border-2 border-gray-400 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Resume_1"
            />
            <p className="text-sm text-gray-600 italic">
              Tip: Don't use numbers when naming your file.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 py-3 text-base border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200"
              disabled={isDownloading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={isDownloading || !fileName.trim()}
              className="flex-1 py-3 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
            >
              {isDownloading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Downloading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 