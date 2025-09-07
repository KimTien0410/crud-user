import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { Express } from "express";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    // Check size (5MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException("File too large! Max 5MB allowed");
    }

    // Check mimetype
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException(
        "Only image files (jpg, jpeg, png, webp) are allowed",
      );
    }

    return file;
  }
}
