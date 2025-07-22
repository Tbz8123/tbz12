import React from 'react';

// Test component with hard-coded resume data to verify preview functionality
const TestResumePreview: React.FC = () => {
  const testResumeData = {
    personalInfo: {
      firstName: "John",
      lastName: "Doe", 
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      location: "New York, NY"
    },
    professionalSummary: "Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies.",
    experience: [
      {
        jobTitle: "Senior Software Engineer",
        company: "Tech Corp",
        startDate: "2022",
        endDate: "Present",
        description: "Lead development of microservices architecture serving 1M+ users daily. Improved system performance by 40% and reduced deployment time by 60%."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        graduationDate: "2019"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB"]
  };

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-sm" style={{ minHeight: '1131px' }}>
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {testResumeData.personalInfo.firstName} {testResumeData.personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>{testResumeData.personalInfo.email}</span>
            <span>{testResumeData.personalInfo.phone}</span>
            <span>{testResumeData.personalInfo.location}</span>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{testResumeData.professionalSummary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Professional Experience
        </h2>
        <div className="space-y-4">
          {testResumeData.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-purple-200 pl-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-purple-600 font-medium mb-2">{exp.company}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Education
        </h2>
        <div className="space-y-3">
          {testResumeData.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-purple-600">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-600">{edu.graduationDate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {testResumeData.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResumePreview;