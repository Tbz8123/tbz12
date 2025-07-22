#!/bin/bash

# Production Build Script for TBZ Resume Builder
# This script builds both frontend and backend for production deployment

set -e  # Exit on any error

echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Please create it with your production configuration."
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Build the client (frontend)
print_status "Building frontend..."
npm run build:client

if [ ! -d "dist" ]; then
    print_error "Frontend build failed. dist directory not found."
    exit 1
fi

print_status "Frontend build completed successfully!"

# Build the server (backend)
print_status "Building backend..."
npm run build:server

if [ ! -d "server/dist" ]; then
    print_error "Backend build failed. server/dist directory not found."
    exit 1
fi

print_status "Backend build completed successfully!"

# Generate Prisma client for production
print_status "Generating Prisma client..."
npx prisma generate

# Create deployment package
print_status "Creating deployment package..."
mkdir -p deployment

# Copy backend files
cp -r server/dist deployment/
cp package.json deployment/
cp package-lock.json deployment/
cp -r prisma deployment/
cp .env.production deployment/.env

# Copy frontend build
cp -r dist deployment/public

print_status "Deployment package created in ./deployment directory"

# Create archive for easy upload
print_status "Creating deployment archive..."
tar -czf tbz-resume-builder-$(date +%Y%m%d-%H%M%S).tar.gz -C deployment .

print_status "✅ Production build completed successfully!"
print_status "📦 Deployment files are ready in ./deployment directory"
print_status "📁 Archive created: tbz-resume-builder-$(date +%Y%m%d-%H%M%S).tar.gz"

echo ""
print_status "Next steps:"
echo "1. Upload the deployment directory to your EC2 instance"
echo "2. Set up your production database (RDS)"
echo "3. Update .env with production values"
echo "4. Run database migrations: npx prisma migrate deploy"
echo "5. Start the application: npm start"
echo ""
print_status "For frontend deployment:"
echo "1. Upload the ./dist directory contents to your S3 bucket"
echo "2. Configure CloudFront distribution"
echo "3. Update DNS settings"