import React, { useState } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export const ResumeDataDebugger: React.FC = () => {
  const resumeData = useResumeStore((state) => state.resumeData);
  const { clearResumeData } = useResumeStore((state) => state.actions);
  const [isVisible, setIsVisible] = useState(false);
  const [justCleared, setJustCleared] = useState(false);

  const handleClearData = () => {
    if (clearResumeData) {
      clearResumeData();
      setJustCleared(true);
      setTimeout(() => setJustCleared(false), 2000);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
        >
          <Eye className="w-4 h-4 mr-2" />
          Debug Data
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-black/20 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Resume Data</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleClearData}
                variant="outline"
                size="sm"
                className={`text-xs h-6 px-2 transition-colors ${
                  justCleared 
                    ? 'text-green-400 border-green-400/20 hover:bg-green-400/10' 
                    : 'text-red-400 border-red-400/20 hover:bg-red-400/10'
                }`}
              >
                {justCleared ? '✓ Cleared' : 'Clear'}
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/10"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-white text-xs space-y-2 max-h-64 overflow-auto">
            <div>
              <span className="text-purple-300 font-medium">Personal Info:</span>
              <div className="ml-2 text-gray-300">
                <div>Name: {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</div>
                <div>Email: {resumeData.personalInfo.email}</div>
                <div>Phone: {resumeData.personalInfo.phone}</div>
                <div>Title: {resumeData.personalInfo.title}</div>
              </div>
            </div>
            <div>
              <span className="text-purple-300 font-medium">Experience:</span>
              <div className="ml-2 text-gray-300">
                {resumeData.experience.length > 0 ? (
                  resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="mb-1">
                      {exp.position} at {exp.company}
                    </div>
                  ))
                ) : (
                  <div>No experience added</div>
                )}
              </div>
            </div>
            <div>
              <span className="text-purple-300 font-medium">Template ID:</span>
              <div className="ml-2 text-gray-300">{resumeData.templateId || 'None'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};