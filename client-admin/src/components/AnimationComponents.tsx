
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp';
  delay?: number;
  className?: string;
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  className 
}) => {
  const animationConfig = animations[animation];
  
  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={{ ...animationConfig.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
