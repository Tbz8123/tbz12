import Logo from './Logo';
import React from "react";
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Heart, Star, Mail, Globe } from 'lucide-react';

const SocialLink = ({ icon: Icon, href, label }: { icon: React.ElementType, href: string, label: string }) => (
  <a href={href} aria-label={label} className="text-gray-400 hover:text-white transition-colors">
    <Icon className="h-6 w-6" />
  </a>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="text-gray-400 hover:text-white transition-colors">
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-6 text-gray-300 max-w-md leading-relaxed">
              Create professional, ATS-friendly resumes in minutes with our intuitive resume builder and expert templates.
            </p>
            {/* Social Links */}
            <div className="mt-8 flex space-x-4">
              <SocialLink icon={Facebook} href="#" label="Facebook" />
              <SocialLink icon={Instagram} href="#" label="Instagram" />
              <SocialLink icon={Twitter} href="#" label="Twitter" />
              <SocialLink icon={Globe} href="#" label="Website" />
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Product
            </h3>
            <ul className="space-y-4">
              <li><FooterLink href="/templates">Templates</FooterLink></li>
              <li><FooterLink href="#features">Features</FooterLink></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Company
            </h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-purple-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} TbzResumeBuilder. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 