import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

//Redis
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__, COOKIE_NAME } from "./constants";
import { MyContext } from "./types";
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const main = async () => {
  // Connect to the database
  const conn = await new DataSource({
    type: "postgres",
    database: "redditclone2",
    username: "postgres",
    password: "1336473ww",
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

  // Create an Express app
  const app = express();

  let RedisStore = connectRedis(session);
  const redis = new Redis();
  const cors = {
    credentials: true,
    origin: ["https://studio.apollographql.com", "http://localhost:3000"],
  };
  app.set("trust proxy", !__prod__);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: false, //TODO: change it to prod? true: false
      },
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Create an Apollo Server instance
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext): MyContext => ({
      req,
      res,
      redis,
    }), // Inject the entity manager into the GraphQL context
  });

  // Start the Apollo Server
  await apolloServer.start();

  // Apply the Apollo middleware to the Express app
  apolloServer.applyMiddleware({ app, cors });

  // Start the Express server
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

  //First way to work in async right way with orm, is to use Request Context.
  // await RequestContext.createAsync(orm.em, async() => {
  //   const post = orm.em.create(Post, {title: 'my first post'} as Post);
  //   await orm.em.persistAndFlush(post);
  // });

  //   //Second way to work with orm it`s fork
  //   const posts = await orm.em.fork({}).find(Post, {});
  //     console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
