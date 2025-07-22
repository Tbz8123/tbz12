import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phone?: string;
    address?: string;
    summary?: string;
  };
  summary?: string;
  experience?: Array<{
    position?: string;
    jobTitle?: string;
    company?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    description?: string;
  }>;
  skills?: Array<{
    name?: string;
    level?: string;
    category?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    url?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    url?: string;
  }>;
  languages?: Array<{
    name?: string;
    level?: string;
  }>;
  additionalSections?: Array<{
    title?: string;
    content?: string;
    items?: Array<{
      title?: string;
      description?: string;
    }>;
  }>;
}

interface MultiPageProTemplateProps {
  userData: ResumeData;
  templateStyle?: 'executive' | 'creative' | 'modern' | 'minimalist';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
  priority: number;
  minHeight: number;
  canSplit: boolean;
}

// Enhanced spacing constants for better content distribution
const PAGE_HEIGHT = 1131; // A4 height in pixels at 96 DPI
const PAGE_WIDTH = 800;   // A4 width in pixels at 96 DPI
const PAGE_PADDING = 50;
const HEADER_HEIGHT_FIRST = 140;
const HEADER_HEIGHT_SUBSEQUENT = 80;
const FOOTER_HEIGHT = 35;

// Content optimization thresholds
const MIN_CONTENT_HEIGHT = 100;
const SECTION_SPACING = 32;
const OPTIMAL_SECTIONS_PER_PAGE = 4;

