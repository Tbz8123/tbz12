import React from 'react';
import { ChevronDown, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-gray-800 text-white flex items-center justify-between px-6 py-3 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Tbz_Projects_Resume</h1>
        <button className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300">
          More options <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-700 rounded-full">
          <RefreshCw size={18} />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-700 rounded-full">
            <ZoomOut size={18} />
          </button>
          <span>100%</span>
          <button className="p-2 hover:bg-gray-700 rounded-full">
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 