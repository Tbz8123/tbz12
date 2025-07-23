
import { PrismaClient } from '@prisma/client';

// Visitor session interface for tracking
interface VisitorSessionData {
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  isRegistered: boolean;
  country?: string;
  city?: string;
  isNewSession?: boolean;
  lastSeen?: Date;
  firstVisit?: Date;
  totalSessions?: number;
  totalPageViews?: number;
  id?: string;
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
    visitorSession?: VisitorSessionData;
  }
}

declare global {
  var prisma: PrismaClient | null;
}

export {}; // No changes needed, interface already includes visitorSession

