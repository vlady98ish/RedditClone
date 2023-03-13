
import "reflect-metadata"
import { MikroORM} from "@mikro-orm/core";
import { __prod__ } from "./constants";

import mikroOrmConfig from "./mikro-orm.config";
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";


const main = async () => {
    //Connect to DB
  const orm = await MikroORM.init(mikroOrmConfig);
  //Automatically start migration.
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver],
        validate: false,
    }),
    context: () => ({em:orm.em})
    
  });
   await apolloServer.start();
   apolloServer.applyMiddleware({app});
  
  
  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })





//   //First way to work in async right way with orm, is to use Request Context.
//   await RequestContext.createAsync(orm.em, async() => {
//     const post = orm.em.create(Post, {title: 'my first post'} as Post);
//     await orm.em.persistAndFlush(post);
//   });

//   //Second way to work with orm it`s fork
//   const posts = await orm.em.fork({}).find(Post, {});
//     console.log(posts);

  
};

main().catch((err) => {
    console.error(err);
})
