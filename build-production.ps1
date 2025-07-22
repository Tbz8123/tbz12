# Production Build Script for TBZ Resume Builder (PowerShell)
# This script builds both frontend and backend for production deployment

Write-Host "🚀 Starting production build process..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required files exist
if (-not (Test-Path "package.json")) {
    Write-Error "package.json not found. Please run this script from the project root."
    exit 1
}

if (-not (Test-Path ".env.production")) {
    Write-Warning ".env.production not found. Please create it with your production configuration."
}

try {
    # Install dependencies
    Write-Status "Installing dependencies..."
    npm ci --production=false
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }

    # Build the client (frontend)
    Write-Status "Building frontend..."
    npm run build:client
    if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }

    if (-not (Test-Path "dist")) {
        throw "Frontend build failed. dist directory not found."
    }

    Write-Status "Frontend build completed successfully!"

    # Build the server (backend)
    Write-Status "Building backend..."
    npm run build:server
    if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }

    if (-not (Test-Path "server/dist")) {
        throw "Backend build failed. server/dist directory not found."
    }

    Write-Status "Backend build completed successfully!"

    # Generate Prisma client for production
    Write-Status "Generating Prisma client..."
    npx prisma generate
    if ($LASTEXITCODE -ne 0) { throw "Prisma generate failed" }

    # Create deployment package
    Write-Status "Creating deployment package..."
    if (Test-Path "deployment") {
        Remove-Item -Recurse -Force "deployment"
    }
    New-Item -ItemType Directory -Path "deployment" | Out-Null

    # Copy backend files
    Copy-Item -Recurse "server/dist" "deployment/"
    Copy-Item "package.json" "deployment/"
    Copy-Item "package-lock.json" "deployment/"
    Copy-Item -Recurse "prisma" "deployment/"
    if (Test-Path ".env.production") {
        Copy-Item ".env.production" "deployment/.env"
    }

    # Copy frontend build
    Copy-Item -Recurse "dist" "deployment/public"

    Write-Status "Deployment package created in ./deployment directory"

    # Create archive for easy upload
    Write-Status "Creating deployment archive..."
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $archiveName = "tbz-resume-builder-$timestamp.zip"
    
    if (Get-Command "Compress-Archive" -ErrorAction SilentlyContinue) {
        Compress-Archive -Path "deployment/*" -DestinationPath $archiveName -Force
        Write-Status "Archive created: $archiveName"
    } else {
        Write-Warning "Compress-Archive not available. Please manually zip the deployment folder."
    }

    Write-Status "✅ Production build completed successfully!"
    Write-Status "📦 Deployment files are ready in ./deployment directory"
    
    Write-Host ""
    Write-Status "Next steps:"
    Write-Host "1. Upload the deployment directory to your EC2 instance"
    Write-Host "2. Set up your production database (RDS)"
    Write-Host "3. Update .env with production values"
    Write-Host "4. Run database migrations: npx prisma migrate deploy"
    Write-Host "5. Start the application: npm start"
    Write-Host ""
    Write-Status "For frontend deployment:"
    Write-Host "1. Upload the ./dist directory contents to your S3 bucket"
    Write-Host "2. Configure CloudFront distribution"
    Write-Host "3. Update DNS settings"

} catch {
    Write-Error "Build failed: $_"
    exit 1
}