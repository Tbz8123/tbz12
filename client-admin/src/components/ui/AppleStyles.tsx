
import React from 'react';
import { cn } from '@/lib/utils';

interface FullWidthSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const FullWidthSection: React.FC<FullWidthSectionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <section className={cn("w-full", className)}>
      {children}
    </section>
  );
};
