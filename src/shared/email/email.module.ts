import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { EmailProcessor } from "./email.processor";
import { EmailService } from "./email.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email", // tên queue
    }),
  ],
  providers: [EmailProcessor, EmailService],
})
export class EmailModule {}
