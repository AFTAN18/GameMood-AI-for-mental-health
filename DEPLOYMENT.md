# GameMood AI Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Git repository set up

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard**
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
   REACT_APP_SENTRY_DSN=your_sentry_dsn
   ```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd gamemood-ai
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Run Database Migrations**
   ```bash
   docker-compose exec backend npm run db:migrate
   ```

5. **Seed Database (Optional)**
   ```bash
   docker-compose exec backend npm run db:seed
   ```

### Using Docker

1. **Build Image**
   ```bash
   docker build -t gamemood-ai .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 -p 5000:5000 gamemood-ai
   ```

## ☁️ Cloud Deployment

### AWS Deployment

1. **Using AWS Amplify**
   - Connect your GitHub repository
   - Set build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

2. **Using AWS ECS**
   - Push Docker image to ECR
   - Create ECS task definition
   - Deploy using ECS service

### Google Cloud Platform

1. **Using Cloud Run**
   ```bash
   gcloud run deploy gamemood-ai --source . --platform managed --region us-central1
   ```

2. **Using App Engine**
   - Create `app.yaml`:
     ```yaml
     runtime: nodejs18
     env: standard
     automatic_scaling:
       min_instances: 1
       max_instances: 10
     ```

### Azure Deployment

1. **Using Azure App Service**
   - Create App Service plan
   - Deploy from GitHub
   - Configure environment variables

## 🗄️ Database Setup

### PostgreSQL

1. **Local Development**
   ```bash
   # Install PostgreSQL
   brew install postgresql  # macOS
   sudo apt-get install postgresql  # Ubuntu
   
   # Create database
   createdb gamemood_ai
   
   # Run migrations
   npm run db:migrate
   ```

2. **Production (AWS RDS)**
   - Create RDS PostgreSQL instance
   - Configure security groups
   - Set connection string in environment variables

3. **Production (Google Cloud SQL)**
   - Create Cloud SQL instance
   - Configure authorized networks
   - Set connection string

### Redis

1. **Local Development**
   ```bash
   # Install Redis
   brew install redis  # macOS
   sudo apt-get install redis  # Ubuntu
   
   # Start Redis
   redis-server
   ```

2. **Production (AWS ElastiCache)**
   - Create ElastiCache Redis cluster
   - Configure security groups
   - Set Redis URL in environment variables

## 🔧 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_key
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=gamemood
DB_PASSWORD=your_password
DB_NAME=gamemood_ai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
STEAM_API_KEY=your_steam_key
DISCORD_CLIENT_ID=your_discord_id
DISCORD_CLIENT_SECRET=your_discord_secret
```

## 📊 Monitoring & Logging

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior analytics
- **New Relic**: Application performance monitoring

### Logging
- **Winston**: Structured logging
- **CloudWatch**: AWS logging (if using AWS)
- **Stackdriver**: Google Cloud logging (if using GCP)

## 🔒 Security

### SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Configure HTTPS redirects
- Set secure headers

### Environment Security
- Use secrets management (AWS Secrets Manager, Azure Key Vault)
- Rotate API keys regularly
- Use environment-specific configurations

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Backend
- Use Redis for caching
- Implement database connection pooling
- Use compression middleware
- Optimize database queries

## 🔄 Backup & Recovery

### Database Backups
```bash
# PostgreSQL backup
pg_dump gamemood_ai > backup.sql

# Restore
psql gamemood_ai < backup.sql
```

### Automated Backups
- Set up automated daily backups
- Store backups in multiple regions
- Test restore procedures regularly

## 📞 Support & Maintenance

### Health Checks
- `/health` endpoint for application health
- Database connection checks
- External service availability checks

### Monitoring Alerts
- Set up alerts for critical errors
- Monitor response times
- Track user engagement metrics

## 🎯 Scaling

### Horizontal Scaling
- Use load balancers
- Implement auto-scaling
- Use container orchestration (Kubernetes)

### Vertical Scaling
- Increase server resources
- Optimize database performance
- Use caching strategies

---

For more detailed information, see the [Technical Documentation](./TECHNICAL_DOCS.md).
