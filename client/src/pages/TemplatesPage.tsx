import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Search, Check } from "lucide-react";
import { useResumeStore } from '@/stores/resumeStore';

// Define the template interface locally like other files do
interface ResumeTemplate {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  structure: any;
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null;
  uploadedImageUrl?: string | null;
  thumbnailType?: 'standard' | 'enhanced3d' | null;
  displayMode?: 'thumbnail' | 'uploaded_image' | null;
  enhanced3DMetadata?: any | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
  isPopular?: boolean;
  templateType?: 'snap' | 'pro'; // Added to differentiate between template types
}

const TemplatesPage = () => {
  const [_, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const { toast } = useToast();

  // Connect to ResumeStore with stable selectors
  const proTemplates = useResumeStore(state => state.proTemplates);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const setActiveProTemplateId = useResumeStore(state => state.actions.setActiveProTemplateId);

  // Extract the parameters from the URL
  const experienceLevel = searchParams.get("experience");
  const educationLevel = searchParams.get("education");
  const selectionText = searchParams.get("selection") || "No Experience";

  // Fetch Pro templates only
  const { data: fetchedProTemplates = [], isLoading: isLoadingProTemplates } = useQuery<ResumeTemplate[]>({
    queryKey: ['/api/pro-templates'],
    queryFn: async () => {
      const response = await fetch('/api/pro-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch pro templates');
      }
      return response.json();
    },
  });

  // Use only Pro templates with type differentiation
  const templates = fetchedProTemplates.map(template => ({ ...template, templateType: 'pro' as const }));

  const isLoading = isLoadingProTemplates;

  const templatesArray = templates as ResumeTemplate[] || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Use context state for selected template (Pro only)
  const selectedTemplate = activeProTemplateId;

  // For managing recommended templates
  const [recommendedTemplates, setRecommendedTemplates] = useState<number[]>([]);

  // Filter templates based on the active filter and search query
  const filteredTemplates = templatesArray.length > 0 
    ? templatesArray.filter((template: ResumeTemplate) => {
        // Filter by category only (all templates are Pro)
        if (activeFilter !== "all") {
          // Filter by category (skip if template doesn't have category)
          if (template.category && template.category !== activeFilter) {
            return false;
          }
        }

        // Filter by search query
        if (searchQuery.trim() !== "" && 
            !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !(template.description || "").toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
    : [];

  // Navigate to the upload options page with the selected template
  const handleUseTemplate = (templateId: number) => {
    console.log(`Selected template: ${templateId}`);

    // Store template information in localStorage for persistence
    localStorage.setItem('selectedTemplateId', templateId.toString());
    localStorage.setItem('experienceLevel', experienceLevel || '');
    localStorage.setItem('educationLevel', educationLevel || '');

    // Redirect to the upload options page
    setLocation('/upload-options');
  };

  // Allow the user to choose the template later
  const handleChooseLater = () => {
    console.log("User chose to select a template later");
    setLocation("/upload-options"); // Redirect to upload options page
  };

  // Handle template selection to highlight it AND update global context
  const handleTemplateSelect = (templateId: number) => {
    // Find the template to determine its type
    const template = templatesArray.find(t => t.id === templateId);

    console.log('🎯 TemplatesPage - Pro Template Selected:', {
      templateId,
      template: template?.name,
      currentActiveProId: activeProTemplateId
    });

    if (template) {
      // All templates are Pro templates
      console.log('🔄 Setting Pro template:', templateId);
      setActiveProTemplateId(templateId === activeProTemplateId ? null : templateId);
      if (templateId !== activeProTemplateId) {
        // Sync localStorage
        localStorage.setItem('activeProTemplateId', templateId.toString());
        localStorage.setItem('selectedTemplateId', templateId.toString());
        console.log('💾 Stored Pro template in localStorage:', templateId);
      }
    }
  };

  // Handle right-click to toggle recommendation
  const handleRightClick = (e: React.MouseEvent, templateId: number) => {
    e.preventDefault(); // Prevent the default context menu

    // Find the template name for the toast
    const template = filteredTemplates.find((t: ResumeTemplate) => t.id === templateId);
    const templateName = template?.name || "Template";

    // Determine if we're adding or removing
    const isAlreadyRecommended = recommendedTemplates.includes(templateId);

    setRecommendedTemplates(prev => {
      // Check if template is already in the recommended list
      if (isAlreadyRecommended) {
        // Remove it from recommendations
        return prev.filter(id => id !== templateId);
      } else {
        // Add it to recommendations
        return [...prev, templateId];
      }
    });

    // Show toast notification
    toast({
      title: isAlreadyRecommended ? "Removed from recommendations" : "Added to recommendations",
      description: isAlreadyRecommended 
        ? `${templateName} has been removed from your recommendations.` 
        : `${templateName} has been added to your recommendations!`,
      variant: isAlreadyRecommended ? "default" : "default",
    });

    return false; // Prevent the browser's context menu
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-32 pb-8 w-full min-h-full">
        <motion.div 
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Choose Your Perfect Template
          </motion.h1>

          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-base mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Select a template that best showcases your skills and experience.
          </motion.p>

          <motion.p
            className="text-purple-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            100+ professional, ATS-friendly templates available
          </motion.p>
        </motion.div>

        {/* User selection notification */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 flex items-start border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Info className="h-5 w-5 text-purple-300 mt-0.5 mr-4 flex-shrink-0" />
          <div>
            <p className="text-white mb-2">
              You selected <span className="font-semibold text-purple-300 bg-purple-500/20 px-2 py-1 rounded">{decodeURIComponent(selectionText)}</span> experience level. Here are the best templates for your profile.
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-medium text-purple-300">Pro tip:</span> Right-click on a template to mark it as recommended for future reference.
            </p>
          </div>
        </motion.div>

        {/* Search and filter */}
        <motion.div 
          className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              className="pl-12 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveFilter}>
            <TabsList className="bg-white/10 backdrop-blur-lg border-white/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-300">All</TabsTrigger>
              <TabsTrigger value="creative" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-300">Creative</TabsTrigger>
              <TabsTrigger value="simple" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-300">Simple</TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-300">Professional</TabsTrigger>
              <TabsTrigger value="modern" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-300">Modern</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-white/5 backdrop-blur-lg rounded-xl animate-pulse border border-white/10"
                style={{ width: '280px', height: '362.13px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-[280px] bg-white/10 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </motion.div>
            ))
          ) : filteredTemplates && filteredTemplates.length > 0 ? (
            // Display templates
            filteredTemplates.map((template: ResumeTemplate, index) => (
              <motion.div 
                key={template.id} 
                className="relative group flex items-center justify-center"
              >
                <motion.div 
                  className={`bg-white/10 backdrop-blur-lg border rounded-xl overflow-hidden transition-all duration-300 flex flex-col
                    ${selectedTemplate === template.id 
                      ? 'border-purple-400 border-2 shadow-2xl shadow-purple-500/25' 
                      : 'border-white/20 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/20'
                    }`}
                  style={{ width: '280px', height: '362.13px' }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleTemplateSelect(template.id)}
                  onContextMenu={(e) => handleRightClick(e, template.id)}
                >
                  {/* Template badges */}
                  <div className="absolute top-3 right-3 z-10 space-y-2">
                    {/* Pro Template Badge */}
                    {template.templateType === 'pro' && (
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        ✨ Pro
                      </div>
                    )}

                    {/* Popular Badge */}
                    {template.isPopular && (
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        🔥 Hot!
                      </div>
                    )}
                  </div>

                  {/* Selection indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-2 z-10 shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  {/* Template preview */}
                  <div className="relative h-full w-full overflow-hidden bg-white/5 flex items-center justify-center">
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

                      return displayUrl ? (
                        <div className="relative h-full w-full flex items-center justify-center">
                          <img 
                            src={displayUrl} 
                            alt={`${template.name} template`}
                            className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            style={{ maxWidth: '100%' }}
                          />

                          {/* Overlay hover button */}
                          <div className="absolute inset-0 bg-black/0 opacity-0 flex items-center justify-center transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                            <motion.button 
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm py-3 px-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseTemplate(template.id);
                              }}
                              initial={{ y: 20, opacity: 0 }}
                              whileHover={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              Use this template
                            </motion.button>
                          </div>

                          {/* Template name overlay at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent py-6 px-4">
                            <h3 className="font-medium text-white text-sm">{template.name}</h3>
                            <div className="flex items-center gap-2">
                              {template.category && (
                                <p className="text-xs text-gray-300 capitalize">{template.category}</p>
                              )}
                              {template.templateType === 'pro' && (
                                <span className="text-xs text-purple-300 font-medium">• Pro Template</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No preview available
                        </div>
                      );
                    })()}

                    {/* Category tag */}
                    {template.category && (
                      <div className="absolute top-3 left-3 bg-white/90 text-purple-700 text-xs px-3 py-1 rounded-full capitalize shadow-sm font-medium">
                        {template.category}
                      </div>
                    )}

                    {/* Status tags */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-lg font-semibold shadow-lg">
                        Selected
                      </div>
                    )}

                    {/* "RECOMMENDED" tag */}
                    {(template.isPopular || recommendedTemplates.includes(template.id)) && selectedTemplate !== template.id && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-lg font-semibold tracking-wide px-3 py-1 shadow-lg">
                        RECOMMENDED
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            // No templates found
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
              <p className="text-gray-400 text-lg">No templates match your search. Try different keywords or filters.</p>
            </div>
          )}
        </div>

        {/* Template actions */}
        {selectedTemplate !== null && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg border-t border-white/20 p-6 shadow-2xl z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="container mx-auto flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={handleChooseLater}
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-8 py-3"
              >
                Choose later
              </Button>

              <Button 
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg px-8 py-3 border-0"
              >
                Use this template
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;