
import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core";

import mikroOrmConfig from "./mikro-orm.config";
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import {UserResolver} from "./resolvers/user";


const main = async () => {
    // Connect to the database
    const orm = await MikroORM.init(mikroOrmConfig);

    // Automatically start database migration
    await orm.getMigrator().up();

    // Create an Express app
    const app = express();

    // Create an Apollo Server instance
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em }) // Inject the entity manager into the GraphQL context
    });

    // Start the Apollo Server
    await apolloServer.start();

    // Apply the Apollo middleware to the Express app
    apolloServer.applyMiddleware({ app });

    // Start the Express server
    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })





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
})
