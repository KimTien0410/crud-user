import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "src/common/pipes/file-validation.pipe";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { AuthGuard } from "../auth/guards/auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("avatar"))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(FileValidationPipe) file?: Express.Multer.File,
  ) {
    return this.userService.create(createUserDto, file);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles("admin")
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  @Roles("admin")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles("user", "admin")
  @UseInterceptors(FileInterceptor("avatar"))
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.update(+id, updateUserDto, file);
  }
  @UseGuards(AuthGuard)
  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
