import { IsNotEmpty, IsString } from "class-validator";
import { IsUnique } from "../../../common/validation/is-unique.decorator";

export class CreatePermissionDto {
  @IsUnique("Permission", "name", { message: "Permission name must be unique" })
  @IsNotEmpty({ message: "Permission name should not be empty" })
  @IsString({ message: "Permission name must be a string" })
  name: string;
}
