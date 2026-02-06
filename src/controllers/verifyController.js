import { hashFile, roundSimilarity } from '../utils/helpers.js';
import { errorResponse, successResponse } from '../utils/responses.js';
import { compareFaces, detectMultipleFaces, SIMILARITY_THRESHOLD, SAME_IMAGE_SIMILARITY_THRESHOLD } from '../services/rekognitionService.js';

export const verifyIdentity = async (req, res) => {
  try {
    const { selfie, idDocument } = req.files || {};
    if (!selfie?.[0]?.buffer || !idDocument?.[0]?.buffer) {
      return errorResponse(res, 400, 'Please upload both Selfie and ID/Passport');
    }

    const [selfieFile, idDocumentFile] = [selfie[0], idDocument[0]];

    // Check if files are identical
    if (hashFile(selfieFile.buffer) === hashFile(idDocumentFile.buffer)) {
      return errorResponse(res, 400, 'Please upload different files - Cannot use the same file for both Selfie and ID/Passport');
    }

    // Compare faces
    const compareResponse = await compareFaces(selfieFile.buffer, idDocumentFile.buffer);

    if (!compareResponse.FaceMatches?.length) {
      return errorResponse(res, 200, 'No matching faces found', 0, 0, { code: 'NO_MATCH_FOUND' });
    }

    const similarity = compareResponse.FaceMatches[0].Similarity;
    const roundedSimilarity = roundSimilarity(similarity);
    const faceMatches = compareResponse.FaceMatches.length;
    const isMatch = similarity >= SIMILARITY_THRESHOLD;

    // Check for same image if similarity is very high
    if (similarity >= SAME_IMAGE_SIMILARITY_THRESHOLD) {
      const [selfieFaces, idDocFaces] = await detectMultipleFaces(selfieFile.buffer, idDocumentFile.buffer);

      if (selfieFaces.FaceDetails?.length === 1 && idDocFaces.FaceDetails?.length === 1 && faceMatches === 1) {
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
    
    return successResponse(res, roundedSimilarity, message, faceMatches);
  } catch (error) {
    console.error('Error during face verification:', error);

    if (error.name === 'InvalidParameterException') {
      return errorResponse(res, 400, 'Invalid image or no face detected in image. Please try again', 0, 0, { code: 'INVALID_IMAGE' });
    }
    if (error.name === 'ImageTooLargeException') {
      return errorResponse(res, 400, 'Image file is too large. Please reduce file size', 0, 0, { code: 'FILE_TOO_LARGE' });
    }
    if (error.name === 'AccessDeniedException' || error.__type === 'AccessDeniedException') {
      console.error('❌ AWS IAM Permission Error:', error.message);
      return errorResponse(res, 403, 'No permission to access AWS Rekognition API. Please check IAM permissions', 0, 0, {
        code: 'AWS_PERMISSION_DENIED',
        details: 'IAM user must have a policy that allows rekognition:CompareFaces action',
        awsError: error.message,
      });
    }

    return errorResponse(res, 500, 'An error occurred during face verification. Please try again', 0, 0, {
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' ? { details: error.message, errorName: error.name } : {})
    });
  }
};
