/**
 * @file Multi-Page Template Utilities
 * @description Shared logic for advanced multi-page resume templates.
 * This includes content unit definitions, height estimation, and page distribution logic.
 */
import React from 'react';
import { useLocation } from 'wouter';
import EditableSection from '@/components/final-page/EditableSection';

// --- INTERFACES ---
interface CustomSection {
  title: string;
  content: string;
  placement: 'main' | 'sidebar';
}

interface ContentUnit {
  type: string;
  placement: 'main' | 'sidebar';
  height: number;
  id: string;
  data?: any;
}

interface Page {
  mainUnits: ContentUnit[];
  sidebarUnits: ContentUnit[];
}

// --- CONSTANTS ---
const MAIN_COL_WIDTH_CHARS = 65;
const SIDEBAR_COL_WIDTH_CHARS = 35;

// --- UTILITY FUNCTIONS ---
const estimateTextHeight = (text: string, fontSize: number, charsPerLine: number) => {
  const lines = text.split('\n').reduce((acc: number, line: string) => {
    return acc + Math.ceil(line.length / charsPerLine);
  }, 0);
  return lines * fontSize * 1.2;
};

const estimateMainTextHeight = (text: string, fontSize = 14) => estimateTextHeight(text, fontSize, MAIN_COL_WIDTH_CHARS);
const estimateSidebarTextHeight = (text: string, fontSize = 13) => estimateTextHeight(text, fontSize, SIDEBAR_COL_WIDTH_CHARS);

// --- CONTENT DISTRIBUTION ---
export const getContentUnits = (userData: any) => {
  const units: ContentUnit[] = [];

  // Main column units
  if (userData.personalInfo?.summary) {
    units.push({ 
      type: 'about', 
      placement: 'main', 
      height: estimateMainTextHeight(userData.personalInfo.summary) + 60,
      id: 'about'
    });
  }

  if (userData.experience?.length > 0) {
    userData.experience.forEach((exp: any, index: number) => {
      const descHeight = exp.description ? estimateMainTextHeight(exp.description) : 0;
      units.push({
        type: 'experience',
        placement: 'main',
        height: descHeight + 80,
        data: exp,
        id: `experience-${index}`
      });
    });
  }

  if (userData.education?.length > 0) {
    userData.education.forEach((edu: any, index: number) => {
      const descHeight = edu.description ? estimateMainTextHeight(edu.description) : 0;
      units.push({
        type: 'education',
        placement: 'main',
        height: descHeight + 60,
        data: edu,
        id: `education-${index}`
      });
    });
  }

  if (userData.certifications?.length > 0) {
    userData.certifications.forEach((cert: any, index: number) => {
      units.push({
        type: 'certification',
        placement: 'main',
        height: 45,
        data: cert,
        id: `certification-${index}`
      });
    });
  }

  if (userData.customSections?.length > 0) {
    userData.customSections
      .filter((section: CustomSection) => section.placement === 'main')
      .forEach((section: CustomSection, index: number) => {
        const contentHeight = section.content ? estimateMainTextHeight(section.content) : 0;
        units.push({
          type: 'custom-main',
          placement: 'main',
          height: contentHeight + 60,
          data: section,
          id: `custom-main-${index}`
        });
      });
  }

  // Sidebar units
  const sidebarUnits: ContentUnit[] = [];

  if (userData.personalInfo?.phone || userData.personalInfo?.email || userData.personalInfo?.address) {
    sidebarUnits.push({ type: 'contact', placement: 'sidebar', height: 120, id: 'contact' });
  }

  if (userData.skills?.length > 0) {
    sidebarUnits.push({ type: 'skills', placement: 'sidebar', height: Math.min(userData.skills.length * 35 + 60, 280), id: 'skills' });
  }

  if (userData.languages?.length > 0) {
    sidebarUnits.push({ type: 'languages', placement: 'sidebar', height: userData.languages.length * 25 + 60, id: 'languages' });
  }

  if (userData.customSections?.length > 0) {
    userData.customSections
      .filter((section: CustomSection) => section.placement === 'sidebar')
      .forEach((section: CustomSection, index: number) => {
        const contentHeight = section.content ? estimateSidebarTextHeight(section.content) : 0;
        sidebarUnits.push({
          type: 'custom-sidebar',
          placement: 'sidebar',
          height: contentHeight + 60,
          data: section,
          id: `custom-sidebar-${index}`
        });
      });
  }

  return { mainUnits: units, sidebarUnits };
};

