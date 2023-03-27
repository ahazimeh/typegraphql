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
import { ForgotPasswordResolver } from "./modules/user/ForgotPassword";
import { LogoutResolver } from "./modules/user/Logout";
import {
  CreateProductResolver,
  CreateUserResolver,
} from "./modules/user/CreateUser";
import { Product } from "./entity/Product";

import {
  getComplexity,
  simpleEstimator,
  fieldExtensionsEstimator,
} from "graphql-query-complexity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "mydb",
  synchronize: true,
  logging: true,
  entities: [User, Product],
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
      // __dirname + "/modules/**/*.ts",
      MeResolver,
      RegisterResolver,
      LoginResolver,
      ConfirmUserResolver,
      ChangePasswordResolver,
      ForgotPasswordResolver,
      LogoutResolver,
      CreateUserResolver,
      CreateProductResolver,
    ],
    validate: { forbidUnknownValues: false },
    authChecker: customAuthChecker,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground,
      {
        requestDidStart: () =>
          ({
            didResolveOperation({ request, document }: any) {
              /**
               * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
               * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
               * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
               */
              const complexity = getComplexity({
                // Our built schema
                schema,
                // To calculate query complexity properly,
                // we have to check only the requested operation
                // not the whole document that may contains multiple operations
                operationName: request.operationName,
                // The GraphQL query document
                query: document,
                // The variables for our GraphQL query
                variables: request.variables,
                // Add any number of estimators. The estimators are invoked in order, the first
                // numeric value that is being returned by an estimator is used as the field complexity.
                // If no estimator returns a value, an exception is raised.
                estimators: [
                  // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                  fieldExtensionsEstimator(),
                  // Add more estimators here...
                  // This will assign each field a complexity of 1
                  // if no other estimator returned a value.
                  simpleEstimator({ defaultComplexity: 1 }),
                ],
              });
              // Here we can react to the calculated complexity,
              // like compare it with max and throw error when the threshold is reached.
              if (complexity > 20) {
                throw new Error(
                  `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`
                );
              }
              // And here we can e.g. subtract the complexity point from hourly API calls limit.

              // console.log("Used query complexity points:", complexity);
            },
          } as any),
      },
    ],
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
