import React from "react";
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Pick a CV template',
      description: 'Choose a sleek design and layout to get started. Each template is designed for specific careers and experience levels.',
      imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      number: 2,
      title: 'Fill in the blanks',
      description: 'Type in a few words and let our AI suggest perfect CV content to match your experience and target role. No writing experience needed.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      number: 3,
      title: 'Customize your document',
      description: 'Make it truly yours. Reorganize sections, adjust colors, and fine-tune formatting until your resume perfectly represents you.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Build Your Resume in Three Simple Steps</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process gets you from blank page to job-ready resume in minutes
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                <div className="mb-6 h-48 overflow-hidden rounded-lg">
                  <img 
                    src={step.imageUrl} 
                    alt={`Step ${step.number}: ${step.title}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/resume-builder">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Create Your Resume Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
