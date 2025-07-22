import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, User, Briefcase, GraduationCap, Award, Settings, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressStepper from '@/components/ProgressStepper';

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

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle}
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



const WhyNeedResumePage = () => {
  const [, setLocation] = useLocation();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleBack = () => {
    setLocation('/personal-information');
  };

  const handleSkip = () => {
    setLocation('/education');
  };

  const handleNext = () => {
    if (selectedReason) {
      setLocation('/work-experience-details');
    }
  };

  const reasons = [
    { id: 'job-seeking', label: 'Job Seeking' },
    { id: 'different-reason', label: 'A Different Reason' }
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      {!isMobile && <FloatingParticles />}

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] ${isMobile ? '' : 'animate-pulse'}`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-32 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Back Button */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button 
              onClick={handleBack}
              className="flex items-center text-purple-400 font-semibold hover:text-purple-300 transition-colors group"
              whileHover={{ x: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ArrowLeft size={18} className="mr-2 group-hover:animate-bounce" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Progress Stepper */}
          <ProgressStepper currentStep={2} />

          {/* Main Content */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight"
              style={{
                background: 'linear-gradient(-45deg, #ffffff, #a855f7, #3b82f6, #ffffff)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Why do you need a resume?
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              We'll show you a personalized experience based on your response.
            </motion.p>
          </motion.div>

          {/* Option Buttons */}
          <motion.div 
            className="flex justify-center gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {reasons.map((reason, index) => (
              <motion.button
                key={reason.id}
                className={`rounded-3xl py-8 px-20 transition-all text-lg font-medium border-2 backdrop-blur-xl shadow-2xl ${
                  selectedReason === reason.id 
                    ? 'border-purple-400 bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/40 hover:shadow-white/10'
                }`}
                onClick={() => setSelectedReason(reason.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {reason.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div 
            className="flex justify-end items-center mt-8 space-x-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.button 
              onClick={handleSkip}
              className="text-purple-400 hover:text-purple-300 border border-purple-400 hover:border-purple-300 font-medium rounded-full px-8 py-2.5 text-base transition-colors duration-300 hover:bg-purple-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skip for now
            </motion.button>
            <motion.button 
              onClick={handleNext}
              disabled={!selectedReason}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-10 py-2.5 text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              whileHover={{ scale: selectedReason ? 1.05 : 1 }}
              whileTap={{ scale: selectedReason ? 0.95 : 1 }}
            >
              Next: Work Experience
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WhyNeedResumePage; 