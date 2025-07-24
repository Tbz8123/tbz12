import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProgressStepper from '@/components/ProgressStepper';
import { useResumeStore } from '@/stores/resumeStore';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';

const FloatingParticles = () => {
    const particles = Array.from({ length: 20 });
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
};

const AddSectionPage = () => {
  const [, setLocation] = useLocation();
  const resumeData = useResumeStore((state) => state.resumeData);
  const getProTemplateById = useResumeStore((state) => state.getProTemplateById);
  const activeProTemplateId = useResumeStore((state) => state.activeProTemplateId);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [sections, _setSections] = useState({
    personalDetails: false,
    websites: false,
    certifications: false,
    languages: false,
    software: false,
    accomplishments: false,
    additionalInfo: false,
    affiliations: false,
    interests: false,
    hobbies: false,
  });

  const [hobbiesValue, setHobbiesValue] = useState('');

  const handleSectionClick = (section: keyof typeof sections) => {
    const sectionPath = section.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    setLocation(`/section/${sectionPath}`);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07 
      }
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const activeProTemplate = activeProTemplateId ? getProTemplateById(activeProTemplateId) : null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <FloatingParticles />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <main className="relative z-10 pt-32 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.button 
            onClick={() => setLocation('/professional-summary')}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-all hover:-translate-x-1 duration-300 text-sm font-medium mb-10"
            variants={itemVariants}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </motion.button>

          <ProgressStepper currentStep={5} />

          <div className="grid grid-cols-1 mt-10">
            <div className="lg:col-span-2">
              <motion.h1 
                className="text-4xl font-bold text-white mb-2"
                variants={itemVariants}
              >
                Do you have anything else to add?
              </motion.h1>
              <motion.p 
                className="text-gray-300 mb-10"
                variants={itemVariants}
              >
                These sections are optional.
              </motion.p>

              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                {Object.keys(sections).map((key) => {
                  const sectionKey = key as keyof typeof sections;
                  const labels: Record<keyof typeof sections, string> = {
                    personalDetails: 'Personal Details',
                    websites: 'Websites, Portfolios, Profiles',
                    certifications: 'Certifications',
                    languages: 'Languages',
                    software: 'Software',
                    accomplishments: 'Accomplishments',
                    additionalInfo: 'Additional Information',
                    affiliations: 'Affiliations',
                    interests: 'Interests',
                    hobbies: 'Hobbies'
                  };

                  return (
                    <motion.div 
                      key={key} 
                      variants={itemVariants}
                      onClick={() => handleSectionClick(sectionKey)}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <label className="flex items-center text-lg text-gray-200 cursor-pointer">
                        <div className="w-6 h-6 rounded border-2 border-purple-400/50 flex items-center justify-center mr-4">
                          {/* Placeholder for checkmark */}
                        </div>
                        <span className="flex-grow">{labels[sectionKey]}</span>
                        {sectionKey === 'languages' && (
                          <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-2 py-1 rounded-md ml-2">
                            New!
                          </span>
                        )}
                      </label>
                      {sectionKey === 'hobbies' && (
                         <div className="mt-4 ml-10">
                           <input
                             type="text"
                             placeholder="Add a custom section like 'Hobbies'"
                             className="w-full bg-transparent border-b-2 border-purple-400/30 focus:border-purple-400 text-white placeholder-gray-400 outline-none transition-colors"
                             value={hobbiesValue}
                             onChange={(e) => setHobbiesValue(e.target.value)}
                             onClick={(e) => e.stopPropagation()} // Prevent card click
                           />
                         </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <motion.div 
            className="flex justify-end items-center mt-16 space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              className="text-purple-400 hover:text-purple-300 border border-purple-400 hover:border-purple-300 font-medium rounded-full px-8 py-2.5 text-base transition-colors duration-300 hover:bg-purple-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPreviewModalOpen(true)}
            >
              Preview
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-10 py-2.5 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocation('/review')}
            >
              Next
            </motion.button>
          </motion.div>
        </div>
      </main>

      {isPreviewModalOpen && (
        <ResumePreviewModal 
          isOpen={isPreviewModalOpen} 
          onClose={() => setIsPreviewModalOpen(false)} 
          resumeData={resumeData}
          templateCode={activeProTemplate?.code || ''}
        />
      )}
    </motion.div>
  );
};

export default AddSectionPage;