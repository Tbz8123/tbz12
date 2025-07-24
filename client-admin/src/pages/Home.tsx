import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Star, 
  ArrowRight, 
  Users, 
  Target, 
  Trophy,
  Zap,
  Eye,
  Brain,
  Rocket,
  Crown,
  Shield,
  Plus,
  Clock
} from 'lucide-react';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Define the type for a resume template from the database
interface ResumeTemplateType {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  structure: any;
  thumbnailUrl?: string | null;
  enhanced3DThumbnailUrl?: string | null;
  thumbnailType?: 'standard' | 'enhanced3d' | null;
  enhanced3DMetadata?: any | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// 3D Floating Particles Component - Optimized for mobile
const FloatingParticles = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Reduce particles on mobile for better performance
    const particleCount = isMobile ? 15 : 50;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.5),
      size: Math.random() * (isMobile ? 2 : 4) + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    let animationId: number;

    const animateParticles = () => {
      if (!particlesRef.current) return;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      });

      particlesRef.current.innerHTML = particles
        .map(p => `<div class="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400 ${isMobile ? '' : 'animate-pulse'}" 
                    style="left: ${p.x}px; top: ${p.y}px; width: ${p.size}px; height: ${p.size}px; opacity: ${p.opacity}; 
                    will-change: transform; transform: translateZ(0); ${isMobile ? '' : `box-shadow: 0 0 ${p.size * 2}px rgba(147, 51, 234, 0.3)`}"></div>`)
        .join('');

      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMobile]);

  return <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// 3D Rotating Resume Card
const RotatingResumeCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], isMobile ? [0, 0] : [30, -30]);
  const rotateY = useTransform(x, [-300, 300], isMobile ? [0, 0] : [-30, 30]);

  return (
    <motion.div
      className="relative perspective-1000"
      // Remove mouse interactions on mobile
      {...(!isMobile && {
        onMouseMove: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => {
          setIsHovered(false);
          x.set(0);
          y.set(0);
        }
      })}
      style={{
        perspective: isMobile ? 'none' : '1000px',
      }}
    >
      <motion.div
        className="relative w-96 h-[600px] transform-gpu"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {/* Front Face - ATS Template Preview */}
        <motion.div
          className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
            boxShadow: isHovered 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(147, 51, 234, 0.2)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* ATS Template Content */}
          <div className="p-4 h-full text-gray-800 text-[10px] leading-tight overflow-hidden">
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-2 mb-3">
              <h1 className="text-sm font-bold text-gray-900">JOHN PROFESSIONAL</h1>
              <p className="text-xs text-gray-700 font-medium">Senior Software Engineer</p>
              <div className="text-[9px] text-gray-600 mt-1 space-y-0.5">
                <p>john.professional@email.com | (555) 123-4567</p>
                <p>LinkedIn: linkedin.com/in/johnpro | Portfolio: johnpro.dev</p>
                <p>San Francisco, CA</p>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">PROFESSIONAL SUMMARY</h2>
              <p className="text-[9px] leading-relaxed">
                Results-driven Senior Software Engineer with 8+ years of experience developing scalable web applications. 
                Expertise in React, Node.js, and cloud technologies. Led teams of 5+ developers and delivered 20+ successful projects.
              </p>
            </div>

            {/* Technical Skills */}
            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">TECHNICAL SKILLS</h2>
              <div className="grid grid-cols-2 gap-0.5 text-[9px]">
                <div><strong>Languages:</strong> JavaScript, TypeScript, Python</div>
                <div><strong>Frontend:</strong> React, Vue.js, Angular</div>
                <div><strong>Backend:</strong> Node.js, Express, Django</div>
                <div><strong>Database:</strong> PostgreSQL, MongoDB, Redis</div>
                <div><strong>Cloud:</strong> AWS, Docker, Kubernetes</div>
                <div><strong>Tools:</strong> Git, Jenkins, Jira, Figma</div>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">PROFESSIONAL EXPERIENCE</h2>

              <div className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[9px] font-bold">Senior Software Engineer</h3>
                  <span className="text-[8px]">2021 - Present</span>
                </div>
                <p className="text-[9px] font-medium text-gray-700">TechCorp Inc. | San Francisco, CA</p>
                <ul className="text-[8px] mt-0.5 space-y-0.5 list-disc list-inside">
                  <li>Led development of microservices architecture serving 1M+ users</li>
                  <li>Improved application performance by 40% through optimization</li>
                  <li>Mentored 5 junior developers and conducted code reviews</li>
                </ul>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[9px] font-bold">Software Engineer</h3>
                  <span className="text-[8px]">2019 - 2021</span>
                </div>
                <p className="text-[9px] font-medium text-gray-700">StartupXYZ | San Francisco, CA</p>
                <ul className="text-[8px] mt-0.5 space-y-0.5 list-disc list-inside">
                  <li>Built responsive web applications using React and Node.js</li>
                  <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
                </ul>
              </div>
            </div>

            {/* Education */}
            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">EDUCATION</h2>
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-[9px] font-bold">Bachelor of Science in Computer Science</h3>
                  <p className="text-[9px] text-gray-700">University of California, Berkeley</p>
                </div>
                <span className="text-[8px]">2015 - 2019</span>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">CERTIFICATIONS</h2>
              <div className="text-[9px] space-y-0.5">
                <p>• AWS Certified Solutions Architect (2023)</p>
                <p>• Google Cloud Professional Developer (2022)</p>
              </div>
            </div>
          </div>

          {/* Floating Icons */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Sparkles className="h-6 w-6 text-purple-500" />
          </motion.div>

          {/* ATS Badge */}
          <motion.div
            className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            ATS ✓
          </motion.div>

          {/* Holographic Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-blue-500/5 rounded-2xl"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              background: [
                'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.05), transparent)',
                'linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
                'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.05), transparent)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* Back Face */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-1px)',
            opacity: isHovered ? 1 : 0,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">ATS Optimized</h3>
            <p className="text-purple-100">98% Success Rate</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Morphing Text Component
const MorphingText = ({ texts, className }: { texts: string[], className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <motion.span
      key={currentIndex}
      className={className}
      initial={{ 
        opacity: 0, 
        y: 20, 
        scale: 0.8,
        filter: 'blur(10px)'
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: 'blur(0px)'
      }}
      exit={{ 
        opacity: 0, 
        y: -20, 
        scale: 1.2,
        filter: 'blur(10px)'
      }}
      transition={{ 
        duration: 0.8,
        ease: 'easeOut'
      }}
    >
      {texts[currentIndex]}
    </motion.span>
  );
};

// Interactive Feature Cards
const FeatureCard = ({ icon, title, description, delay }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, rotateX: isMobile ? 0 : -45 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          duration: isMobile ? 0.6 : 0.8, 
          delay,
          type: 'spring',
          stiffness: 100 
        }
      }}
      whileHover={!isMobile ? {
        scale: 1.02,
        transition: { duration: 0.3 }
      } : {}}
      // Remove mouse interactions on mobile
      {...(!isMobile && {
        onHoverStart: () => setIsHovered(true),
        onHoverEnd: () => setIsHovered(false)
      })}
    >
      <motion.div 
        className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-purple-400/30 overflow-hidden h-[260px] flex flex-col"
        whileHover={{
          boxShadow: '0 20px 40px rgba(147, 51, 234, 0.2)',
          borderColor: 'rgba(147, 51, 234, 0.6)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-40" />

        {/* Icon with 3D effect */}
        <motion.div
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6"
          animate={!isMobile ? {
            rotateY: isHovered ? 180 : 0,
          } : {}}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <motion.div
            animate={!isMobile ? { rotateY: isHovered ? 180 : 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
        </motion.div>

        <h3 className="relative z-10 text-xl font-bold text-white mb-3">{title}</h3>
        <p className="relative z-10 text-gray-300 leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
};

// 3D Resume Preview Card Component
const ResumePreviewCard = ({ resume, index }: { resume: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Reduce transform intensity on mobile for better performance
  const rotateX = useTransform(y, [-100, 100], isMobile ? [5, -5] : [15, -15]);
  const rotateY = useTransform(x, [-100, 100], isMobile ? [-5, 5] : [-15, 15]);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 100, rotateY: isMobile ? 0 : -45 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        transition: { 
          duration: isMobile ? 0.5 : 0.8, 
          delay: index * (isMobile ? 0.1 : 0.15),
          type: 'spring',
          stiffness: isMobile ? 120 : 80 
        }
      }}
      // Remove all mouse interactions on mobile
      {...(!isMobile && {
        onMouseMove: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => {
          setIsHovered(false);
          x.set(0);
          y.set(0);
        }
      })}
      style={{ perspective: isMobile ? 'none' : '1000px' }}
    >
      <Link href={`/resume-builder?template=${resume.id}`}>
        <motion.div
          className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200/30 overflow-hidden cursor-pointer"
          style={{
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
            willChange: 'transform',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
          whileHover={!isMobile ? {
            scale: 1.02,
            y: -5,
            boxShadow: "0 15px 30px rgba(147, 51, 234, 0.2)",
            transition: { duration: 0.3, ease: "easeOut" }
          } : {}}
          onClick={() => {
            console.log('[Home] Template card clicked - Resume ID:', resume.id);
            console.log('[Home] Template card clicked - Template name:', resume.template);
            console.log('[Home] Navigate to URL:', `/resume-builder?template=${resume.id}`);
          }}
        >
          {/* Resume Preview - Now fills entire card */}
          <div className="aspect-[3/4] p-0 relative overflow-hidden">
            {resume.thumbnailUrl ? (
              <motion.img 
                src={resume.thumbnailUrl} 
                alt={`${resume.template} thumbnail`} 
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
                animate={!isMobile ? {
                  scale: isHovered ? 1.05 : 1,
                } : {
                  scale: 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                loading="lazy" // Add lazy loading for better performance
              />
            ) : (
              <div className="p-6 h-full">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg mb-3">
                  <h3 className="font-bold text-sm">{resume.name || 'John Professional'}</h3>
                  <p className="text-purple-100 text-xs">{resume.title || 'Software Developer'}</p>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: isMobile ? 8 : 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-sm"
                      style={{ 
                        height: '8px',
                        width: `${60 + Math.random() * 35}%`,
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                      }}
                      animate={!isMobile ? {
                        opacity: isHovered ? [0.3, 0.8, 0.3] : 0.5,
                        scale: isHovered ? [1, 1.02, 1] : 1,
                      } : {
                        opacity: 0.5,
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: isHovered && !isMobile ? Infinity : 0,
                        ease: 'easeInOut'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Floating Status Indicator - Simplified on mobile */}
            <motion.div
              className="absolute top-4 right-4"
              animate={!isMobile ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0]
              } : {}}
              transition={{
                duration: 3,
                repeat: !isMobile ? Infinity : 0,
                ease: 'easeInOut'
              }}
            >
              <div className={`w-3 h-3 rounded-full ${
                resume.status === 'completed' ? 'bg-green-400' : 
                resume.status === 'draft' ? 'bg-yellow-400' : 'bg-blue-400'
              } shadow-lg`} />
            </motion.div>

            {/* Template Name Overlay on Hover */}
            <motion.div
              className="absolute bottom-4 left-4 right-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: (isHovered && !isMobile) ? 1 : 0, 
                y: (isHovered && !isMobile) ? 0 : 20 
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                <h4 className="font-semibold text-sm">{resume.template || 'Professional Template'}</h4>
                <p className="text-xs text-gray-300">
                  Click to edit this template
                </p>
              </div>
            </motion.div>

            {/* Holographic Overlay - Simplified on mobile */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-blue-500/5 rounded-2xl pointer-events-none"
              animate={!isMobile ? {
                opacity: isHovered ? [0.2, 0.6, 0.2] : 0.1,
                background: isHovered ? [
                  'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent)',
                  'linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                  'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent)'
                ] : 'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.05), transparent)'
              } : {
                opacity: 0.1,
              }}
              transition={{
                duration: 3,
                repeat: isHovered && !isMobile ? Infinity : 0,
                ease: 'easeInOut'
              }}
            />
          </div>

          {/* Particle Effect on Hover - Disabled on mobile */}
          {isHovered && !isMobile && (
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    willChange: 'transform, opacity',
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    opacity: [1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Parallax effects - Reduce on mobile for better performance
  const y1 = useTransform(springScrollY, [0, 1], [0, isMobile ? -50 : -200]);
  const y2 = useTransform(springScrollY, [0, 1], [0, isMobile ? -25 : -100]);
  const opacity = useTransform(springScrollY, [0, 0.3, 0.7, 1], [1, 0.8, 0.3, 0]);

  // Fetch real templates from database
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery<ResumeTemplateType[]>({
    queryKey: ['/api/templates'],
    queryFn: async () => {
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  // Map templates to user resume cards with realistic data
  const userResumes = templates.slice(0, 4).map((template: any, index: number) => {
    // Get the appropriate thumbnail URL
    const thumbnailUrl = template.thumbnailType === 'enhanced3d' && template.enhanced3DThumbnailUrl 
                        ? template.enhanced3DThumbnailUrl 
                        : template.thumbnailUrl;

    const statusOptions = ['completed', 'draft', 'in-progress'];
    const timeOptions = ['2 days ago', '1 week ago', '3 days ago', '5 hours ago'];
    const titleOptions = ['Senior Frontend Developer', 'Full Stack Engineer', 'Project Manager', 'UI/UX Designer'];

    return {
      id: template.id,
      name: 'John Professional',
      title: titleOptions[index] || 'Software Developer',
      template: template.name,
      status: statusOptions[index % statusOptions.length],
      lastUpdated: timeOptions[index] || '1 day ago',
      thumbnailUrl: thumbnailUrl || null // Use the actual template thumbnail
    };
  });

  // Debug logging for templates and userResumes
  console.log('[Home] Templates loaded:', templates.length);
  console.log('[Home] Templates:', templates.map((t: any) => ({ id: t.id, name: t.name })));
  console.log('[Home] UserResumes created:', userResumes.map((r: any) => ({ id: r.id, template: r.template })));

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add scroll listener for advanced effects - Disable on mobile
    // const handleScroll = () => {
    //   if (isMobile) return; // Skip expensive scroll effects on mobile

    //   const scrolled = window.scrollY;
    //   const rate = scrolled * -0.5;

    //   if (containerRef.current) {
    //     containerRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
    //   }
    // };

    // if (!isMobile) {
    //   window.addEventListener('scroll', handleScroll, { passive: true });
    // }

    // return () => {
    //   if (!isMobile) {
    //     window.removeEventListener('scroll', handleScroll);
    //   }
    // };
  }, [isMobile]);

  const heroVariants = {
    hidden: { opacity: 0, scale: isMobile ? 1 : 0.8, rotateX: isMobile ? 0 : -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: isMobile ? 0.8 : 1.2,
        ease: 'easeOut',
        staggerChildren: isMobile ? 0.1 : 0.2
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50, z: isMobile ? 0 : -100 },
    visible: {
      opacity: 1,
      y: 0,
      z: 0,
      transition: {
        duration: isMobile ? 0.6 : 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Floating Particles Background - Desktop only */}
      {!isMobile && <FloatingParticles />}

      {/* Animated Grid Background - Simplified on mobile */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] ${isMobile ? '' : 'animate-pulse'}`} />
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="flex items-center justify-center px-4 pt-48 pb-32 text-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: isMobile ? 1 : opacity }}
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              className="text-center lg:text-left space-y-8"
              variants={textVariants}
              style={{ y: isMobile ? 0 : y1 }}
            >
              {/* Animated Title */}
              <motion.h1
                className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white text-center"
                variants={textVariants}
              >
                <motion.span
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  animate={!isMobile ? {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: !isMobile ? Infinity : 0,
                    ease: 'linear'
                  }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                >
                  Build Your
                </motion.span>

                <motion.span className="block text-white mt-2">
                  <MorphingText 
                    texts={['Dream Career', 'Perfect Resume', 'Future Success']}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                  />
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                variants={textVariants}
              >
                Experience the future of resume building with our 
                <span className="text-purple-400 font-semibold"> revolutionary AI-powered platform</span> that creates stunning, ATS-optimized resumes in minutes.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center"
                variants={textVariants}
              >
                <Link href="/package-selection">
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="overflow-hidden rounded-3xl"
                  >
                    <Button 
                      size="lg" 
                      className="relative group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 text-lg font-bold rounded-3xl border-0 overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        animate={{
                          x: [-100, 100],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                      <span className="relative flex items-center gap-2">
                        Create Your Resume
                        <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/templates">
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="overflow-hidden rounded-3xl"
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-4 text-lg font-bold rounded-3xl backdrop-blur-sm overflow-hidden"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Explore Templates
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 pt-8"
                variants={textVariants}
              >
                {[
                  { icon: Users, value: '100K+', label: 'Users' },
                  { icon: FileText, value: '500K+', label: 'Resumes' },
                  { icon: Trophy, value: '98%', label: 'Success Rate' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <stat.icon className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - 3D Resume */}
            <motion.div
              className="flex justify-center lg:justify-end"
              variants={textVariants}
              style={{ y: y2 }}
            >
              <RotatingResumeCard />
            </motion.div>
          </div>
        </motion.section>

        {/* User Resumes Section */}
        <motion.section
          className="pt-16 pb-8 px-4 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Your Resume Portfolio
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Manage and customize your professional resumes with our intuitive platform
              </p>
            </motion.div>

            {/* Resume Templates Grid */}
            {isLoadingTemplates ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/30 animate-pulse"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="h-48 bg-gray-300/20 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300/20 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300/20 rounded w-2/3"></div>
                  </motion.div>
                ))}
              </div>
            ) : userResumes && userResumes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userResumes.slice(0, 6).map((resume, index) => (
                  <ResumePreviewCard 
                    key={resume.id}
                    resume={resume}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              // No templates available
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.5 : 0.8 }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md mx-auto border border-purple-400/30">
                  <FileText className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Templates Available</h3>
                  <p className="text-gray-300 mb-6">Templates are being loaded or none have been created yet.</p>
                  <Link href="/admin/templates">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      Manage Templates
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Create New Resume Button - Only show if we have templates */}
            {!isLoadingTemplates && userResumes.length > 0 && (
              <motion.div
                className="flex justify-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/package-selection">
                  <motion.div
                    className="group relative overflow-hidden rounded-3xl"
                    whileHover={{ 
                      scale: 1.02
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-500 hover:via-pink-400 hover:to-blue-500 text-white px-12 py-6 text-xl font-bold rounded-3xl border-0 overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                        animate={{
                          x: [-100, 300],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                      <span className="relative flex items-center gap-3">
                        <Plus className="h-6 w-6" />
                        Create New Resume
                        <Sparkles className="h-6 w-6 group-hover:animate-spin" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="pt-16 pb-8 px-4 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Revolutionary Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience cutting-edge technology that transforms how you create professional resumes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="h-8 w-8 text-white" />,
                  title: 'AI-Powered Writing',
                  description: 'Our advanced AI analyzes your experience and crafts compelling, industry-specific content that makes you stand out.'
                },
                {
                  icon: <Target className="h-8 w-8 text-white" />,
                  title: 'ATS Optimization',
                  description: 'Built-in ATS scanner ensures your resume passes through applicant tracking systems with 98% success rate.'
                },
                {
                  icon: <Zap className="h-8 w-8 text-white" />,
                  title: 'Real-time Preview',
                  description: 'See your resume transform instantly as you type with our lightning-fast real-time preview technology.'
                },
                {
                  icon: <Crown className="h-8 w-8 text-white" />,
                  title: 'Premium Templates',
                  description: 'Choose from 100+ professionally designed templates crafted by top designers and career experts.'
                },
                {
                  icon: <Shield className="h-8 w-8 text-white" />,
                  title: 'Data Security',
                  description: 'Your personal information is protected with enterprise-grade encryption and privacy controls.'
                },
                {
                  icon: <Download className="h-8 w-8 text-white" />,
                  title: 'Multiple Formats',
                  description: 'Export your resume in PDF, DOCX, or plain text formats optimized for different use cases.'
                }
              ].map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          className="pt-16 pb-16 px-4 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
              <motion.span
                className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-full text-cyan-300 text-sm font-semibold mb-6 border border-cyan-400/30"
                whileHover={{ scale: 1.05 }}
              >
                🚀 Simple Process
              </motion.span>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                How It Works
                <br />
                <MorphingText 
                  texts={["In 3 Easy Steps", "Quick & Simple", "Fast & Efficient", "Effortlessly"]}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400"
                />
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Create your professional resume in minutes with our intuitive, AI-powered platform
              </p>
            </motion.div>

            {/* Steps Grid */}
            <motion.div
              className="grid md:grid-cols-3 gap-12 mb-16"
              initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
              {[
                {
                  step: "01",
                  title: "Choose Template",
                  description: "Select from our collection of ATS-optimized, professionally designed templates that match your industry and style.",
                  icon: <FileText className="h-12 w-12" />,
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "02", 
                  title: "Add Your Details",
                  description: "Fill in your information with our smart forms. Our AI assistant helps you write compelling content that stands out.",
                  icon: <Brain className="h-12 w-12" />,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "03",
                  title: "Download & Apply",
                  description: "Export your polished resume in multiple formats (PDF, DOCX) and start applying to your dream jobs immediately.",
                  icon: <Download className="h-12 w-12" />,
                  color: "from-green-500 to-emerald-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Step Number */}
                  <motion.div
                    className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.step}
                  </motion.div>

                  {/* Card */}
              <motion.div
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/30 h-full"
                    whileHover={{
                      boxShadow: '0 20px 40px rgba(147, 51, 234, 0.2)',
                      borderColor: 'rgba(147, 51, 234, 0.6)'
                    }}
                  >
                    {/* Icon */}
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      {step.icon}
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-center">{step.description}</p>
                  </motion.div>

                  {/* Connecting Arrow (except for last item) */}
                  {index < 2 && (
                    <motion.div
                      className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2"
                      animate={{
                        x: [0, 10, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="h-8 w-8 text-purple-400" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              >
              <p className="text-gray-300 mb-8 text-lg">
                Ready to get started? It only takes 5 minutes!
              </p>
                <Link href="/package-selection">
                  <motion.div
                  whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  className="overflow-hidden rounded-3xl inline-block"
                  >
                    <Button 
                      size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-12 py-6 text-xl font-bold rounded-3xl border-0"
                    >
                      Start Building Now
                    <Rocket className="h-6 w-6 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
