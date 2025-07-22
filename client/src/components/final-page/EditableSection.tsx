import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditableSectionProps {
  children: React.ReactNode;
  sectionPath: string;
  navigateTo: (path: string) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canDelete?: boolean;
}

const EditableSection: React.FC<EditableSectionProps> = ({ 
  children, 
  sectionPath, 
  navigateTo, 
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  canDelete = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigateTo(sectionPath);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete();
    }
  };

  const handleMoveUpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onMoveUp) {
      onMoveUp();
    }
  };

  const handleMoveDownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onMoveDown) {
      onMoveDown();
    }
  };

  return (
    <motion.div
      className="relative group border border-transparent hover:border-dashed hover:border-gray-400 rounded-md p-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ scale: 1 }}
      animate={{ 
        scale: isHovered ? 1.05 : 1,
        zIndex: isHovered ? 50 : 1
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      style={{
        transformOrigin: 'center',
        boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        position: 'relative',
        isolation: 'isolate',
        willChange: isHovered ? 'transform, box-shadow' : 'auto'
      }}
    >
      <motion.div
        animate={{
          filter: isHovered ? 'brightness(1.02)' : 'brightness(1)'
        }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>

      {/* Action buttons container */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : -12
        }}
        transition={{ 
          duration: 0.25, 
          delay: isHovered ? 0.1 : 0,
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
        className="absolute top-2 right-2 z-20 flex gap-1"
      >
        {/* Move Up Button */}
        {canMoveUp && (
          <motion.button
            onClick={handleMoveUpClick}
            className="bg-gray-600 hover:bg-gray-700 text-white p-1.5 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Move section up"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Move Up"
          >
            <ArrowUp size={12} />
          </motion.button>
        )}

        {/* Move Down Button */}
        {canMoveDown && (
          <motion.button
            onClick={handleMoveDownClick}
            className="bg-gray-600 hover:bg-gray-700 text-white p-1.5 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Move section down"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Move Down"
          >
            <ArrowDown size={12} />
          </motion.button>
        )}

        {/* Edit Button */}
        <motion.button
          onClick={handleEditClick}
          className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Edit section"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Edit"
        >
          <Pencil size={12} />
        </motion.button>

        {/* Delete Button */}
        {canDelete && (
          <motion.button
            onClick={handleDeleteClick}
            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Delete section"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Delete"
          >
            <Trash2 size={12} />
          </motion.button>
        )}
      </motion.div>

      {/* Transparent hover indicator */}
      <motion.div
        className="absolute inset-0 border border-gray-300 rounded-md pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default EditableSection; 