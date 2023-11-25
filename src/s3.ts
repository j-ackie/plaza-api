import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIAUB64AXW3LC2ZXACQ',
    secretAccessKey: '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'
  }
});

export default client;