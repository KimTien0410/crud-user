import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from "express";

import compression from "compression";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: "NestJS-KT:",
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Middleware log trước compression
  // app.use((req, res: any, next) => {
  //   const originalEnd = res.end;
  //   const originalWrite = res.write;
  //   const chunks: Buffer[] = [];
  //
  //   res.write = (chunk: any) => {
  //     chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  //     return originalWrite.apply(res, [chunk]);
  //   };
  //
  //   res.end = (chunk: any) => {
  //     if (chunk)
  //       chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  //     const contentLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
  //     console.log(
  //       `[Before Compression] Response length: ${contentLength} bytes`,
  //     );
  //     return originalEnd.apply(res, [chunk]);
  //   };
  //
  //   next();
  // });

  app.use(
    compression({
      level: 4,
      threshold: 0,
    }),
  );
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  // app.use((req: Request, res: any, next: NextFunction) => {
  //   const originalEnd = res.end;
  //   res.end = ((chunk: any) => {
  //     if (chunk) {
  //       const compressedLength = chunk.length;
  //       console.log(
  //         `[After Compression] Response length: ${compressedLength} bytes`,
  //       );
  //     }
  //     return originalEnd.apply(res, [chunk]);
  //   }) as any;
  //   next();
  // });

  const config = new DocumentBuilder()
    .setTitle("CRUD Users")
    .setDescription("The users API description")
    .setVersion("1.0")
    .addTag("users")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory, {
    jsonDocumentUrl: "swagger/json",
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
