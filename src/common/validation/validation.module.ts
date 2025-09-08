import { Module } from "@nestjs/common";
import { IsUniqueConstraint } from "./is-unique.constraint";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot()],
  providers: [IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class ValidationModule {}
