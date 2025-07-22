import React from 'react';

interface TemplatesPanelProps {
  onClose: () => void;
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onClose }) => {
  const templates = [
    { id: 1, name: 'Minimalist', image: '/placeholder.svg' },
    { id: 2, name: 'Modern', image: '/placeholder.svg' },
    { id: 3, name: 'Classic', image: '/placeholder.svg' },
    { id: 4, name: 'Creative', image: '/placeholder.svg' },
    { id: 5, name: 'Professional', image: '/placeholder.svg' },
    { id: 6, name: 'Elegant', image: '/placeholder.svg' },
  ];

  return (
    <div className="bg-[#1E1B3A] text-white w-96 h-full p-6 flex flex-col border-r border-purple-500/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Templates</h2>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-4">
        {templates.map(template => (
          <div key={template.id} className="cursor-pointer group">
            <div className="border-2 border-transparent group-hover:border-purple-500 rounded-lg overflow-hidden transition-all duration-300">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-auto bg-[#100E23] aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <p className="text-center text-sm mt-2 text-gray-300 group-hover:text-white">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPanel;
