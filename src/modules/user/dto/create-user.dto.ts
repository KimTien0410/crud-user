import { IsNotEmpty, IsEmail, MinLength } from "class-validator";
import { IsUnique } from "../../../common/validation/is-unique.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsUnique("User", "email", { message: "Email must be unique" })
  email: string;

  @MinLength(6)
  password: string;
}
