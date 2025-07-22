import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import { requireAdminAuth } from '../server/middleware/adminAuth.js';

// Initialize Prisma client
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['error', 'warn'],
});

// Connect to database
prisma.$connect()
  .then(() => {
    console.log('✅ Admin Database connected successfully');
    global.prisma = prisma;
  })
  .catch((error) => {
    console.error('❌ Admin Database connection failed:', error);
    global.prisma = null;
  });

const ADMIN_PORT = process.env.ADMIN_PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startAdminServer() {
  const app = express();

  // Error handler middleware
  app.use((err, req, res, next) => {
    console.error('Admin Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // CORS configuration - Allow requests from main app domain
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.MAIN_APP_URL || 'https://webapp.com', process.env.ADMIN_FRONTEND_URL || 'https://admin.webapp.com']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4001'], // Development origins
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Add compression for production
  if (process.env.NODE_ENV === 'production') {
    const compression = await import('compression');
    app.use(compression.default());
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'admin-server', timestamp: new Date().toISOString() });
  });

  // All admin routes require authentication
  app.use('/api', requireAdminAuth);

  // Import and register admin-specific routes
  const { registerAdminRoutes } = await import('./routes.js');
  await registerAdminRoutes(app);

  // Serve admin static files
  const adminDistPath = path.join(__dirname, '..', 'client-admin', 'dist');
  app.use(express.static(adminDistPath));
  
  // Catch-all for admin SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(adminDistPath, 'index.html'));
  });

  // Start server
  const server = app.listen(ADMIN_PORT, '0.0.0.0', () => {
    console.log(`🔐 Admin Server listening on http://0.0.0.0:${ADMIN_PORT}`);
    console.log(`🎯 Admin Panel accessible at http://localhost:${ADMIN_PORT}`);
  });

  // Handle server errors
  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Admin Port ${ADMIN_PORT} is already in use. Please use a different port.`);
      process.exit(1);
    } else {
      console.error('Admin Server error:', error);
    }
  });

  return server;
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Admin Server: Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Admin Server: Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start admin server
async function initialize() {
  try {
    console.log('Starting TbzResumeBuilder Admin Server...');
    await startAdminServer();
  } catch (error) {
    console.error('Failed to start admin server:', error);
    process.exit(1);
  }
}

initialize();