# 🚀 Deployment Guide for Accessible Learning Platform

## Overview
This guide covers multiple hosting options for your full-stack React + Node.js + MongoDB application.

## 📋 Prerequisites
- GitHub repository with your code
- MongoDB database (local or cloud)
- Node.js environment for backend
- Web server for frontend

---

## Option 1: Vercel + MongoDB Atlas (Recommended for Quick Start)

### 1. Database Setup (MongoDB Atlas)
```bash
# 1. Create account at https://www.mongodb.com/atlas
# 2. Create a free cluster
# 3. Get connection string: mongodb+srv://username:password@cluster.mongodb.net/learning-platform
```

### 2. Backend Deployment (Vercel)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
vercel --prod
```

### 3. Frontend Deployment (Vercel)
```bash
# 1. Update API URLs in frontend
# Edit frontend/src/context/AuthContext.jsx
# Change localhost:3001 to your Vercel backend URL

# 2. Deploy frontend
cd frontend
npm run build
vercel --prod
```

---

## Option 2: Heroku (Full Stack)

### 1. Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Verify installation
heroku --version
```

### 2. Prepare Backend for Heroku
```bash
# Create Procfile in backend directory
echo "web: node server.js" > backend/Procfile

# Update package.json scripts
# In backend/package.json, add:
"scripts": {
  "start": "node server.js",
  "heroku-postbuild": "echo 'Backend ready'"
}
```

### 3. Deploy Backend
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-backend

# Set environment variables
heroku config:set MONGO_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_super_secret_key"
heroku config:set NODE_ENV="production"

# Deploy
cd backend
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### 4. Deploy Frontend
```bash
# Create separate Heroku app for frontend
heroku create your-app-frontend

# Update API URLs to point to backend Heroku URL
# Then deploy
cd frontend
npm run build
# Use build folder for static hosting
```

---

## Option 3: DigitalOcean App Platform

### 1. Create DigitalOcean Account
- Sign up at https://www.digitalocean.com/
- Create a MongoDB database cluster

### 2. Deploy via App Spec
```yaml
# .do/app.yaml
name: accessible-learning-platform
services:
- name: backend
  source_dir: backend
  github:
    repo: yourusername/yourrepo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}

- name: frontend
  source_dir: frontend
  github:
    repo: yourusername/yourrepo
    branch: main
  build_command: npm run build
  static_sites:
  - name: frontend
    source_dir: dist
    github:
      repo: yourusername/yourrepo
      branch: main
```

---

## Option 4: AWS (Production Ready)

### 1. EC2 + S3 + CloudFront
```bash
# 1. Launch EC2 instance (t2.micro for free tier)
# 2. Install Node.js and MongoDB
# 3. Clone your repo
# 4. Configure nginx reverse proxy
# 5. Use S3 for static files
# 6. CloudFront for CDN
```

### 2. Elastic Beanstalk
```bash
# 1. Install AWS CLI
pip install awscli

# 2. Configure AWS credentials
aws configure

# 3. Deploy with EB CLI
eb init
eb create production-env
eb deploy
```

---

## Option 5: Railway + PlanetScale

### 1. Railway (Backend)
```bash
# 1. Sign up at https://railway.app/
# 2. Connect GitHub repo
# 3. Add MongoDB plugin
# 4. Set environment variables
# 5. Deploy automatically
```

### 2. PlanetScale (Database)
```bash
# Alternative to MongoDB Atlas
# MySQL-compatible database
```

---

## Option 6: Render + MongoDB Atlas

### 1. Backend on Render
```bash
# 1. Sign up at https://render.com/
# 2. Connect GitHub repo
# 3. Choose "Web Service"
# 4. Set build command: npm install
# 5. Set start command: npm start
# 6. Add environment variables
```

### 2. Frontend Static Site
```bash
# 1. Choose "Static Site"
# 2. Set build command: npm run build
# 3. Set publish directory: dist
```

---

## Environment Variables Setup

### For All Hosting Platforms:
```bash
# Copy and customize
cp backend/.env.example backend/.env

# Required variables:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-platform
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
PORT=3001
```

---

## Post-Deployment Checklist

### 1. Update Frontend API URLs
```javascript
// In frontend/src/context/AuthContext.jsx
// Change localhost:3001 to your deployed backend URL
const API_BASE_URL = 'https://your-backend-url.com';
```

### 2. Test All Features
- [ ] User registration/login
- [ ] Course creation and viewing
- [ ] Accessibility features (TTS, contrast, etc.)
- [ ] Video playback with captions
- [ ] Admin panel functionality

### 3. Security Checks
- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] CORS properly configured
- [ ] Rate limiting implemented

### 4. Performance Optimization
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Database connection pooling
- [ ] Caching strategies

---

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build scripts

2. **Database Connection:**
   - Whitelist hosting IP in MongoDB Atlas
   - Check connection string format
   - Verify network access

3. **CORS Issues:**
   - Update CORS origins in backend
   - Check API endpoint URLs in frontend

4. **Environment Variables:**
   - Ensure all required vars are set
   - Check variable naming (case-sensitive)

---

## Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Vercel | 100GB bandwidth | $20+/month | Quick deploys |
| Heroku | 550 hours/month | $7+/month | Full stack |
| DigitalOcean | - | $5+/month | VPS control |
| Railway | 512MB RAM | $5+/month | Modern DX |
| Render | 750 hours/month | $7+/month | Simple deploys |
| AWS | Limited free | Pay-as-you-go | Enterprise |

---

## Recommended Approach for Beginners

1. **Start with Vercel + MongoDB Atlas** (easiest)
2. **Scale to Heroku** when you need more control
3. **Move to AWS/DigitalOcean** for production workloads

Need help with any specific deployment option?