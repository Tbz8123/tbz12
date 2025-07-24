import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { User } from '@prisma/client'; // Import User type from Prisma

// Define request/response types for non-Next.js environment
interface ApiRequest {
  headers: {
    authorization?: string;
    cookie?: string;
  };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

export interface UserPayload {
  sub: string; // User ID
  tier: number;
  // You can add other fields to the JWT payload if needed, like email or roles
}

// Helper to sign a JWT
export function signJwt(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '2h' }); // Token expires in 2 hours
}

// Helper to verify a JWT and return the payload
export function verifyJwt(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as UserPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Middleware to protect Tier 2 routes
export async function requireTier2(req: ApiRequest, res: ApiResponse): Promise<User | null> {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to checking cookies as per the blueprint's initial suggestion
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    token = match ? match[1] : undefined;
  }

  if (!token) {
    res.status(401).json({ error: "Not authenticated: No token provided" });
    return null;
  }

  const payload = verifyJwt(token);

  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    res.status(401).json({ error: "User not found for token" });
    return null;
  }

  if (user.tier < 2) {
    res.status(403).json({ error: "Forbidden: Tier 2 access required" });
    return null;
  }

  return user; // Return the full user object
}

// Utility to set the JWT as an HttpOnly cookie
export function setJwtCookie(res: ApiResponse, token: string) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 2 * 60 * 60, // 2 hours in seconds
    sameSite: 'Strict' as const,
  };
  // The `cookie` library can be used for more robust cookie setting if needed
  // For now, setting it directly:
  res.setHeader('Set-Cookie', `token=${token}; ${Object.entries(cookieOptions).map(([key, value]: [string, any]) => `${key === 'maxAge' ? 'Max-Age' : key}=${value}`).join('; ')}`);
}

export function clearJwtCookie(res: ApiResponse) {
  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`);
}