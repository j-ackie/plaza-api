import { GraphQLError } from 'graphql';
import connection from '../../db';
import {
  generateGetPresignedURL,
  generatePutPresignedURL,
} from '../../utils/presignedURLs';

type ReviewCreateInput = {
  review: {
    productID: number;
    title: string;
    description: string;
    rating: number;
  };
};

type ReviewFilters = {
  filters: {
    productID: number | null;
    sellerID: number | null;
  };
};

// limit reviews later
const reviewQueries = {
  reviews: async (_: any, args: ReviewFilters) => {
    if (!args.filters.productID && !args.filters.sellerID) {
      throw new GraphQLError(
        'Either productID or sellerID has to be provided',
        {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        }
      );
    }

    const reviews = await connection('Review')
      .select('*')
      .where(
        !!args.filters.productID
          ? { product_id: args.filters.productID }
          : { seller_id: args.filters.sellerID }
      )
      .join('Product', 'Product.id', '=', 'Review.product_id')
      .leftJoin('ReviewImage', 'Review.id', '=', 'ReviewImage.review_id');

    return Promise.all(
      reviews.map(async (review) => ({
        id: review.review_id,
        productID: review.product_id,
        reviewerID: review.reviewer_id,
        title: review.title,
        description: review.description,
        rating: review.rating,
        createdAt: review.created_at,
        imageURI: await generateGetPresignedURL(
          'plaza-videos-images',
          review.bucket_key
        ),
      }))
    );
  },
};

const reviewMutations = {
  createReview: async (
    parent: undefined,
    args: ReviewCreateInput,
    ctx: any
  ) => {
    const { bucketKey, presignedURL } = await generatePutPresignedURL(
      'plaza-videos-images'
    );

    const insertedObject = await connection.transaction(async (trx) => {
      const insertedReviewObject = (
        await connection('Review')
          .insert({
            product_id: args.review.productID,
            reviewer_id: ctx.user.id,
            title: args.review.title,
            description: args.review.description,
            rating: args.review.rating,
            created_at: new Date().toISOString(),
          })
          .returning('*')
      )[0];

      await trx('ReviewImage').insert({
        review_id: insertedReviewObject.id,
        bucket_key: bucketKey,
      });

      return insertedReviewObject;
    });

    return {
      id: insertedObject.id,
      productID: insertedObject.product_id,
      reviewerID: insertedObject.reviewer_id,
      title: insertedObject.title,
      description: insertedObject.description,
      rating: insertedObject.rating,
      createdAt: insertedObject.created_at,
      imageURI: await generateGetPresignedURL('plaza-videos-images', bucketKey),
      uploadURI: presignedURL,
    };
  },
};

export { reviewQueries, reviewMutations };
