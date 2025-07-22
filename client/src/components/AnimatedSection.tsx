import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp';
  className?: string;
  [key: string]: any;
}

interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
  animation?: 'fadeIn' | 'fadeInUp';
  className?: string;
  [key: string]: any;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  animation = 'fadeIn', 
  className = '', 
  ...props 
}) => {
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

  const animationConfig = animations[animation] || animations.fadeIn;

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={animationConfig.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedItem: React.FC<AnimatedItemProps> = ({ 
  children, 
  delay = 0, 
  animation = 'fadeInUp', 
  className = '', 
  ...props 
}) => {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay }
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay }
    }
  };

  const animationConfig = animations[animation] || animations.fadeInUp;

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={animationConfig.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}; 