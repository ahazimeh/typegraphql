import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true })
  async Me(@Ctx() ctx: MyContext): Promise<User | null | undefined> {
    if (!ctx.req.session.userId) {
      return undefined;
    }
    return User.findOne({ where: { id: +ctx.req.session!.userId } });
  }
}
