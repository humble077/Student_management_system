# Grafana Loki Logging Setup

This document describes the logging setup using Grafana Loki, Promtail, and Winston.

## Architecture

```
Application (Winston) → Docker Logs → Promtail → Loki → Grafana
```

## Components

### 1. Winston Logger (Application)

The Node.js application uses Winston for structured JSON logging:

- **Location**: `server.js`
- **Format**: JSON with timestamp, level, message, and metadata
- **Output**: Console (stdout) - collected by Promtail

### 2. Promtail (Log Collector)

- **Image**: `grafana/promtail:latest`
- **Configuration**: `promtail/promtail-config.yml`
- **Function**: Collects logs from Docker containers and sends to Loki
- **Features**:
  - Auto-discovers Docker containers
  - Parses JSON logs
  - Extracts labels (level, service, container)

### 3. Loki (Log Aggregation)

- **Image**: `grafana/loki:latest`
- **Port**: 3100
- **Function**: Stores and indexes logs for querying
- **Storage**: Docker volume (`loki_data`)

### 4. Grafana (Visualization)

- **Datasource**: Pre-configured Loki datasource
- **Dashboard**: "Student Management System - Logs Dashboard"
- **Features**:
  - Real-time log streaming
  - Log filtering by level, service, container
  - Log rate visualization
  - HTTP request log analysis

## Log Structure

Application logs are structured JSON:

```json
{
  "level": "info",
  "message": "HTTP Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "student-management-system",
  "method": "GET",
  "path": "/api/students",
  "statusCode": 200,
  "duration": "0.006s",
  "ip": "172.19.0.6"
}
```

## Log Levels

- **error**: Errors and exceptions
- **warn**: Warnings (validation failures, etc.)
- **info**: General information (HTTP requests, DB connections)
- **debug**: Debug information (detailed operations)

## Accessing Logs

### Via Grafana

1. Open http://localhost:3001
2. Login (admin/admin)
3. Navigate to **Dashboards** → **Student Management System - Logs Dashboard**
4. View real-time logs with filtering options

### Via Loki API

```bash
# Query logs
curl "http://localhost:3100/loki/api/v1/query_range?query={service=\"student-management-system\"}&limit=100"

# Query by log level
curl "http://localhost:3100/loki/api/v1/query_range?query={service=\"student-management-system\",level=\"error\"}"
```

### Via Docker Logs

```bash
# View application logs
docker-compose logs app

# Follow logs
docker-compose logs -f app

# View Promtail logs
docker-compose logs promtail
```

## Log Queries (LogQL)

### Basic Queries

```logql
# All application logs
{service="student-management-system"}

# Error logs only
{service="student-management-system", level="error"}

# HTTP request logs
{service="student-management-system"} |= "HTTP Request"

# Logs from last 15 minutes
{service="student-management-system"} [15m]
```

### Advanced Queries

```logql
# Count logs by level
sum(count_over_time({service="student-management-system"}[1m])) by (level)

# Log rate by level
sum(rate({service="student-management-system"}[5m])) by (level)

# Error rate
sum(rate({service="student-management-system", level="error"}[5m]))
```

## Dashboard Panels

The logs dashboard includes:

1. **Application Logs**: Full log stream with filtering
2. **Logs by Level**: Time series showing log counts by level
3. **Log Rate by Level**: Rate of logs per second by level
4. **Error Logs Counter**: Total error logs in last 5 minutes
5. **Warning Logs Counter**: Total warning logs in last 5 minutes
6. **Info Logs Counter**: Total info logs in last 5 minutes
7. **HTTP Request Logs**: Filtered view of HTTP request logs

## Testing Logs

### Generate Test Logs

```bash
# Make API requests to generate logs
curl http://localhost:3000/api/students
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","age":20,"course":"CS"}'

# Check health endpoint
curl http://localhost:3000/health
```

### Verify Logs in Grafana

1. Wait 10-30 seconds for logs to appear
2. Open Grafana dashboard
3. Check "Application Logs" panel
4. You should see:
   - Server startup logs
   - MongoDB connection logs
   - HTTP request logs
   - API operation logs

## Troubleshooting

### Logs Not Appearing

1. **Check Promtail**:
   ```bash
   docker-compose logs promtail
   ```

2. **Check Loki**:
   ```bash
   docker-compose logs loki
   ```

3. **Verify Application Logs**:
   ```bash
   docker-compose logs app
   ```

4. **Check Docker Socket**:
   - On Linux/Mac: `/var/run/docker.sock` should be accessible
   - On Windows: Docker Desktop should be running

### Promtail Not Collecting Logs

- Ensure Docker socket is mounted correctly
- Check Promtail configuration file
- Verify container labels are correct

### Grafana Not Showing Logs

- Check Loki datasource is configured
- Verify Loki is accessible from Grafana
- Check dashboard query syntax

## Production Considerations

### Log Retention

Configure in `docker-compose.yml`:

```yaml
loki:
  command:
    - -config.file=/etc/loki/local-config.yaml
    - -storage.tsdb.retention.time=168h  # 7 days
```

### Log Volume

Monitor Loki data volume size:

```bash
docker volume inspect student-management-system_loki_data
```

### Performance

- Use log sampling for high-volume applications
- Configure log rotation
- Set appropriate retention periods

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Winston log level | `info` |

Set in `.env` or `docker-compose.yml`:

```yaml
environment:
  - LOG_LEVEL=debug  # or info, warn, error
```

## Screenshots

To capture Grafana logs dashboard:

1. Start services: `docker-compose up -d`
2. Generate some API requests
3. Open Grafana: http://localhost:3001
4. Navigate to "Student Management System - Logs Dashboard"
5. Take screenshot showing:
   - Application logs panel
   - Logs by level graph
   - Log statistics

## References

- [Grafana Loki Documentation](https://grafana.com/docs/loki/latest/)
- [Promtail Documentation](https://grafana.com/docs/loki/latest/clients/promtail/)
- [Winston Documentation](https://github.com/winstonjs/winston)

