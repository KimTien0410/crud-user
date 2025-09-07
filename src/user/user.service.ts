import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'nest-users' },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          if (!result) {
            return reject(new Error('Upload failed'));
          }
          resolve(result.secure_url);
        },
      );

      // TS giờ hiểu đúng, file.buffer là Buffer
      upload.end(file.buffer);
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    let avatar: string | undefined;
    if (file) {
      avatar = await this.uploadToCloudinary(file);
    }
    const user = this.userRepository.create({
      ...createUserDto,
      isActive: true,
      avatar,
    });
    return this.userRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }

    let avatar = user.avatar;
    if (file) {
      avatar = await this.uploadToCloudinary(file);
    }

    const updated = this.userRepository.merge(user, {
      ...updateUserDto,
      avatar,
    });
    return this.userRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
