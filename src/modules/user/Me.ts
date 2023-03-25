import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

declare module "express-session" {
  export interface SessionData {
    // userId: { [key: string]: any };
    userId: string | number;
  }
}

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true, complexity: 5 })
  async Me(@Ctx() ctx: MyContext): Promise<User | null | undefined> {
    if (!ctx.req.session.userId) {
      return undefined;
    }
    return User.findOne({ where: { id: +ctx.req.session!.userId } });
  }
}
