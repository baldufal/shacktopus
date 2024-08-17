#!/bin/bash
# Rebuild the images
docker-compose build frontend
docker-compose build backend

# Redeploy the containers
docker-compose up -d frontend
docker-compose up -d backend