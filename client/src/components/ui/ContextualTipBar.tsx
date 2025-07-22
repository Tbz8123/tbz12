import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Users, Zap, Target, CheckCircle } from 'lucide-react';

const tips = [
  {
    icon: Lightbulb,
    title: "Profile Section",
    content: "Your profile section should fit above the fold on one page. Keep it under 150 words for maximum impact.",
    category: "content"
  },
  {
    icon: TrendingUp,
    title: "Action Verbs",
    content: "Use action verbs to describe your accomplishments in experience bullet points. Start with words like 'Led', 'Developed', 'Implemented'.",
    category: "writing"
  },
  {
    icon: Target,
    title: "Quantify Results",
    content: "Quantify your achievements whenever possible (e.g., 'Increased sales by 15%', 'Managed team of 8 developers').",
    category: "metrics"
  },
  {
    icon: Users,
    title: "Tailor Content",
    content: "Tailor your resume for each job application, highlighting relevant skills and experiences that match the job description.",
    category: "strategy"
  },
  {
    icon: CheckCircle,
    title: "Proofread Carefully",
    content: "Proofread carefully! Typos can make a bad first impression. Use tools like Grammarly or ask someone to review.",
    category: "quality"
  },
  {
    icon: Zap,
    title: "Keywords Matter",
    content: "Include industry-specific keywords from the job posting to help your resume pass ATS (Applicant Tracking Systems).",
    category: "ats"
  }
];

const ContextualTipBar: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const intervalId = setInterval(() => {
      setAnimateOut(true); 
      setProgress(0); // Reset progress

      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setAnimateOut(false); 
      }, 300); 
    }, 6000); 

    return () => clearInterval(intervalId);
  }, [isVisible]);

  // Progress bar animation
  useEffect(() => {
    if (!isVisible || animateOut) return;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 60); // 60 updates over 6 seconds
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [currentTipIndex, isVisible, animateOut]);

  const currentTip = tips[currentTipIndex];
  const IconComponent = currentTip.icon;

  const categoryColors = {
    content: 'from-blue-500 to-cyan-500',
    writing: 'from-purple-500 to-pink-500',
    metrics: 'from-green-500 to-emerald-500',
    strategy: 'from-orange-500 to-red-500',
    quality: 'from-indigo-500 to-purple-500',
    ats: 'from-yellow-500 to-orange-500'
  };

  const currentGradient = categoryColors[currentTip.category as keyof typeof categoryColors] || 'from-purple-500 to-blue-500';

  return (
    <motion.div
      className={`
        relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden
        transition-all duration-500 ease-out mb-2 h-32
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}
      `}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className={`h-full bg-gradient-to-r ${currentGradient} rounded-full`}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <div className="p-4 h-full flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 h-full"
          >
            {/* Icon */}
            <motion.div
              className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${currentGradient}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <IconComponent className="w-4 h-4 text-white" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <motion.div
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h4 className="text-sm font-semibold text-white">
                  {currentTip.title}
                </h4>
                <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${currentGradient} text-white font-medium`}>
                  Pro Tip
                </span>
              </motion.div>

              <motion.p
                className="text-sm text-white/80 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentTip.content}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: '50%',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ContextualTipBar; 