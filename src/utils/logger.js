import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Get log file path for today
const getLogFilePath = () => {
  const today = new Date().toISOString().split('T')[0];
  return path.join(logsDir, `transaction-${today}.log`);
};

// Format log entry
const formatLogEntry = (level, data) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    ...data,
  };
  return JSON.stringify(logData);
};

// Write to file
const writeToFile = (logEntry) => {
  try {
    const logFile = getLogFilePath();
    fs.appendFileSync(logFile, logEntry + '\n', 'utf8');
  } catch (error) {
    console.error('Failed to write log to file:', error);
  }
};

// Logger object
export const logger = {
  // Log transaction start
  transactionStart: (req) => {
    const { method, path, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const logData = {
      type: 'TRANSACTION_START',
      method,
      path,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    };
    
    const logEntry = formatLogEntry('INFO', logData);
    console.log(`📥 [${logData.timestamp}] ${method} ${path} - IP: ${ip}`);
    writeToFile(logEntry);
  },

  // Log file upload details
  fileUpload: (req, fileType, fileInfo) => {
    const { filename, size, mimetype } = fileInfo;
    const logData = {
      type: 'FILE_UPLOAD',
      fileType,
      filename: filename || 'unknown',
      size,
      mimetype,
      sizeInMB: (size / (1024 * 1024)).toFixed(2),
    };
    
    const logEntry = formatLogEntry('INFO', logData);
    console.log(`📎 File uploaded: ${fileType} - ${(size / (1024 * 1024)).toFixed(2)}MB`);
    writeToFile(logEntry);
  },

  // Log AWS API call
  awsApiCall: (apiName, params = {}) => {
    const logData = {
      type: 'AWS_API_CALL',
      apiName,
      params: {
        ...params,
        // Don't log buffer data
        sourceImage: params.sourceImage ? '[Buffer]' : undefined,
        targetImage: params.targetImage ? '[Buffer]' : undefined,
        Image: params.Image ? '[Buffer]' : undefined,
      },
    };
    
    const logEntry = formatLogEntry('INFO', logData);
    console.log(`☁️  AWS API Call: ${apiName}`);
    writeToFile(logEntry);
  },

  // Log AWS API response
  awsApiResponse: (apiName, response) => {
    const logData = {
      type: 'AWS_API_RESPONSE',
      apiName,
      response: {
        faceMatches: response.FaceMatches?.length || 0,
        unmatchedFaces: response.UnmatchedFaces?.length || 0,
        faceDetails: response.FaceDetails?.length || 0,
        similarity: response.FaceMatches?.[0]?.Similarity || null,
      },
    };
    
    const logEntry = formatLogEntry('INFO', logData);
    console.log(`✅ AWS Response: ${apiName} - ${logData.response.faceMatches} face(s) matched`);
    writeToFile(logEntry);
  },

  // Log verification result
  verificationResult: (result) => {
    const {
      similarity,
      faceMatches,
      isMatch,
      message,
      code,
      statusCode,
      processingTime,
    } = result;
    
    const logData = {
      type: 'VERIFICATION_RESULT',
      similarity,
      faceMatches,
      isMatch,
      message,
      code,
      statusCode,
      processingTime,
    };
    
    const logEntry = formatLogEntry('INFO', logData);
    const emoji = isMatch ? '✅' : '❌';
    console.log(`${emoji} Verification Result: ${similarity}% similarity - ${message}`);
    writeToFile(logEntry);
  },

  // Log transaction end
  transactionEnd: (req, res, processingTime) => {
    const { method, path } = req;
    const { statusCode } = res;
    const logData = {
      type: 'TRANSACTION_END',
      method,
      path,
      statusCode,
      processingTime,
    };
    
    const logEntry = formatLogEntry('INFO', logData);
    console.log(`📤 [${new Date().toISOString()}] ${method} ${path} - Status: ${statusCode} (${processingTime}ms)`);
    writeToFile(logEntry);
  },

  // Log error
  error: (error, context = {}) => {
    const logData = {
      type: 'ERROR',
      errorName: error.name,
      errorMessage: error.message,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      ...context,
    };
    
    const logEntry = formatLogEntry('ERROR', logData);
    console.error(`❌ Error: ${error.name} - ${error.message}`, context);
    writeToFile(logEntry);
  },

  // Log warning
  warning: (message, data = {}) => {
    const logData = {
      type: 'WARNING',
      message,
      ...data,
    };
    
    const logEntry = formatLogEntry('WARN', logData);
    console.warn(`⚠️  Warning: ${message}`, data);
    writeToFile(logEntry);
  },
};
