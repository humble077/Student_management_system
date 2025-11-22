# Student Management System

This is my first full-stack project! A CRUD (Create, Read, Update, Delete) application for managing students. 
I learned a lot while building this - Docker, MongoDB, monitoring with Prometheus/Grafana, and even logging with Loki!

## Features

- Add new students with Name, Age, and Course
- View all students in a table
- Edit existing students
- Delete students
- Form validation (client-side and server-side)
- Modern, responsive UI
- MongoDB database integration
- Docker containerization
- Prometheus & Grafana monitoring
- **Grafana Loki logging** (Bonus Feature)
- CI/CD pipeline with GitHub Actions
- Health check endpoints

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Containerization**: Docker, Docker Compose
- **Monitoring**: Prometheus, Grafana
- **Logging**: Grafana Loki, Promtail, Winston
- **CI/CD**: GitHub Actions

## Project Structure

```
Student-management-system/
├── server.js                    # Express backend server
├── package.json                 # Node.js dependencies
├── Dockerfile                   # Docker image configuration
├── docker-compose.yml           # Multi-container orchestration
├── .dockerignore               # Docker ignore file
├── .env.example                # Environment variables template
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── prometheus/
│   └── prometheus.yml          # Prometheus configuration
├── promtail/
│   └── promtail-config.yml     # Promtail log collection config
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/        # Grafana datasource config (Prometheus + Loki)
│   │   └── dashboards/         # Dashboard provisioning
│   └── dashboards/             # Dashboard definitions (Metrics + Logs)
├── README.md                   # This file
└── public/                     # Frontend files
    ├── index.html
    ├── style.css
    └── script.js
```

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB URI:
- For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/studentdb`
- For MongoDB Atlas: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentdb`

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## Docker Setup

### 1. Build and Run with Docker Compose

```bash
# Build and start all services (Node.js, MongoDB, Prometheus, Grafana)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### 2. Access Services

- **Application**: http://localhost:3000
- **Grafana Dashboard**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100
- **MongoDB**: localhost:27017

### 3. Build Docker Image Manually

```bash
# Build image
docker build -t student-management-system:latest .

# Run container
docker run -d -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/studentdb \
  --name student-app \
  student-management-system:latest

# Check health
curl http://localhost:3000/health
```

## API Endpoints

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics endpoint

## Cloud Deployment

### Option 1: Render (Recommended - Free Tier Available!)

**📖 See detailed guide**: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

**Quick Steps:**

1. **Setup MongoDB Atlas** (5 minutes):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free M0 cluster
   - Create database user (save password!)
   - Allow network access from anywhere (`0.0.0.0/0`)
   - Get connection string

2. **Deploy to Render** (10 minutes):
   - Sign up at https://render.com (use GitHub login)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `Student_management_system`
   - Configure:
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Environment Variables**:
       - `MONGODB_URI`: Your Atlas connection string
       - `NODE_ENV`: `production`
   - Choose **Free** plan
   - Click "Create Web Service"

3. **Wait 5-10 minutes** for deployment

4. **Your app will be live at**: `https://your-app-name.onrender.com`

**⚠️ Note**: Free tier sleeps after 15 min inactivity (wakes up on first request)

### Option 2: AWS EC2

