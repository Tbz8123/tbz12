import React from "react";
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to Build Your Perfect Resume?</h2>
        <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">
          Join thousands of professionals who have already landed their dream jobs using TbzResumeBuilder
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
          <Link href="/package-selection">
            <Button size="lg" variant="secondary" className="text-primary">
              Create Your Resume
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Browse Templates
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
