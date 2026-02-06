import { RekognitionClient, CompareFacesCommand, DetectFacesCommand } from '@aws-sdk/client-rekognition';
import { AWS_CONFIG, SIMILARITY_THRESHOLD, SAME_IMAGE_SIMILARITY_THRESHOLD } from '../config/index.js';

const rekognitionClient = new RekognitionClient({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  },
});

export const compareFaces = async (selfieBuffer, idDocumentBuffer) => {
  return await rekognitionClient.send(new CompareFacesCommand({
    SourceImage: { Bytes: selfieBuffer },
    TargetImage: { Bytes: idDocumentBuffer },
    SimilarityThreshold: SIMILARITY_THRESHOLD,
  }));
};

export const detectFaces = async (imageBuffer) => {
  return await rekognitionClient.send(new DetectFacesCommand({
    Image: { Bytes: imageBuffer },
    Attributes: ['DEFAULT'],
  }));
};

export const detectMultipleFaces = async (selfieBuffer, idDocumentBuffer) => {
  return await Promise.all([
    detectFaces(selfieBuffer),
    detectFaces(idDocumentBuffer),
  ]);
};

export { SIMILARITY_THRESHOLD, SAME_IMAGE_SIMILARITY_THRESHOLD };
