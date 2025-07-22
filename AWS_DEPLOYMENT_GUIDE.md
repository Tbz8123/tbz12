# AWS Deployment Guide for TbzResumeBuilder

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **PostgreSQL Database** (AWS RDS recommended)
3. **Node.js 18+** runtime environment
4. **Environment Variables** configured

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)

1. **Install EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**:
   ```bash
   eb init
   ```
   - Choose Node.js platform
   - Select appropriate region

3. **Create Environment**:
   ```bash
   eb create production
   ```

4. **Configure Environment Variables**:
   ```bash
   eb setenv NODE_ENV=production
   eb setenv DATABASE_URL=postgresql://user:pass@host:port/db
   eb setenv SESSION_SECRET=your-secret-key
   eb setenv CORS_ORIGIN=https://your-domain.com
   ```

5. **Deploy**:
   ```bash
   eb deploy
   ```

### Option 2: AWS App Runner

1. **Create apprunner.yaml**:
   ```yaml
   version: 1.0
   runtime: nodejs18
   build:
     commands:
       build:
         - npm ci
         - npm run aws:build
   run:
     runtime-version: 18
     command: npm run aws:start
     network:
       port: 3000
       env: PORT
   ```

2. **Deploy via AWS Console**:
   - Go to AWS App Runner
   - Create service from source code
   - Connect your repository
   - Configure environment variables

### Option 3: AWS Lambda + API Gateway (Serverless)

1. **Install Serverless Framework**:
   ```bash
   npm install -g serverless
   ```

2. **Create serverless.yml**:
   ```yaml
   service: tbzresumebuilder
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
   functions:
     app:
       handler: dist/lambda.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
   ```

## Environment Variables Setup

### Required Variables:
```bash
# Core Configuration
NODE_ENV=production
PORT=3000  # AWS will override this
SESSION_SECRET=your-super-secret-key

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Security
CORS_ORIGIN=https://your-domain.com

# Optional: Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Database Setup (AWS RDS)

1. **Create PostgreSQL RDS Instance**:
   - Engine: PostgreSQL 14+
   - Instance class: db.t3.micro (for testing)
   - Storage: 20GB minimum
   - Enable automated backups

2. **Configure Security Groups**:
   - Allow inbound connections on port 5432
   - From your application's security group

3. **Run Migrations**:
   ```bash
   # Set DATABASE_URL environment variable
   npm run db:migrate
   ```

## Build Process

### Local Testing:
```bash
# Install dependencies
npm ci

# Build for production
npm run aws:build

# Test production build locally
NODE_ENV=production npm run aws:start
```

### Production Build Steps:
1. `npm ci` - Install dependencies
2. `vite build` - Build React frontend
3. `esbuild` - Bundle Node.js backend
4. `npx prisma generate` - Generate Prisma client

## Health Checks

The application provides health check endpoints:

- **Basic Health**: `GET /health`
  - Returns server status and uptime
  - Use for load balancer health checks

- **Database Health**: `GET /api/health`
  - Tests database connectivity
  - Returns 503 if database is unavailable

## Monitoring & Logging

### CloudWatch Integration:
- Application logs are automatically sent to CloudWatch
- Set up alarms for error rates and response times
- Monitor database connection health

### Performance Monitoring:
- Enable AWS X-Ray for request tracing
- Monitor memory and CPU usage
- Set up alerts for high error rates

## Security Considerations

1. **Environment Variables**:
   - Never commit secrets to version control
   - Use AWS Systems Manager Parameter Store for sensitive data

2. **Database Security**:
   - Use RDS with encryption at rest
   - Enable SSL connections
   - Restrict access via security groups

3. **Application Security**:
   - CORS is configured for production domains
   - Session secrets are environment-specific
   - Compression is enabled for performance

## Troubleshooting

### Common Issues:

1. **Port Binding Errors**:
   - Ensure `PORT` environment variable is used
   - AWS automatically assigns ports

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` format
   - Check security group rules
   - Ensure RDS is in same VPC

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Ensure Prisma schema is valid

### Debugging Commands:
```bash
# Check application health
curl https://your-app.com/health

# Check database connectivity
curl https://your-app.com/api/health

# View application logs
eb logs  # For Elastic Beanstalk
```

## Scaling Considerations

1. **Horizontal Scaling**:
   - Use Application Load Balancer
   - Configure auto-scaling groups
   - Ensure session storage is external (Redis/Database)

2. **Database Scaling**:
   - Use RDS read replicas for read-heavy workloads
   - Consider connection pooling
   - Monitor database performance metrics

3. **CDN Integration**:
   - Use CloudFront for static assets
   - Configure proper cache headers
   - Enable gzip compression

## Cost Optimization

1. **Right-sizing**:
   - Start with smaller instances
   - Monitor usage and scale as needed
   - Use spot instances for non-critical environments

2. **Database Optimization**:
   - Use appropriate RDS instance sizes
   - Enable automated backups with retention policies
   - Consider Aurora Serverless for variable workloads

## Support

For deployment issues:
1. Check AWS CloudWatch logs
2. Verify environment variables
3. Test database connectivity
4. Review security group configurations