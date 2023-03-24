import { Post } from '../entities/Post'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'

//CRUD FOR GRAPHQL POSTS

@Resolver()
export class PostResolver {
  //SELECT * FROM posts;
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  //SELECT * FROM posts WHERE id = <id>;
  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number): Promise<Post | null> {
    //  em.findOne(Post, { id }); // MikroORM call with Enitity Manager, but we moved to TypeORM
    return Post.findOneBy({ id });
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string): Promise<Post> {
    //MikroORM
    // const post = em.create(Post, { title: title } as Post); // create a post
    // await em.persistAndFlush(post); //push post to db
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOneBy({ id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      //MikroORM
      // post.title = title;
      // await em.persistAndFlush(post);
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);

    return true;
  }
}
