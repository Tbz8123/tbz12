import React from "react";
import { FileText, Lightbulb, Monitor, Upload } from 'lucide-react';
import { useLocation } from 'wouter';

export default function FeaturesSection() {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: 'ATS-Optimized Templates',
      description: 'All our templates are tested and optimized to pass Applicant Tracking Systems.',
      icon: <FileText className="h-6 w-6 text-primary" />
    },
    {
      title: 'AI Content Suggestions',
      description: 'Get smart suggestions for skills, achievements, and job descriptions as you type.',
      icon: <Lightbulb className="h-6 w-6 text-primary" />
    },
    {
      title: 'Real-Time Preview',
      description: 'See your changes instantly as you build your resume without any delays.',
      icon: <Monitor className="h-6 w-6 text-primary" />
    },
    {
      title: 'Multiple Export Options',
      description: 'Download as PDF, DOCX, or share a private link with potential employers.',
      icon: <Upload className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose TbzResumeBuilder?</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Our intuitive platform provides everything you need to create a standout resume
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 shadow-sm card-hover-animation"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Resume Snap vs Pro Suite Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Snap (Lite) Card */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-md flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-2xl">🟢</span>
              <h3 className="text-2xl font-bold text-green-800">Resume Snap <span className="text-base font-medium">(Lite)</span></h3>
            </div>
            <p className="text-green-900 font-semibold mb-4">⚡ Perfect for quick, professional resumes with zero hassle.</p>
            <div className="mb-4">
              <table className="w-full text-sm mb-2">
                <tbody className="text-green-900">
                  <tr><td className="pr-2 align-top">✅</td><td className="font-medium">One-Click Resume Builder</td><td>Fill a short form or import from LinkedIn – done in minutes.</td></tr>
                  <tr><td className="pr-2 align-top">✅</td><td className="font-medium">Modern Templates</td><td>Choose from 3–5 stylish templates designed to pass visual checks.</td></tr>
                  <tr><td className="pr-2 align-top">✅</td><td className="font-medium">No Signup Needed</td><td>Start building right away – no account required.</td></tr>
                  <tr><td className="pr-2 align-top">✅</td><td className="font-medium">Download as PDF</td><td>Get your resume instantly in print-ready format.</td></tr>
                  <tr><td className="pr-2 align-top">✅</td><td className="font-medium">Smart Auto-Fill</td><td>Autofill sections based on minimal input.</td></tr>
                  <tr><td className="pr-2 align-top">✅</td><td className="font-medium">Budget-Friendly</td><td>Free to use with optional $2–$5 paid extras.</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-green-900 text-sm mb-2">
              <span className="block mb-1">👤 <b>Best for:</b> Students, freelancers, interns, entry-level applicants</span>
              <span className="block mb-1">⏱️ <b>Time to build:</b> Under 5 minutes</span>
              <span className="block mb-1">💸 <b>Pricing:</b> Free for basic, optional one-time fees</span>
            </div>
            <button className="btn-lite bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg mt-auto transition">Start with Resume Snap (Free)</button>
          </div>
          {/* Resume Pro Suite Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 shadow-md flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-2xl">🔵</span>
              <h3 className="text-2xl font-bold text-blue-800">Resume Pro Suite</h3>
            </div>
            <p className="text-blue-900 font-semibold mb-4">🚀 For serious job-seekers who want to stand out and beat ATS systems.</p>
            <div className="mb-4">
              <table className="w-full text-sm mb-2">
                <tbody className="text-blue-900">
                  <tr><td className="pr-2 align-top">🔍</td><td className="font-medium">ATS Optimization</td><td>Automatically checks your resume against real job descriptions.</td></tr>
                  <tr><td className="pr-2 align-top">🎯</td><td className="font-medium">Job-Specific Tailoring</td><td>AI customizes your resume for each role you apply to.</td></tr>
                  <tr><td className="pr-2 align-top">📊</td><td className="font-medium">Resume Analytics</td><td>See how your resume performs — views, keyword matches, etc.</td></tr>
                  <tr><td className="pr-2 align-top">🔗</td><td className="font-medium">LinkedIn + GitHub Integration</td><td>Pull data directly or link profiles.</td></tr>
                  <tr><td className="pr-2 align-top">🧩</td><td className="font-medium">Multiple Versions</td><td>Save and switch between role-specific resumes.</td></tr>
                  <tr><td className="pr-2 align-top">✍️</td><td className="font-medium">AI-Powered Cover Letters</td><td>Generate personalized cover letters in one click.</td></tr>
                  <tr><td className="pr-2 align-top">👨‍🏫</td><td className="font-medium">Expert Review (Optional)</td><td>Add-on service for real-time professional feedback.</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-blue-900 text-sm mb-2">
              <span className="block mb-1">🎯 <b>Best for:</b> Mid-to-senior professionals, career switchers, tech/business roles</span>
              <span className="block mb-1">🕓 <b>Time to build:</b> ~10–15 minutes</span>
              <span className="block mb-1">💰 <b>Pricing:</b> $10–$20/month OR one-time pro pack for $30–$50</span>
            </div>
            <button className="btn-pro bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-auto transition" onClick={() => setLocation('/pro-suite')}>Upgrade to Resume Pro Suite</button>
          </div>
        </div>

        {/* Side-by-Side Summary Table */}
        <div className="mt-16 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl bg-white shadow-sm text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-bold">Feature</th>
                <th className="py-3 px-4 text-left font-bold text-green-700">Resume Snap (Lite) ✅</th>
                <th className="py-3 px-4 text-left font-bold text-blue-700">Resume Pro Suite 🚀</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-2 px-4">Instant Resume Creation</td><td className="py-2 px-4">✅</td><td className="py-2 px-4">✅</td></tr>
              <tr><td className="py-2 px-4">Template Selection</td><td className="py-2 px-4">Basic (3–5)</td><td className="py-2 px-4">Advanced (10+)</td></tr>
              <tr><td className="py-2 px-4">ATS Optimization</td><td className="py-2 px-4">❌</td><td className="py-2 px-4">✅</td></tr>
              <tr><td className="py-2 px-4">Job-Specific Resume Tailoring</td><td className="py-2 px-4">❌</td><td className="py-2 px-4">✅</td></tr>
              <tr><td className="py-2 px-4">Multi-Version Management</td><td className="py-2 px-4">❌</td><td className="py-2 px-4">✅</td></tr>
              <tr><td className="py-2 px-4">AI-Powered Cover Letter</td><td className="py-2 px-4">Basic</td><td className="py-2 px-4">Advanced</td></tr>
              <tr><td className="py-2 px-4">Resume Analytics</td><td className="py-2 px-4">❌</td><td className="py-2 px-4">✅</td></tr>
              <tr><td className="py-2 px-4">Expert Feedback</td><td className="py-2 px-4">❌</td><td className="py-2 px-4">Optional Add-on</td></tr>
              <tr><td className="py-2 px-4">Portfolio Builder</td><td className="py-2 px-4">❌</td><td className="py-2 px-4">✅</td></tr>
              <tr><td className="py-2 px-4">Cost</td><td className="py-2 px-4">Free / $2–$5</td><td className="py-2 px-4">$10–$20/mo or $30–$50 one-time</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
