import dateScalar from './date';
import { productQueries, productMutations } from './product';
import {
  messageQueries,
  messageMutations,
  messageSubscriptions,
} from './message';
import { userQueries } from './user';
import { chatMutations, chatQueries } from './chat';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
  Date: dateScalar,
  Query: {
    ...chatQueries,
    ...productQueries,
    ...messageQueries,
    ...userQueries,
  },
  Mutation: {
    ...chatMutations,
    ...productMutations,
    ...messageMutations,
  },
  Subscription: {
    ...messageSubscriptions,
  },
};

export default resolvers;
export { pubsub };
