# My Git Commit History

These are the commits I made while building this project. I'm still learning Git, so some commit messages might not be perfect! 😅

```
Initial commit - basic CRUD with in-memory storage
- Started with simple array to store students
- Basic HTML/CSS/JS frontend
- Express server with GET, POST, PUT, DELETE endpoints

Added form validation
- Client-side validation
- Server-side validation
- Error messages

Added MongoDB
- Installed mongoose
- Created student schema
- Changed from array to database
- Had to learn async/await for this!

Fixed MongoDB connection issues
- Connection string problems
- Had to use environment variables

Added Docker support
- Created Dockerfile
- First time using Docker, took a while to understand
- Had issues with port mapping

Added docker-compose
- MongoDB service
- App service
- Learned about Docker networking

Added Prometheus metrics
- Installed prom-client
- Added /metrics endpoint
- Created custom metrics for HTTP requests
- Watched tutorials to understand histograms

Added Prometheus service to docker-compose
- Prometheus container
- Configuration file
- Still learning about scraping

Added Grafana
- Created dashboard
- Connected to Prometheus
- First time making dashboards, lots of trial and error

Added health check endpoint
- /health route
- Checks database connection
- Returns status and uptime

Added Winston logger
- For bonus task
- JSON format logging
- Learned about log levels

Added Loki and Promtail
- Loki for log aggregation
- Promtail to collect logs
- Complex setup but got it working

Created logs dashboard in Grafana
- Logs visualization
- Filters by level
- HTTP request logs

Fixed Docker networking
- Containers couldn't communicate
- Fixed network configuration
- Everything works now!

Updated README
- Added deployment instructions
- Added setup guide
- Added what I learned section

Final deployment setup
- Render configuration
- Environment variables
- MongoDB Atlas setup
```

## Git Commands I Used

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Regular workflow
git add .
git commit -m "Added feature X"
git push origin main

# When I made mistakes
git status
git log
git diff
git checkout -- file.js  # Undo changes
```

## Notes

- I'm still learning proper commit message format
- Sometimes I commit too much at once (should commit more often)
- Had to learn about .gitignore (forgot to add node_modules at first!)
- Using GitHub Desktop sometimes instead of command line (easier for me)

