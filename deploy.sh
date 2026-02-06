#!/bin/bash

# Deployment script for Face Verification App
# Usage: ./deploy.sh [platform]
# Platforms: heroku, railway, render, ec2

set -e

PLATFORM=${1:-"help"}

case $PLATFORM in
  heroku)
    echo "🚀 Deploying to Heroku..."
    heroku config:set NODE_ENV=production
    git push heroku main
    heroku open
    ;;
  
  railway)
    echo "🚂 Deploying to Railway..."
    echo "Note: Railway auto-deploys on git push"
    echo "Make sure your repo is connected to Railway"
    git push origin main
    ;;
  
  render)
    echo "🎨 Deploying to Render..."
    echo "Note: Render auto-deploys on git push"
    echo "Make sure your repo is connected to Render"
    git push origin main
    ;;
  
  ec2)
    echo "☁️  Deploying to AWS EC2..."
    echo "Please SSH into your EC2 instance and run:"
    echo "  cd face-verification"
    echo "  git pull origin main"
    echo "  npm install"
    echo "  pm2 restart face-verification"
    ;;
  
  docker)
    echo "🐳 Building Docker image..."
    docker build -t face-verification .
    echo "✅ Docker image built successfully"
    echo "Run with: docker-compose up -d"
    ;;
  
  *)
    echo "Usage: ./deploy.sh [platform]"
    echo ""
    echo "Available platforms:"
    echo "  heroku  - Deploy to Heroku"
    echo "  railway - Deploy to Railway (auto-deploy)"
    echo "  render  - Deploy to Render (auto-deploy)"
    echo "  ec2     - Show EC2 deployment instructions"
    echo "  docker  - Build Docker image"
    ;;
esac
