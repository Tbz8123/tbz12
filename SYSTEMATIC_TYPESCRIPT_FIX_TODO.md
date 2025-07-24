# Systematic TypeScript Error Fix - Action Plan

## Current Status
- **Problem**: 500 errors across all API endpoints due to TypeScript compilation issues
- **Root Cause**: 60+ TypeScript errors preventing proper server compilation
- **Solution**: Systematic fix of all TypeScript errors in priority order

## Phase 1: Critical Infrastructure Fixes (IMMEDIATE)

### 1.1 File Casing Issues (BLOCKING)
- [ ] Fix Toaster.tsx vs toaster.tsx casing conflict in client-admin/src/App.tsx:4
- [ ] Standardize all file imports to match actual file names

### 1.2 Missing Dependencies (BLOCKING)
- [ ] Install react-router-dom: `npm install react-router-dom @types/react-router-dom`
- [ ] Install @stripe/stripe-js: `npm install @stripe/stripe-js`
- [ ] Verify all package.json dependencies are installed

### 1.3 Missing Schema Exports (BLOCKING)
- [ ] Add ResumeData export to shared/schema.ts
- [ ] Add ResumeTemplateRecord export to shared/schema.ts
- [ ] Fix all schema import errors across 7+ files

### 1.4 Missing Interface Properties (BLOCKING)
- [ ] Add isAdmin: boolean to ExtendedUser interface
- [ ] Add resume and updateResume properties to ResumeState interface
- [ ] Fix missing context properties

## Phase 2: Type Safety Fixes (HIGH PRIORITY)

### 2.1 Implicit 'any' Parameters
- [ ] Fix FinalPagePreview.tsx data parameters (lines 464-470)
- [ ] Fix SectionReorderModal.tsx sectionId parameter (line 168)
- [ ] Fix docx.ts export parameters (lines 46,58,67,71,74)
- [ ] Fix txt.ts export parameters (lines 31,38,44,46,48)
- [ ] Fix multi-page-template-utils.tsx binding elements

### 2.2 Type Mismatches
- [ ] Add id property to Education interface
- [ ] Fix MultiPageRender missing props in PersonalInfoPreview.tsx
- [ ] Fix SlotProps type issues in UI components

## Phase 3: Component Fixes (MEDIUM PRIORITY)

### 3.1 UI Component Issues
- [ ] Fix breadcrumb.tsx SlotProps type mismatch (line 51)
- [ ] Fix sidebar.tsx SlotProps type mismatches (lines 446,467,568,613,727)

### 3.2 Missing Properties
- [ ] Add performance properties to MobileOptimizationIndicator.tsx
- [ ] Fix missing device detection properties

## Phase 4: Module Resolution (LOW PRIORITY)

### 4.1 Missing Modules
- [ ] Fix auth.ts missing prisma and next modules
- [ ] Create missing ResumeContext or update imports
- [ ] Fix any remaining module resolution issues

## Implementation Strategy

### Step 1: Immediate Action (Next 30 minutes)
1. Fix file casing issues
2. Install missing dependencies
3. Add basic schema exports
4. Test server startup

### Step 2: Core Fixes (Next 1 hour)
1. Fix interface properties
2. Add explicit types for parameters
3. Fix type mismatches
4. Test API endpoints

### Step 3: Cleanup (Next 30 minutes)
1. Fix remaining UI component issues
2. Add missing properties
3. Final TypeScript check
4. Verify all tests pass

## Success Criteria
- [ ] `npx tsc --noEmit` returns 0 errors
- [ ] Server starts without compilation errors
- [ ] All API endpoints return proper responses (not 500)
- [ ] TestSprite tests pass

## Progress Tracking
- **Total Errors**: 60+
- **Phase 1 Completed**: 0/4
- **Phase 2 Completed**: 0/2
- **Phase 3 Completed**: 0/2
- **Phase 4 Completed**: 0/1

---

**NEXT ACTION**: Start with Phase 1.1 - Fix file casing issues