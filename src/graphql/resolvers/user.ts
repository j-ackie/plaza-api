import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import connection from '../../db';
import crypto from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import client from '../../s3';

const userQueries = {
  user: async (_: any, args: any) => {
    const filter = {};
    if (args.filters.id) {
      // @ts-ignore
      filter.id = args.filters.id;
    }
    if (args.filters.username) {
      // @ts-ignore
      filter.username = args.filters.username;
    }

    const user = await connection('User').where(filter).first();

    let profilePictureURI = null;
    if (user.profile_picture_bucket_key) {
      const command = new GetObjectCommand({
        Bucket: 'plaza-videos-images',
        Key: user.profile_picture_bucket_key,
      });

      const presignedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600,
      });
      profilePictureURI = presignedUrl;
    }

    console.log(user);
    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      profilePictureURI: profilePictureURI,
      description: user.description,
    };
  },
  // users: async (_: any, args: any) => {},
};

const userMutations = {
  updateProfilePicture: async (_: any, args: any, ctx: any) => {
    const bucketKey = crypto.randomBytes(32).toString('hex');
    const command = new PutObjectCommand({
      Bucket: 'plaza-videos-images',
      Key: bucketKey,
    });

    const presignedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

    await connection('User')
      .update({ profile_picture_bucket_key: bucketKey })
      .where({ id: ctx.user.id });

    return presignedUrl;
  },
};

// const messageMutations = {
//   createMessage: async (parent: undefined, args: MessageCreateInput) => {
//     const insertedID = await connection('Message').insert({
//       sender_id: 1,
//       chat_id: args.message.chatID,
//       text: args.message.text,
//     });
//     console.log(insertedID);
//   },
// };

export { userQueries, userMutations };
