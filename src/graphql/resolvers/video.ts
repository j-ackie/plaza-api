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

  // video_url: string;

  // description: string;

  thumbnailURL: string;
};

type VideoFilters = {
  filters: {
    productID: number | null;
    userID: number | null;
  };
};

// interface VideosShort{
//   userID?: number
//   productID?: number

//   // for some reason the async call to get array of videos refuses to cast to an array of Videos so
//   // TODO: change the type
//   videos: any
// }

const videoQueries = {
  video: async (_: any, args: any, ctx: any) => {
    const video = (
      await connection('Video').select('*').where('id', args.videoID)
    )[0];

    const products = await connection('Product')
      .select('*')
      .join('ProductImage', 'ProductImage.product_id', '=', 'Product.id')
      .join('VideoProduct', 'Product.id', '=', 'VideoProduct.product_id')
      .where('VideoProduct.video_id', video.id);

    const liked = await connection('VideoLiked')
      .select(connection.raw("exists(select 1 where video_id = ?)", [video.id])).where("user_id", ctx.user.id)

    const command = new GetObjectCommand({
      Bucket: 'plaza-videos-images',
      Key: video.video_bucket_key,
    });
    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });

    console.log(presignedUrl);
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
      isLiked: liked[0].exists,
    };
  },
  videos: async (_: any, args: VideoFilters, ctx: any) => {
    // const videos = await connection('Video')
    //   .select('*')
    //   .where('user_id', );

    let videos;
    if (args.filters.userID) {
      videos = await connection('Video')
        .select('*')
        .where('user_id', args.filters.userID);
    } else {
      videos = await connection('VideoProduct')
        .select('*')
        .join('Video', 'Video.id', '=', 'VideoProduct.video_id')
        .where('product_id', args.filters.productID);
    }

    // if (ctx.user.id != resource.owner.id) {
    //   return null;
    // }

    // let result : VideosShort = {
    //   videos: videos.map(async (video) => {
    //     const command = new GetObjectCommand({
    //       Bucket: 'plaza-videos-images',
    //       Key: video.video_bucket_key + "-thumbnail",
    //     });
    //     const presignedUrl = await getSignedUrl(client, command, {
    //       expiresIn: 3600,
    //     });  
    //     return {
    //       id: video.id,
    //       userID: video.user_id,
    //       thumbnailURL: presignedUrl,
    //     };
    //   })
    // }; 
    // if(args.filters.productID){
    //   result.productID = args.filters.productID
    // }
    // else if(args.filters.userID){
    //   result.userID = args.filters.userID
    // }
    console.log(videos)
    return videos.map(async (video) => {
        const command = new GetObjectCommand({
          Bucket: 'plaza-videos-images',
          Key: video.video_bucket_key + "-thumbnail",
        });
        const presignedUrl = await getSignedUrl(client, command, {
          expiresIn: 3600,
        });  
        return {
          id: video.id,
          userID: video.user_id,
          thumbnailURL: presignedUrl,
        };
      })
  },
};

const videoMutations = {
  createVideo: async (parent: undefined, args: VideoCreateInput, ctx: any) => {
    console.log(args);

    const bucketKey = crypto.randomBytes(32).toString('hex');
    const command = new PutObjectCommand({
      Bucket: 'plaza-unprocessed-videos-images',
      Key: bucketKey,
    });
    const presignedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

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
