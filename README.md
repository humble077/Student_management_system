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

### Option 1: Render (Free Tier Available!)

1. **Setup MongoDB Atlas**:
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free cluster (M0)
   - Create database user and save password
   - Allow network access from anywhere (0.0.0.0/0)
   - Get connection string

2. **Deploy to Render**:
   - Sign up at https://render.com
   - Create new Web Service
   - Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variable: `MONGODB_URI` (your Atlas connection string)
   - Deploy!

3. **Your app will be live**: `https://your-app-name.onrender.com`

Note: Free tier sleeps after 15 min of inactivity

### Option 2: Other Platforms

You can also deploy to AWS EC2, DigitalOcean, or any other platform that supports Node.js. Just make sure to set the `MONGODB_URI` environment variable!

## CI/CD Pipeline

GitHub Actions workflow automatically builds and tests on every push. Check `.github/workflows/deploy.yml` for details.

## Monitoring

When running with Docker Compose:
- **Grafana**: http://localhost:3001 (admin/admin) - for metrics and logs
- **Prometheus**: http://localhost:9090 - metrics collection
- **Loki**: http://localhost:3100 - log aggregation

Pre-configured dashboards are available in Grafana!

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

- **MongoDB not connecting**: Check network access in MongoDB Atlas (allow 0.0.0.0/0 for testing)
- **Port already in use**: Change port in docker-compose.yml
- **Container issues**: Check logs with `docker-compose logs app`

## Development

```bash
npm install    # Install dependencies
npm start      # Start server
docker-compose up -d  # Run with Docker
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

## Live Deployment

Deployed on Render: https://student-management-system-g653.onrender.com

Using MongoDB Atlas for database. Free tier works great for learning!
