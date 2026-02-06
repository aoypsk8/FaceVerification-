# ⚡ Quick Deployment Guide

คู่มือการ deploy แบบเร็วสำหรับ platforms ต่างๆ

---

## 🚂 Railway (แนะนำ - ง่ายที่สุด + Free Tier)

### 1. Sign Up
- ไปที่ [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Deploy
1. คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เลือก repository ของคุณ
4. Railway จะ detect Node.js อัตโนมัติ

### 3. Set Environment Variables
ใน Railway dashboard → Variables:
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-southeast-1
NODE_ENV=production
```

### 4. Done! 🎉
Railway จะให้ public URL อัตโนมัติ

**Cost:** Free tier ($5 credit/month)

---

## 🎨 Render (Free Tier Available)

### 1. Sign Up
- ไปที่ [render.com](https://render.com)
- Sign up with GitHub

### 2. Create Web Service
1. "New +" → "Web Service"
2. Connect GitHub repo
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### 3. Set Environment Variables
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-southeast-1
NODE_ENV=production
```

### 4. Deploy
คลิก "Create Web Service"

**Cost:** Free (sleeps after 15 min)

---

## 🟣 Heroku (Paid, แต่เสถียร)

### 1. Install Heroku CLI
```bash
brew install heroku  # macOS
# หรือ download จาก heroku.com
```

### 2. Login & Create App
```bash
heroku login
heroku create your-app-name
```

### 3. Set Environment Variables
```bash
heroku config:set AWS_ACCESS_KEY_ID=your_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret
heroku config:set AWS_REGION=ap-southeast-1
heroku config:set NODE_ENV=production
```

### 4. Deploy
```bash
git push heroku main
heroku open
```

**Cost:** $7/month (Hobby)

---

## ☁️ AWS EC2 (Full Control)

### Quick Setup Script

```bash
# 1. SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Run setup script
curl -fsSL https://raw.githubusercontent.com/your-repo/setup.sh | bash

# หรือทำ manual:
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2

# 3. Clone & Setup
git clone https://github.com/your-username/face-verification.git
cd face-verification
npm install

# 4. Create .env
nano .env
# Add AWS credentials

# 5. Start with PM2
pm2 start src/app.js --name face-verification
pm2 save
pm2 startup

# 6. Setup Nginx (see nginx.conf.example)
```

**Cost:** Free tier (750 hours/month) หรือ ~$7/month

---

## 🐳 Docker Deployment

### Build & Run
```bash
# Build image
docker build -t face-verification .

# Run container
docker run -d \
  -p 3000:3000 \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  -e AWS_REGION=ap-southeast-1 \
  --name face-verification \
  face-verification

# Or use docker-compose
docker-compose up -d
```

---

## ✅ Post-Deployment Checklist

- [ ] App accessible via public URL
- [ ] `/health` endpoint works
- [ ] `/api/verify` endpoint works
- [ ] `/api-docs` shows Swagger UI
- [ ] Frontend (`/`) displays correctly
- [ ] File upload works
- [ ] AWS Rekognition API works
- [ ] Environment variables set correctly

---

## 🔧 Troubleshooting

### App won't start
- Check logs: `heroku logs --tail` หรือ Railway/Render logs
- Verify environment variables
- Check PORT variable

### CORS errors
- Update CORS config in `src/app.js`
- Add your domain to allowed origins

### File upload fails
- Check file size limits (5MB)
- Verify multer configuration

---

## 📞 Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Platform-specific docs:
  - [Railway Docs](https://docs.railway.app)
  - [Render Docs](https://render.com/docs)
  - [Heroku Docs](https://devcenter.heroku.com)
