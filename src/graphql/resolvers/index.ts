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
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
  Date: dateScalar,
  Query: {
    ...chatQueries,
    ...productQueries,
    ...messageQueries,
    ...userQueries,
    ...videoQueries,
    ...reviewQueries,
    ...likedQueries
  },
  Mutation: {
    ...chatMutations,
    ...productMutations,
    ...messageMutations,
    ...reviewMutations,
    ...likedMutations,
    ...videoMutations
  },
  Subscription: {
    ...messageSubscriptions,
  },
};

export default resolvers;
export { pubsub };
