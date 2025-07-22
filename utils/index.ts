import { ZodError } from 'zod';

/**
 * Converts a Zod validation error into a user-friendly error message
 * @param error - The ZodError to convert
 * @returns A formatted error message string
 */
export function fromZodError(error: ZodError): string {
  const issues = error.issues.map(issue => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
    return `${path}: ${issue.message}`;
  });
  
  return issues.join(', ');
}

/**
 * Alternative version that returns an object with field-specific errors
 * @param error - The ZodError to convert
 * @returns An object with field names as keys and error messages as values
 */
export function fromZodErrorToObject(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  
  error.issues.forEach(issue => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
    result[path] = issue.message;
  });
  
  return result;
}