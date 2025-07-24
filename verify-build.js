#!/usr/bin/env node

/**
 * Build Verification Script
 * This script verifies that all build outputs are correctly generated
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredDirectories = [
  'dist',
  'dist/client',
  'dist/admin'
];

const requiredFiles = [
  'dist/index.js',
  'dist/client/index.html',
  'dist/admin/index.html'
];

console.log('🔍 Verifying build output...');

let allGood = true;

// Check directories
for (const dir of requiredDirectories) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ Directory exists: ${dir}`);
  } else {
    console.log(`❌ Missing directory: ${dir}`);
    allGood = false;
  }
}

// Check files
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ File exists: ${file}`);
  } else {
    console.log(`❌ Missing file: ${file}`);
    allGood = false;
  }
}

if (allGood) {
  console.log('\n🎉 All build outputs are present!');
  console.log('\n📋 Build verification summary:');
  
  // Show file sizes
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ${file}: ${sizeKB} KB`);
    }
  }
  
  process.exit(0);
} else {
  console.log('\n❌ Build verification failed!');
  console.log('\n🔧 Suggested fixes:');
  console.log('   1. Run: npm run build');
  console.log('   2. Check for TypeScript errors');
  console.log('   3. Verify all dependencies are installed');
  console.log('   4. Check build logs for errors');
  
  process.exit(1);
}