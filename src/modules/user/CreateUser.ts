import { User } from "../../entity/User";
import {
  Arg,
  ClassType,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { RegisterInput } from "./register/RegisterInput";
import { Entity } from "typeorm";
import { Product } from "../../entity/Product";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

// resolver inheritence
function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  objectTypeCls: T, // returnType
  inputType: X,
  entity: any,
  middleware?: Middleware<any>[]
) {
  //   @Resolver({ isAbstract: true })
  //   abstract
  class BaseResolver {
    @UseMiddleware(...(middleware || []))
    @Mutation(() => objectTypeCls, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  name: string;
}

export const CreateUserResolver = createResolver(
  "User",
  User,
  RegisterInput,
  User
);
export const CreateProductResolver = createResolver(
  "Product",
  Product,
  ProductInput,
  Product
);

// const BaseCreateUser = createResolver("User", User, RegisterInput, User);
// const BaseCreateProduct = createResolver(
//   "Product",
//   Product,
//   ProductInput,
//   Product
// );

// @Resolver()
// export class CreateUserResolver extends BaseCreateUser {}

// @Resolver()
// export class CreateProductResolver extends BaseCreateProduct {}
