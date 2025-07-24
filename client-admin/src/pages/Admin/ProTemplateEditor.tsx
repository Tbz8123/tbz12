import React, { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion, useAnimation } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useToast } from '@/components/ui/use-toast';
import { useInView } from 'react-intersection-observer';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Image, Upload, ArrowLeft } from 'lucide-react';

// Updated sample resume data tailored for ModernATSResume and target screenshot
const sampleUserData = {
  personalInfo: {
    firstName: 'JOHNSON',
    lastName: 'SMITH',
    title: 'Graphic Designer',
    email: 'johnson.smith@email.com',
    phone: '+1 234 567 8901',
    address: '1234 Street Address, Level-5',
    profileImageUrl: '', // Add a URL here if you have one, or leave empty for initials
    contactDetails: {
      linkedin: 'linkedin.com/in/johnsonsmith',
      website: 'www.johnson-design.com',
      drivingLicense: 'Class B License'
    }
  },
  summary: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
  experience: [
    {
      company: 'Company Name Here',
      position: 'Job Position Here',
      startDate: '2010-2013',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.',
    },
    {
      company: 'Company Name Here',
      position: 'Job Position Here',
      startDate: '2013-2015',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.',
    },
    {
      company: 'Company Name Here',
      position: 'Job Position Here',
      startDate: '2015-2018',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.',
    },
  ],
  education: [
    {
      degree: 'University Name',
      startDate: '2003-2005',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      degree: 'University Name',
      startDate: '2005-2009',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ],
  skills: [
    { name: "Adobe Illustrator", level: 80 },
    { name: "Microsoft Word", level: 90 },
    { name: "Adobe Photoshop", level: 75 },
    { name: "Adobe InDesign", level: 85 }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
    { name: "French", level: "Conversational" },
    { name: "Arabic", level: "Basic" }
  ],
  // You can add other sections like awards, projects if your full userData schema supports them
};

interface ProTemplateEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
  isEditing?: boolean;
}

