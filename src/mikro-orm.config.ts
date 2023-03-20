import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

//Config for database
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
    allowGlobalContext: true,
  },
  entities: [Post, User],
  dbName: "clonereddit",
  password: "1336473ww",
  type: "postgresql",
  allowGlobalContext: true,
  debug: !__prod__,
  //Its a black magic for MikroORM init in index.ts
} as Parameters<typeof MikroORM.init>[0];