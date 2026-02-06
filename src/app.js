import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { PORT, SWAGGER_CONFIG } from './config/index.js';
import { verifyRoute } from './routes/verify.js';
import { healthRoute } from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Request logging middleware (should be early in the chain)
app.use(requestLogger);

// Swagger
const swaggerSpec = swaggerJsdoc(SWAGGER_CONFIG);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Face Verification API Documentation',
}));

// Routes
healthRoute(app);
verifyRoute(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📝 AWS credentials check: ${process.env.AWS_REGION ? '✓' : '✗'}`);
  console.log(`📚 Swagger API Documentation: http://localhost:${PORT}/api-docs`);
});
