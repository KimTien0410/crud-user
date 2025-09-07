import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

  // async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const upload = cloudinary.uploader.upload_stream(
  //       { folder: 'nest-users' },
  //       (err, result) => {
  //         if (err) {
  //           return reject(err);
  //         }
  //         if (!result) {
  //           return reject(new Error('Upload failed'));
  //         }
  //         resolve(result.secure_url);
  //       },
  //     );

  //     // TS giờ hiểu đúng, file.buffer là Buffer
  //     upload.end(file.buffer);
  //   });
  // }

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
    // let avatar: string | undefined;
    // if (file) {
    //   avatar = await this.uploadToCloudinary(file);
    // }
    // const user = this.userRepository.create({
    //   ...createUserDto,
    //   isActive: true,
    //   avatar,
    // });
    // return this.userRepository.save(user);
    const queryRunner = this.dataSource.createQueryRunner();
    let uploadedPublicId: string | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let avatarUrl: string | undefined;

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file).catch((err) => {
          // Nếu upload thất bại thì throw ngay => transaction rollback
          throw new BadRequestException(`Upload avatar failed: ${err.message}`);
        });
        avatarUrl = uploadResult.secure_url;
        uploadedPublicId = uploadResult.public_id;
      }

      const user = queryRunner.manager.create(User, {
        ...createUserDto,
        avatar: avatarUrl,
        isActive: true,
      });

      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // rollback file Cloudinary nếu đã upload
      if (uploadedPublicId) {
        await this.cloudinaryService.deleteFile(uploadedPublicId);
      }

      throw error instanceof BadRequestException
        ? error
        : new BadRequestException('Create user failed: ' + error.message);
    } finally {
      await queryRunner.release();
    }
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
      avatar = await this.cloudinaryService.uploadFile(file);
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
