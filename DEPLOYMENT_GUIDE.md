# 🚀 Deployment Guide - Face Verification App

คู่มือการ deploy แอปพลิเคชัน Face Verification บน cloud platforms ต่างๆ

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Heroku](#heroku)
4. [Railway](#railway)
5. [Render](#render)
6. [AWS EC2](#aws-ec2)
7. [Vercel](#vercel)
8. [Environment Variables](#environment-variables)
9. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

ก่อน deploy ต้องมี:

- ✅ AWS Account พร้อม Rekognition access
- ✅ AWS IAM User พร้อม Access Keys
- ✅ Git repository (GitHub/GitLab/Bitbucket)
- ✅ Node.js 18+ (สำหรับ local testing)

---

## Deployment Options

| Platform | Free Tier | Ease of Use | Best For |
|----------|-----------|-------------|----------|
| **Heroku** | ❌ | ⭐⭐⭐⭐⭐ | Quick deployment |
| **Railway** | ✅ | ⭐⭐⭐⭐⭐ | Free tier available |
| **Render** | ✅ | ⭐⭐⭐⭐ | Free tier available |
| **AWS EC2** | ✅ (12 months) | ⭐⭐⭐ | Full control |
| **Vercel** | ✅ | ⭐⭐⭐⭐ | Serverless |

---

## 🟣 Heroku

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
# Create app
heroku create your-app-name

# Or create with specific region
heroku create your-app-name --region us
```

### Step 4: Set Environment Variables

```bash
heroku config:set AWS_ACCESS_KEY_ID=your_access_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret_key
heroku config:set AWS_REGION=ap-southeast-1
heroku config:set PORT=3000
heroku config:set NODE_ENV=production
```

### Step 5: Deploy

```bash
# Deploy to Heroku
git push heroku main

# Or if using master branch
git push heroku master
```

### Step 6: Open App

```bash
heroku open
```

**Cost:** $7/month (Hobby dyno) หรือ $25/month (Standard)

---

## 🚂 Railway

### Step 1: Sign Up

1. ไปที่ [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เลือก repository ของคุณ

### Step 3: Configure Environment Variables

ใน Railway dashboard:
1. ไปที่ Variables tab
2. เพิ่ม:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `PORT` (optional, default: 3000)
   - `NODE_ENV=production`

### Step 4: Deploy

Railway จะ deploy อัตโนมัติเมื่อ push code

### Step 5: Get Public URL

Railway จะให้ public URL อัตโนมัติ

**Cost:** Free tier available ($5 credit/month)

---

## 🎨 Render

### Step 1: Sign Up

1. ไปที่ [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service

1. คลิก "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name:** face-verification-app
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (หรือ Paid)

### Step 3: Set Environment Variables

ใน Environment Variables section:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `NODE_ENV=production`

### Step 4: Deploy

คลิก "Create Web Service" - Render จะ deploy อัตโนมัติ

**Cost:** Free tier available (sleeps after 15 min inactivity)

---

## ☁️ AWS EC2

### Step 1: Launch EC2 Instance

1. เข้า AWS Console → EC2
2. Launch Instance:
   - **AMI:** Ubuntu Server 22.04 LTS
   - **Instance Type:** t3.micro (Free tier)
   - **Security Group:** Allow HTTP (80), HTTPS (443), SSH (22)
   - **Key Pair:** Create new หรือใช้ existing

### Step 2: Connect to EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 4: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Step 5: Clone Repository

```bash
# Install git
sudo apt install git -y

# Clone your repo
git clone https://github.com/your-username/face-verification.git
cd face-verification
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Set Environment Variables

```bash
# Create .env file
nano .env

# Add:
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-1
PORT=3000
NODE_ENV=production
```

### Step 8: Start with PM2

```bash
# Start app
pm2 start src/app.js --name face-verification

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### Step 9: Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/face-verification
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/face-verification /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**Cost:** Free tier (750 hours/month) หรือ ~$7/month

---

## ▲ Vercel (Serverless)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# In project directory
vercel

# Follow prompts
# Set environment variables when asked
```

### Step 4: Set Environment Variables

```bash
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_REGION
```

**Note:** Vercel อาจต้องปรับ code สำหรับ serverless functions

**Cost:** Free tier available

---

## 🔐 Environment Variables

ทุก platform ต้องตั้งค่า environment variables เหล่านี้:

```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=ap-southeast-1
PORT=3000
NODE_ENV=production
```

---

## 📝 Post-Deployment Checklist

- [ ] Environment variables ถูกตั้งค่าครบถ้วน
- [ ] App สามารถเข้าถึงได้ผ่าน public URL
- [ ] Health endpoint (`/health`) ทำงาน
- [ ] API endpoint (`/api/verify`) ทำงาน
- [ ] Swagger docs (`/api-docs`) แสดงผล
- [ ] Frontend (`/`) แสดงผล
- [ ] AWS Rekognition API ทำงาน
- [ ] Error handling ทำงานถูกต้อง
- [ ] CORS อนุญาตให้เข้าถึงได้
- [ ] Logs ทำงาน (ตรวจสอบ errors)

---

## 🔧 Troubleshooting

### Port Issues

บาง platforms ใช้ dynamic port:

```javascript
// ใน src/app.js
const PORT = process.env.PORT || 3000;
```

### CORS Issues

ถ้ามี CORS error ให้ตรวจสอบ:

```javascript
// ใน src/app.js
app.use(cors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true
}));
```

### File Upload Size

ตรวจสอบว่า platform รองรับ file size ที่ต้องการ:

- Heroku: 30MB max
- Railway: 100MB max
- Render: 100MB max

### Environment Variables Not Loading

ตรวจสอบว่า:
- Variable names ถูกต้อง
- ไม่มี spaces หรือ quotes
- Restart app หลังจากเปลี่ยน variables

---

## 📊 Recommended Setup by Use Case

| Use Case | Recommended Platform | Reason |
|----------|---------------------|--------|
| **Quick Testing** | Railway/Render | Free tier, easy setup |
| **Production (Small)** | Railway/Render | Good balance |
| **Production (Large)** | AWS EC2 | Full control, scalable |
| **Serverless** | Vercel/AWS Lambda | Pay per use |

---

## 🔗 Useful Links

- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**Last Updated:** February 2026