1. **Launch EC2 Instance**:
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Docker
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   
   # Clone repository
   git clone https://github.com/yourusername/Student-management-system.git
   cd Student-management-system
   
   # Create .env file
   nano .env
   # Add: MONGODB_URI=your-mongodb-atlas-uri
   
   # Start services
   docker-compose up -d
   ```

2. **Configure Security Groups**:
   - Open ports: 22 (SSH), 3000 (App), 3001 (Grafana), 9090 (Prometheus)

### Option 3: DigitalOcean

1. **Using App Platform**:
   - Connect GitHub repository
   - Select Node.js environment
   - Add environment variables
   - Deploy automatically

2. **Using Droplet**:
   - Similar to EC2 setup
   - Use Docker Compose for deployment

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **On Push/PR**:
   - Checks out code
   - Installs dependencies
   - Builds Docker image
   - Tests container health

2. **On Push to Main** (Optional):
   - Triggers deployment (configure based on your hosting provider)

### Setup GitHub Actions Secrets (Optional for Docker Hub)

If you want to push to Docker Hub:
1. Go to Repository Settings → Secrets
2. Add:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password

## Monitoring Setup

### Prometheus

- **URL**: http://localhost:9090
- **Configuration**: `prometheus/prometheus.yml`
- **Metrics Endpoint**: http://localhost:3000/metrics

### Grafana Loki (Logging)

- **URL**: http://localhost:3100
- **Configuration**: `promtail/promtail-config.yml`
- **Features**:
  - Collects logs from all Docker containers
  - Parses JSON logs from the application
  - Stores logs in Loki for querying

### Grafana

1. **Access**: http://localhost:3001
2. **Login**: 
   - Username: `admin`
   - Password: `admin` (change on first login)
3. **Pre-configured Datasources**:
   - Prometheus (metrics)
   - Loki (logs)
4. **Pre-configured Dashboards**:
   - **Student Management System - Monitoring**: Metrics dashboard
   - **Student Management System - Logs Dashboard**: Logs visualization
     - Application logs with filtering
     - Logs by level (info, warn, error)
     - HTTP request logs
     - Log rate visualization

### Health Checks

```bash
# Check application health
curl http://localhost:3000/health

# Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "database": "connected",
  "memory": { ... }
}
```

## Validation Rules

- **Name**: Cannot be empty
- **Age**: Must be a valid number (greater than 0)
- **Course**: Cannot be empty

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB connection
docker-compose logs mongodb

# Test MongoDB connection string
mongosh "your-connection-string"
```

### Container Issues

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs app

# Restart services
docker-compose restart
```

### Port Conflicts

If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run with Docker
docker-compose up

# Build Docker image
docker build -t student-management-system .

# Run tests (if available)
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://mongodb:27017/studentdb |
| `NODE_ENV` | Environment mode | production |

## License

ISC

## Author

Made by a student learning full-stack development! 😊

## What I Learned

- Express.js and REST APIs
- MongoDB and Mongoose (first time using a database!)
- Docker and Docker Compose (containerization was confusing at first)
- Prometheus for metrics (monitoring is important!)
- Grafana for visualization (dashboards are cool!)
- Winston and Loki for logging (bonus task)
- GitHub Actions for CI/CD
- Environment variables and .env files
- Async/await and promises

---

## Deployment Summary

### Steps Completed:
1. ✅ Dockerized the application with Dockerfile
2. ✅ Created docker-compose.yml for multi-container setup
3. ✅ Integrated MongoDB with Mongoose
4. ✅ Added Prometheus metrics collection
5. ✅ Configured Grafana for visualization
6. ✅ Implemented health check endpoint
7. ✅ Set up CI/CD pipeline with GitHub Actions
8. ✅ Created environment variable templates

### Challenges I Faced:
- **MongoDB Integration**: First time using a database! Had to learn Mongoose, schemas, and async/await. Took me a while to understand promises.
- **Docker Networking**: Containers couldn't talk to each other at first. Fixed it by using docker-compose networks properly.
- **Prometheus Metrics**: Histograms and counters were confusing. Read a lot of docs and watched tutorials.
- **Grafana Dashboard**: So many options! Started simple and built up gradually.
- **Health Checks**: Learned about HTTP status codes (200 vs 503) and what makes a good health check.
- **Loki Setup**: Promtail configuration was complex, but got it working with Docker service discovery.

### Live Deployment:
- **URL**: [Your deployed URL here]
- **MongoDB**: MongoDB Atlas (Cloud)
- **Hosting**: [Render/AWS EC2/DigitalOcean]

### Monitoring:
- **Grafana Dashboard**: http://localhost:3001 (local) or [your-deployed-url]:3001
- **Screenshot**: [Attach Grafana dashboard screenshot]
