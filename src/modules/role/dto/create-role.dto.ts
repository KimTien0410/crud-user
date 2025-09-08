import {
  IsArray,
  IsEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from "class-validator";
import { Role } from "../entities/role.entity";

import { IsUniqueConstraint } from "../../../common/validation/is-unique.constraint";

export class CreateRoleDto {
  @IsEmpty()
  @Validate(IsUniqueConstraint, [Role, "name"])
  name: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}
