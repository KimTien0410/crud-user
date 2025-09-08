import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ConfigModule } from "@nestjs/config";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ScheduleModule } from "@nestjs/schedule";
import { UserModule } from "./modules/user/user.module";

import { AuthModule } from "./modules/auth/auth.module";
import { RoleModule } from "./modules/role/role.module";
import { PermissionModule } from "./modules/permission/permission.module";
import { BullModule } from "@nestjs/bull";
import { CloudinaryModule } from "./shared/cloudinary/cloudinary.module";
import { EmailModule } from "./shared/email/email.module";
import { IsUniqueConstraint } from "./common/validation/is-unique.constraint";
import { ValidationModule } from "./common/validation/validation.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    ValidationModule,
    UserModule,
    CloudinaryModule,
    EmailModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
