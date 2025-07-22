import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from './variants';
import { ANIMATION_CONFIG } from './constants';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={cardVariants.hidden}
      whileInView={{ 
        ...cardVariants.visible,
        transition: { 
          ...cardVariants.visible.transition,
          delay
        }
      }}
      whileHover={cardVariants.hover}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-purple-200/50 overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: ANIMATION_CONFIG.durations.fast }}
        />

        {/* Icon with 3D effect */}
        <motion.div
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6"
          animate={{
            rotateY: isHovered ? 180 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            animate={{ rotateY: isHovered ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
        </motion.div>

        <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="relative z-10 text-gray-600 leading-relaxed">{description}</p>

        {/* Particle Effect on Hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: ANIMATION_CONFIG.particles.burst.count }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-500 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: [1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: ANIMATION_CONFIG.particles.burst.duration,
                  delay: i * 0.05,
                  ease: 'easeOut'
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}; 

