import s3 from '../../s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const uploadMutations = {
  // @ts-ignore
  singleUpload: async(_: any, { file }) => {
    const command = new PutObjectCommand({ Bucket:  })

    const { createReadStream, filename, mimetype, encoding } = await file;

    const stream = createReadStream();

    return { filename, mimetype, encoding };
  }
}

export { uploadMutations };