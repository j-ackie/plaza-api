import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import client from '../s3';

const generatePutPresignedURL = async (bucket: string) => {
  const bucketKey = crypto.randomBytes(32).toString('hex');
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: bucketKey,
  });
  return {
    bucketKey,
    presignedURL: await getSignedUrl(client, command, { expiresIn: 60 }),
  };
};

const generateGetPresignedURL = async (bucket: string, bucketKey: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: bucketKey,
  });

  return await getSignedUrl(client, command, {
    expiresIn: 3600,
  });
};

export { generatePutPresignedURL, generateGetPresignedURL };
