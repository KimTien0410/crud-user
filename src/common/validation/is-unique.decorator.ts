import { registerDecorator, ValidationOptions } from "class-validator";
import { IsUniqueConstraint } from "./is-unique.constraint";
import { EntityTarget } from "typeorm";

export function IsUnique(
  entity: EntityTarget<any>,
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property],
      validator: IsUniqueConstraint,
    });
  };
}
