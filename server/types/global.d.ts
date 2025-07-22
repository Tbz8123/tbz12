
import { PrismaClient } from '@prisma/client';

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}

declare global {
  var prisma: PrismaClient | null;
}

export {};
