import React from 'react';
import { Download, Printer, Mail, FileText } from 'lucide-react';

const RightActions = () => {
  const actions = [
    { icon: Download, label: 'Download', description: 'PDF, DOCX formats' },
    { icon: Printer, label: 'Print', description: 'Print your resume' },
    { icon: Mail, label: 'Email', description: 'Send via email' },
  ];

  return (
    <div className="bg-[#2A2D3E] w-80 h-full flex flex-col border-l border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Export Options</h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-1 px-6 py-6 space-y-4">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className="w-full group relative bg-[#1E2139] hover:bg-[#252849] border-2 border-purple-500/30 hover:border-purple-400 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <action.icon className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white group-hover:text-purple-100 transition-colors">
                  {action.label}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {action.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      </div>

      {/* Finish Button */}
      <div className="px-6 py-6">
        <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl py-4 px-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-[1.02] group">
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg">Finish resume</span>
            <div className="w-2 h-2 bg-black/30 rounded-full group-hover:scale-110 transition-transform"></div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-xs text-gray-500">Resume Builder</div>
          <div className="text-xs text-gray-400 mt-1">Save your progress automatically</div>
        </div>
      </div>
    </div>
  );
};

export default RightActions;
