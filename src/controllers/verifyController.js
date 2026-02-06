import { hashFile, roundSimilarity } from '../utils/helpers.js';
import { errorResponse, successResponse } from '../utils/responses.js';
import { compareFaces, detectMultipleFaces, SIMILARITY_THRESHOLD, SAME_IMAGE_SIMILARITY_THRESHOLD } from '../services/rekognitionService.js';
import { logger } from '../utils/logger.js';

export const verifyIdentity = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { selfie, idDocument } = req.files || {};
    if (!selfie?.[0]?.buffer || !idDocument?.[0]?.buffer) {
      logger.warning('Missing files in request', { hasSelfie: !!selfie?.[0], hasIdDocument: !!idDocument?.[0] });
      return errorResponse(res, 400, 'Please upload both Selfie and ID/Passport');
    }

    const [selfieFile, idDocumentFile] = [selfie[0], idDocument[0]];

    // Log file uploads
    logger.fileUpload(req, 'selfie', {
      filename: selfieFile.originalname,
      size: selfieFile.size,
      mimetype: selfieFile.mimetype,
    });
    logger.fileUpload(req, 'idDocument', {
      filename: idDocumentFile.originalname,
      size: idDocumentFile.size,
      mimetype: idDocumentFile.mimetype,
    });

    // Check if files are identical
    const selfieHash = hashFile(selfieFile.buffer);
    const idDocumentHash = hashFile(idDocumentFile.buffer);
    
    if (selfieHash === idDocumentHash) {
      logger.warning('Same file uploaded for both selfie and ID document', {
        hash: selfieHash,
      });
      return errorResponse(res, 400, 'Please upload different files - Cannot use the same file for both Selfie and ID/Passport');
    }

    // Log AWS API call
    logger.awsApiCall('CompareFaces', {
      sourceImageSize: selfieFile.size,
      targetImageSize: idDocumentFile.size,
    });

    // Compare faces
    const compareResponse = await compareFaces(selfieFile.buffer, idDocumentFile.buffer);
    
    // Log AWS API response
    logger.awsApiResponse('CompareFaces', compareResponse);

    if (!compareResponse.FaceMatches?.length) {
      const processingTime = Date.now() - startTime;
      logger.verificationResult({
        similarity: 0,
        faceMatches: 0,
        isMatch: false,
        message: 'No matching faces found',
        code: 'NO_MATCH_FOUND',
        statusCode: 200,
        processingTime,
      });
      return errorResponse(res, 200, 'No matching faces found', 0, 0, { code: 'NO_MATCH_FOUND' });
    }

    const similarity = compareResponse.FaceMatches[0].Similarity;
    const roundedSimilarity = roundSimilarity(similarity);
    const faceMatches = compareResponse.FaceMatches.length;
    const isMatch = similarity >= SIMILARITY_THRESHOLD;

    // Check for same image if similarity is very high
    if (similarity >= SAME_IMAGE_SIMILARITY_THRESHOLD) {
      logger.warning('High similarity detected, checking for same image', {
        similarity: roundedSimilarity,
        threshold: SAME_IMAGE_SIMILARITY_THRESHOLD,
      });

      logger.awsApiCall('DetectFaces', { imageType: 'selfie', imageSize: selfieFile.size });
      logger.awsApiCall('DetectFaces', { imageType: 'idDocument', imageSize: idDocumentFile.size });

      const [selfieFaces, idDocFaces] = await detectMultipleFaces(selfieFile.buffer, idDocumentFile.buffer);

      logger.awsApiResponse('DetectFaces', { FaceDetails: selfieFaces.FaceDetails });
      logger.awsApiResponse('DetectFaces', { FaceDetails: idDocFaces.FaceDetails });

      if (selfieFaces.FaceDetails?.length === 1 && idDocFaces.FaceDetails?.length === 1 && faceMatches === 1) {
        const processingTime = Date.now() - startTime;
        logger.verificationResult({
          similarity: roundedSimilarity,
          faceMatches,
          isMatch: false,
          message: 'Same image detected',
          code: 'SAME_IMAGE_DETECTED',
          statusCode: 400,
          processingTime,
        });
        return errorResponse(res, 400, 'Please upload different images - The uploaded images may be the same image taken with different cameras', 
          roundedSimilarity, faceMatches, { 
            code: 'SAME_IMAGE_DETECTED',
            warning: 'Similarity score is very high (>98%) which may indicate the same image' 
          });
      }
    }

    const message = isMatch 
      ? 'Identity verification successful - Faces match' 
      : 'Identity verification failed - Faces do not match';
    
    const processingTime = Date.now() - startTime;
    logger.verificationResult({
      similarity: roundedSimilarity,
      faceMatches,
      isMatch,
      message,
      code: isMatch ? 'VERIFICATION_SUCCESS' : 'VERIFICATION_FAILED',
      statusCode: 200,
      processingTime,
    });
    
    return successResponse(res, roundedSimilarity, message, faceMatches);
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    logger.error(error, {
      endpoint: '/api/verify',
      processingTime,
    });

    if (error.name === 'InvalidParameterException') {
      logger.verificationResult({
        similarity: 0,
        faceMatches: 0,
        isMatch: false,
        message: 'Invalid image or no face detected',
        code: 'INVALID_IMAGE',
        statusCode: 400,
        processingTime,
      });
      return errorResponse(res, 400, 'Invalid image or no face detected in image. Please try again', 0, 0, { code: 'INVALID_IMAGE' });
    }
    if (error.name === 'ImageTooLargeException') {
      logger.verificationResult({
        similarity: 0,
        faceMatches: 0,
        isMatch: false,
        message: 'Image file is too large',
        code: 'FILE_TOO_LARGE',
        statusCode: 400,
        processingTime,
      });
      return errorResponse(res, 400, 'Image file is too large. Please reduce file size', 0, 0, { code: 'FILE_TOO_LARGE' });
    }
    if (error.name === 'AccessDeniedException' || error.__type === 'AccessDeniedException') {
      logger.error(error, {
        endpoint: '/api/verify',
        errorType: 'AWS_PERMISSION_DENIED',
        processingTime,
      });
      return errorResponse(res, 403, 'No permission to access AWS Rekognition API. Please check IAM permissions', 0, 0, {
        code: 'AWS_PERMISSION_DENIED',
        details: 'IAM user must have a policy that allows rekognition:CompareFaces action',
        awsError: error.message,
      });
    }

    logger.verificationResult({
      similarity: 0,
      faceMatches: 0,
      isMatch: false,
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      processingTime,
    });

    return errorResponse(res, 500, 'An error occurred during face verification. Please try again', 0, 0, {
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' ? { details: error.message, errorName: error.name } : {})
    });
  }
};
