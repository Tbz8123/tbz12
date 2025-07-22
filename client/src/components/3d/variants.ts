// 3D Animation Variants
// Framer Motion Animation Configurations

export const heroVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      staggerChildren: 0.2
    }
  }
};

export const textVariants = {
  hidden: { opacity: 0, y: 50, z: -100 },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
};

export const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -45 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      type: 'spring',
      stiffness: 100
    }
  },
  hover: {
    y: -20,
    rotateY: 10,
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)',
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const particleVariants = {
  burst: {
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    opacity: [1, 0],
    scale: [0, 1, 0],
    transition: {
      duration: 1.5,
      ease: 'easeOut'
    }
  }
};

export const morphingTextVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.8,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.2,
    filter: 'blur(10px)'
  },
  transition: {
    duration: 0.8,
    ease: 'easeOut'
  }
};

export const holographicVariants = {
  animate: {
    background: [
      'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent)',
      'linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
      'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent)'
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const glowVariants = {
  animate: {
    opacity: [0.3, 0.7, 0.3],
    scale: [1, 1.05, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}; 

