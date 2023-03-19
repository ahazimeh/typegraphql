declare module "express-session" {
  export interface SessionData {
    // userId: { [key: string]: any };
    userId: string | number;
  }
}
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";
export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }
  return next();
};
