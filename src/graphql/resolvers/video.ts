import connection from '../../db';
import client from '../../s3';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

import Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
Ffmpeg.setFfmpegPath(ffmpegPath);

type VideoCreateInput = {
  video: {
    videoURL: string;

    description: string;

    productIDs: [number];
  };
};

type Video = {
  id: number;

  user_id: number;

  video_url: string;

  description: string;
};

const videoQueries = {
  video: async (_: any, args: any) => {
    const video = (
      await connection('Video').select('*').where('id', args.videoID)
    )[0];

    const products = await connection('Product')
      .select('*')
      .join('ProductImage', 'ProductImage.product_id', '=', 'Product.id')
      .join('VideoProduct', 'Product.id', '=', 'VideoProduct.product_id')
      .where('VideoProduct.video_id', video.id);

    const command = new GetObjectCommand({
      Bucket: 'plaza-videos-images',
      Key: video.video_bucket_key,
    });
    const presignedUrl = getSignedUrl(client, command, { expiresIn: 3600 });

    return {
      id: video.id,
      userID: video.user_id,
      videoURL: presignedUrl,
      description: video.description,
      products: products.map((product) => ({
        id: product.id,
        sellerID: product.seller_id,
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        imageURI: product.image_uri,
      })),
    };
  },
  videos: async (_: any, args: any, ctx: any) => {
    const videos = await connection('Video')
      .select('*')
      .where('user_id', args.userID);

    // if (ctx.user.id != resource.owner.id) {
    //   return null;
    // }

    return videos.map(async (video) => {
      return {
        id: video.id,
        userID: video.user_id,
      };
    });
  },
};

const videoMutations = {
  createVideo: async (parent: undefined, args: VideoCreateInput, ctx: any) => {
    // Ffmpeg(args.video.videoURL)
    // .on('end', function() {
    //   console.log('Screenshots taken');
    // })
    // .on('error', function(err) {
    //   console.error(err);
    // })
    // .screenshots({
    //   // Will take screenshots at 20%, 40%, 60% and 80% of the video
    //   count: 4,
    //   folder: './asset/output',
    //   filename: "output.jpg",
    //   size: '320x240',
    //   timemarks: [ '1' ]
    // });
    console.log(args);

    const bucketKey = crypto.randomBytes(32).toString('hex');
    const command = new PutObjectCommand({
      Bucket: 'plaza-videos-images',
      Key: bucketKey,
    });
    const presignedUrl = getSignedUrl(client, command, { expiresIn: 60 });

    const insertedObject = (
      await connection('Video')
        .insert({
          user_id: ctx.user.id,
          video_bucket_key: bucketKey,
          description: args.video.description,
        })
        .returning('*')
    )[0];

    // Insert VideoProducts
    return {
      id: insertedObject.id,
      userID: insertedObject.user_id,
      videoURL: presignedUrl,
      description: insertedObject.description,
      products: [],
    };
  },
};

export { videoQueries, videoMutations };
