
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import setupRoutes from './routes.js';
import { setupVite, serveStatic } from './vite.js';
import { setupCustomVite } from './custom-vite.js';
import { trackVisitor } from './middleware/visitorTracking.js';
import cookieParser from 'cookie-parser';

// Set environment variables for Vite host configuration
process.env.VITE_HMR_HOST = '0.0.0.0';
process.env.VITE_HMR_PORT = '3000'; // Changed from 5000 to 3000

// Initialize Prisma client
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['error', 'warn'],
});

// Connect to database and ensure it's available globally
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    // Make prisma available globally for middleware
    (global as any).prisma = prisma;
  })
  .catch((error: unknown) => {
    console.error('❌ Database connection failed:', error);
    // Set a flag to skip database operations if connection fails
    (global as any).prisma = null;
  });

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '5174', 10); // AWS compatible port configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Add error handler middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // CORS configuration for production
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN || false
      : true,
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  app.use(cookieParser()); // Add cookie parser for session tracking
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Add compression for production
  if (process.env.NODE_ENV === 'production') {
    const compression = await import('compression');
    app.use(compression.default());
  }
  
  // Temporarily disable visitor tracking to fix frontend loading
  // app.use(trackVisitor);
  
  console.log('🔍 Visitor tracking middleware initialized');

  // Register all API routes first - this returns an HTTP server
  const httpServer = setupRoutes(app);

  // Admin routes have been moved to separate admin server (server-admin/)
  // Admin panel is now accessible via separate subdomain/port for security

  // Serve main client static files
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    // In development, set up Vite dev server for main client
    const { setupVite } = await import('./vite.js');
    await setupVite(app, httpServer);
  }

  // Use the HTTP server from setupRoutes instead of creating a new one
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡️ Server listening on http://0.0.0.0:${PORT}`);
    console.log(`🔧 Frontend and API both served from port ${PORT}`);
  });

  return httpServer;
}

// Add global error handlers
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start server with graceful error handling
async function initialize() {
  try {
    console.log('🚀 Starting TbzResumeBuilder server...');
    console.log('📍 Current working directory:', process.cwd());
    console.log('🔧 Node version:', process.version);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔌 Target port:', PORT);
    
    const server = await startServer();
    console.log('✅ Server initialization completed successfully');

    // Handle server errors
    server.on('error', (error: Error & { code?: string }) => {
      console.error('❌ Server error occurred:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`🚫 Port ${PORT} is already in use. Please wait for it to be freed or use a different port.`);
        process.exit(1);
      } else {
        console.error('💥 Unexpected server error:', error);
      }
    });

  } catch (error: unknown) {
    console.error('💀 Failed to start server:', error);
    if (error instanceof Error) {
      console.error('📋 Error details:', error.stack);
    }
    process.exit(1);
  }
}

initialize();
