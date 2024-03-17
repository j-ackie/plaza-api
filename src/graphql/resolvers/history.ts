import { GetObjectCommand } from '@aws-sdk/client-s3';
import connection from '../../db';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import client from '../../s3';

type HistoryInsertInput = {
    order: {
        productID: number;
        userID: number;
        videoID: number | null;
      };
  };
  
  const historyQueries = {
    history: async (_: any, args: any, ctx: any) => {
        const history = await connection("UserOrderHistory")
            .select("*")
            .where("user_id", args.userID)
            .join("ProductImage", "ProductImage.product_id", "=", "UserOrderHistory.product_id")
            .join("Product", "Product.id", "=", "UserOrderHistory.product_id")
        
        return history.map(async (order) => {

          const command = new GetObjectCommand({
            Bucket: 'plaza-videos-images',
            Key: order.bucket_key,
          });
      
          const presignedUrl = await getSignedUrl(client, command, {
            expiresIn: 3600,
          });

          return ({
              id: order.id,
              productID: order.product_id,
              userID: order.user_id,
              orderedAt: order.ordered_at,
              status: order.status,
              imageURI: presignedUrl,
              name: order.name,
              videoID: order.video_id,
              quantity: order.quantity
          })
        })
    },
  }
  
  const historyMutations = {
    insertHistory: async (parent: undefined, args: HistoryInsertInput, ctx: any) => {
      
      const currentTimestamp = new Date().toISOString();
      let insertVideoID = -1;
      if(args.order.videoID){
        insertVideoID = args.order.videoID
      }

      const insertedObject = (
        await connection('UserOrderHistory')
          .insert({
            product_id: args.order.productID,
            user_id: ctx.user.id,
            video_id: insertVideoID,
            ordered_at: currentTimestamp,
            status: 0,
            quantity: 1
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
        productID: insertedObject.product_id,
        quantity: insertedObject.quantity,
        orderedAt: insertedObject.ordered_at,
        status: insertedObject.status
      };

    },
  };
  
  export { historyQueries, historyMutations };
  