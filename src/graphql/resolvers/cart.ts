import connection from '../../db';

type CartInsertInput = {
    order: {
      productID: number;
      userID: number;
    };
  };
  
  const cartQueries = {
    cart: async (_: any, args: any, ctx: any) => {
        console.log(args)
        const cart = await connection("UserCart")
            .select("*")
            .where("user_id", args.userID)
            .join("ProductImage", "ProductImage.product_id", "=", "UserCart.product_id")
            .join("Product", "Product.id", "=", "UserCart.product_id")
        
        return cart.map((order) => ({
            id: order.id,
            userID: order.user_id,
            productID: order.product_id,
            imageURI: order.image_uri,
            name: order.name,
            price: order.price
        }))
    },
  };
  
  const cartMutations = {
    insertCart: async (parent: undefined, args: CartInsertInput) => {
        
    },
  };
  
  export { cartQueries, cartMutations };
  