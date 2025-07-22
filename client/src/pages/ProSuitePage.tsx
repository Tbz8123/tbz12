import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

type ExperienceOption = {
  id: string;
  label: string;
  value: string;
};

type EducationOption = {
  id: string;
  label: string;
  value: string;
};

const ProSuitePage = () => {
  const [_, setLocation] = useLocation();
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState<boolean | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);

  const experienceOptions: ExperienceOption[] = [
    { id: "no-experience", label: "No Experience", value: "no_experience" },
    { id: "less-than-3", label: "Less Than 3 Years", value: "less_than_3" },
    { id: "3-5-years", label: "3-5 Years", value: "3_5_years" },
    { id: "5-10-years", label: "5-10 Years", value: "5_10_years" },
    { id: "10-plus", label: "10+ Years", value: "10_plus_years" },
  ];

  const educationOptions: EducationOption[] = [
    { id: "secondary", label: "Secondary School", value: "secondary_school" },
    { id: "vocational", label: "Vocational Certificate or Diploma", value: "vocational" },
    { id: "apprenticeship", label: "Apprenticeship or Internship Training", value: "apprenticeship" },
    { id: "associates", label: "Associates", value: "associates" },
    { id: "bachelors", label: "Bachelors", value: "bachelors" },
    { id: "masters", label: "Masters", value: "masters" },
    { id: "doctorate", label: "Doctorate or Ph.D.", value: "doctorate" },
  ];

  const handleExperienceSelect = (experienceOption: ExperienceOption) => {
    setSelectedExperience(experienceOption.value);

    // For all experience levels except "No Experience", go directly to templates
    if (experienceOption.value !== "no_experience") {
      console.log(`Selected experience level: ${experienceOption.value}`);
      setTimeout(() => {
        setLocation(`/templates?experience=${experienceOption.value}&selection=${encodeURIComponent(experienceOption.label)}`);
      }, 500);
    }
    // For "No Experience", we'll wait for the student question to be answered
  };

  const handleStudentSelect = (isStudentVal: boolean) => {
    setIsStudent(isStudentVal);

    if (!isStudentVal) {
      // If not a student, proceed to templates immediately
      console.log(`Not a student, experience: ${selectedExperience}`);
      setTimeout(() => {
        setLocation(`/templates?experience=${selectedExperience}&selection=${encodeURIComponent("No Experience")}`);
      }, 500);
    }
    // If they are a student, they'll need to pick an education level
  };

  const handleEducationSelect = (educationOption: EducationOption) => {
    setSelectedEducation(educationOption.value);
    console.log(`Selected education: ${educationOption.value}, experience: ${selectedExperience}`);
    setTimeout(() => {
      // Go to templates with both experience and education parameters
      setLocation(`/templates?experience=${selectedExperience}&education=${educationOption.value}&selection=${encodeURIComponent(educationOption.label)}`);
    }, 500);
  };

  const skipEducation = () => {
    console.log(`Skipping education question, experience: ${selectedExperience}`);
    setTimeout(() => {
      setLocation(`/templates?experience=${selectedExperience}&selection=${encodeURIComponent("No Experience")}`);
    }, 300);
  };

  // Determine if different sections should be visible or not
  const showStudentSection = selectedExperience === "no_experience";
  const showEducationSection = selectedExperience === "no_experience" && isStudent === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-5xl w-full mx-auto">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <motion.div 
              className="inline-flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold flex items-center justify-center mr-2 shadow-lg">
                1
              </div>
              <span className="text-sm text-gray-300 font-medium">Step 1 of 3 • Resume Pro Suite</span>
            </motion.div>

            <motion.h1 
              className="text-2xl md:text-3xl font-bold mb-3 text-white leading-tight"
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
              How long have you been working?
            </motion.h1>

            <motion.p 
              className="text-base text-gray-300 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              We'll find the best premium templates for your experience level.
            </motion.p>
          </motion.div>

          {/* Experience Options */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
              {experienceOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <motion.button
                    className={`w-full h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-center transition-all duration-50 shadow-lg hover:shadow-2xl
                      ${selectedExperience === option.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-2xl ring-2 ring-purple-500/50 scale-105'
                        : 'text-white hover:bg-white/20 hover:border-white/40 hover:scale-105'
                      }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExperienceSelect(option)}
                  >
                    <span className="block font-semibold text-sm px-2">{option.label}</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Student Question - Shown if No Experience is selected */}
          {showStudentSection && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2 text-white">Are you a student?</h2>
              </div>

              <div className="flex justify-center gap-4 max-w-sm mx-auto">
                <motion.button
                  className={`flex-1 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-center transition-all duration-50 shadow-lg hover:shadow-2xl
                    ${isStudent === true
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-2xl scale-105'
                      : 'text-white hover:bg-white/20 hover:border-white/40 hover:scale-105'
                    }`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStudentSelect(true)}
                >
                  <span className="block font-semibold text-base">Yes</span>
                </motion.button>

                <motion.button
                  className={`flex-1 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-center transition-all duration-50 shadow-lg hover:shadow-2xl
                    ${isStudent === false
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-2xl scale-105'
                      : 'text-white hover:bg-white/20 hover:border-white/40 hover:scale-105'
                    }`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStudentSelect(false)}
                >
                  <span className="block font-semibold text-base">No</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Education Options - Shown if student = true */}
          {showEducationSection && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2 text-white">Select your education level</h2>
                <p className="text-base text-gray-300 max-w-2xl mx-auto">Your education background helps us guide you through relevant sections for your resume.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto mb-4">
                {educationOptions.slice(0, 6).map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <motion.button
                      className={`w-full h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-center transition-all duration-50 shadow-lg hover:shadow-2xl
                        ${selectedEducation === option.value
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-2xl scale-105'
                          : 'text-white hover:bg-white/20 hover:border-white/40 hover:scale-105'
                        }`}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEducationSelect(option)}
                    >
                      <span className="block font-semibold text-sm px-2">{option.label}</span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Doctorate is centered on its own row */}
              <div className="max-w-xs mx-auto mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    className={`w-full h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-center transition-all duration-50 shadow-lg hover:shadow-2xl
                      ${selectedEducation === educationOptions[6].value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-2xl scale-105'
                        : 'text-white hover:bg-white/20 hover:border-white/40 hover:scale-105'
                      }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEducationSelect(educationOptions[6])}
                  >
                    <span className="block font-semibold text-sm px-2">{educationOptions[6].label}</span>
                  </motion.button>
                </motion.div>
              </div>

              <div className="text-center">
                <button
                  className="text-purple-300 text-sm hover:text-white hover:underline transition-colors duration-200 font-medium"
                  onClick={skipEducation}
                >
                  Prefer not to answer
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProSuitePage; 