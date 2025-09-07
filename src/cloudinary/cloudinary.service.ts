import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File) {
    return new Promise<any>((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error) {
            return reject(new Error(error.message));
          }
          resolve(result);
        },
      );
      upload.end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(new Error(error.message));
        resolve(result);
      });
    });
  }
}
