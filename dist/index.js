"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const http_1 = __importDefault(require("http"));
const graphql_1 = __importDefault(require("./graphql"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: '',
    });
    const serverCleanup = (0, ws_2.useServer)({ schema: graphql_1.default }, wsServer);
    const server = new server_1.ApolloServer({
        schema: graphql_1.default,
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                serverWillStart: () => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        drainServer: () => __awaiter(void 0, void 0, void 0, function* () {
                            yield serverCleanup.dispose();
                        }),
                    };
                }),
            },
        ],
    });
    yield server.start();
    app.use(express_1.default.json({ limit: '50mb' }), express_1.default.urlencoded({ extended: true }), (0, express4_1.expressMiddleware)(server));
    httpServer.listen({ port: 8000 });
    console.log('Server is listening on port 8000');
});
startServer();
