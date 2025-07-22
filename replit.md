# TbzResumeBuilder Application Guide

## Overview

TbzResumeBuilder is a web application for creating professional resumes. The application allows users to select from various templates, customize their resume content, and generate polished, ATS-friendly resumes. The system uses a React frontend with a Node.js/Express backend and Drizzle for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 14, 2025:**
- Fixed critical server startup port conflicts caused by dual server creation
- Resolved WebSocket server errors by restructuring server architecture
- Successfully pushed Prisma schema to database using `npx prisma db push`
- Cleaned up corrupted migration files that contained syntax errors
- Database reset and synchronized with complete Prisma schema
- All database tables now properly created and accessible
- Sample data initialization working correctly for jobs, templates, and pro templates
- Server running successfully on port 5000 with no database connection errors
- Application fully operational with all features accessible

## System Architecture

The application follows a modern full-stack architecture:

1. **Frontend**: React-based SPA with Tailwind CSS and shadcn/ui components
2. **Backend**: Express.js server handling API requests
3. **Database**: PostgreSQL database (accessed via Drizzle ORM)
4. **API**: RESTful API for managing resume data and templates
5. **State Management**: React Query for server state management

The application is structured as a monorepo with client and server code separated but sharing common types and schemas. This approach maintains type safety across the codebase while keeping concerns separated.

## Key Components

### Frontend

- **React**: Main UI library
- **Wouter**: Lightweight routing solution
- **Tanstack Query**: Data fetching and cache management
- **shadcn/ui**: Component library based on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Build tool and development server

The UI is organized into:
- Core pages (`Home`, `Templates`, `ResumeBuilder`, `Preview`)
- Reusable components (UI components, layout components, and feature-specific components)
- Hooks for common functionality (e.g., theme management, mobile detection)

### Backend

- **Express**: Web server framework
- **Drizzle ORM**: Database access and query builder
- **Zod**: Schema validation for API requests
- **PostgreSQL**: Relational database (via Neon serverless PostgreSQL)

The server handles:
- API endpoints for resume and template operations
- Static file serving for the frontend
- Error handling and request logging

### Database Schema

The database includes two main tables:
1. **resumes**: Stores user resume data
   - Contains personal info, education, experience, skills, etc.
   - Uses JSONB column for flexible data storage

2. **resume_templates**: Stores template definitions
   - Contains template ID, name, description, category
   - Includes metadata like preview image URL and premium status

## Data Flow

1. **Template Selection**:
   - User browses templates via `/templates` route
   - Templates are fetched from `/api/templates` endpoint
   - Selected template is used as the basis for a new resume

2. **Resume Creation**:
   - User inputs personal information, experience, education, etc.
   - Data is managed in frontend state during editing
   - Resume is saved to database via API when completed

3. **Resume Preview**:
   - Resume data and selected template are combined to render a preview
   - Preview can be viewed, downloaded, or shared

## External Dependencies

### Frontend Libraries
- Radix UI components (various UI primitives)
- Lucide icons
- React Hook Form (with Zod validation)
- Class-variance-authority for component styling variations

### Backend Libraries
- Express middleware for request handling
- Neon serverless PostgreSQL client
- Drizzle ORM for database operations
- Zod for validation

### Development Tools
- TypeScript for type safety
- Vite for frontend bundling
- ESBuild for server bundling
- Tailwind for styling

## Deployment Strategy

The application is deployed on Replit and configured to:

1. **Development**:
   - Run both client and server in development mode
   - Enable hot module replacement
   - Automatically restart on changes

2. **Production**:
   - Build frontend with Vite
   - Bundle backend with ESBuild
   - Run optimized production build
   - Serve static frontend from server

Database access is configured through environment variables, with the application expecting a `DATABASE_URL` environment variable pointing to a PostgreSQL database.

## Getting Started

1. **Setup Database**:
   - Ensure PostgreSQL is provisioned (available as a Replit module)
   - Set the `DATABASE_URL` environment variable
   - Run database migrations: `npm run db:push`

2. **Development**:
   - Start the application: `npm run dev`
   - Access the application at the provided URL

3. **Adding Features**:
   - Frontend: Add components in `client/src/components`
   - Backend: Add API endpoints in `server/routes.ts`
   - Shared: Update schemas in `shared/schema.ts`