export const distributeContentToPages = (userData: any): Page[] => {
  const { mainUnits, sidebarUnits } = getContentUnits(userData);

  const CONTENT_HEIGHT = 950;
  const SIDEBAR_HEIGHT = 1050;

  const pages: Page[] = [];
  let currentPage: Page = { mainUnits: [], sidebarUnits: [] };
  let currentMainHeight = 0;
  let currentSidebarHeight = 0;

  // Distribute sidebar units first
  for (const unit of sidebarUnits) {
    if (currentSidebarHeight + unit.height > SIDEBAR_HEIGHT && currentPage.sidebarUnits.length > 0) {
      pages.push(currentPage);
      currentPage = { mainUnits: [], sidebarUnits: [] };
      currentSidebarHeight = 0;
    }
    currentPage.sidebarUnits.push(unit);
    currentSidebarHeight += unit.height;
  }

  // Distribute main units
  for (const unit of mainUnits) {
    if (currentMainHeight + unit.height > CONTENT_HEIGHT && currentPage.mainUnits.length > 0) {
      pages.push(currentPage);
      currentPage = { mainUnits: [], sidebarUnits: [] };
      currentMainHeight = 0;
    }
    currentPage.mainUnits.push(unit);
    currentMainHeight += unit.height;
  }

  if (currentPage.mainUnits.length > 0 || currentPage.sidebarUnits.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [{ mainUnits: [], sidebarUnits: [] }];
};

// --- COMPONENT UNITS ---
const HeaderUnit = ({ userData, customColors }: { userData: any; customColors: any }) => {
  const primaryColor = customColors?.primary || '#1e40af';
  const textColor = customColors?.text || '#111827';

  return (
    <div style={{ marginBottom: '50px', pageBreakInside: 'avoid' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: textColor, marginBottom: '8px' }}>
        {userData.personalInfo?.firstName} {userData.personalInfo?.lastName}
      </h1>
      <p style={{ fontSize: '16px', color: primaryColor, fontWeight: '600', marginBottom: '0' }}>
        {userData.personalInfo?.title}
      </p>
    </div>
  );
};

const AboutUnit = ({ userData, customColors }: { userData: any; customColors: any }) => {
  const primaryColor = customColors?.primary || '#1e40af';
  const textColor = customColors?.text || '#374151';

  return (
    <div style={{ marginBottom: '35px', pageBreakInside: 'avoid' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>PROFESSIONAL SUMMARY</h2>
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: textColor, margin: '0' }}>
        {userData.personalInfo?.summary || userData.professionalSummary || 'Add your professional summary here...'}
      </p>
    </div>
  );
};

const ExperienceUnit = ({ exp, customColors }: { exp: any; customColors: any }) => {
  const primaryColor = customColors?.primary || '#1e40af';
  const textColor = customColors?.text || '#111827';

  const formatDescription = (description: string) => {
    if (!description) return '';
    return description.split('\n').map((line: string, index: number) => (
      <div key={index} style={{ marginBottom: '4px' }}>
        {line.trim() && !line.startsWith('•') ? `• ${line.trim()}` : line}
      </div>
    ));
  };

  return (
    <div style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: textColor, marginBottom: '4px' }}>{exp.position}</h3>
      <p style={{ fontSize: '14px', color: primaryColor, fontWeight: '600', marginBottom: '8px' }}>
        {exp.company}
        {exp.location && ` | ${exp.location}`}
        {' | '}
        {exp.startDate} - {exp.endDate}
      </p>
      {exp.description && (
        <div style={{ fontSize: '13px', lineHeight: '1.5', color: textColor }}>
          {formatDescription(exp.description)}
        </div>
      )}
    </div>
  );
};

