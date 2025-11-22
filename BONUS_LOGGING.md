# Bonus Task: Grafana Loki Logging Implementation ✅

## Summary

Successfully implemented comprehensive logging using **Grafana Loki** with **Promtail** and **Winston** logger.

## What Was Implemented

### 1. Winston Logger Integration ✅
- Added Winston logger to the Node.js application
- Structured JSON logging format
- Log levels: error, warn, info, debug
- Logs all HTTP requests, database operations, and application events

### 2. Loki & Promtail Setup ✅
- **Loki**: Log aggregation system (port 3100)
- **Promtail**: Log collector that scrapes Docker container logs
- **Configuration**: `promtail/promtail-config.yml`
- Auto-discovers and collects logs from all containers

### 3. Grafana Integration ✅
- Added Loki as a datasource in Grafana
- Created comprehensive logs dashboard
- Real-time log streaming
- Log filtering and visualization

### 4. Log Dashboard Features ✅
- **Application Logs Panel**: Full log stream with search/filter
- **Logs by Level**: Time series graph showing log counts by level
- **Log Rate by Level**: Rate of logs per second
- **Error/Warning/Info Counters**: Statistics for each log level
- **HTTP Request Logs**: Filtered view of HTTP requests

## Files Created/Modified

1. **package.json**: Added `winston` dependency
2. **server.js**: Integrated Winston logger with structured logging
3. **docker-compose.yml**: Added Loki and Promtail services
4. **promtail/promtail-config.yml**: Promtail configuration
5. **grafana/provisioning/datasources/datasource.yml**: Added Loki datasource
6. **grafana/dashboards/logs-dashboard.json**: Logs visualization dashboard
7. **LOKI_SETUP.md**: Comprehensive logging documentation

## How to View Logs

### Option 1: Grafana Dashboard (Recommended)
1. Start services: `docker-compose up -d`
2. Open http://localhost:3001
3. Login: admin/admin
4. Navigate to **Dashboards** → **Student Management System - Logs Dashboard**
5. View real-time logs with filtering

### Option 2: Docker Logs
```bash
docker-compose logs app
docker-compose logs -f app  # Follow logs
```

### Option 3: Loki API
```bash
curl "http://localhost:3100/loki/api/v1/query_range?query={service=\"student-management-system\"}"
```

## Sample Logs

The application generates structured JSON logs:

```json
{
  "level": "info",
  "message": "HTTP Request",
  "timestamp": "2024-11-22T18:54:06.060Z",
  "service": "student-management-system",
  "method": "GET",
  "path": "/api/students",
  "statusCode": 200,
  "duration": "0.006s"
}
```

## Testing

1. **Start Services**:
   ```bash
   docker-compose up -d
   ```

2. **Generate Logs**:
   - Access http://localhost:3000
   - Make API requests
   - Check health endpoint

3. **View in Grafana**:
   - Wait 10-30 seconds
   - Open logs dashboard
   - See logs appear in real-time

## Screenshot Instructions

To capture the logs dashboard:

1. Start all services
2. Generate some API activity (create/read/update students)
3. Open Grafana: http://localhost:3001
4. Navigate to "Student Management System - Logs Dashboard"
5. Wait for logs to populate (30 seconds)
6. Take screenshot showing:
   - Application logs panel with sample logs
   - Logs by level graph
   - Log statistics panels

## Deployment on Render

For Render deployment, note that:
- Loki and Promtail are for local development/monitoring
- On Render, use Render's built-in log viewer or external logging service
- Application logs are still available via Render dashboard
- For production, consider Grafana Cloud or similar service

## Benefits

1. **Centralized Logging**: All logs in one place
2. **Structured Logs**: JSON format for easy parsing
3. **Real-time Monitoring**: See logs as they happen
4. **Filtering & Search**: Find specific logs quickly
5. **Visualization**: Graphs and statistics for log analysis
6. **Production Ready**: Scalable logging solution

## Next Steps

- Set up log retention policies
- Configure log rotation
- Add alerting based on error logs
- Integrate with external logging services for production

---

**Status**: ✅ Complete - All logging features implemented and tested!

