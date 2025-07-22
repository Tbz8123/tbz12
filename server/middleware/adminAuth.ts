import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // In production, use service account key from environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // For development, you might want to use a service account file
      // admin.initializeApp({
      //   credential: admin.credential.applicationDefault(),
      // });
      console.warn('⚠️ Firebase Admin SDK not initialized - admin authentication will be bypassed in development');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    isAdmin?: boolean;
  };
}

/**
 * Middleware to verify Firebase ID token and check admin privileges
 */
export const requireAdminAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // In development mode, bypass authentication for testing
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_ADMIN_AUTH === 'true') {
      req.user = {
        uid: 'dev-admin',
        email: 'admin@dev.local',
        isAdmin: true,
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!admin.apps.length) {
      return res.status(500).json({ error: 'Firebase Admin SDK not initialized' });
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if user has admin privileges
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const isAdmin = userRecord.customClaims?.admin === true;
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: true,
    };

    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to serve admin static files only to authenticated admin users
 */
export const serveAdminStatic = (adminDistPath: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Apply admin authentication first
    await new Promise<void>((resolve, reject) => {
      requireAdminAuth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // If authentication passed, serve the static files
    const express = await import('express');
    const staticMiddleware = express.default.static(adminDistPath);
    staticMiddleware(req, res, next);
  };
};