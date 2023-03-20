import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { AuthChecker, buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/register";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { MeResolver } from "./modules/user/Me";
import { MyContext } from "./types/MyContext";
import { sendEmail } from "./modules/utils/sendEmail";
import { ConfirmUserResolver } from "./modules/user/ConfirmUser";
import { ChangePasswordResolver } from "./modules/user/ChangePassword";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "mydb",
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
export const customAuthChecker: AuthChecker<MyContext> = (
  { root, args, context: { req }, info },
  roles
) => {
  return !!req.session.userId;
};

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      __dirname + "/modules/**/*.ts",
      // MeResolver,
      // RegisterResolver,
      // LoginResolver,
      // ConfirmUserResolver,
      // ChangePasswordResolver,
    ],
    validate: { forbidUnknownValues: false },
    authChecker: customAuthChecker,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  const app = Express();

  const RedisStore = require("connect-redis").default;
  app.use(
    cors({
      credentials: true,
      origin: "https://studio.apollographql.com",
    })
  );
  const cors1 = {
    credentials: true,
    origin: "https://studio.apollographql.com",
  };
  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      secret: "aslkdfjoiq12313",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // secure: true,
        maxAge: 1001 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: cors1 });

  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main();
