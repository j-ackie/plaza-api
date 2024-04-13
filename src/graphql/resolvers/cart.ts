import { GetObjectCommand } from '@aws-sdk/client-s3';
import connection from '../../db';
import client from '../../s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type CartInsertInput = {
  order: {
    productID: number;
    userID: number;
    videoID: number | null;
  };
};

const cartQueries = {
  cart: async (_: any, args: any, ctx: any) => {
    console.log(args);
    const cart = await connection('UserCart')
      .select('*')
      .where('user_id', args.userID)
      .leftJoin(
        'ProductImage',
        'UserCart.product_id',
        '=',
        'ProductImage.product_id'
      )
      .leftJoin('Product', 'UserCart.product_id', '=', 'Product.id');
  

    return cart.map(async (order) => {
      console.log("order:", order)
      const command = new GetObjectCommand({
        Bucket: 'plaza-videos-images',
        Key: order.bucket_key,
      });
  
      const presignedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600,
      });

      return ({
        id: order.id,
        userID: order.user_id,
        productID: order.product_id,
        imageURI: presignedUrl,
        name: order.name,
        price: order.price,
        videoID: order.video_id,
      })
    });
  },
};

const cartMutations = {
  insertCart: async (parent: undefined, args: CartInsertInput, ctx: any) => {
    
    let insertVideoID = -1;
    if(args.order.videoID){
      insertVideoID = args.order.videoID
    }

    const insertedObject = (
      await connection('UserCart')
        .insert({
          product_id: args.order.productID,
          user_id: ctx.user.id,
          video_id: insertVideoID
        })
        .returning('*')
    )[0];

    console.log(insertedObject)

    const product = await connection('Product')
    .select("name")
    .select("price")
    .where('id', insertedObject.product_id)

    const image = await connection('ProductImage')
    .select("bucket_key")
    .where('id', insertedObject.product_id)

    const command = new GetObjectCommand({
      Bucket: 'plaza-videos-images',
      Key: image[0].bucket_key,
    });

    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });

    return {
      id: insertedObject.id,
      videoID: insertedObject.video_id,
      userID: insertedObject.user_id,
      imageURI: presignedUrl,
      name: product[0].name,
      price: product[0].price,
      productID: insertedObject.product_id
    };

  },

  deleteCart: async (parent: undefined, args: any, ctx: any) => {

    const deletedObject = (
      await connection('UserCart')
        .where("product_id", args.productID)
        .del()
        .returning('*')
    )[0];

    console.log("here?", deletedObject)

    return {
      id: deletedObject.id,
      videoID: deletedObject.video_id,
      userID: deletedObject.user_id,
      imageURI: "",
      name: "",
      price: 0,
      productID: deletedObject.product_id
    };

  },
};

export { cartQueries, cartMutations };
