import dateScalar from './date';
import { productQueries, productMutations } from './product';
import {
  messageQueries,
  messageMutations,
  messageSubscriptions,
} from './message';
import { userQueries } from './user';
import { chatMutations, chatQueries } from './chat';
import { videoQueries, videoMutations } from './video';
import { reviewQueries, reviewMutations } from './review';
import { likedQueries, likedMutations } from './liked';
// import { uploadMutations } from './upload';
import { PubSub } from 'graphql-subscriptions';
// @ts-ignore
// import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { cartMutations, cartQueries } from './cart';
import { historyMutations, historyQueries } from './history';
// import { GraphQLUpload } from 'graphql-upload';

const pubsub = new PubSub();

const resolvers = {
  Date: dateScalar,
  // Upload: GraphQLUpload,
  Query: {
    ...chatQueries,
    ...productQueries,
    ...messageQueries,
    ...userQueries,
    ...videoQueries,
    ...reviewQueries,
    ...likedQueries,
    ...cartQueries,
    ...historyQueries,
  },
  Mutation: {
    ...chatMutations,
    ...productMutations,
    ...messageMutations,
    ...reviewMutations,
    ...likedMutations,
    ...videoMutations,
    ...cartMutations,
    ...historyMutations
    //...uploadMutations,
  },
  Subscription: {
    ...messageSubscriptions,
  },
};

export default resolvers;
export { pubsub };
