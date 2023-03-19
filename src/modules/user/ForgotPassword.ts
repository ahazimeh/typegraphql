import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { redis } from "../../redis";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
declare module "express-session" {
  export interface SessionData {
    // userId: { [key: string]: any };
    userId: string | number;
  }
}
@Resolver(User)
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "EX", 60 * 60 * 24); // 1 day expiration
    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
