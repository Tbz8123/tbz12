# AWS Production Setup Script
# This script helps configure the application for AWS deployment

Write-Host "Setting up TbzResumeBuilder for AWS Production Deployment" -ForegroundColor Green
Write-Host ""

# Check if .env.production exists
if (Test-Path ".env.production") {
    Write-Host "✅ .env.production file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env.production file not found" -ForegroundColor Red
    Write-Host "Please create .env.production with your production values" -ForegroundColor Yellow
    exit 1
}

# Check for required environment variables
$envContent = Get-Content ".env.production" -Raw
$requiredVars = @(
    "DATABASE_URL",
    "JWT_SECRET", 
    "SESSION_SECRET",
    "CORS_ORIGIN",
    "S3_BUCKET_NAME"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if ($envContent -notmatch "$var=(?!your-|username:|https://your-)") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ Missing or placeholder values for:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Please update .env.production with actual production values" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Create Neon database at https://neon.tech" -ForegroundColor White
    Write-Host "2. Copy connection string to DATABASE_URL" -ForegroundColor White
    Write-Host "3. Generate secure secrets for JWT_SECRET and SESSION_SECRET" -ForegroundColor White
    Write-Host "4. Set your actual domain for CORS_ORIGIN" -ForegroundColor White
    Write-Host "5. Create S3 bucket and set S3_BUCKET_NAME" -ForegroundColor White
    exit 1
}

Write-Host "✅ All required environment variables are configured" -ForegroundColor Green
Write-Host ""

# Test build process
Write-Host "Testing production build process..." -ForegroundColor Cyan

try {
    Write-Host "Building frontend..." -ForegroundColor Yellow
    npm run build:frontend
    if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
    
    Write-Host "Building backend..." -ForegroundColor Yellow
    npm run build:backend
    if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }
    
    Write-Host "✅ Build process completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build process failed: $_" -ForegroundColor Red
    exit 1
}

# Check Docker
Write-Host ""
Write-Host "Checking Docker configuration..." -ForegroundColor Cyan

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker is installed" -ForegroundColor Green
    
    # Test Docker build
    Write-Host "Testing Docker build..." -ForegroundColor Yellow
    docker build -t tbz-resume-test . --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker build successful" -ForegroundColor Green
        docker rmi tbz-resume-test --force | Out-Null
    } else {
        Write-Host "❌ Docker build failed" -ForegroundColor Red
        Write-Host "Please check Dockerfile configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "Docker not found - required for AWS ECS deployment" -ForegroundColor Yellow
    Write-Host "Install Docker Desktop from https://docker.com" -ForegroundColor White
}

# Check AWS CLI
Write-Host ""
Write-Host "Checking AWS CLI..." -ForegroundColor Cyan

if (Get-Command aws -ErrorAction SilentlyContinue) {
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
    
    # Check AWS credentials
    try {
        aws sts get-caller-identity --output text | Out-Null
        Write-Host "✅ AWS credentials configured" -ForegroundColor Green
    } catch {
        Write-Host "AWS credentials not configured" -ForegroundColor Yellow
        Write-Host "Run: aws configure" -ForegroundColor White
    }
} else {
    Write-Host "AWS CLI not found - required for deployment" -ForegroundColor Yellow
    Write-Host "Install from https://aws.amazon.com/cli/" -ForegroundColor White
}

Write-Host ""
Write-Host "AWS Production Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps for AWS Deployment:" -ForegroundColor Cyan
Write-Host "1. Create S3 buckets for frontend and file storage" -ForegroundColor White
Write-Host "2. Set up ECR repository for Docker images" -ForegroundColor White
Write-Host "3. Configure security groups and networking" -ForegroundColor White
Write-Host "4. Deploy backend to ECS or EC2" -ForegroundColor White
Write-Host "5. Deploy frontend to S3 + CloudFront" -ForegroundColor White
Write-Host ""
Write-Host "See AWS_DEPLOYMENT_STEP_BY_STEP_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host "See AWS_COMPATIBILITY_ANALYSIS.md for current status" -ForegroundColor Cyan