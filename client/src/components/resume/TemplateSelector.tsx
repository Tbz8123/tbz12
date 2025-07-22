import React, { useState } from 'react';
// Card and CardContent are no longer used with the new overlay design
// import { Card, CardContent } from '@/components/ui/card'; 
import { Input } from '@/components/ui/input';
import { Search, FileText, Check, Sparkles, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define the type for a resume template based on Prisma schema (as used by the API)
interface PrismaResumeTemplate {
  id: number;
  name: string;
  description?: string | null;
  code: string; 
  structure?: any;
  thumbnailUrl?: string | null; 
  enhanced3DThumbnailUrl?: string | null; // Added for enhanced thumbnails
  uploadedImageUrl?: string | null; // Added for uploaded images
  thumbnailType?: 'standard' | 'enhanced3d' | null; // Added to track which thumbnail type is active
  displayMode?: 'thumbnail' | 'uploaded_image' | null; // Added to track display preference
  enhanced3DMetadata?: any | null; // Added for enhanced thumbnail metadata
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  templateType?: 'snap' | 'pro'; // Added to differentiate between template types
}

interface TemplateSelectorProps {
  templates: PrismaResumeTemplate[];
  selectedTemplate: number | null; 
  onSelectTemplate: (templateId: number, forceNavigation?: boolean) => void;
  onContentEditingClick?: (templateId: number) => void;
  onContinue?: () => void;
  showContinueButton?: boolean;
}

export default function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate,
  onContentEditingClick,
  onContinue,
  showContinueButton = true
}: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);

  // Special handler for Content Editing button - always forces navigation
  const handleContentEditingClick = (templateId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Use a special flag to indicate this is a Content Editing button click
    (onSelectTemplate as any)(templateId, true);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div 
      className="template-selector min-h-[1200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Search Bar */}
      <motion.div 
        className="relative mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 z-10" />
        <Input
          placeholder="Search templates..."
            className="pl-10 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-md focus:bg-white/15 focus:border-white/30 transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              onClick={() => setSearchTerm('')}
            >
              ×
            </motion.button>
          )}
      </div>

        {/* Search Results Count */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-white/60"
          >
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </motion.div>
        )}
      </motion.div>

      {filteredTemplates.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id} 
              className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative group ${
                selectedTemplate === template.id 
                  ? "ring-4 ring-purple-500/50 ring-offset-2 ring-offset-transparent shadow-purple-500/25" 
                  : ""
              }`}
              onClick={() => onSelectTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)"
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {(() => {
                  // Check display mode preference first
                  let displayUrl;
                  if (template.displayMode === 'uploaded_image' && template.uploadedImageUrl) {
                    displayUrl = template.uploadedImageUrl;
                  } else {
                    // Default to thumbnail mode - check for enhanced thumbnail first, then fallback to standard
                    displayUrl = template.thumbnailType === 'enhanced3d' && template.enhanced3DThumbnailUrl 
                                ? template.enhanced3DThumbnailUrl 
                                : template.thumbnailUrl;
                  }

                  if (displayUrl) {
                    return (
                      <motion.img 
                        src={displayUrl}
                  alt={template.name} 
                        className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                    );
                  } else {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                        <motion.div
                          animate={{ 
                            rotate: hoveredTemplate === template.id ? 360 : 0,
                            scale: hoveredTemplate === template.id ? 1.2 : 1
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <FileText className="w-16 h-16 text-purple-400" /> 
                        </motion.div>
                      </div>
                    );
                  }
                })()}

                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedTemplate === template.id && (
                    <motion.div 
                      className="absolute top-4 right-4 z-20"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    > 
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full p-2 shadow-lg">
                        <Check className="h-5 w-5" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Template Type Badges */}
                <div className="absolute top-4 left-4 z-20 space-y-2">
                  {/* Pro Template Badge */}
                  {template.templateType === 'pro' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </motion.div>
                  )}

                  {/* Popular Badge */}
                  {template.isDefault && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Hover Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ opacity: hoveredTemplate === template.id ? 1 : 0 }}
                >
                  <div className="absolute bottom-4 left-4 right-4">
                    <motion.h3 
                      className="text-lg font-bold text-white mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: hoveredTemplate === template.id ? 0 : 20, 
                        opacity: hoveredTemplate === template.id ? 1 : 0 
                      }}
                      transition={{ delay: 0.1 }}
                    >
                      {template.name}
                    </motion.h3>

                    {template.description && (
                      <p className="text-sm text-white/80 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          (onSelectTemplate as any)(template.id, true);
                        }}
                      >
                        Content Editing
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Simplified bottom overlay for template name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {template.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <FileText className="h-20 w-20 text-white/30 mx-auto mb-6" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white/80 mb-3">No Templates Found</h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            We couldn't find any templates matching "{searchTerm}". Try adjusting your search or browse all templates.
          </p>

          <motion.button 
            onClick={() => setSearchTerm('')}
            className="text-purple-400 hover:text-purple-300 underline transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear search and see all templates
          </motion.button>
        </motion.div>
      )}

      {/* Continue Button - Show when template is selected */}
      {selectedTemplate && showContinueButton && onContinue && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue to Content Editing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
} 