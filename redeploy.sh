#!/bin/bash

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 [frontend|backend|all]"
  exit 1
fi

# Function to deploy frontend
deploy_frontend() {
  echo "Rebuilding and redeploying frontend..."
  docker-compose build frontend
  docker-compose up -d frontend
}

# Function to deploy backend
deploy_backend() {
  echo "Remember to provide a valid reef/config/config.json"
  echo "Rebuilding and redeploying backend..."
  docker-compose build backend
  docker-compose up -d backend
}

# Conditional logic based on argument
case $1 in
  frontend)
    deploy_frontend
    ;;
  backend)
    deploy_backend
    ;;
  all)
    deploy_backend
    deploy_frontend
    ;;
  *)
    echo "Invalid argument. Usage: $0 [frontend|backend|all]"
    exit 1
    ;;
esac
