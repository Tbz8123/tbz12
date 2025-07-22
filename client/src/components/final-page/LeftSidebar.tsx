import React from 'react';
import { LayoutDashboard, Brush, Type, SpellCheck } from 'lucide-react';

type Panel = 'templates' | 'design' | 'spell-check' | 'font' | null;

interface LeftSidebarProps {
  activePanel: Panel;
  setActivePanel: React.Dispatch<React.SetStateAction<Panel>>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activePanel, setActivePanel }) => {
  const navItems = [
    { id: 'templates', icon: LayoutDashboard, label: 'Templates', color: 'text-blue-400' },
    { id: 'design', icon: Brush, label: 'Design & formatting', color: 'text-purple-400' },
    { id: 'font', icon: Type, label: 'Font style', color: 'text-green-400' },
    { id: 'spell-check', icon: SpellCheck, label: 'Spell check', color: 'text-pink-400' },
  ];

  const handlePanelToggle = (panel: Panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="bg-[#2A2D3E] text-gray-400 w-20 flex flex-col items-center py-8 space-y-3 border-r border-gray-700/50 shadow-xl">
      {navItems.map((item, index) => (
        <div key={item.id} className="relative group">
          <button
            onClick={() => handlePanelToggle(item.id as Panel)}
            className={`relative p-4 w-16 h-16 flex justify-center items-center rounded-xl transition-all duration-300 ${
              activePanel === item.id 
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white shadow-lg shadow-purple-500/20' 
                : 'hover:bg-gray-700/50 hover:text-white hover:scale-105'
            }`}
            title={item.label}
          >
            {/* Active indicator */}
            {activePanel === item.id && (
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full shadow-lg"></div>
            )}

            {/* Icon */}
            <item.icon 
              className={`h-6 w-6 transition-all duration-300 ${
                activePanel === item.id 
                  ? 'text-white drop-shadow-sm' 
                  : `${item.color} group-hover:text-white group-hover:scale-110`
              }`} 
            />

            {/* Glow effect for active item */}
            {activePanel === item.id && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-pulse"></div>
            )}
          </button>

          {/* Tooltip */}
          <div className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            {item.label}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      ))}

      {/* Decorative element */}
      <div className="mt-auto mb-4">
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      </div>
    </div>
  );
};

export default LeftSidebar;