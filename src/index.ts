import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import schema from './graphql';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import connection from './db';

const user = {
  id: 1,
  sub: 'b14a161c-f682-4bfc-8dc8-75e778f00a73',
  username: 'JohnSmith9000',
  display_name: 'John Smith',
  profile_picture_uri: 'https://d.newsweek.com/en/full/2297448/golden-retriever.jpg?w=1600&h=1600&q=88&f=55e676b03801944abe9791eff4272a2e',
  description: 'I am John Smith',
}

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '',
  });

  const setContext = async (authorization: string) => {
    const jwt = authorization.split(' ')[1];

    const verifier = CognitoJwtVerifier.create({
      userPoolId: "us-east-1_jPNACfr3m",
      tokenUse: "access",
      clientId: "144mbeg2bfsmq450eefu9te2vm",
    });

    return {
      id: 1,
      sub: 'b14a161c-f682-4bfc-8dc8-75e778f00a73',
      username: 'JohnSmith9000',
      display_name: 'John Smith',
      profile_picture_uri: 'https://d.newsweek.com/en/full/2297448/golden-retriever.jpg?w=1600&h=1600&q=88&f=55e676b03801944abe9791eff4272a2e',
      description: 'I am John Smith',
    }

    try {
      const payload = await verifier.verify(
        jwt // the JWT as string
      );
      console.log("Token is valid. Payload:", payload);

      const user = await connection('User').where({ sub: payload.sub }).first();

      return { user };
    } catch (err) {
    
      return false;
    }
  }

  const serverCleanup = useServer({ schema, onConnect: async(ctx) => {
    return setContext(ctx.connectionParams?.authorization as string);
  }, onDisconnect: async (ctx, code) => {
    console.log("he disconnected")
  }}, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => {
          return {
            drainServer: async () => {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    express.json({ limit: '50mb' }),
    express.urlencoded({ extended: true }),
    expressMiddleware(server, {
      context: async({req, res}) => {
        console.log(user)
        return { user };
        return setContext(req.headers.authorization as string);
      }
    }),
  );

  httpServer.listen({ port: 8000 });

  console.log('Server is listening on port 8000');
};

startServer();
