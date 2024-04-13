import dateScalar from './date';
import { productQueries, productMutations } from './product';
import {
  messageQueries,
  messageMutations,
  messageSubscriptions,
} from './message';
import { userQueries, userMutations } from './user';
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
import { commentMutations, commentQueries } from './comment';
import { followMutations, followQueries } from './following';
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
    ...commentQueries,
    ...followQueries
  },
  Mutation: {
    ...chatMutations,
    ...productMutations,
    ...messageMutations,
    ...reviewMutations,
    ...likedMutations,
    ...videoMutations,
    ...cartMutations,
    ...historyMutations,
    ...userMutations,
    ...commentMutations,
    ...followMutations
    //...uploadMutations,
  },
  Subscription: {
    ...messageSubscriptions,
  },
};

export default resolvers;
export { pubsub };
