const { ApolloServer } = require("@apollo/server");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const jwt = require("jsonwebtoken");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
  console.log("connected to MongoDB");
});

mongoose.set("debug", true);

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.SECRET
          );
          const currentUser = await User.findById(decodedToken.id);
          return {
            currentUser,
            dataLoaders: {
              bookCountLoader,
            },
          };
        }
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

start();
