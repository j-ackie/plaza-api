import connection from '../../db';

type HistoryInsertInput = {
    order: {
        productID: number;
        userID: number;
      };
  };
  
  const historyQueries = {
    history: async (_: any, args: any, ctx: any) => {
        const history = await connection("UserOrderHistory")
            .select("*")
            .where("user_id", args.userID)
            .join("ProductImage", "ProductImage.product_id", "=", "UserOrderHistory.product_id")
            .join("Product", "Product.id", "=", "UserOrderHistory.product_id")
        
        return history.map((order) => ({
            id: order.id,
            productID: order.product_id,
            userID: order.user_id,
            orderedAt: order.ordered_at,
            status: order.status,
            imageURI: order.image_uri,
            name: order.name
        }))
    },
  };
  
  const historyMutations = {
    insertHistory: async (parent: undefined, args: HistoryInsertInput) => {
        
    },
  };
  
  export { historyQueries, historyMutations };
  