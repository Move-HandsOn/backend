import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@GetUser() user: User) {
    return this.authService.refreshAccess(user.email, user.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Headers('Authorization') userToken: string,
    @Headers('refresh_token') refreshToken: string,
    @Res() res: Response
  ) {
    const tokenData = await this.authService.decryptToken(userToken);

    await this.authService.logout(tokenData.email, refreshToken);

    res.end();
  }
}
