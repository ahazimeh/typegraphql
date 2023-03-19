// Fractal folder structure:
import { IsEmail, Length, Min } from "class-validator";
import { PasswordInput } from "../../../modules/shared/PasswordInput";
import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput extends PasswordInput {
  //   @Length(1, 255)
  @Field()
  token: string;
}
