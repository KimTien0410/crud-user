import { Injectable } from "@nestjs/common";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { UploadResult } from "./cloudinary.type";

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    return new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "avatars",
            resource_type: "image",
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              return reject(error);
            }

            // Trả về đúng kiểu UploadResult
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        )
        .end(file.buffer); // lấy buffer từ Multer
    });
  }

  async deleteFile(publicId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        (error: UploadApiErrorResponse, result: { result: string }) => {
          if (error) {
            return reject(
              new Error(
                `Cloudinary delete failed: ${error.message ?? JSON.stringify(error)}`,
              ),
            );
          }

          // Cloudinary trả về { result: 'ok' | 'not found' | 'error' }
          if (result.result === "ok") {
            resolve(true);
          } else {
            resolve(false);
          }
        },
      );
    });
  }
}