const EducationUnit = ({ edu, customColors }: { edu: any; customColors: any }) => {
  const primaryColor = customColors?.primary || '#1e40af';
  const textColor = customColors?.text || '#111827';

  return (
    <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: textColor, marginBottom: '4px' }}>{edu.degree}</h3>
        <p style={{ fontSize: '14px', color: primaryColor, fontWeight: '600', marginBottom: '4px' }}>
            {edu.institution || edu.school}
            {edu.location && ` | ${edu.location}`}
            {' | '}
            {edu.graduationDate || `${edu.startDate} - ${edu.endDate}`}
        </p>
        {edu.description && (
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: textColor, margin: '0' }}>
                {edu.description}
            </p>
        )}
    </div>
  );
};

const CertificationUnit = ({ cert, customColors }: { cert: any; customColors: any }) => {
  const primaryColor = customColors?.primary || '#1e40af';
  const textColor = customColors?.text || '#111827';

  return (
    <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '2px' }}>{cert.name}</h3>
        <p style={{ fontSize: '13px', color: primaryColor, fontWeight: '600', margin: '0' }}>{cert.issuer} | {cert.date}</p>
    </div>
  );
};

const CustomMainUnit = ({ section, customColors }: { section: any; customColors: any }) => {
  const primaryColor = customColors?.primary || '#1e40af';
  const textColor = customColors?.text || '#374151';

  return (
    <div style={{ marginBottom: '35px', pageBreakInside: 'avoid' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>{section.title}</h2>
      <div style={{ fontSize: '14px', lineHeight: '1.6', color: textColor }}>
        {section.content || 'Add content...'}
      </div>
    </div>
  );
};

const ContactUnit = ({ userData, customColors }: { userData: any; customColors: any }) => {
  const accentColor = customColors?.accent || '#60a5fa';

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '8px' }}>CONTACT</h3>
      <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
         {userData.personalInfo?.phone && ( <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '8px' }}>📞</span><span>{userData.personalInfo.phone}</span></div>)}
         {userData.personalInfo?.email && ( <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '8px' }}>✉️</span><span style={{ wordBreak: 'break-all' }}>{userData.personalInfo.email}</span></div>)}
         {userData.personalInfo?.address && ( <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}><span style={{ marginRight: '8px', marginTop: '2px' }}>📍</span><span>{userData.personalInfo.address}</span></div>)}
      </div>
    </div>
  );
};