const ProTemplateEditor = ({
  initialData,
  onSave,
  isEditing = false,
}: ProTemplateEditorProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('// Start your JSX template here\n// Example: render(<div>Hello {userData.name}</div>);');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [enhanced3DThumbnailUrl, setEnhanced3DThumbnailUrl] = useState('');
  const [thumbnailType, setThumbnailType] = useState<'standard' | 'enhanced3d'>('standard');
  const [enhanced3DMetadata, setEnhanced3DMetadata] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerating3D, setIsGenerating3D] = useState(false);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState('');
  const [displayMode, setDisplayMode] = useState<'thumbnail' | 'uploaded_image'>('thumbnail');
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const livePreviewScope = { 
    React, 
    useState, 
    useEffect, 
    motion, 
    useAnimation, 
    useInView, 
    render: (ui: React.ReactNode) => ui, 
    userData: sampleUserData,
    customColors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#60a5fa',
      text: '#111827',
      background: '#ffffff',
      sidebarText: '#ffffff',
      sidebarBackground: '#333333'
    }
  };

  const thumbnailPreviewRef = useRef<HTMLDivElement>(null);
  const thumbnailContentRef = useRef<HTMLDivElement>(null);
  const livePreviewRef = useRef<HTMLDivElement>(null);
  const templateContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setCode(initialData.code || '// Start your JSX template here\n// Example: render(<div>Hello {userData.name}</div>);');
      setThumbnailUrl(initialData.thumbnailUrl || '');
      setEnhanced3DThumbnailUrl(initialData.enhanced3DThumbnailUrl || '');
      setUploadedThumbnailUrl(initialData.uploadedImageUrl || '');
      setDisplayMode(initialData.displayMode || 'thumbnail');
      setThumbnailType(initialData.thumbnailType || 'standard');
      setEnhanced3DMetadata(initialData.enhanced3DMetadata || null);
    }
  }, [initialData]);

  const handleEditorDidMount = (_editor: any, monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    });

    const userDataKeys = Object.keys(sampleUserData);
    const userDataProps = userDataKeys.map(key => {
      const value = (sampleUserData as any)[key];
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const itemKeys = Object.keys(value[0]);
          const itemProps = itemKeys.map(itemKey => `    ${itemKey}?: any;`).join('\n');
          return `  ${key}?: Array<{\n${itemProps}\n  }>;`;
        }
        return `  ${key}?: any[];`;
      }
      return `  ${key}?: any;`;
    }).join('\n');

    const userDataTypeDef = `declare var userData: {\n${userDataProps}\n};`;

    const reactTypeDef = `
      declare var React: {
        createElement: any;
        Fragment: any;
        useState: any;
        useEffect: any;
      };
      declare var useState: any;
      declare var useEffect: any;

      declare namespace JSX {
        interface IntrinsicElements {
          div: any; span: any; p: any; h1: any; h2: any; h3: any; h4: any; h5: any; h6: any;
          ul: any; ol: any; li: any; img: any; a: any; button: any; input: any; textarea: any;
          section: any; article: any; aside: any; header: any; footer: any; nav: any; main: any;
          table: any; tr: any; td: any; th: any; tbody: any; thead: any; tfoot: any;
          svg: any; path: any; circle: any; rect: any; line: any; g: any;
          [elemName: string]: any;
        }
      }
    `;

    const framerMotionTypeDef = `
      declare var motion: any;
      declare var useAnimation: any;
    `;
    const reactIntersectionObserverTypeDef = `
      declare var useInView: any;
    `;
    const renderTypeDef = `declare function render(element: any): void;`;

    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
      { content: userDataTypeDef, filePath: 'ts:filename/userData.d.ts' },
      { content: reactTypeDef, filePath: 'ts:filename/react.d.ts' },
      { content: framerMotionTypeDef, filePath: 'ts:filename/framer-motion.d.ts' },
      { content: reactIntersectionObserverTypeDef, filePath: 'ts:filename/react-intersection-observer.d.ts' },
      { content: renderTypeDef, filePath: 'ts:filename/render.d.ts' },
    ]);
  };

  const handleGenerateThumbnail = async () => {
    console.log('Starting thumbnail generation...');
    console.log('thumbnailContentRef.current:', thumbnailContentRef.current);

    if (!thumbnailContentRef.current) {
      console.error('thumbnailContentRef.current is null!');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Calling html2canvas...');
      const canvas = await html2canvas(thumbnailContentRef.current, {
        width: 800,
        height: 1131,
        scale: 1,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });

      console.log('html2canvas completed, canvas:', canvas);

      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Blob created successfully:', blob);
          const url = URL.createObjectURL(blob);
          console.log('Object URL created:', url);
          setThumbnailUrl(url);
          toast({
            title: "Thumbnail Generated",
            description: "Standard thumbnail has been generated successfully.",
          });
        } else {
          console.error('Failed to create blob from canvas');
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate thumbnail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateEnhanced3DThumbnail = async () => {
    if (!code.trim()) {
      toast({ 
        title: "Code Error", 
        description: "Template code is empty. Please add template code first.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      setIsGenerating3D(true);
      toast({ title: "Generating Enhanced 3D Thumbnail", description: "This may take a moment..." });

      // Create a completely separate container for capture (not affecting the display)
      const captureContainer = document.createElement('div');
      captureContainer.style.cssText = `
        position: fixed;
        top: -10000px;
        left: -10000px;
        width: 800px;
        height: 1131px;
        background: #ffffff;
        overflow: hidden;
        z-index: -1;
      `;

      document.body.appendChild(captureContainer);

      try {
        // Import React components needed for rendering
        const { createRoot } = await import('react-dom/client');
        const { LiveProvider, LivePreview } = await import('react-live');

        // Create a root for the capture container
        const root = createRoot(captureContainer);

        // Create the live preview scope with sample data
        const livePreviewScope = {
          React,
          useState: React.useState,
          useEffect: React.useEffect,
          userData: {
            personalInfo: {
              firstName: 'JOHN',
              lastName: 'SMITH',
              jobTitle: 'Software Engineer',
              email: 'john.smith@email.com',
              phoneNumber: '+1 (555) 123-4567',
              address: '123 Main Street, City, State 12345',
              profileImageUrl: '',
            },
            professionalSummary: 'Experienced software engineer with 5+ years of experience in full-stack development. Skilled in React, Node.js, and cloud technologies. Passionate about creating efficient and scalable solutions.',
            experience: [
              {
                companyName: 'Tech Solutions Inc.',
                jobTitle: 'Senior Software Engineer',
                startDate: 'Jan 2021',
                endDate: 'Present',
                description: 'Led development of multiple web applications using React and Node.js. Improved system performance by 40% through optimization.',
              },
              {
                companyName: 'Digital Innovations LLC',
                jobTitle: 'Software Developer',
                startDate: 'Jun 2019',
                endDate: 'Dec 2020',
                description: 'Developed and maintained web applications. Collaborated with cross-functional teams to deliver high-quality software solutions.',
              },
            ],
            education: [
              {
                institutionName: 'University of Technology',
                degree: 'Bachelor of Science in Computer Science',
                startDate: '2015',
                endDate: '2019',
                description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Software Engineering.',
              },
            ],
            skills: [
              { name: 'JavaScript', level: 90 },
              { name: 'React', level: 85 },
              { name: 'Node.js', level: 80 },
              { name: 'Python', level: 75 },
              { name: 'SQL', level: 70 },
            ],
          },
          customColors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#60a5fa',
            text: '#111827',
            background: '#ffffff',
            sidebarText: '#ffffff',
            sidebarBackground: '#333333'
          }
        };

        // Render the template at full size in the hidden container
        root.render(
          React.createElement(LiveProvider, {
            code: code,
            scope: livePreviewScope,
            noInline: true
          }, React.createElement(LivePreview, { className: "w-full h-full" }))
        );

        // Wait longer for React Live to fully render complex layouts
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("🚀 Capturing from separate container");
        console.log("Container dimensions:", captureContainer.offsetWidth, "x", captureContainer.offsetHeight);

        // Capture the separate container
        const canvas = await html2canvas(captureContainer, {
          scale: 2.5, // High quality scale for 600x800 output
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: 800,
          height: 1131,
          foreignObjectRendering: false,
          removeContainer: false,
          imageTimeout: 0,
          ignoreElements: (element) => {
            return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
          }
        });

        console.log("Canvas created:", canvas);
        console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

        // Generate high-quality WebP with fallback to PNG
        let dataUrl: string;
        let format: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.92);
          format = 'webp';
          if (!dataUrl.startsWith('data:image/webp')) {
            throw new Error('WebP not supported');
          }
        } catch (webpError) {
          console.log("WebP not supported, falling back to PNG");
          dataUrl = canvas.toDataURL('image/png', 0.95);
          format = 'png';
        }

        console.log("DataURL generated:", {
          format,
          length: dataUrl.length,
          preview: dataUrl.substring(0, 100) + "..."
        });

        if (dataUrl.length < 1000) {
          throw new Error("Generated image appears to be empty or too small");
        }

        // Calculate file size
        const fileSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

        const result = {
          primary: dataUrl,
          fallback: dataUrl,
          metadata: {
            width: canvas.width,
            height: canvas.height,
            format: format,
            generatedAt: new Date().toISOString(),
            fileSize: { [format]: fileSizeKB + 'KB' }
          }
        };

        console.log("Generated result:", result);

        setEnhanced3DThumbnailUrl(result.primary);
        setEnhanced3DMetadata(result.metadata);

        toast({ 
          title: "Enhanced 3D Thumbnail Generated! ✨", 
          description: `High-quality ${result.metadata.format?.toUpperCase()} thumbnail created (${result.metadata.fileSize?.[format] || 'N/A'})` 
        });

        // Cleanup the React root
        root.unmount();

      } finally {
        // Always cleanup the container
        if (captureContainer.parentNode) {
          document.body.removeChild(captureContainer);
        }
      }

    } catch (error) {
      console.error("❌ Error generating enhanced 3D thumbnail:", error);
      console.error("📊 Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });

      toast({ 
        title: "Enhanced 3D Thumbnail Error", 
        description: `Could not generate thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating3D(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!code.trim()) {
      toast({
        title: "Validation Error", 
        description: "Template code is required.",
        variant: "destructive",
      });
      return;
    }

    const templateData = {
      name: name.trim(),
      description: description.trim(),
      code: code.trim(),
      structure: {}, // Or derive from code if needed later
      thumbnailUrl, 
      enhanced3DThumbnailUrl,
      uploadedImageUrl: uploadedThumbnailUrl,
      displayMode,
      thumbnailType,
      enhanced3DMetadata,
    };

    console.log('Saving Pro template:', templateData);

    if (onSave) { // This branch is for editing existing templates
      onSave(templateData);
    } else { // This branch is for creating new templates
      try {
        console.log('Making API request to /api/pro-templates...');
        const response = await fetch('/api/pro-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData),
        });
        console.log('API response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.message || 'Failed to save template');
        }
        const newTemplate = await response.json();
        console.log('New template created:', newTemplate);

        toast({
          title: 'Pro Template Saved!',
          description: `Template "${newTemplate.name}" has been successfully saved.`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/pro-templates'] });
        setTimeout(() => setLocation('/admin/pro/templates/management'), 1000);
      } catch (err: any) {
        console.error('Failed to save pro template:', err);
        toast({
          title: 'Save Error',
          description: err.message || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleManualThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setUploadedThumbnailUrl(objectUrl);

      toast({
        title: "Upload Successful",
        description: "Thumbnail image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload thumbnail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-20">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(147,51,234,0.03)_50%,transparent_65%)]"></div>
      </div>

      <div className="container mx-auto py-10 px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/admin/pro')}
            className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Edit Template' : 'Create New Template'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Editor, Info, Thumbnail Generation */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Template Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Modern Minimalist"
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of the template"
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="templateCode" className="block text-sm font-medium text-gray-300 mb-2">
                Template Code (JSX)
              </label>
              <div className="border border-white/20 rounded-lg overflow-hidden">
                <Editor
                  height="350px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{ 
                    minimap: { enabled: false }, 
                    scrollBeyondLastLine: false, 
                    automaticLayout: true,
                    fontSize: 14,
                    lineHeight: 20,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Use <code className="bg-white/10 px-1 rounded">render(&lt;YourComponent userData={'{userData}'} /&gt;);</code> to display. <code className="bg-white/10 px-1 rounded">motion</code> and <code className="bg-white/10 px-1 rounded">userData</code> are available in scope.
              </p>
            </div>

            {/* Thumbnail Generation Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <Image className="w-5 h-5 text-purple-400" />
                  Thumbnail Generation
                </h3>
                <p className="text-sm text-gray-300">
                  Generate thumbnails for template preview. Choose between standard or enhanced 3D options.
                </p>
              </div>

              {/* Thumbnail Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Thumbnail Type</Label>
                <RadioGroup
                  value={thumbnailType}
                  onValueChange={(value) => setThumbnailType(value as 'standard' | 'enhanced3d')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" className="border-white/30 text-purple-400" />
                    <Label htmlFor="standard" className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <Image className="w-4 h-4" />
                      Standard (240x320px)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enhanced3d" id="enhanced3d" className="border-white/30 text-purple-400" />
                    <Label htmlFor="enhanced3d" className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <Sparkles className="w-4 h-4" />
                      Enhanced 3D (600x800px)
                      <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">WebP</Badge>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  ref={thumbnailPreviewRef} 
                  className="w-[240px] h-[320px] border border-dashed border-white/30 overflow-hidden bg-white shadow-inner flex-shrink-0 rounded-lg"
                  aria-label="Thumbnail preview area for capture"
                >
                  {/* Intermediate div for full-size rendering, then scaled down */}
                  <div 
                    ref={thumbnailContentRef}
                    style={{
                      width: '800px', 
                      height: '1131px', // Approx A4 aspect ratio for 800px width
                      transform: 'scale(0.3)',
                      transformOrigin: 'top left',
                      backgroundColor: 'white', // Ensure a background if template is transparent
                    }}
                  >
                    <LiveProvider code={code} scope={livePreviewScope} noInline={true} key={code + '-thumbnail'}>
                      <LivePreview className="w-full h-full" />
                    </LiveProvider>
                  </div>
                </div>

                <div className="flex-grow space-y-3">
                  {/* Standard Thumbnail */}
                  {thumbnailType === 'standard' && (
                    <>
                      <Button 
                        onClick={handleGenerateThumbnail} 
                        variant="outline" 
                        className="w-full bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Image className="w-4 h-4 mr-2" />
                            Generate Standard Thumbnail
                          </>
                        )}
                      </Button>
                      {thumbnailUrl && (
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-2">Standard Thumbnail (JPEG):</p>
                          <img src={thumbnailUrl} alt="Generated Thumbnail" className="border border-white/20 rounded max-w-[120px] max-h-[160px] object-contain shadow-md" />
                        </div>
                      )}
                    </>
                  )}

                  {/* Enhanced 3D Thumbnail */}
                  {thumbnailType === 'enhanced3d' && (
                    <>
                      <Button 
                        onClick={handleGenerateEnhanced3DThumbnail} 
                        variant="outline" 
                        className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/50 text-white hover:from-purple-500/30 hover:to-blue-500/30"
                        disabled={isGenerating3D}
                      >
                        {isGenerating3D ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2"></div>
                            Generating 3D...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Enhanced 3D Thumbnail
                          </>
                        )}
                      </Button>
                      {enhanced3DThumbnailUrl && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-medium text-gray-300">Enhanced 3D Thumbnail:</p>
                            {enhanced3DMetadata && (
                              <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-300">
                                {enhanced3DMetadata.format?.toUpperCase()} • {enhanced3DMetadata.fileSize?.png}
                              </Badge>
                            )}
                          </div>
                          <img src={enhanced3DThumbnailUrl} alt="Enhanced 3D Thumbnail" className="border border-white/20 rounded max-w-[180px] max-h-[240px] object-contain shadow-lg" />
                          {enhanced3DMetadata && (
                            <div className="text-xs text-gray-400 mt-2">
                              <p>Resolution: {enhanced3DMetadata.width}×{enhanced3DMetadata.height}px</p>
                              <p>Generated: {new Date(enhanced3DMetadata.generatedAt).toLocaleTimeString()}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Manual Thumbnail Upload */}
                  <div className="pt-3 border-t border-white/20">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Manual Upload (Fallback)</h4>
                        <p className="text-xs text-gray-400">Upload your own thumbnail if automatic generation fails</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleManualThumbnailUpload}
                          className="hidden"
                          id="thumbnail-upload"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="flex-1 cursor-pointer"
                        >
                          <div className={`flex items-center justify-center gap-2 px-3 py-2 text-sm border-2 border-dashed rounded-md transition-colors ${
                            isUploading 
                              ? 'border-white/20 bg-white/5 cursor-not-allowed' 
                              : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                          }`}>
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Image
                              </>
                            )}
                          </div>
                        </label>
                      </div>

                      {uploadedThumbnailUrl && (
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-2">Uploaded Thumbnail:</p>
                          <div className="flex items-start gap-2">
                            <img 
                              src={uploadedThumbnailUrl} 
                              alt="Uploaded Thumbnail" 
                              className="border border-white/20 rounded max-w-[120px] max-h-[160px] object-contain shadow-md" 
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setUploadedThumbnailUrl('');
                                setDisplayMode('thumbnail');
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-500/50"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        <p>• Supports JPEG, PNG, WebP formats</p>
                        <p>• Maximum file size: 5MB</p>
                        <p>• Recommended size: 240×320px or 600×800px</p>
                      </div>
                    </div>
                  </div>

                  {/* Display Mode Selection */}
                  <div className="pt-3 border-t border-white/20">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Display Mode</h4>
                        <p className="text-xs text-gray-400">Choose what to display in resume containers</p>
                      </div>

                      <RadioGroup
                        value={displayMode}
                        onValueChange={(value) => setDisplayMode(value as 'thumbnail' | 'uploaded_image')}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="thumbnail" id="display-thumbnail" className="border-white/30 text-purple-400" />
                          <Label htmlFor="display-thumbnail" className="cursor-pointer text-gray-300">
                            Use Generated Thumbnail
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="uploaded_image" 
                            id="display-uploaded" 
                            disabled={!uploadedThumbnailUrl}
                            className="border-white/30 text-purple-400"
                          />
                          <Label 
                            htmlFor="display-uploaded" 
                            className={`cursor-pointer ${!uploadedThumbnailUrl ? 'text-gray-500' : 'text-gray-300'}`}
                          >
                            Use Uploaded Image
                          </Label>
                        </div>
                      </RadioGroup>

                      {displayMode === 'uploaded_image' && !uploadedThumbnailUrl && (
                        <p className="text-xs text-amber-400">
                          ⚠️ Please upload an image to use this option
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Active Thumbnail Indicator */}
                  <div className="pt-2 border-t border-white/20">
                    <p className="text-xs text-gray-400">
                      <span className="font-medium text-gray-300">Active for frontend:</span> {
                        displayMode === 'uploaded_image' && uploadedThumbnailUrl
                          ? 'Uploaded Image'
                          : thumbnailType === 'enhanced3d' 
                            ? 'Enhanced 3D Thumbnail' 
                            : 'Standard Thumbnail'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSaveTemplate} 
              className="w-full py-3 text-base bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              {isEditing ? 'Save Changes' : 'Save Template'}
            </Button>
          </div>

          {/* Right Column: Live Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Live Preview (Full Size)</h2>
                <p className="text-sm text-gray-300">This is the main preview of your template as it would appear.</p>
              </div>
            </div>

            {/* Outer container for centering and providing min-height, and relative for error positioning */}
            <div 
              ref={livePreviewRef}
              className="border border-white/20 rounded-lg shadow-lg bg-white/5 backdrop-blur-xl min-h-[70vh] flex items-center justify-center p-4 relative overflow-hidden"
            >
              <LiveProvider code={code} scope={livePreviewScope} noInline={true} key={code + '-main'}>
                {/* Responsive canvas for the template to render into */}
                <div
                  className="bg-white shadow-xl overflow-hidden rounded-lg"
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    aspectRatio: '800 / 1131', // A4-like aspect ratio
                    height: 'auto', // Allow height to be determined by aspect ratio and width
                  }}
                >
                  <div 
                    ref={templateContentRef}
                    style={{
                      width: '800px',
                      height: '1131px',
                      transform: 'scale(0.75)',
                      transformOrigin: 'top left',
                      overflow: 'hidden'
                    }}
                  >
                    <LivePreview className="w-full h-full" />
                  </div>
                </div>
                <LiveError 
                  className="absolute top-6 left-6 right-6 max-h-[30%] overflow-y-auto m-0 p-3 bg-red-900/80 text-red-200 text-xs whitespace-pre-wrap border border-red-500/50 rounded z-50 backdrop-blur-sm"
                />
              </LiveProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProTemplateEditor;