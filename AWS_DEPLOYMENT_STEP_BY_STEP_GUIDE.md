# AWS Deployment Guide: Separate Frontend & Backend

This guide will walk you through deploying the TbzResumeBuilder webapp on AWS with separate infrastructure for frontend and backend.

## Architecture Overview

- **Frontend**: React app deployed on AWS S3 + CloudFront
- **Backend**: Node.js/Express API deployed on AWS EC2 or ECS
- **Database**: Neon DB (PostgreSQL) for user data, resumes, and templates
- **File Storage**: AWS S3 for resume files and thumbnails

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js and npm installed locally
4. Domain name (optional but recommended)

## Step 1: Prepare Your Application

### 1.1 Environment Configuration

1. Create production environment files:
   ```bash
   # Create .env.production for backend
   cp .env .env.production
   ```

2. Update `.env.production` with production values:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=your-super-secure-jwt-secret
   CORS_ORIGIN=https://your-frontend-domain.com
   PORT=3000
   ```

### 1.2 Build Scripts

1. Update `package.json` to include production build scripts:
   ```json
   {
     "scripts": {
       "build:frontend": "cd client && npm run build",
       "build:backend": "tsc",
       "start:prod": "node dist/server/index.js"
     }
   }
   ```

## Step 2: Set Up AWS Infrastructure

### 2.1 Set Up Neon Database

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Database Project**: 
   - Create new project in Neon dashboard
   - Choose your preferred region
   - Copy the connection string provided
3. **Get Connection String**: 
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

**Why Use Neon DB Instead of RDS?**
- **Serverless**: Automatic scaling and hibernation
- **Cost-Effective**: Pay only for compute time used
- **Branching**: Database branching for development/staging
- **Fast Setup**: No infrastructure management required
- **Modern Features**: Built-in connection pooling and edge functions

### 2.2 Create S3 Buckets

1. **Frontend Hosting Bucket**:
   ```bash
   aws s3 mb s3://tbz-resume-frontend-prod
   aws s3 website s3://tbz-resume-frontend-prod --index-document index.html --error-document error.html
   ```

2. **File Storage Bucket**:
   ```bash
   aws s3 mb s3://tbz-resume-files-prod
   ```

3. **Configure CORS for file storage bucket**:
   ```json
   {
     "CORSRules": [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
         "AllowedOrigins": ["https://your-frontend-domain.com"],
         "ExposeHeaders": ["ETag"]
       }
     ]
   }
   ```

## Step 3: Deploy Backend

### 3.1 Option A: Deploy on EC2

1. **Launch EC2 Instance**:
   ```bash
   aws ec2 run-instances \
     --image-id ami-0c02fb55956c7d316 \
     --count 1 \
     --instance-type t3.micro \
     --key-name your-key-pair \
     --security-group-ids sg-xxxxxxxxx \
     --user-data file://user-data.sh
   ```

2. **Create user-data.sh script**:
   ```bash
   #!/bin/bash
   yum update -y
   curl -sL https://rpm.nodesource.com/setup_18.x | bash -
   yum install -y nodejs git
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Create app directory
   mkdir -p /opt/tbz-resume
   cd /opt/tbz-resume
   
   # Clone your repository (replace with your repo)
   git clone https://github.com/yourusername/tbz-resume-builder.git .
   
   # Install dependencies
   npm install
   
   # Build the application
   npm run build:backend
   
   # Start with PM2
   pm2 start dist/server/index.js --name "tbz-resume-api"
   pm2 startup
   pm2 save
   ```

3. **Configure Security Group**:
   - Allow inbound HTTP (port 80) and HTTPS (port 443)
   - Allow inbound on your app port (3000)
   - Allow SSH (port 22) from your IP

### 3.2 Option B: Deploy on ECS (Recommended for Production)

1. **Create Dockerfile for backend**:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   COPY server/package*.json ./server/
   
   # Install dependencies
   RUN npm install
   RUN cd server && npm install
   
   # Copy source code
   COPY . .
   
   # Build application
   RUN npm run build:backend
   
   # Expose port
   EXPOSE 3000
   
   # Start application
   CMD ["npm", "run", "start:prod"]
   ```

2. **Build and push to ECR**:
   ```bash
   # Create ECR repository
   aws ecr create-repository --repository-name tbz-resume-backend
   
   # Get login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
   
   # Build and tag image
   docker build -t tbz-resume-backend .
   docker tag tbz-resume-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/tbz-resume-backend:latest
   
   # Push image
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/tbz-resume-backend:latest
   ```

3. **Create ECS Task Definition**:
   ```json
   {
     "family": "tbz-resume-backend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "tbz-resume-backend",
         "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/tbz-resume-backend:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           },
           {
             "name": "DATABASE_URL",
             "value": "postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/tbz-resume-backend",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

4. **Create ECS Service with Application Load Balancer**:
   ```bash
   # Create ALB
   aws elbv2 create-load-balancer \
     --name tbz-resume-alb \
     --subnets subnet-12345678 subnet-87654321 \
     --security-groups sg-xxxxxxxxx
   
   # Create target group
   aws elbv2 create-target-group \
     --name tbz-resume-targets \
     --protocol HTTP \
     --port 3000 \
     --vpc-id vpc-12345678 \
     --target-type ip
   
   # Create ECS service
   aws ecs create-service \
     --cluster default \
     --service-name tbz-resume-backend \
     --task-definition tbz-resume-backend:1 \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}" \
     --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/tbz-resume-targets/1234567890123456,containerName=tbz-resume-backend,containerPort=3000
   ```

## Step 4: Deploy Frontend

### 4.1 Build Frontend for Production

1. **Update frontend environment**:
   ```bash
   # Create .env.production in client folder
   cd client
   echo "VITE_API_URL=https://api.your-domain.com" > .env.production
   ```

2. **Build the frontend**:
   ```bash
   npm run build
   ```

### 4.2 Deploy to S3

1. **Upload build files**:
   ```bash
   aws s3 sync client/dist/ s3://tbz-resume-frontend-prod --delete
   ```

2. **Set bucket policy for public read**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::tbz-resume-frontend-prod/*"
       }
     ]
   }
   ```

### 4.3 Set Up CloudFront Distribution

1. **Create CloudFront distribution**:
   ```json
   {
     "CallerReference": "tbz-resume-frontend-2024",
     "Origins": {
       "Quantity": 1,
       "Items": [
         {
           "Id": "S3-tbz-resume-frontend-prod",
           "DomainName": "tbz-resume-frontend-prod.s3.amazonaws.com",
           "S3OriginConfig": {
             "OriginAccessIdentity": ""
           }
         }
       ]
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-tbz-resume-frontend-prod",
       "ViewerProtocolPolicy": "redirect-to-https",
       "TrustedSigners": {
         "Enabled": false,
         "Quantity": 0
       },
       "ForwardedValues": {
         "QueryString": false,
         "Cookies": {
           "Forward": "none"
         }
       },
       "MinTTL": 0
     },
     "Comment": "TBZ Resume Builder Frontend",
     "Enabled": true,
     "DefaultRootObject": "index.html"
   }
   ```

## Step 5: Configure Domain and SSL

### 5.1 Set Up Route 53 (if using AWS for DNS)

1. **Create hosted zone**:
   ```bash
   aws route53 create-hosted-zone --name your-domain.com --caller-reference $(date +%s)
   ```

2. **Create records**:
   ```bash
   # Frontend (CloudFront)
   aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://frontend-record.json
   
   # Backend (ALB)
   aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://backend-record.json
   ```

### 5.2 Set Up SSL Certificates

1. **Request certificates via ACM**:
   ```bash
   # For CloudFront (must be in us-east-1)
   aws acm request-certificate \
     --domain-name your-domain.com \
     --subject-alternative-names www.your-domain.com \
     --validation-method DNS \
     --region us-east-1
   
   # For ALB (in your region)
   aws acm request-certificate \
     --domain-name api.your-domain.com \
     --validation-method DNS \
     --region us-east-1
   ```

## Step 6: Database Migration

1. **Run Prisma migrations**:
   ```bash
   # From your local machine or CI/CD
   DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" npx prisma migrate deploy
   ```

2. **Seed initial data** (if needed):
   ```bash
   DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" npx prisma db seed
   ```

## Step 7: Monitoring and Logging

### 7.1 Set Up CloudWatch

1. **Create log groups**:
   ```bash
   aws logs create-log-group --log-group-name /ecs/tbz-resume-backend
   aws logs create-log-group --log-group-name /aws/lambda/tbz-resume
   ```

2. **Set up alarms**:
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name "TBZ-Resume-High-CPU" \
     --alarm-description "Alarm when CPU exceeds 70%" \
     --metric-name CPUUtilization \
     --namespace AWS/ECS \
     --statistic Average \
     --period 300 \
     --threshold 70 \
     --comparison-operator GreaterThanThreshold
   ```

## Step 8: CI/CD Pipeline (Optional)

### 8.1 GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Build and push Docker image
        run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker build -t tbz-resume-backend .
          docker tag tbz-resume-backend:latest ${{ secrets.ECR_REGISTRY }}/tbz-resume-backend:latest
          docker push ${{ secrets.ECR_REGISTRY }}/tbz-resume-backend:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster default --service tbz-resume-backend --force-new-deployment

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install and build
        run: |
          cd client
          npm install
          npm run build
      
      - name: Deploy to S3
        run: |
          aws s3 sync client/dist/ s3://tbz-resume-frontend-prod --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## Step 9: Security Considerations

1. **Enable AWS WAF** on CloudFront and ALB
2. **Set up VPC** with private subnets for backend
3. **Use IAM roles** with least privilege principle
4. **Enable CloudTrail** for audit logging
5. **Set up AWS Config** for compliance monitoring
6. **Use AWS Secrets Manager** for sensitive data

## Step 10: Testing and Validation

1. **Test frontend**: Visit your CloudFront domain
2. **Test backend API**: Make requests to your ALB endpoint
3. **Test database connectivity**: Verify backend can connect to RDS
4. **Test file uploads**: Verify S3 integration works
5. **Load testing**: Use tools like Artillery or k6

## Estimated Costs (Monthly)

- **Neon DB**: ~$0-19 (Free tier available, Pro starts at $19)
- **EC2 t3.micro**: ~$8 (if using EC2)
- **ECS Fargate**: ~$15-30 (if using ECS)
- **S3 storage**: ~$1-5
- **CloudFront**: ~$1-10
- **ALB**: ~$16
- **Route 53**: ~$0.50
- **Total**: ~$35-89/month

## Troubleshooting

### Common Issues:

1. **CORS errors**: Check ALB and backend CORS configuration
2. **Database connection**: Verify security groups and connection strings
3. **Build failures**: Check Node.js versions and dependencies
4. **SSL issues**: Ensure certificates are validated and attached
5. **Performance**: Monitor CloudWatch metrics and optimize accordingly

## Next Steps

1. Set up monitoring dashboards
2. Implement automated backups
3. Set up staging environment
4. Configure auto-scaling
5. Implement caching strategies
6. Set up error tracking (Sentry, etc.)

This guide provides a comprehensive approach to deploying your webapp on AWS with proper separation of concerns and production-ready infrastructure.