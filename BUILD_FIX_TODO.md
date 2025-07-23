# Build Fix To-Do List

## Issue
The build process is failing because the Vite build commands are being run from the wrong directory.

## Root Cause
The build scripts in package.json are trying to run `vite build --config client/vite.config.ts` from the root directory, but Vite needs to be run from within the client directory to find the index.html file.

## Solution
Update the build scripts in the root package.json to use the correct approach:

### Current (Broken) Scripts:
```json
"build:client": "vite build --config client/vite.config.ts",
"build:admin": "vite build --config client-admin/vite.config.ts",
```

### Fixed Scripts:
```json
"build:client": "npm --prefix client run build",
"build:admin": "npm --prefix client-admin run build",
```

## Verification
Both individual builds work when run from their respective directories:
- ✅ `cd client && npx vite build` - Works
- ✅ `cd client-admin && npx vite build` - Works
- ✅ `npm --prefix client run build` - Works
- ✅ `npm --prefix client-admin run build` - Works

## Status
- [x] Identified the issue
- [x] Tested individual builds
- [x] Verified the fix works for individual components
- [ ] **PENDING**: Update package.json with correct build scripts
- [ ] **PENDING**: Test full build process

## Next Steps
1. Manually update the package.json file to use the correct build scripts
2. Run `npm run build` to verify the full build process works
3. Update the TypeScript errors todo list to reflect build fix completion