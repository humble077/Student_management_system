#!/bin/bash

# Simple health check test script

echo "Testing Student Management System Health Endpoint..."
echo ""

# Test health endpoint
echo "1. Testing /health endpoint:"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
echo ""

# Test metrics endpoint
echo "2. Testing /metrics endpoint:"
METRICS_RESPONSE=$(curl -s http://localhost:3000/metrics | head -20)
echo "$METRICS_RESPONSE"
echo ""

# Test API endpoint
echo "3. Testing /api/students endpoint:"
API_RESPONSE=$(curl -s http://localhost:3000/api/students)
echo "$API_RESPONSE" | jq '.' 2>/dev/null || echo "$API_RESPONSE"
echo ""

echo "Health check complete!"

