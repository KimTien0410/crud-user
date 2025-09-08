import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectQueue } from "@nestjs/bull";
import type { Queue } from "bull";

@Injectable()
export class EmailService {
    constructor(@InjectQueue("email") private readonly emailQueue: Queue) { }

    //   // Cron chạy mỗi 10s
    //   @Cron("*/10 * * * * *")
    //   async handleCron() {
    //     await this.emailQueue.add(
    //       "sendEmails",
    //       { timestamp: Date.now() }, // payload
    //       {
    //         jobId: "send-emails", // tránh duplicate nếu job cũ chưa xong
    //         removeOnComplete: true,
    //         removeOnFail: false,
    //       },
    //     );
    //     console.log("Cron triggered -> pushed job");
    //   }
    // }

    // import { Injectable, Logger } from "@nestjs/common";
    // import { Cron } from "@nestjs/schedule";

    // @Injectable()
    // export class EmailService {
    //   private readonly logger = new Logger(EmailService.name);
    //   private isRunning = false; // lock

    //   @Cron("*/10 * * * * *") // chạy mỗi 10s
    //   async sendEmailsJob() {
    //     if (this.isRunning) {
    //       this.logger.warn("Job skipped: previous job still running");
    //       return;
    //     }

    //     this.isRunning = true;
    //     this.logger.log("Start sending emails...");

    //     try {
    //       // giả sử bạn có 15 email
    //       for (let i = 0; i < 15; i++) {
    //         await this.sendEmail(i); // hàm này mất thời gian
    //       }
    //     } catch (err) {
    //       this.logger.error("Error while sending emails", err.stack);
    //     } finally {
    //       this.isRunning = false; // mở khóa sau khi xong
    //       this.logger.log("Job finished");
    //     }
    //   }

    //   private async sendEmail(i: number) {
    //     // giả lập gửi email tốn thời gian
    //     await new Promise((resolve) => setTimeout(resolve, 2000));
    //     this.logger.log(`Email ${i + 1} sent`);
    //   }
    // }
}