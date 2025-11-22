# Learning Notes

This file contains notes I made while learning and building this project.

## Things I Learned

### Week 1: Basic CRUD
- Started with in-memory array storage
- Learned about REST APIs (GET, POST, PUT, DELETE)
- Frontend-backend communication with fetch API
- Form validation (both client and server side)

### Week 2: MongoDB Integration
- First time using a database!
- Learned about Mongoose schemas
- Async/await was confusing at first but now I understand it
- MongoDB Atlas setup was tricky but got it working

### Week 3: Docker
- Docker was really hard to understand at first
- Learned about Dockerfile and docker-compose.yml
- Container networking was confusing
- But now I can containerize any app!

### Week 4: Monitoring & Logging
- Prometheus metrics - had to read a lot of docs
- Grafana dashboards - so many options!
- Loki logging - bonus task, took extra time but worth it
- Winston logger - first time using a logging library

## Challenges I Faced

1. **MongoDB Connection**: Had issues with connection strings, especially for Docker
   - Solution: Used environment variables and proper URI format

2. **Docker Networking**: Containers couldn't talk to each other
   - Solution: Used docker-compose networks

3. **Prometheus Metrics**: Didn't understand histograms and counters at first
   - Solution: Read examples and watched tutorials

4. **Grafana Dashboards**: Creating dashboards was overwhelming
   - Solution: Started with simple queries, built up gradually

5. **Loki Setup**: Promtail configuration was complex
   - Solution: Used Docker service discovery, simplified config

## Things I Want to Improve

- [ ] Add user authentication
- [ ] Add pagination for student list
- [ ] Add search functionality
- [ ] Better error handling
- [ ] Write unit tests (haven't learned testing yet)
- [ ] Add more validation rules

## Resources That Helped

- Express.js official docs
- MongoDB University free course
- Docker documentation (lots of reading!)
- Prometheus getting started guide
- Grafana tutorials on YouTube
- Stack Overflow (of course!)

## Git Commits I Made

```
Initial commit - basic CRUD with in-memory storage
Added MongoDB integration
Added Docker support
Added Prometheus metrics
Added Grafana dashboards
Added Loki logging (bonus task)
Fixed Docker networking issues
Updated README
Final deployment setup
```

## Deployment Notes

- Render was easiest to use (free tier!)
- MongoDB Atlas free tier is great for learning
- Had to configure environment variables properly
- Health check endpoint helped debug issues

---

*This project was a great learning experience!*

