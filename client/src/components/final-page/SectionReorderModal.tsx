import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Eye, EyeOff, ArrowUpDown } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';

interface SectionReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SectionItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  visible: boolean;
  required?: boolean;
}

interface SortableItemProps {
  section: SectionItem;
  toggleSectionVisibility: (sectionId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ section, toggleSectionVisibility }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 transition-all ${
        isDragging
          ? 'border-purple-300 shadow-lg bg-white z-10'
          : 'border-transparent hover:border-gray-200'
      } ${
        !section.visible ? 'opacity-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Section Icon */}
      <div className="flex-shrink-0">
        {section.icon}
      </div>

      {/* Section Name */}
      <div className="flex-1">
        <span className="font-medium text-gray-900">
          {section.name}
        </span>
        {section.required && (
          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            Required
          </span>
        )}
      </div>

      {/* Visibility Toggle */}
      {!section.required && (
        <button
          onClick={() => toggleSectionVisibility(section.id)}
          className={`p-2 rounded-full transition-colors ${
            section.visible
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          {section.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

const SectionReorderModal: React.FC<SectionReorderModalProps> = ({ isOpen, onClose }) => {
  const resumeData = useResumeStore((state) => state.resume);
  const updateResume = useResumeStore((state) => state.updateResume);

  const [sections, setSections] = useState<SectionItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Define all available sections with their display names and icons
  const sectionDefinitions: Record<string, { name: string; icon: React.ReactNode; required?: boolean }> = {
    contact: {
      name: 'Contact Information',
      icon: <div className="w-4 h-4 bg-blue-500 rounded-full" />,
      required: true
    },
    summary: {
      name: 'Professional Summary',
      icon: <div className="w-4 h-4 bg-purple-500 rounded-full" />
    },
    experience: {
      name: 'Work Experience',
      icon: <div className="w-4 h-4 bg-green-500 rounded-full" />
    },
    education: {
      name: 'Education',
      icon: <div className="w-4 h-4 bg-orange-500 rounded-full" />
    },
    skills: {
      name: 'Skills',
      icon: <div className="w-4 h-4 bg-red-500 rounded-full" />
    },
    languages: {
      name: 'Languages',
      icon: <div className="w-4 h-4 bg-pink-500 rounded-full" />
    },
    certifications: {
      name: 'Certifications',
      icon: <div className="w-4 h-4 bg-yellow-500 rounded-full" />
    }
  };

  // Initialize sections from resume data
  useEffect(() => {
    if (isOpen) {
      const currentOrder = resumeData.sectionOrder || ['contact', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications'];

      const initialSections = currentOrder.map(sectionId => ({
        id: sectionId,
        name: sectionDefinitions[sectionId]?.name || sectionId,
        icon: sectionDefinitions[sectionId]?.icon || <div className="w-4 h-4 bg-gray-500 rounded-full" />,
        visible: true,
        required: sectionDefinitions[sectionId]?.required || false
      }));

      setSections(initialSections);
    }
  }, [isOpen, resumeData.sectionOrder]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    ));
  };

  const handleSave = () => {
    const newOrder = sections
      .filter(section => section.visible)
      .map(section => section.id);

    // Update the section order in the resume data
    updateResume({
      sectionOrder: newOrder,
      updatedAt: new Date().toISOString(),
    });

    // Close the modal
    onClose();
  };

  const handleReset = () => {
    const defaultOrder = ['contact', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications'];
    const resetSections = defaultOrder.map(sectionId => ({
      id: sectionId,
      name: sectionDefinitions[sectionId]?.name || sectionId,
      icon: sectionDefinitions[sectionId]?.icon || <div className="w-4 h-4 bg-gray-500 rounded-full" />,
      visible: true,
      required: sectionDefinitions[sectionId]?.required || false
    }));

    setSections(resetSections);
  };

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ArrowUpDown className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Reorder Sections</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-purple-100 mt-2 text-sm">
                Drag and drop to reorder sections, or toggle visibility
              </p>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      } transition-colors rounded-lg p-2`}
                    >
                      {sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 transition-all ${
                                snapshot.isDragging
                                  ? 'border-purple-300 shadow-lg bg-white'
                                  : 'border-transparent hover:border-gray-200'
                              } ${
                                !section.visible ? 'opacity-50' : ''
                              }`}
                            >
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              {/* Section Icon */}
                              <div className="flex-shrink-0">
                                {section.icon}
                              </div>

                              {/* Section Name */}
                              <div className="flex-1">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                {section.required && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                    Required
                                  </span>
                                )}
                              </div>

                              {/* Visibility Toggle */}
                              {!section.required && (
                                <button
                                  onClick={() => toggleSectionVisibility(section.id)}
                                  className={`p-2 rounded-full transition-colors ${
                                    section.visible
                                      ? 'text-green-600 hover:bg-green-50'
                                      : 'text-gray-400 hover:bg-gray-100'
                                  }`}
                                >
                                  {section.visible ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Reset to Default
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                >
                  Save Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SectionReorderModal;