# Deprecation Fix To-Do List

## Issues Found:
1. **react-beautiful-dnd** - Deprecated drag-and-drop library
2. **@esbuild-kit packages** - Merged into tsx (indirect dependencies)
3. **Incorrect import paths** - .tsx extensions in imports

## Tasks to Complete:

### ✅ COMPLETED:
- [x] Migrate `client/src/components/final-page/SectionReorderModal.tsx` from react-beautiful-dnd to @dnd-kit
- [x] Migrate `client-admin/src/components/final-page/SectionReorderModal.tsx` from react-beautiful-dnd to @dnd-kit
- [x] **Remove react-beautiful-dnd package**
  - [x] Uninstall from main package.json
  - [x] Uninstall from client-admin/package.json
  - [x] Remove @types/react-beautiful-dnd
- [x] **Install @dnd-kit packages**
  - [x] Install @dnd-kit/core
  - [x] Install @dnd-kit/sortable
  - [x] Install @dnd-kit/utilities
- [x] **Fix import paths**
  - [x] Fix `client/src/components/layout/ThemeProvider.tsx` - remove .tsx extension
  - [x] Fix `client-admin/src/components/layout/ThemeProvider.tsx` - remove .tsx extension
- [x] **Clean up package-lock.json**
  - [x] Delete package-lock.json and regenerate to remove @esbuild-kit references
- [x] **Install dependencies**
  - [x] Regenerate clean package-lock.json files
  - [x] Install new @dnd-kit dependencies

### 🔄 REMAINING:
- [ ] **Test the application**
  - [ ] Start development server
  - [ ] Test drag-and-drop functionality
  - [ ] Verify no deprecation warnings

## Priority Order:
1. Remove deprecated packages
2. Install new packages
3. Fix import paths
4. Test functionality
5. Clean up lock files