// Fractal folder structure:
import { Min, MinLength } from "class-validator";
import { ClassType, Field, InputType } from "type-graphql";

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType({ isAbstract: true }) // without it I had to include at least 1 type
  class PasswordInput extends BaseClass {
    @Field()
    password: string;
  }

  return PasswordInput;
};
