import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { redis } from "../../redis";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./ChangePassword/ChangePasswordInput";
import bcrypt from "bcryptjs";

declare module "express-session" {
  export interface SessionData {
    // userId: { [key: string]: any };
    userId: string | number;
  }
}
@Resolver(User)
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    if (!userId) {
      return null;
    }
    const user = await User.findOne({ where: { id: +userId } });
    if (!user) {
      return null;
    }
    await redis.del(forgotPasswordPrefix + token);
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    ctx.req.session.userId = user.id;

    return user;
  }
}
