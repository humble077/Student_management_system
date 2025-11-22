# Quick Start Guide

## Local Development (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start with Docker Compose (includes MongoDB, Prometheus, Grafana)
docker-compose up -d

# 3. Access the application
# App: http://localhost:3000
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
```

## Cloud Deployment (Render - 10 minutes)

1. **Setup MongoDB Atlas** (5 min):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

2. **Deploy to Render** (5 min):
   - Go to https://render.com
   - New Web Service → Connect GitHub
   - Build: `npm install`
   - Start: `node server.js`
   - Add env: `MONGODB_URI=your-atlas-connection-string`
   - Deploy!

## Test Health Endpoint

```bash
curl http://localhost:3000/health
# or for deployed app:
curl https://your-app.onrender.com/health
```

## Stop Services

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f app
```

