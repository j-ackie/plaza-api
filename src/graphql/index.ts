import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import { GraphQLScalarType, Kind } from 'graphql';

// https://www.apollographql.com/docs/apollo-server/workflow/generate-types

const gqlFiles = readdirSync(join(__dirname, './typedefs'));

let typeDefs = '';

gqlFiles.forEach((file) => {
  typeDefs += readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8',
  });
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
