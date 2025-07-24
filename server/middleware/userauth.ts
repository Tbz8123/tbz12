import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
    tier?: string;
  };
}

/**
 * Middleware to verify JWT token and require user authentication
 */
export const requireUserAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback to checking cookies
      const cookie = req.headers.cookie || "";
      const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
      token = match ? match[1] : undefined;
    }

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email || undefined,
      name: user.name || undefined,
      tier: user.tier || undefined
    };

    next();
  } catch (error) {
    console.error('User authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to optionally verify JWT token (doesn't require authentication)
 */
export const optionalUserAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback to checking cookies
      const cookie = req.headers.cookie || "";
      const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
      token = match ? match[1] : undefined;
    }

    if (!token) {
      // No token provided, continue without user info
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        isActive: true
      }
    });

    if (user && user.isActive) {
      // Attach user info to request if valid
      req.user = {
        id: user.id,
        email: user.email || undefined,
        name: user.name || undefined,
        tier: user.tier || undefined
      };
    }

    next();
  } catch (error) {
    // For optional auth, continue even if token is invalid
    console.warn('Optional user authentication failed:', error);
    next();
  }
};