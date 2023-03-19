// Fractal folder structure:
import { Min } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PasswordInput {
  @Field()
  password: string;
}
