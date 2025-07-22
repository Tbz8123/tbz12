import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Function to format a date
export function formatDate(date: string): string {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return date; // If not a valid date, return as is
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
}

// Function to capitalize first letter of each word
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to truncate text if it's longer than maxLength
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Function to get the initials from a name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}
