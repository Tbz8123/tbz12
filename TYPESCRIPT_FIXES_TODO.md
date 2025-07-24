# TypeScript Fixes To-Do List

## Overview
This document outlines all the TypeScript type safety issues that need to be fixed across the codebase.

## High Priority Fixes

### 1. Analytics Service (`server/services/analyticsService.ts`)
- [ ] Fix `Promise<any>` return type in `trackVisitor` method (line 172)
- [ ] Fix `Promise<any>` return type in `trackSession` method
- [ ] Replace `as any` casts in Prisma operations
- [ ] Add proper return types for all analytics methods
- [ ] Define proper interfaces for visitor tracking data

### 2. Import History Route (`server/routes/import-history.ts`)
- [ ] Fix `updatePayload: any` type (line 310)
- [ ] Fix `updateData: any` type (line 313)
- [ ] Fix `metadata as Record<string, any>` casts (multiple locations)
- [ ] Fix `(error as any)?.code` type assertion (line 570)
- [ ] Add proper interfaces for import job data
- [ ] Replace `Function` type with proper callback interface

### 3. Analytics Routes (`server/routes/analytics.ts`)
- [x] Remove explicit `any` types from visitor filtering (COMPLETED)
- [x] Fix funnel analysis type safety (COMPLETED)
- [ ] Add proper interfaces for analytics data structures
- [ ] Fix remaining `Record<string, any>` usages

### 4. Visitor Tracking Middleware (`server/middleware/visitorTracking.ts`)
- [ ] Review and fix any remaining type safety issues
- [ ] Ensure proper return types for all tracking methods

## Medium Priority Fixes

### 5. Missing Prisma Types
- [ ] Investigate missing `VisitorAnalyticsCreateInput` type
- [ ] Investigate missing `VisitorAnalyticsUpdateInput` type
- [ ] Investigate missing `ImportHistoryUpdateInput` type
- [ ] Ensure all Prisma generated types are properly imported

### 6. General Type Safety
- [ ] Review all `as any` casts across the codebase
- [ ] Add proper error type handling
- [ ] Define interfaces for all data structures
- [ ] Add proper return types for all functions

## Implementation Strategy

1. **Start with Analytics Service**: Fix the core `Promise<any>` issues
2. **Fix Import History**: Address the most critical type safety issues
3. **Review Prisma Types**: Ensure all generated types are available
4. **Systematic Review**: Go through each file and fix remaining issues
5. **Testing**: Ensure all fixes don't break functionality

## Notes
- All fixes should maintain existing functionality
- Prefer proper typing over `any` casts
- Add interfaces for complex data structures
- Ensure backward compatibility