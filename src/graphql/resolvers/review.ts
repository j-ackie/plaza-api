import connection from '../../db';

type ReviewCreateInput = {
  review: {
    productID: number;
    title: string;
    description: string;
    rating: number;
  };
};

type ReviewFilters =  {
  filters: {
    productID: number | null;
    sellerID: number | null;
  }
}

// limit reviews later
const reviewQueries = {
  reviews: async (_: any, args: ReviewFilters) => {
    const reviews = await connection("Review")
      .select("*")
      .where(!!args.filters.productID ? {product_id: args.filters.productID} : {seller_id: args.filters.sellerID});

    return reviews.map(review => ({
      id: review.id,
      productID: review.product_id,
      reviewerID: review.reviewer_id,
      title: review.title,
      description: review.description,
      rating: review.rating,
      createdAt: review.created_at
    }));
    
}};
  

const reviewMutations = {
  createReview: async (parent: undefined, args: ReviewCreateInput, ctx: any) => {
    console.log(ctx);
    
    const insertedObject = (await connection("Review").insert({
      product_id: args.review.productID,
      reviewer_id: ctx.user.id,
      title: args.review.title,
      description: args.review.description,
      rating: args.review.rating,
      created_at: new Date().toISOString(),
    }).returning('*'))[0];



    return {
      id: insertedObject.id,
      productID: insertedObject.product_id,
      reviewerID: insertedObject.reviewer_id,
      title: insertedObject.title,
      description: insertedObject.description,
      rating: insertedObject.rating,
      createdAt: insertedObject.created_at
    };
  }
}

export { reviewQueries, reviewMutations };