const MultiPageProTemplate: React.FC<MultiPageProTemplateProps> = ({
  userData,
  templateStyle = 'executive',
  primaryColor = '#2563eb',
  secondaryColor = '#1e293b',
  accentColor = '#7c3aed'
}) => {
  const [pages, setPages] = useState<ContentSection[][]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [contentMetrics, setContentMetrics] = useState<{ [key: string]: number }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Debug logging
  console.log('🔍 MultiPageProTemplate - userData:', userData);
  console.log('🔍 MultiPageProTemplate - templateStyle:', templateStyle);

  // Enhanced content estimation function
  const estimateContentHeight = useCallback((section: ContentSection): number => {
    const baseHeight = section.minHeight;

    // Estimate based on content type and data
    switch (section.id) {
      case 'experience':
        const expCount = userData.experience?.length || 0;
        const expHeight = baseHeight + (expCount * 120);
        console.log('📏 Experience height estimate:', expHeight, 'for', expCount, 'items');
        return expHeight;

      case 'education':
        const eduCount = userData.education?.length || 0;
        const eduHeight = baseHeight + (eduCount * 80);
        console.log('📏 Education height estimate:', eduHeight, 'for', eduCount, 'items');
        return eduHeight;

      case 'skills':
        const skillsCount = userData.skills?.length || 0;
        const skillsHeight = baseHeight + Math.ceil(skillsCount / 2) * 40;
        console.log('📏 Skills height estimate:', skillsHeight, 'for', skillsCount, 'items');
        return skillsHeight;

      case 'projects':
        const projectsCount = userData.projects?.length || 0;
        const projectsHeight = baseHeight + (projectsCount * 100);
        console.log('📏 Projects height estimate:', projectsHeight, 'for', projectsCount, 'items');
        return projectsHeight;

      default:
        console.log('📏 Default height estimate:', baseHeight + 40, 'for section:', section.id);
        return baseHeight + 40;
    }
  }, [userData]);

  // Enhanced content sections with better styling
  const contentSections = useMemo((): ContentSection[] => {
    const sections: ContentSection[] = [];

    console.log('🔧 Creating content sections from userData:', {
      hasSummary: !!(userData.summary || userData.personalInfo?.summary),
      experienceCount: userData.experience?.length || 0,
      educationCount: userData.education?.length || 0,
      skillsCount: userData.skills?.length || 0,
      projectsCount: userData.projects?.length || 0,
      certificationsCount: userData.certifications?.length || 0,
      languagesCount: userData.languages?.length || 0,
      additionalSectionsCount: userData.additionalSections?.length || 0
    });

    // Professional Summary Section with enhanced styling
    if (userData.summary || userData.personalInfo?.summary) {
      sections.push({
        id: 'summary',
        title: 'Professional Summary',
        priority: 1,
        minHeight: 80,
        canSplit: false,
        content: (
          <section className="mb-8 page-break-inside-avoid">
            <div className="section-divider">
              <h3 className="text-xl font-bold mb-4 pb-3 border-b-2 flex items-center" 
                  style={{ color: secondaryColor, borderColor: primaryColor }}>
                <div className="w-1 h-6 mr-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                Professional Summary
              </h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4" style={{ borderColor: primaryColor }}>
              <p className="text-gray-700 leading-relaxed text-base font-medium">
                {userData.summary || userData.personalInfo?.summary}
              </p>
            </div>
          </section>
        )
      });
      console.log('✅ Added Professional Summary section');
    }

    // Enhanced Experience Section with timeline
    if (userData.experience && userData.experience.length > 0) {
      sections.push({
        id: 'experience',
        title: 'Professional Experience',
        priority: 2,
        minHeight: 120,
        canSplit: true,
        content: (
          <section className="mb-8">
            <div className="section-divider">
              <h3 className="text-xl font-bold mb-6 pb-3 border-b-2 flex items-center" 
                  style={{ color: secondaryColor, borderColor: primaryColor }}>
                <div className="w-1 h-6 mr-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                Professional Experience
              </h3>
            </div>
            <div className="experience-timeline space-y-8">
              {userData.experience.map((exp, index) => (
                <div key={index} className="experience-item page-break-inside-avoid border-l-4 pl-8 relative bg-white p-6 rounded-lg shadow-sm" 
                     style={{ borderColor: accentColor }}>
                  <div className="absolute -left-3 top-8 w-6 h-6 rounded-full border-4 border-white shadow-md" 
                       style={{ backgroundColor: accentColor }}></div>

                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold" style={{ color: secondaryColor }}>
                      {exp.position || exp.jobTitle || 'Position'}
                    </h4>
                    <div className="text-right">
                      <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" 
                            style={{ backgroundColor: primaryColor }}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold text-lg mb-4" style={{ color: primaryColor }}>
                    {exp.company || exp.companyName || 'Company'}
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Key Achievements:</h5>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" 
                                 style={{ backgroundColor: accentColor }}></div>
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      });
      console.log('✅ Added Professional Experience section');
    }

    // Education Section
    if (userData.education && userData.education.length > 0) {
      sections.push({
        id: 'education',
        title: 'Education',
        priority: 3,
        minHeight: 80,
        canSplit: true,
        content: (
          <section className="mb-8">
            <div className="section-divider">
              <h3 className="text-xl font-bold mb-6 pb-3 border-b-2 flex items-center" 
                  style={{ color: secondaryColor, borderColor: primaryColor }}>
                <div className="w-1 h-6 mr-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                Education
              </h3>
            </div>
            <div className="space-y-6">
              {userData.education.map((edu, index) => (
                <div key={index} className="education-item page-break-inside-avoid bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold" style={{ color: secondaryColor }}>
                        {edu.degree || 'Degree'}
                      </h4>
                      <p className="font-semibold text-lg" style={{ color: primaryColor }}>
                        {edu.institution || 'Institution'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" 
                            style={{ backgroundColor: accentColor }}>
                        {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : 
                         edu.endDate || 'Year'}
                      </span>
                    </div>
                  </div>

                  {edu.gpa && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">GPA:</span> {edu.gpa}
                    </p>
                  )}

                  {edu.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      });
      console.log('✅ Added Education section');
    }

    // Enhanced Skills Section with visual progress bars
    if (userData.skills && userData.skills.length > 0) {
      sections.push({
        id: 'skills',
        title: 'Skills & Expertise',
        priority: 4,
        minHeight: 80,
        canSplit: false,
        content: (
          <section className="mb-8 page-break-inside-avoid">
            <div className="section-divider">
              <h3 className="text-xl font-bold mb-6 pb-3 border-b-2 flex items-center" 
                  style={{ color: secondaryColor, borderColor: primaryColor }}>
                <div className="w-1 h-6 mr-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                Skills & Expertise
              </h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-800 text-sm">
                        {typeof skill === 'string' ? skill : skill.name || 'Skill'}
                      </span>
                      {typeof skill === 'object' && skill.level && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-white" 
                              style={{ backgroundColor: accentColor }}>
                          {skill.level}
                        </span>
                      )}
                    </div>
                    {typeof skill === 'object' && skill.level && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="skill-bar h-2.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                            width: skill.level === 'Expert' ? '95%' : 
                                  skill.level === 'Advanced' ? '85%' : 
                                  skill.level === 'Intermediate' ? '70%' : '50%'
                          }}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: skill.level === 'Expert' ? '95%' : 
                                  skill.level === 'Advanced' ? '85%' : 
                                  skill.level === 'Intermediate' ? '70%' : '50%'
                          }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      });
      console.log('✅ Added Skills & Expertise section');
    }

    // Projects Section
    if (userData.projects && userData.projects.length > 0) {
      sections.push({
        id: 'projects',
        title: 'Projects',
        priority: 5,
        minHeight: 80,
        canSplit: true,
        content: (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2" 
                style={{ color: secondaryColor, borderColor: primaryColor }}>
              Projects
            </h3>
            <div className="space-y-4">
              {userData.projects.map((project, index) => (
                <div key={index} className="project-item">
                  <h4 className="text-lg font-semibold mb-2" style={{ color: secondaryColor }}>
                    {project.name}
                  </h4>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 text-xs font-medium rounded-full text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.url && (
                    <a 
                      href={project.url} 
                      className="text-sm underline"
                      style={{ color: primaryColor }}
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      });
      console.log('✅ Added Projects section');
    }

    // Certifications Section
    if (userData.certifications && userData.certifications.length > 0) {
      sections.push({
        id: 'certifications',
        title: 'Certifications',
        priority: 6,
        minHeight: 60,
        canSplit: true,
        content: (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2" 
                style={{ color: secondaryColor, borderColor: primaryColor }}>
              Certifications
            </h3>
            <div className="space-y-3">
              {userData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold" style={{ color: secondaryColor }}>
                        {cert.name}
                      </h4>
                      <p className="text-gray-600">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      });
      console.log('✅ Added Certifications section');
    }

    // Languages Section
    if (userData.languages && userData.languages.length > 0) {
      sections.push({
        id: 'languages',
        title: 'Languages',
        priority: 7,
        minHeight: 50,
        canSplit: false,
        content: (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2" 
                style={{ color: secondaryColor, borderColor: primaryColor }}>
              Languages
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {userData.languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{lang.name}</span>
                  <span className="text-sm text-gray-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )
      });
      console.log('✅ Added Languages section');
    }

    // Additional Sections
    if (userData.additionalSections && userData.additionalSections.length > 0) {
      userData.additionalSections.forEach((section, index) => {
        sections.push({
          id: `additional-${index}`,
          title: section.title || 'Additional Information',
          priority: 8 + index,
          minHeight: 60,
          canSplit: true,
          content: (
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-6 pb-2 border-b-2" 
                  style={{ color: secondaryColor, borderColor: primaryColor }}>
                {section.title}
              </h3>
              {section.content && (
                <p className="text-gray-700 mb-4">{section.content}</p>
              )}
              {section.items && section.items.length > 0 && (
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx}>
                      {item.title && (
                        <h4 className="font-semibold mb-1" style={{ color: secondaryColor }}>
                          {item.title}
                        </h4>
                      )}
                      {item.description && (
                        <p className="text-gray-700 text-sm">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        });
      });
      console.log('✅ Added Additional Sections');
    }

    console.log('🔍 Final contentSections array:', sections);
    return sections.sort((a, b) => a.priority - b.priority);
  }, [userData, primaryColor, secondaryColor, accentColor]);

  // Intelligent pagination with content optimization
  const optimizePagination = useCallback((): ContentSection[][] => {
    const paginatedPages: ContentSection[][] = [];
    let currentPage: ContentSection[] = [];
    let currentPageHeight = 0;
    let pageIndex = 0;

    console.log('🔄 Starting pagination with', contentSections.length, 'sections');

    // Calculate available content height for each page
    const getAvailableHeight = (isFirstPage: boolean): number => {
      const headerHeight = isFirstPage ? HEADER_HEIGHT_FIRST : HEADER_HEIGHT_SUBSEQUENT;
      const availableHeight = PAGE_HEIGHT - headerHeight - FOOTER_HEIGHT - (PAGE_PADDING * 2);
      console.log('📐 Available height for page', pageIndex + 1, ':', availableHeight, 'px');
      return availableHeight;
    };

    contentSections.forEach((section, index) => {
      const estimatedHeight = estimateContentHeight(section);
      const isFirstPage = pageIndex === 0;
      const availableHeight = getAvailableHeight(isFirstPage);

      console.log(`📊 Section ${index + 1} (${section.id}):`, {
        estimatedHeight,
        currentPageHeight,
        availableHeight,
        wouldFit: currentPageHeight + estimatedHeight + SECTION_SPACING <= availableHeight
      });

      // Check if section fits on current page
      const wouldFitOnCurrentPage = currentPageHeight + estimatedHeight + SECTION_SPACING <= availableHeight;
      const hasRoomForMoreSections = currentPage.length < OPTIMAL_SECTIONS_PER_PAGE;

      if (wouldFitOnCurrentPage && hasRoomForMoreSections && currentPage.length > 0) {
        // Add to current page
        currentPage.push(section);
        currentPageHeight += estimatedHeight + SECTION_SPACING;
        console.log(`✅ Added section ${section.id} to page ${pageIndex + 1}. New height: ${currentPageHeight}px`);
      } else {
        // Start new page
        if (currentPage.length > 0) {
          paginatedPages.push([...currentPage]);
          console.log(`📄 Completed page ${pageIndex + 1} with ${currentPage.length} sections`);
          pageIndex++;
        }
        currentPage = [section];
        currentPageHeight = estimatedHeight;
        console.log(`📄 Started new page ${pageIndex + 1} with section ${section.id}. Height: ${currentPageHeight}px`);
      }
    });

    // Add the last page if it has content
    if (currentPage.length > 0) {
      paginatedPages.push(currentPage);
      console.log(`📄 Final page ${pageIndex + 1} with ${currentPage.length} sections`);
    }

    // Ensure at least one page exists
    if (paginatedPages.length === 0) {
      paginatedPages.push([]);
      console.log('📄 Created empty page as fallback');
    }

    console.log('✅ Pagination complete:', paginatedPages.length, 'pages created');
    return paginatedPages;
  }, [contentSections, estimateContentHeight]);

  // Process pagination when content changes
  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const paginatedPages = optimizePagination();
      setPages(paginatedPages);
      setIsProcessing(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [optimizePagination]);

  // Enhanced Header Component with better styling
  const Header: React.FC<{ isFirstPage: boolean }> = ({ isFirstPage }) => (
    <header className={`${isFirstPage ? 'mb-10' : 'mb-6'}`}>
      {isFirstPage ? (
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50"></div>
          <div className="relative z-10 py-8">
            <h1 className="text-5xl font-bold mb-3" style={{ color: secondaryColor }}>
              {userData.personalInfo?.firstName || 'John'} {userData.personalInfo?.lastName || 'Doe'}
            </h1>
            <div className="w-24 h-1 mx-auto mb-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            <h2 className="text-2xl font-medium mb-6" style={{ color: primaryColor }}>
              {userData.personalInfo?.title || 'Professional Title'}
            </h2>
            <div className="flex justify-center space-x-8 text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                <span>{userData.personalInfo?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                <span>{userData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
              </div>
              {userData.personalInfo?.address && (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                  <span>{userData.personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center border-b-2 pb-4" style={{ borderColor: primaryColor }}>
          <h1 className="text-2xl font-bold" style={{ color: secondaryColor }}>
            {userData.personalInfo?.firstName} {userData.personalInfo?.lastName}
          </h1>
          <span className="text-gray-600 font-medium">{userData.personalInfo?.title}</span>
        </div>
      )}
    </header>
  );

  // Enhanced Footer Component
  const Footer: React.FC<{ pageNumber: number; totalPages: number }> = ({ pageNumber, totalPages }) => (
    <footer className="mt-10 pt-4 border-t text-center text-gray-500 text-sm" style={{ borderColor: primaryColor }}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{userData.personalInfo?.firstName} {userData.personalInfo?.lastName}</span>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          <span>Page {pageNumber} of {totalPages}</span>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></div>
        </div>
      </div>
    </footer>
  );

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-4 border-transparent mx-auto mb-4" 
            style={{ borderTopColor: primaryColor, borderRightColor: accentColor }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Optimizing multi-page layout...</p>
          <p className="text-gray-500 text-sm mt-1">Analyzing content distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="multi-page-resume">
      <AnimatePresence>
        {pages.map((pageContent, pageIndex) => (
          <motion.div
            key={`page-${pageIndex}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: pageIndex * 0.15, 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            className="resume-page bg-white"
            style={{
              width: `${PAGE_WIDTH}px`,
              minHeight: `${PAGE_HEIGHT}px`,
              padding: `${PAGE_PADDING}px`,
              marginBottom: pageIndex < pages.length - 1 ? '40px' : '0',
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
              fontFamily: templateStyle === 'creative' ? 'Inter, sans-serif' : 'system-ui, -apple-system, sans-serif'
            }}
          >
            <Header isFirstPage={pageIndex === 0} />

            <main className="content-area">
              <AnimatePresence>
                {pageContent.map((section, sectionIndex) => (
                  <motion.div 
                    key={section.id} 
                    ref={(el) => { contentRefs.current[section.id] = el; }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: (pageIndex * 0.15) + (sectionIndex * 0.1),
                      duration: 0.4
                    }}
                  >
                    {section.content}
                  </motion.div>
                ))}
              </AnimatePresence>
            </main>

            <Footer pageNumber={pageIndex + 1} totalPages={pages.length} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MultiPageProTemplate; 