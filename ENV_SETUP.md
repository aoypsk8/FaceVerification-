# 🔐 Environment Variables Setup Guide

คู่มือการตั้งค่า Environment Variables สำหรับ Face Verification App

---

## 📋 Required Environment Variables

### 1. AWS Credentials (Required)

```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-southeast-1
```

**Where to get:**
1. เข้า AWS Console → IAM → Users → Your User
2. Security credentials tab
3. Create access key
4. Copy Access Key ID และ Secret Access Key

**Region Options:**
- `ap-southeast-1` (Singapore) - แนะนำสำหรับไทย
- `ap-southeast-2` (Sydney)
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- [ดู regions อื่นๆ](https://docs.aws.amazon.com/general/latest/gr/rekognition.html)

---

## 🔧 Optional Environment Variables

### 2. Server Port (Optional)

```bash
PORT=3000
```

**Default:** 3000  
**Note:** บาง platforms (Heroku, Railway) กำหนด PORT อัตโนมัติ

### 3. Node Environment (Optional)

```bash
NODE_ENV=production
```

**Options:**
- `development` - สำหรับ local development
- `production` - สำหรับ production deployment

**Effects:**
- Development: แสดง error details ใน response
- Production: ซ่อน error details เพื่อความปลอดภัย

### 4. Server URL (Optional - สำหรับ Swagger)

```bash
SERVER_URL=https://your-domain.com
```

**Note:** 
- สำหรับ Swagger documentation
- ถ้าไม่ตั้งค่า จะใช้ auto-detect จาก platform:
  - Railway: `RAILWAY_PUBLIC_DOMAIN`
  - Render: `RENDER_EXTERNAL_URL`
  - Vercel: `VERCEL_URL`

---

## 📝 Complete .env Example

### For Local Development

```bash
# AWS Credentials (Required)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-southeast-1

# Server Configuration (Optional)
PORT=3000
NODE_ENV=development
```

### For Production

```bash
# AWS Credentials (Required)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-southeast-1

# Server Configuration (Optional)
PORT=3000
NODE_ENV=production
SERVER_URL=https://your-domain.com
```

---

## 🚀 Platform-Specific Setup

### Railway

ใน Railway Dashboard → Variables:

```
AWS_ACCESS_KEY_ID = AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION = ap-southeast-1
NODE_ENV = production
```

**Note:** ไม่ต้องตั้ง `PORT` - Railway กำหนดให้อัตโนมัติ

---

### Render

ใน Render Dashboard → Environment:

```
AWS_ACCESS_KEY_ID = AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION = ap-southeast-1
NODE_ENV = production
```

**Note:** ไม่ต้องตั้ง `PORT` - Render กำหนดให้อัตโนมัติ

---

### Heroku

```bash
heroku config:set AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
heroku config:set AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
heroku config:set AWS_REGION=ap-southeast-1
heroku config:set NODE_ENV=production
```

**Note:** ไม่ต้องตั้ง `PORT` - Heroku กำหนดให้อัตโนมัติ

---

### AWS EC2

สร้างไฟล์ `.env` ใน project directory:

```bash
nano .env
```

เพิ่ม:
```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-southeast-1
PORT=3000
NODE_ENV=production
```

---

### Docker

#### Option 1: Environment Variables

```bash
docker run -d -p 3000:3000 \
  -e AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE \
  -e AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
  -e AWS_REGION=ap-southeast-1 \
  -e NODE_ENV=production \
  face-verification
```

#### Option 2: .env file

```bash
# docker-compose.yml จะอ่านจาก .env file อัตโนมัติ
docker-compose up -d
```

---

## ✅ Verification Checklist

หลังจากตั้งค่า environment variables แล้ว:

- [ ] `AWS_ACCESS_KEY_ID` ถูกตั้งค่า
- [ ] `AWS_SECRET_ACCESS_KEY` ถูกตั้งค่า
- [ ] `AWS_REGION` ถูกตั้งค่า
- [ ] Server start ได้โดยไม่มี error
- [ ] Health endpoint (`/health`) ทำงาน
- [ ] API endpoint (`/api/verify`) ทำงาน
- [ ] AWS Rekognition API เรียกได้

---

## 🔒 Security Best Practices

### 1. Never Commit .env File

```bash
# .env ควรอยู่ใน .gitignore
echo ".env" >> .gitignore
```

### 2. Use Platform Secrets Management

- ✅ ใช้ platform's environment variables (Railway, Render, Heroku)
- ❌ อย่า hardcode credentials ใน code
- ❌ อย่า commit .env file

### 3. Rotate Credentials Regularly

- เปลี่ยน AWS credentials ทุก 90 วัน
- ใช้ IAM roles แทน access keys ถ้าเป็นไปได้

### 4. Limit IAM Permissions

ใช้ least privilege principle:
- ให้เฉพาะ permissions ที่จำเป็น
- ใช้ custom policy แทน full access

---

## 🧪 Testing Environment Variables

### Check if variables are set:

```bash
# Local
node -e "require('dotenv').config(); console.log(process.env.AWS_REGION)"

# Heroku
heroku config

# Railway/Render
# Check in dashboard → Environment Variables
```

### Test AWS Connection:

```bash
# Test with AWS CLI
aws rekognition list-collections --region ap-southeast-1
```

---

## 📊 Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | ✅ Yes | - | AWS Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | ✅ Yes | - | AWS Secret Access Key |
| `AWS_REGION` | ✅ Yes | - | AWS Region (e.g., ap-southeast-1) |
| `PORT` | ❌ No | 3000 | Server port |
| `NODE_ENV` | ❌ No | development | Environment mode |
| `SERVER_URL` | ❌ No | auto-detect | Server URL for Swagger |

---

## 🆘 Troubleshooting

### Error: "AWS credentials are incomplete"

**Solution:**
- ตรวจสอบว่า environment variables ถูกตั้งค่าครบทั้ง 3 ตัว
- ตรวจสอบว่าไม่มี spaces หรือ quotes
- Restart server หลังจากเปลี่ยน variables

### Error: "AccessDeniedException"

**Solution:**
- ตรวจสอบ IAM permissions
- ดู `AWS_IAM_SETUP.md` สำหรับการตั้งค่า IAM

### Error: "Invalid region"

**Solution:**
- ตรวจสอบว่า region name ถูกต้อง
- ใช้ format: `ap-southeast-1` (ไม่ใช่ `ap-southeast-1a`)

---

## 📚 Additional Resources

- [AWS Regions](https://docs.aws.amazon.com/general/latest/gr/rekognition.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Environment Variables Guide](https://12factor.net/config)
