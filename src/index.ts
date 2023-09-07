import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import schema from './graphql';
import connectToDB from './db';

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  await connectToDB();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    express.json({ limit: '50mb' }),
    express.urlencoded({ extended: true }),
    expressMiddleware(server)
  );

  httpServer.listen({ port: 8000 });

  console.log('Server is listening on port 8000');
};

startServer();
