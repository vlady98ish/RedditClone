import { Post } from '../entities/Post'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from 'src/types'

//CRUD FOR GRAPHQL POSTS


@Resolver()
export class PostResolver {
    //SELECT * FROM posts;
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    //SELECT * FROM posts WHERE id = <id>;
    @Query(() => Post, { nullable: true })
    async post(
      @Arg("id") id: number,
      @Ctx() { em }: MyContext
    ): Promise<Post | null> {

        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
      @Arg("title") title: string,
      @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, { title: title } as Post); // create a post
        await em.persistAndFlush(post); //push post to db
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
      @Arg("id") id: number,
      @Arg("title", () => String, { nullable: true }) title: string,
      @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
      @Arg("id") id: number,
      @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, { id });
        } catch {
            return false;
        }

        return true;
    }
}
