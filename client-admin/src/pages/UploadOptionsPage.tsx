import React from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, FileUp, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UploadOptionsPage = () => {
  const [, setLocation] = useLocation();
  const [selectedOption, setSelectedOption] = React.useState<'upload' | 'scratch' | null>(null);

  // Function to handle going back
  const handleBack = () => {
    setLocation('/templates');
  };

  // Function to handle next step
  const handleNext = () => {
    if (selectedOption === 'upload') {
      setLocation('/upload-resume');
    } else if (selectedOption === 'scratch') {
      setLocation('/personal-information');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-16 max-w-5xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold flex items-center justify-center mr-2 shadow-lg">
              2
            </div>
            <span className="text-sm text-gray-300 font-medium">Step 2 of 3 • Resume Pro Suite</span>
          </motion.div>

          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-4 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'linear-gradient(-45deg, #ffffff, #a855f7, #3b82f6, #ffffff)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Are you uploading an existing resume?
          </motion.h1>

          <motion.p 
            className="text-gray-300 text-base max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Just review, edit, and update it with new information
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Upload option */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div 
              className={`bg-white/10 backdrop-blur-lg border rounded-xl p-8 h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20
                ${selectedOption === 'upload' 
                  ? 'border-purple-400 border-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 shadow-2xl shadow-purple-500/25' 
                  : 'border-white/20 hover:border-purple-400'
                }`}
              onClick={() => setSelectedOption('upload')}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Recommended tag */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg">
                Recommended option to save you time
              </div>

              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <div className="relative">
                  <motion.div 
                    className="w-12 h-14 border-2 border-purple-400 rounded-md flex items-center justify-center bg-white/10 backdrop-blur-sm"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileUp size={24} className="text-purple-300" />
                  </motion.div>
                  <div className="absolute -right-2 -bottom-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-1 rounded-full shadow-lg">
                    <ArrowLeft size={12} className="transform rotate-180" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 text-center">Yes, upload from my resume</h3>
              <p className="text-gray-300 text-center text-sm leading-relaxed">
                We'll give you expert guidance to fill out your info and enhance your resume, from start to finish
              </p>
            </motion.div>
          </motion.div>

          {/* Start from scratch option */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div 
              className={`bg-white/10 backdrop-blur-lg border rounded-xl p-8 h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20
                ${selectedOption === 'scratch' 
                  ? 'border-purple-400 border-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 shadow-2xl shadow-purple-500/25' 
                  : 'border-white/20 hover:border-purple-400'
                }`}
              onClick={() => setSelectedOption('scratch')}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <div className="relative">
                  <motion.div 
                    className="w-12 h-14 border-2 border-purple-400 rounded-md flex items-center justify-center bg-white/10 backdrop-blur-sm"
                    whileHover={{ rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pencil size={20} className="text-purple-300" />
                  </motion.div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 text-center">No, start from scratch</h3>
              <p className="text-gray-300 text-center text-sm leading-relaxed">
                We'll guide you through the whole process so your skills can shine
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <motion.div 
          className="flex justify-between mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-6 py-3"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <Button 
            onClick={handleNext}
            disabled={!selectedOption}
            className={`px-8 py-3 font-medium transition-all duration-300 ${
              !selectedOption 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl border-0'
            }`}
          >
            Next
          </Button>
        </motion.div>

        {/* Terms text */}
        <motion.div 
          className="text-center text-sm text-gray-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          By clicking Next, you agree to our{' '}
          <Link href="/terms" className="text-purple-300 hover:text-purple-200 hover:underline transition-colors">
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-purple-300 hover:text-purple-200 hover:underline transition-colors">
            Privacy Policy
          </Link>.
        </motion.div>
      </main>
    </div>
  );
};

export default UploadOptionsPage; 