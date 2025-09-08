import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const email= req.user?.email;
    const user = await this.authService.getProfile(email);
    if (!user) {
      return { message: "User not found" };
    }
    return user;
  }
}
