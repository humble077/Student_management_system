# Deployment Guide

This guide provides step-by-step instructions for deploying the Student Management System.

## Prerequisites

- Docker and Docker Compose installed
- GitHub account
- MongoDB Atlas account (for cloud deployment)
- Cloud hosting account (Render/AWS EC2/DigitalOcean)

## Step 1: Local Testing with Docker

### 1.1 Build and Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/Student-management-system.git
cd Student-management-system

# Create .env file
cp .env.example .env
# Edit .env and set MONGODB_URI for local: mongodb://mongodb:27017/studentdb

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### 1.2 Verify Services

- Application: http://localhost:3000
- Health Check: http://localhost:3000/health
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090

### 1.3 Test the Application

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API
curl http://localhost:3000/api/students

# Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":20,"course":"Computer Science"}'
```

## Step 2: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free tier M0)
4. Create a database user:
   - Username: `your-username`
   - Password: `your-password`
5. Whitelist IP addresses:
   - For testing: `0.0.0.0/0` (allows all IPs)
   - For production: Add specific IPs
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/studentdb?retryWrites=true&w=majority`

## Step 3: Deploy to Render

### 3.1 Prepare Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Add Docker and deployment configuration"
git push origin main
```

### 3.2 Deploy on Render

1. Sign up at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name**: student-management-system
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. Add Environment Variables:
   - `PORT`: `3000` (or leave empty, Render provides PORT)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Your app will be live at: `https://your-app-name.onrender.com`

### 3.3 Verify Deployment

```bash
# Test health endpoint
curl https://your-app-name.onrender.com/health

# Test API
curl https://your-app-name.onrender.com/api/students
```

## Step 4: Setup CI/CD (GitHub Actions)

The CI/CD pipeline is already configured in `.github/workflows/deploy.yml`.

### 4.1 Automatic Testing

- On every push/PR, the pipeline will:
  - Install dependencies
  - Build Docker image
  - Test container health

### 4.2 View Pipeline Status

1. Go to your GitHub repository
2. Click "Actions" tab
3. View workflow runs

## Step 5: Monitoring Setup

### 5.1 Local Monitoring

When running `docker-compose up`, monitoring is automatically set up:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### 5.2 Grafana Dashboard

1. Access Grafana: http://localhost:3001
2. Login: admin/admin
3. Navigate to Dashboards
4. View "Student Management System - Monitoring"

### 5.3 Production Monitoring

For production, you can:
- Use Grafana Cloud (free tier available)
- Set up Prometheus on a separate server
- Use cloud monitoring services (Datadog, New Relic, etc.)

## Step 6: Health Checks

### 6.1 Application Health

```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "database": "connected",
  "memory": { ... }
}
```

### 6.2 Metrics Endpoint

```bash
curl https://your-app-name.onrender.com/metrics
```

Returns Prometheus metrics in text format.

## Troubleshooting

### Issue: MongoDB Connection Failed

**Solution**:
1. Check MongoDB Atlas connection string
2. Verify IP whitelist includes your server IP
3. Check environment variable `MONGODB_URI`

### Issue: Port Already in Use

**Solution**:
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change port in docker-compose.yml
```

### Issue: Docker Build Fails

**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue: Container Exits Immediately

**Solution**:
```bash
# Check logs
docker-compose logs app

# Check if MongoDB is running
docker-compose ps

# Restart services
docker-compose restart
```

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Environment variables configured
- [ ] Docker Compose tested locally
- [ ] Health endpoint working
- [ ] GitHub repository pushed
- [ ] Render/AWS/DigitalOcean account created
- [ ] Application deployed
- [ ] Live URL tested
- [ ] Grafana dashboard accessible (local)
- [ ] CI/CD pipeline running
- [ ] Monitoring configured

## Next Steps

1. **Security**:
   - Change default Grafana password
   - Use environment variables for secrets
   - Enable HTTPS (Render provides automatically)

2. **Performance**:
   - Add caching (Redis)
   - Optimize database queries
   - Add rate limiting

3. **Monitoring**:
   - Set up alerts in Grafana
   - Configure uptime monitoring
   - Add error tracking (Sentry)

4. **Backup**:
   - Configure MongoDB Atlas backups
   - Set up database snapshots

## Support

For issues or questions:
- Check GitHub Issues
- Review Docker logs
- Verify environment variables
- Test locally first

