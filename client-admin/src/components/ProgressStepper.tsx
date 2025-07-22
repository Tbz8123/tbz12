import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface Step {
  id: number;
  name: string;
  route: string;
  status: 'completed' | 'current' | 'upcoming';
  isAccessible: boolean;
}

interface ProgressStepperProps {
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const [, setLocation] = useLocation();
  const [maxStepReached, setMaxStepReached] = useState(() => {
    const saved = localStorage.getItem('maxStepReached');
    const savedStep = saved ? parseInt(saved, 10) : 1;
    // Return the maximum of saved step and current step
    // Temporary override: set to 6 for testing
    return Math.max(savedStep, currentStep, 6);
  });

  // Update max step reached when current step increases OR when component mounts
  useEffect(() => {
    const newMaxStep = Math.max(maxStepReached, currentStep);
    if (newMaxStep > maxStepReached) {
      setMaxStepReached(newMaxStep);
      localStorage.setItem('maxStepReached', newMaxStep.toString());
    }
  }, [currentStep, maxStepReached]);

  // Debug logging
  useEffect(() => {
    console.log('ProgressStepper Debug:', {
      currentStep,
      maxStepReached,
      savedInStorage: localStorage.getItem('maxStepReached')
    });
  }, [currentStep, maxStepReached]);

  const steps: Step[] = [
    { 
      id: 1, 
      name: 'Personal Info', 
      route: '/personal-information', 
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming',
      isAccessible: maxStepReached >= 1
    },
    { 
      id: 2, 
      name: 'Work History', 
      route: '/work-history-summary', 
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming',
      isAccessible: maxStepReached >= 2
    },
    { 
      id: 3, 
      name: 'Education', 
      route: '/education-summary', 
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming',
      isAccessible: maxStepReached >= 3
    },
    { 
      id: 4, 
      name: 'Skills', 
      route: '/skills-summary', 
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming',
      isAccessible: maxStepReached >= 4
    },
    { 
      id: 5, 
      name: 'Summary', 
      route: '/professional-summary', 
      status: currentStep > 5 ? 'completed' : currentStep === 5 ? 'current' : 'upcoming',
      isAccessible: maxStepReached >= 5
    },
    { 
      id: 6, 
      name: 'Review', 
      route: '/final', 
      status: currentStep > 6 ? 'completed' : currentStep === 6 ? 'current' : 'upcoming',
      isAccessible: maxStepReached >= 6
    },
  ];

  const handleStepClick = (step: Step) => {
    console.log('Step clicked:', {
      stepId: step.id,
      stepName: step.name,
      isAccessible: step.isAccessible,
      maxStepReached,
      currentStep,
      route: step.route
    });

    if (step.isAccessible) {
      console.log('Navigating to:', step.route);
      setLocation(step.route);
    } else {
      console.log('Step not accessible');
    }
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div 
                className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                  step.status === 'completed' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : step.status === 'current'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : step.isAccessible
                    ? 'bg-gray-500 text-white hover:bg-gray-400'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                whileHover={step.isAccessible ? { scale: 1.1 } : {}}
                onClick={() => handleStepClick(step)}
              >
                {step.status === 'completed' ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <span className="text-xs font-bold">{step.id}</span>
                )}
              </motion.div>

              <motion.p 
                className={`text-xs mt-2 text-center transition-colors ${
                  step.status === 'current' 
                    ? 'text-purple-300 font-semibold cursor-pointer' 
                    : step.status === 'completed'
                    ? 'text-green-300 font-medium cursor-pointer'
                    : step.isAccessible
                    ? 'text-white/80 cursor-pointer hover:text-white'
                    : 'text-white/60 cursor-not-allowed'
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => handleStepClick(step)}
              >
                {step.name}
              </motion.p>
            </div>

            {index < steps.length - 1 && (
              <motion.div 
                className={`w-24 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-600'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressStepper; 