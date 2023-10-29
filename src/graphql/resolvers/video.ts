import connection from '../../db';

type VideoCreateInput = {
    video: {
        videoURL: string

        description: string
        
        productIDs: [number]
    };
  };
  
  const videoQueries = {
    video: async (_: any, args: any) => {},
    videos: async (_: any, args: any, ctx: any) => {
      const videoProducts = await connection('VideoProduct')
        .select('*')
        .join("Video", "VideoProduct.video_id", "=", "Video.id")
        .where('user_id', args.userID)
  
      if (!videoProducts) {
        return null;
      }
  
      // if (ctx.user.id != resource.owner.id) {
      //   return null;
      // }
      
      return videoProducts.map(async video => {

        const products = await connection("Product")
            .select('*')
            .join("ProductImage", "ProductImage.product_id", "=", "Product.id")
            .join("VideoProduct", "Product.id", "=", "VideoProduct.product_id")
            .where("VideoProduct.video_id", video.id)

        console.log(products)
        return {
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
        }
      })

    },
  };

  export {videoQueries}