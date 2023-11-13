import connection from '../../db';
import Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
Ffmpeg.setFfmpegPath(ffmpegPath);

type VideoCreateInput = {
    video: {
        videoURL: string

        description: string
        
        productIDs: [number]
    };
  };

type Video = {
  id: number

  user_id: number

  video_url: string

  description: string
}
  
const videoQueries = {
    video: async (_: any, args: any) => {
      const video = await connection('Video')
        .select('*')
        .where('id', args.videoID)

      console.log(video)
      if(!video){
        return null
      }

      return video.map(async video => {
        const products = await connection("Product")
          .select('*')
          .join("ProductImage", "ProductImage.product_id", "=", "Product.id")
          .join("VideoProduct", "Product.id", "=", "VideoProduct.product_id")
          .where("VideoProduct.video_id", video.id)

        return ({
          id: video.id,
          userID: video.user_id,
          videoURL: video.video_url,
          description: video.description,
          products: products.map(product => ({
              id: product.id,
              sellerID: product.seller_id,
              name: product.name,
              description: product.description,
              quantity: product.quantity,
              price: product.price,
              imageURI: product.image_uri
          }))
        })
      })
    },
    videos: async (_: any, args: any, ctx: any) => {

      const videos = await connection('Video')
        .select('id', 'user_id')
        .where('user_id', args.userID)
  
      if (!videos) {
        return null;
      }
  
      // if (ctx.user.id != resource.owner.id) {
      //   return null;
      // }
      
      return videos.map(async video => {

        return {
            id: video.id,
            userID: video.user_id,
        }
      })
    },
  };

  const videoMutations = {
    createVideo: async (parent: undefined, args: VideoCreateInput, ctx: any) => {
      console.log(ctx);

      Ffmpeg(args.video.videoURL)
      .on('end', function() {
        console.log('Screenshots taken');
      })
      .on('error', function(err) {
        console.error(err);
      })
      .screenshots({
        // Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 4,
        folder: './asset/output',
        filename: "output.jpg",
        size: '320x240',
        timemarks: [ '1' ]
      });
      
      const insertedObject = (await connection("Video").insert({
        user_id: ctx.user.id,
        video_url: args.video.videoURL,
        description: args.video.description,

      }).returning('*'))[0];

      return {
        id: insertedObject.id,
        userID: insertedObject.user_id,
        videoURL: insertedObject.video_url,
        description: insertedObject.description,

      };
    }
  }

  export {videoQueries, videoMutations}