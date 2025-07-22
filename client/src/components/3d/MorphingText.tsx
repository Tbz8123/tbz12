import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { morphingTextVariants } from './variants';

interface MorphingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export const MorphingText = ({ 
  texts, 
  className = "",
  interval = 3000 
}: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [texts.length, interval]);

  return (
    <motion.span
      key={currentIndex}
      className={className}
      initial={morphingTextVariants.initial}
      animate={morphingTextVariants.animate}
      exit={morphingTextVariants.exit}
      transition={morphingTextVariants.transition}
    >
      {texts[currentIndex]}
    </motion.span>
  );
};