const SkillsUnit = ({ userData, customColors }: { userData: any; customColors: any }) => {
  const accentColor = customColors?.accent || '#60a5fa';
  const secondaryColor = customColors?.secondary || '#3b82f6';

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '8px' }}>SKILLS</h3>
        {userData.skills?.slice(0, 6).map((skill: { name: string; level?: string }, index: number) => {
          const percentage = 80; // Simplified
          return (<div key={index} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><span style={{ fontSize: '13px', fontWeight: '500' }}>{skill.name}</span><span style={{ fontSize: '12px', opacity: '0.9' }}>{percentage}%</span></div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${accentColor} 0%, ${secondaryColor} 100%)`, borderRadius: '3px' }}></div></div>
          </div>);
        })}
    </div>
  );
};

const LanguagesUnit = ({ userData, customColors }: { userData: any; customColors: any }) => {
  const accentColor = customColors?.accent || '#60a5fa';

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '8px' }}>LANGUAGES</h3>
       {userData.languages.map((lang: { name: string; proficiency: string }, index: number) => (
         <div key={index} style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
           <span style={{ fontWeight: '500' }}>{lang.name}</span>
           <span style={{ opacity: '0.9' }}>({lang.proficiency})</span>
         </div>
       ))}
    </div>
  );
};

const CustomSidebarUnit = ({ section, customColors }: { section: any; customColors: any }) => {
  const accentColor = customColors?.accent || '#60a5fa';

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px', borderBottom: `2px solid ${accentColor}`, paddingBottom: '8px' }}>{section.title.toUpperCase()}</h3>
      <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
        {section.content || 'Add content...'}
      </div>
    </div>
  );
};

export const renderUnit = (unit: any, userData: any, customColors: any) => {
    switch (unit.type) {
      case 'header': return <HeaderUnit userData={userData} customColors={customColors} />;
      case 'about': return <AboutUnit userData={userData} customColors={customColors} />;
      case 'experience': return <ExperienceUnit exp={unit.data} customColors={customColors} />;
      case 'education': return <EducationUnit edu={unit.data} customColors={customColors} />;
      case 'certification': return <CertificationUnit cert={unit.data} customColors={customColors} />;
      case 'custom-main': return <CustomMainUnit section={unit.data} customColors={customColors} />;
      case 'contact': return <ContactUnit userData={userData} customColors={customColors} />;
      case 'skills': return <SkillsUnit userData={userData} customColors={customColors} />;
      case 'languages': return <LanguagesUnit userData={userData} customColors={customColors} />;
      case 'custom-sidebar': return <CustomSidebarUnit section={unit.data} customColors={customColors} />;
      default: return null;
    }
  };

  export const MultiPageRender = ({ 
    resumeData, 
    onUpdateResumeData,
    onUpdateSkills,
    onUpdateLanguages,
    onUpdateCertifications,
    onUpdateCustomSections,
    onUpdateEducation,
    onUpdateWorkExperience
  }) => {
    const [, setLocation] = useLocation();
    const pages = distributeContentToPages(resumeData);
    const customColors = resumeData.customization?.colors;
    const primaryColor = customColors?.primary || '#1e40af';
    const secondaryColor = customColors?.secondary || '#3b82f6';
    const backgroundColor = customColors?.background || '#fff';

    const navigateToSection = (path: string) => {
      setLocation(path);
    };

    // Implement actual delete functionality
    const handleDeleteSection = (sectionType: string, sectionId?: string) => {
      console.log(`Delete ${sectionType} section:`, sectionId);

      switch (sectionType) {
        case 'skills':
          onUpdateSkills?.([]);
          break;
        case 'languages':
          onUpdateLanguages?.([]);
          break;
        case 'certifications':
          onUpdateCertifications?.([]);
          break;
        case 'professional-summary':
          onUpdateResumeData?.({ 
            personalInfo: { 
              ...resumeData.personalInfo, 
              summary: '' 
            } 
          });
          break;
        case 'experience':
          onUpdateWorkExperience?.([]);
          break;
        case 'education':
          onUpdateEducation?.([]);
          break;
        case 'custom-sidebar':
          if (sectionId) {
            const sectionIndex = parseInt(sectionId.split('-').pop() || '0');
            const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
            onUpdateCustomSections?.(updatedSections);
          }
          break;
        case 'custom-main':
          if (sectionId) {
            const sectionIndex = parseInt(sectionId.split('-').pop() || '0');
            const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
            onUpdateCustomSections?.(updatedSections);
          }
          break;
        default:
          console.warn(`Delete not implemented for section type: ${sectionType}`);
      }
    };

    // Implement actual move functionality
    const handleMoveSection = (sectionType: string, sectionId: string, direction: 'up' | 'down') => {
      console.log(`Move ${sectionType} section ${direction}:`, sectionId);

      switch (sectionType) {
        case 'custom-sidebar':
        case 'custom-main':
          if (sectionId) {
            const sectionIndex = parseInt(sectionId.split('-').pop() || '0');
            const sections = [...(resumeData.customSections || [])];
            const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

            if (newIndex >= 0 && newIndex < sections.length) {
              // Swap sections
              [sections[sectionIndex], sections[newIndex]] = [sections[newIndex], sections[sectionIndex]];
              onUpdateCustomSections?.(sections);
            }
          }
          break;
        default:
          console.warn(`Move not implemented for section type: ${sectionType}`);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {pages.map((page, pageIndex) => {
          const isFirstPage = pageIndex === 0;
          const experienceUnits = page.mainUnits.filter((u: ContentUnit) => u.type === 'experience');
          const educationUnits = page.mainUnits.filter((u: ContentUnit) => u.type === 'education');
          const certificationUnits = page.mainUnits.filter((u: ContentUnit) => u.type === 'certification');

          return (
            <div key={pageIndex} className="resume-page" style={{
              display: 'flex',
              fontFamily: 'Arial, sans-serif',
              background: backgroundColor,
              width: '800px',
              height: '1131px',
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
              position: 'relative',
            }}>
              {/* Left Sidebar */}
              <div style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                color: '#fff',
                width: '280px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {page.sidebarUnits.map((unit: ContentUnit, index: number) => {
                  const content = <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>;
                  const isFirstSidebarUnit = index === 0;
                  const isLastSidebarUnit = index === page.sidebarUnits.length - 1;

                  // Wrap sidebar sections with EditableSection
                  if (unit.type === 'contact') {
                    return (
                      <EditableSection 
                        key={unit.id}
                        sectionPath="/personal-information"
                        navigateTo={navigateToSection}
                        canDelete={false} // Contact info shouldn't be deletable
                        canMoveUp={false}
                        canMoveDown={false}
                      >
                        {content}
                      </EditableSection>
                    );
                  } else if (unit.type === 'skills') {
                    return (
                      <EditableSection 
                        key={unit.id}
                        sectionPath="/skills"
                        navigateTo={navigateToSection}
                        canDelete={true}
                        canMoveUp={!isFirstSidebarUnit}
                        canMoveDown={!isLastSidebarUnit}
                        onDelete={() => handleDeleteSection('skills', unit.id)}
                        onMoveUp={() => handleMoveSection('skills', unit.id, 'up')}
                        onMoveDown={() => handleMoveSection('skills', unit.id, 'down')}
                      >
                        {content}
                      </EditableSection>
                    );
                  } else if (unit.type === 'languages') {
                    return (
                      <EditableSection 
                        key={unit.id}
                        sectionPath="/section/languages"
                        navigateTo={navigateToSection}
                        canDelete={true}
                        canMoveUp={!isFirstSidebarUnit}
                        canMoveDown={!isLastSidebarUnit}
                        onDelete={() => handleDeleteSection('languages', unit.id)}
                        onMoveUp={() => handleMoveSection('languages', unit.id, 'up')}
                        onMoveDown={() => handleMoveSection('languages', unit.id, 'down')}
                      >
                        {content}
                      </EditableSection>
                    );
                  } else if (unit.type === 'custom-sidebar') {
                    return (
                      <EditableSection 
                        key={unit.id}
                        sectionPath="/add-section"
                        navigateTo={navigateToSection}
                        canDelete={true}
                        canMoveUp={!isFirstSidebarUnit}
                        canMoveDown={!isLastSidebarUnit}
                        onDelete={() => handleDeleteSection('custom-sidebar', unit.id)}
                        onMoveUp={() => handleMoveSection('custom-sidebar', unit.id, 'up')}
                        onMoveDown={() => handleMoveSection('custom-sidebar', unit.id, 'down')}
                      >
                        {content}
                      </EditableSection>
                    );
                  }

                  return content;
                })}
              </div>

              {/* Right Content Area */}
              <div style={{ flex: 1, padding: '50px 40px', overflow: 'hidden' }}>
                {isFirstPage && (
                  <EditableSection 
                    sectionPath="/personal-information"
                    navigateTo={navigateToSection}
                    canDelete={false} // Header shouldn't be deletable
                    canMoveUp={false}
                    canMoveDown={false}
                  >
                    {renderUnit({ type: 'header' }, resumeData, customColors)}
                  </EditableSection>
                )}

                {page.mainUnits.some((u: ContentUnit) => u.type === 'about') && (
                  <EditableSection 
                    sectionPath="/professional-summary"
                    navigateTo={navigateToSection}
                    canDelete={true}
                    canMoveUp={false}
                    canMoveDown={experienceUnits.length > 0 || educationUnits.length > 0 || certificationUnits.length > 0}
                    onDelete={() => handleDeleteSection('professional-summary', 'about')}
                    onMoveDown={() => handleMoveSection('professional-summary', 'about', 'down')}
                  >
                    {renderUnit({ type: 'about' }, resumeData, customColors)}
                  </EditableSection>
                )}

                {experienceUnits.length > 0 && (
                  <EditableSection 
                    sectionPath="/work-experience-details"
                    navigateTo={navigateToSection}
                    canDelete={true}
                    canMoveUp={page.mainUnits.some((u: ContentUnit) => u.type === 'about')}
                    canMoveDown={educationUnits.length > 0 || certificationUnits.length > 0}
                    onDelete={() => handleDeleteSection('experience', 'experience-section')}
                    onMoveUp={() => handleMoveSection('experience', 'experience-section', 'up')}
                    onMoveDown={() => handleMoveSection('experience', 'experience-section', 'down')}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>EXPERIENCE</h2>
                      {experienceUnits.map((unit: ContentUnit) => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                    </div>
                  </EditableSection>
                )}

                {educationUnits.length > 0 && (
                  <EditableSection 
                    sectionPath="/education"
                    navigateTo={navigateToSection}
                    canDelete={true}
                    canMoveUp={page.mainUnits.some((u: ContentUnit) => u.type === 'about') || experienceUnits.length > 0}
                    canMoveDown={certificationUnits.length > 0}
                    onDelete={() => handleDeleteSection('education', 'education-section')}
                    onMoveUp={() => handleMoveSection('education', 'education-section', 'up')}
                    onMoveDown={() => handleMoveSection('education', 'education-section', 'down')}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>EDUCATION</h2>
                      {educationUnits.map((unit: ContentUnit) => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                    </div>
                  </EditableSection>
                )}

                {certificationUnits.length > 0 && (
                  <EditableSection 
                    sectionPath="/section/certifications"
                    navigateTo={navigateToSection}
                    canDelete={true}
                    canMoveUp={page.mainUnits.some((u: ContentUnit) => u.type === 'about') || experienceUnits.length > 0 || educationUnits.length > 0}
                    canMoveDown={false}
                    onDelete={() => handleDeleteSection('certifications', 'certifications-section')}
                    onMoveUp={() => handleMoveSection('certifications', 'certifications-section', 'up')}
                  >
                    <div style={{ marginBottom: '10px' }}>
                        <h2 style={{fontSize: '16px', fontWeight: 'bold', color: primaryColor, marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase'}}>CERTIFICATIONS</h2>
                        {certificationUnits.map((unit: ContentUnit) => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                    </div>
                  </EditableSection>
                )}

                {page.mainUnits.filter((u: ContentUnit) => u.type === 'custom-main').map((unit: ContentUnit, index: number) => {
                  const customMainUnits = page.mainUnits.filter((u: ContentUnit) => u.type === 'custom-main');
                  const isFirstCustom = index === 0;
                  const isLastCustom = index === customMainUnits.length - 1;

                  return (
                    <EditableSection 
                      key={unit.id}
                      sectionPath="/add-section"
                      navigateTo={navigateToSection}
                      canDelete={true}
                      canMoveUp={!isFirstCustom}
                      canMoveDown={!isLastCustom}
                      onDelete={() => handleDeleteSection('custom-main', unit.id)}
                      onMoveUp={() => handleMoveSection('custom-main', unit.id, 'up')}
                      onMoveDown={() => handleMoveSection('custom-main', unit.id, 'down')}
                    >
                      <div>{renderUnit(unit, resumeData, customColors)}</div>
                    </EditableSection>
                  );
                })}

                {pages.length > 1 && (
                    <div style={{position: 'absolute', bottom: '20px', right: '40px', fontSize: '12px', color: '#6b7280'}}>
                        Page {pageIndex + 1} of {pages.length}
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };