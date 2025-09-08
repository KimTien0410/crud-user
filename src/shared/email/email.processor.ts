import { Processor, Process } from "@nestjs/bull";
import type { Job } from "bull";

@Processor("email")
export class EmailProcessor {
  @Process({ name: "sendEmails", concurrency: 1 }) // chỉ chạy 1 job một lúc
  async handleSendEmails(job: Job<{ timestamp: number }>) {
    console.log(
      `Start sending emails at ${new Date(job.data.timestamp).toISOString()}`,
    );

    for (let i = 0; i < 15; i++) {
      await this.sendEmail(i);
    }

    console.log("All 15 emails sent ✅");
  }

  private async sendEmail(i: number) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // giả lập delay gửi
    console.log(`Email ${i + 1} sent`);
  }
}
