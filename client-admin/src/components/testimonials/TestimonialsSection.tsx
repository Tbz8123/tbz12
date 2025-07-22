import React from "react";
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      content: "I landed three interviews within a week of using my new resume from TbzResumeBuilder. The templates are professional and the AI suggestions helped me highlight achievements I wouldn't have thought to include.",
      author: "Sarah J.",
      role: "Marketing Specialist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      content: "As a software developer, I needed a resume that could highlight both my technical skills and soft skills. The Technical Expert template was perfect, and I got an offer from a FAANG company within two weeks!",
      author: "Michael T.",
      role: "Senior Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      content: "As a recent graduate with limited experience, I was worried about my resume looking too sparse. The AI content suggestions helped me turn my internships and coursework into impressive achievements. Got my first job within a month!",
      author: "Emily R.",
      role: "Business Analyst",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of job seekers who have found success with TbzResumeBuilder
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={testimonial.avatar} 
                    alt={`${testimonial.author} avatar`} 
                  />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
