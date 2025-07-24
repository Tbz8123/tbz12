# Current TypeScript Errors - Comprehensive Fix TODO

## Overview
This document tracks all current TypeScript errors that need to be resolved based on the latest `npx tsc --noEmit` output.

## Error Categories

### 1. File Casing Issues (HIGH PRIORITY)
- [ ] **client-admin/src/App.tsx:4** - Fix Toaster.tsx vs toaster.tsx casing conflict
  - Issue: Import uses "@/components/ui/Toaster" but file is "toaster.tsx"
  - Solution: Standardize to lowercase "toaster.tsx" and update imports

### 2. Missing Properties in Interfaces
- [ ] **client-admin/src/components/auth/FirebaseProtectedRoute.tsx:28,54** - Property 'isAdmin' missing from ExtendedUser
  - Add `isAdmin: boolean` to ExtendedUser interface

### 3. Missing Dependencies
- [ ] **client-admin/src/components/final-page/EditableSection.tsx:2** - Cannot find module 'react-router-dom'
  - Install: `npm install react-router-dom @types/react-router-dom`
- [ ] **client-admin/src/components/SubscriptionUpgrade.tsx:141** - Cannot find module '@stripe/stripe-js'
  - Install: `npm install @stripe/stripe-js`

### 4. Missing Schema Exports
- [ ] **Multiple files** - Cannot find ResumeData, ResumeTemplateRecord exports from '@shared/schema'
  - Files affected:
    - client-admin/src/components/resume/ResumePreview.tsx:3
    - client-admin/src/components/resume/SectionEditor.tsx:3
    - client-admin/src/components/ResumePreview.tsx:3
    - client-admin/src/components/templates/TemplatesShowcase.tsx:6
    - client-admin/src/lib/export/docx.ts:3
    - client-admin/src/lib/export/pdf.ts:5
    - client-admin/src/lib/export/txt.ts:1
  - Solution: Add missing exports to shared/schema.ts

### 5. Missing Context/Store Properties
- [ ] **client-admin/src/components/final-page/SectionReorderModal.tsx:118,119** - Missing 'resume' and 'updateResume' properties
  - Add missing properties to ResumeState interface
- [ ] **Multiple files** - Cannot find module '@/contexts/ResumeContext'
  - Files: FinalPagePreview.tsx:2, ProPreview.tsx:4
  - Solution: Create missing ResumeContext or update imports

### 6. Type Mismatches
- [ ] **client-admin/src/components/final-page/ExportOptions.tsx:48** - Education array missing 'id' property
  - Add `id: string` to Education interface or update sample data
- [ ] **client-admin/src/components/PersonalInfoPreview.tsx:81** - Missing required props for MultiPageRender
  - Add missing callback props: onUpdateResumeData, onUpdateSkills, etc.

### 7. Implicit 'any' Types (Parameter Types)
- [ ] **client-admin/src/components/final-page/FinalPagePreview.tsx** - Multiple 'data' parameters (lines 464-470)
- [ ] **client-admin/src/components/final-page/SectionReorderModal.tsx:168** - Parameter 'sectionId'
- [ ] **client-admin/src/components/FinalPagePreview.tsx:20** - Parameter 't'
- [ ] **client-admin/src/lib/export/docx.ts** - Multiple parameters (lines 46,58,67,71,74)
- [ ] **client-admin/src/lib/export/txt.ts** - Multiple parameters (lines 31,38,44,46,48)
- [ ] **client-admin/src/lib/multi-page-template-utils.tsx** - Multiple binding elements (lines 227,249,261,275,290)

### 8. UI Component Type Issues
- [ ] **client-admin/src/components/ui/breadcrumb.tsx:51** - SlotProps type mismatch
- [ ] **client-admin/src/components/ui/sidebar.tsx** - Multiple SlotProps type mismatches (lines 446,467,568,613,727)

### 9. Missing Performance/Device Properties
- [ ] **client-admin/src/components/ui/MobileOptimizationIndicator.tsx** - Multiple missing properties:
  - isVeryLowPowerDevice, isThermalThrottling, batteryOptimizationActive (lines 9-11)
  - isLowPower, performanceScore (lines 17-18)
  - lowGraphicsMode, veryLowGraphicsMode (lines 22-23)

### 10. Missing Module/File Issues
- [ ] **client-admin/src/lib/auth.ts:2,3** - Cannot find modules './prisma' and 'next'
- [ ] **client-admin/src/lib/multi-page-template-utils.tsx:143,154** - Type 'any' not assignable to 'never'

## Implementation Plan

### Phase 1: Critical Infrastructure (Day 1)
1. Fix file casing issues
2. Install missing dependencies
3. Add missing schema exports
4. Fix missing interface properties

### Phase 2: Type Safety (Day 2)
1. Add explicit types for all implicit 'any' parameters
2. Fix type mismatches in components
3. Update interface definitions

### Phase 3: UI Components (Day 3)
1. Fix SlotProps type issues
2. Resolve component prop mismatches
3. Add missing performance properties

### Phase 4: Cleanup (Day 4)
1. Remove unused imports
2. Verify all fixes work together
3. Run full TypeScript check

## Progress Tracking
- **Total Errors**: ~60+ errors identified
- **Completed**: 0
- **In Progress**: 0
- **Remaining**: ~60+

## Notes
- All errors are from latest `npx tsc --noEmit` output
- Priority should be given to errors that block compilation
- Some errors may be resolved by fixing dependencies first