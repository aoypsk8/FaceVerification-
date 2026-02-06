# 📝 Logging System Guide

คู่มือการใช้งานระบบ Logging สำหรับ Face Verification Application

---

## 📋 Overview

ระบบ logging จะบันทึกทุก transaction ที่เกิดขึ้นในระบบ โดยบันทึกทั้งใน console และไฟล์ log เพื่อให้สามารถติดตามและ debug ได้ง่าย

---

## 🗂️ Log Files Location

Log files จะถูกบันทึกในโฟลเดอร์ `logs/` ที่ root ของ project:

```
logs/
  ├── transaction-2026-02-06.log
  ├── transaction-2026-02-07.log
  └── ...
```

**Format:** `transaction-YYYY-MM-DD.log` (แยกตามวัน)

---

## 📊 Log Types

### 1. TRANSACTION_START
บันทึกเมื่อมี request เข้ามา

```json
{
  "timestamp": "2026-02-06T10:30:00.000Z",
  "level": "INFO",
  "type": "TRANSACTION_START",
  "method": "POST",
  "path": "/api/verify",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

### 2. FILE_UPLOAD
บันทึกเมื่อมีการอัปโหลดไฟล์

```json
{
  "timestamp": "2026-02-06T10:30:01.000Z",
  "level": "INFO",
  "type": "FILE_UPLOAD",
  "fileType": "selfie",
  "filename": "selfie.jpg",
  "size": 245678,
  "mimetype": "image/jpeg",
  "sizeInMB": "0.23"
}
```

### 3. AWS_API_CALL
บันทึกเมื่อเรียก AWS Rekognition API

```json
{
  "timestamp": "2026-02-06T10:30:02.000Z",
  "level": "INFO",
  "type": "AWS_API_CALL",
  "apiName": "CompareFaces",
  "params": {
    "sourceImageSize": 245678,
    "targetImageSize": 312456
  }
}
```

### 4. AWS_API_RESPONSE
บันทึก response จาก AWS Rekognition

```json
{
  "timestamp": "2026-02-06T10:30:03.000Z",
  "level": "INFO",
  "type": "AWS_API_RESPONSE",
  "apiName": "CompareFaces",
  "response": {
    "faceMatches": 1,
    "unmatchedFaces": 0,
    "similarity": 95.5
  }
}
```

### 5. VERIFICATION_RESULT
บันทึกผลลัพธ์การ verify

```json
{
  "timestamp": "2026-02-06T10:30:04.000Z",
  "level": "INFO",
  "type": "VERIFICATION_RESULT",
  "similarity": 95.5,
  "faceMatches": 1,
  "isMatch": true,
  "message": "Identity verification successful - Faces match",
  "code": "VERIFICATION_SUCCESS",
  "statusCode": 200,
  "processingTime": 2345
}
```

### 6. TRANSACTION_END
บันทึกเมื่อ transaction เสร็จสิ้น

```json
{
  "timestamp": "2026-02-06T10:30:05.000Z",
  "level": "INFO",
  "type": "TRANSACTION_END",
  "method": "POST",
  "path": "/api/verify",
  "statusCode": 200,
  "processingTime": 2345
}
```

### 7. ERROR
บันทึกเมื่อเกิด error

```json
{
  "timestamp": "2026-02-06T10:30:06.000Z",
  "level": "ERROR",
  "type": "ERROR",
  "errorName": "InvalidParameterException",
  "errorMessage": "Invalid image format",
  "errorStack": "...",
  "endpoint": "/api/verify",
  "processingTime": 1234
}
```

### 8. WARNING
บันทึก warning messages

```json
{
  "timestamp": "2026-02-06T10:30:07.000Z",
  "level": "WARN",
  "type": "WARNING",
  "message": "Same file uploaded for both selfie and ID document",
  "hash": "abc123..."
}
```

---

## 🔍 Log Format

ทุก log entry เป็น JSON format (one line per entry) เพื่อให้ง่ายต่อการ parse และ analyze

---

## 📈 Example Log Flow

ตัวอย่าง log flow สำหรับ transaction หนึ่งครั้ง:

```
📥 [2026-02-06T10:30:00.000Z] POST /api/verify - IP: 127.0.0.1
📎 File uploaded: selfie - 0.23MB
📎 File uploaded: idDocument - 0.30MB
☁️  AWS API Call: CompareFaces
✅ AWS Response: CompareFaces - 1 face(s) matched
✅ Verification Result: 95.5% similarity - Identity verification successful - Faces match
📤 [2026-02-06T10:30:05.000Z] POST /api/verify - Status: 200 (2345ms)
```

---

## 🛠️ Usage

### View Logs in Real-time

```bash
# View today's logs
tail -f logs/transaction-$(date +%Y-%m-%d).log

