import { CloudinaryService } from "./../cloudinary/cloudinary.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

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
    const queryRunner = this.dataSource.createQueryRunner();
    let uploadedPublicId: string | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let avatarUrl: string | undefined;

      if (file) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(file);
          avatarUrl = uploadResult.secure_url;
          uploadedPublicId = uploadResult.public_id;
        } catch (err) {
          throw new BadRequestException(
            `Upload avatar failed: ${(err as Error).message}`,
          );
        }
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
        : new BadRequestException("Create user failed: " + error);
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
      // Xoá avatar cũ nếu có
      if (user.avatar) {
        const publicId = user.avatar
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; // Lấy public_id từ URL

        const deleted = await this.cloudinaryService.deleteFile(publicId);
        if (!deleted) {
          throw new BadRequestException("File not found or already deleted");
        }
      }

      // Upload avatar mới
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        avatar = uploadResult.secure_url;
      } catch (err) {
        throw new BadRequestException(
          `Upload avatar failed: ${(err as Error).message}`,
        );
      }
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
