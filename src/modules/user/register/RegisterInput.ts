// Fractal folder structure:
import { IsEmail, Length, Min } from "class-validator";
import { PasswordInput } from "../../../modules/shared/PasswordInput";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255, { message: "asd" })
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;
}
