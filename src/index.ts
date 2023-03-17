import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

import { RegisterResolver } from "./modals/user/register";

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

const main = async () => {
  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  AppDataSource.initialize()
    .then(() => {
      console.log("aa");
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main();
