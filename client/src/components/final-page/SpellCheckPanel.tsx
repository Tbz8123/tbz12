import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SpellCheckPanelProps {
  onClose: () => void;
}

const SpellCheckPanel: React.FC<SpellCheckPanelProps> = ({ onClose }) => {
  return (
    <div className="bg-[#1E1B3A] text-white w-96 h-full p-6 flex flex-col border-r border-purple-500/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Spell check
        </h2>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <CheckCircle className="text-green-400 h-16 w-16 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
        <p className="text-gray-300">No spelling errors detected. You can continue editing or finish your resume now.</p>
      </div>
    </div>
  );
};

export default SpellCheckPanel; 