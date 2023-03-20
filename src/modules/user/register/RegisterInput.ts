// Fractal folder structure:
import { IsEmail, Length, Min } from "class-validator";
import { PasswordMixin } from "../../../modules/shared/PasswordInput";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
import { OkMixin } from "../../shared/OkMixen";

@InputType()
// OkMixin(
// )
export class RegisterInput extends PasswordMixin(class {}) {
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
