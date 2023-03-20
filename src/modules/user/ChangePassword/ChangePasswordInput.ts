// Fractal folder structure:
import { IsEmail, Length, Min } from "class-validator";
import { PasswordMixin } from "../../../modules/shared/PasswordInput";
import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput extends PasswordMixin(class {}) {
  //   @Length(1, 255)
  @Field()
  token: string;
}
