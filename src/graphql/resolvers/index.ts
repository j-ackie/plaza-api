import { productQueries, productMutations } from './product';

const resolvers = {
  Query: {
    ...productQueries,
  },
  Mutation: {
    ...productMutations,
  },
};

export default resolvers;