# View logs with JSON formatting
tail -f logs/transaction-$(date +%Y-%m-%d).log | jq .
```

### Search Logs

```bash
# Search for errors
grep '"level":"ERROR"' logs/transaction-*.log

# Search for specific API calls
grep '"type":"AWS_API_CALL"' logs/transaction-*.log

# Search for failed verifications
grep '"isMatch":false' logs/transaction-*.log

# Search by date range
grep "2026-02-06" logs/transaction-*.log
```

### Analyze Logs

```bash
# Count total transactions today
grep '"type":"TRANSACTION_START"' logs/transaction-$(date +%Y-%m-%d).log | wc -l

# Count successful verifications
grep '"isMatch":true' logs/transaction-$(date +%Y-%m-%d).log | wc -l

# Count failed verifications
grep '"isMatch":false' logs/transaction-$(date +%Y-%m-%d).log | wc -l

# Average processing time
grep '"type":"TRANSACTION_END"' logs/transaction-$(date +%Y-%m-%d).log | \
  jq -r '.processingTime' | awk '{sum+=$1; count++} END {print sum/count}'
```

---

## 🔧 Configuration

### Log Directory

Log directory ถูกสร้างอัตโนมัติเมื่อ server start ครั้งแรก

### Log Rotation

Log files จะถูกแยกตามวันอัตโนมัติ (ไม่มีการ rotate ภายในวันเดียวกัน)

### Log Retention

**Recommendation:** ลบ log files ที่เก่ากว่า 30 วัน:

```bash
# Delete logs older than 30 days
find logs/ -name "transaction-*.log" -mtime +30 -delete
```

หรือเพิ่มใน cron job:

```bash
# Add to crontab
0 0 * * * find /path/to/project/logs/ -name "transaction-*.log" -mtime +30 -delete
```

---

## 📊 Log Analysis Tools

### Using jq (JSON processor)

```bash
# Install jq
brew install jq  # macOS
apt-get install jq  # Ubuntu

# Pretty print logs
cat logs/transaction-2026-02-06.log | jq .

# Extract specific fields
cat logs/transaction-2026-02-06.log | jq '.similarity, .processingTime'

# Filter by type
cat logs/transaction-2026-02-06.log | jq 'select(.type == "VERIFICATION_RESULT")'
```

### Using Python

```python
import json

# Read and parse logs
with open('logs/transaction-2026-02-06.log', 'r') as f:
    logs = [json.loads(line) for line in f]

# Filter successful verifications
successful = [log for log in logs if log.get('isMatch') == True]

# Calculate average similarity
similarities = [log['similarity'] for log in logs if 'similarity' in log]
avg_similarity = sum(similarities) / len(similarities) if similarities else 0
```

---

## 🔒 Security Considerations

1. **Sensitive Data:** Log files ไม่บันทึก buffer data ของ images (บันทึกแค่ size)
2. **File Permissions:** Log files ควรมี permissions ที่เหมาะสม (600 หรือ 640)
3. **Log Rotation:** ควรลบ log files เก่าเป็นประจำ
4. **Access Control:** จำกัดการเข้าถึง log directory

---

## 📝 Best Practices

1. **Monitor Logs Regularly:** ตรวจสอบ logs เป็นประจำเพื่อหา errors หรือ patterns
2. **Set Up Alerts:** ตั้ง alert สำหรับ errors หรือ failed verifications
3. **Backup Logs:** Backup log files สำคัญ (เช่น logs ที่มี errors)
4. **Log Analysis:** วิเคราะห์ logs เพื่อปรับปรุง performance และ accuracy

---

## 🆘 Troubleshooting

### Logs not being created

- ตรวจสอบว่า directory `logs/` มี permissions ที่ถูกต้อง
- ตรวจสอบ disk space
- ตรวจสอบ console output สำหรับ error messages

### Log files too large

- ตั้ง log rotation policy
- ลบ log files เก่าเป็นประจำ
- ใช้ compression สำหรับ log files เก่า

### Missing log entries

- ตรวจสอบว่า middleware ถูก register ถูกต้อง
- ตรวจสอบ error handling ใน logger utility

---

## 📚 Additional Resources

- [JSON Log Format Best Practices](https://www.loggly.com/ultimate-guide/node-logging-basics/)
- [Log Analysis Tools](https://www.loggly.com/blog/log-analysis-tools/)
