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
        return setContext(req.headers.authorization as string);
      }
    }),
  );

  httpServer.listen({ port: 8000 });

  console.log('Server is listening on port 8000');
};

startServer();
