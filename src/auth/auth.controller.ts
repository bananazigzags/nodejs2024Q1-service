import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/auth';
import { JwtRefreshAuthGuard } from './guards/authGuard';
import { Public } from './guards/public';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(StatusCodes.OK)
  @Post('login')
  async login(@Body() authPayload: CreateUserDto) {
    return this.authService.login(authPayload);
  }

  @Public()
  @Post('signup')
  async signup(@Body() authPayload: CreateUserDto) {
    return this.authService.signup(authPayload);
  }

  @Public()
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: JwtPayload,
    @Body() refreshToken: RefreshTokenDto,
  ) {
    const user = req.user;
    return this.authService.refresh(user.userId, refreshToken);
  }

  @HttpCode(StatusCodes.OK)
  @Post('logout')
  async logout(@Request() req: JwtPayload) {
    const user = req.user;
    return this.authService.logout(user.userId);
  }
}
