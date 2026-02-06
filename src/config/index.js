import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const SIMILARITY_THRESHOLD = 90;
export const SAME_IMAGE_SIMILARITY_THRESHOLD = 98;

export const AWS_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

// Validate AWS credentials
if (!AWS_CONFIG.accessKeyId || !AWS_CONFIG.secretAccessKey || !AWS_CONFIG.region) {
  console.error('❌ Error: AWS credentials are incomplete. Please configure in .env file');
  process.exit(1);
}

// Get server URL from environment or use localhost
const getServerUrl = () => {
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  return `http://localhost:${PORT}`;
};

export const SWAGGER_CONFIG = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Face Verification API',
      version: '1.0.0',
      description: 'API for face verification by comparing faces between Selfie and ID/Passport using AWS Rekognition',
    },
    servers: [
      { url: getServerUrl(), description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server' }
    ],
    tags: [
      { name: 'Verification', description: 'Face verification endpoints' },
    ],
  },
  apis: ['./src/routes/*.js'],
};
