import { uploadFields } from '../middleware/upload.js';
import { verifyIdentity } from '../controllers/verifyController.js';

/**
 * @swagger
 * /api/verify:
 *   post:
 *     summary: Verify identity by comparing faces
 *     description: Compare faces between Selfie and ID/Passport using AWS Rekognition API
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [selfie, idDocument]
 *             properties:
 *               selfie:
 *                 type: string
 *                 format: binary
 *                 description: Selfie image file (JPG, PNG, GIF - maximum 5MB)
 *               idDocument:
 *                 type: string
 *                 format: binary
 *                 description: ID Card or Passport image file (JPG, PNG, GIF - maximum 5MB)
 *     responses:
 *       200:
 *         description: Face verification result
 *       400:
 *         description: Invalid or incomplete data
 *       500:
 *         description: Internal server error
 */
export const verifyRoute = (app) => {
  app.post('/api/verify', uploadFields, verifyIdentity);
};
