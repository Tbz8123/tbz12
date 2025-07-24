import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    firebaseUid?: string;
    currentTier?: string;
  };
}

interface JWTPayload {
  userId: string;
  email?: string;
  firebaseUid?: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to verify JWT token and set req.user for regular user authentication
 */
export const requireUserAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // In development mode, bypass authentication for testing
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_USER_AUTH === 'true') {
      req.user = {
        id: 'dev-user-123',
        email: 'testuser@dev.local',
        firebaseUid: 'dev-firebase-uid',
        currentTier: 'FREE'
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    let token: string | undefined;

    // Check Authorization header first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
    } else {
      // Fallback to checking cookies
      const cookie = req.headers.cookie || "";
      const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
      token = match ? match[1] : undefined;
    }

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firebaseUid: true,
        currentTier: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      firebaseUid: user.firebaseUid || undefined,
      currentTier: user.currentTier
    };

    next();
  } catch (error) {
    console.error('User authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Optional middleware that sets req.user if token is present but doesn't require authentication
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
      token = authHeader.split('Bearer ')[1];
    } else {
      const cookie = req.headers.cookie || "";
      const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
      token = match ? match[1] : undefined;
    }

    if (!token) {
      return next(); // No token, continue without setting user
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return next(); // No JWT secret, continue without setting user
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firebaseUid: true,
        currentTier: true,
        isActive: true
      }
    });

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid || undefined,
        currentTier: user.currentTier
      };
    }

    next();
  } catch (error) {
    // Silently continue without setting user if token is invalid
    next();
  }
};