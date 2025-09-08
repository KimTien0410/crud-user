import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [EntityClass, columnName] = args.constraints;

    const repo = this.dataSource.getRepository(EntityClass);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const record = await repo.findOneBy({ [columnName]: value });

    return !record; // true nếu chưa tồn tại
  }

  defaultMessage(args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [, columnName] = args.constraints;
    return `${columnName} must be unique`;
  }
}
