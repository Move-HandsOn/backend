import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-user.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async generateTokens(payload: AuthDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.sub,
        },
        {
          expiresIn: '180s',
        }
      ),
      this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.sub,
        },
        {
          expiresIn: '90d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userEmail: string, refreshToken: string) {
    await this.usersService.update(userEmail, { refreshToken });
  }

  async validateUser(userData: LoginDto) {
    const user = await this.usersService.findUserByEmail(userData.email);

    if (!user || !(await bcrypt.compare(userData.password, user.password))) {
      return null;
    }

    return user;
  }

  async login(
    userData: LoginDto
  ): Promise<
    { accessToken: string; refreshToken: string } | { message: string }
  > {
    const user = await this.validateUser(userData);

    if (!user) {
      return { message: 'Invalid email or password.' };
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.generateTokens(payload);
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  async decryptToken(bearerToken: string): Promise<AuthDto> {
    const token = bearerToken.replace('Bearer', '').trim();
    const tokenData = await this.jwtService.verifyAsync(token);

    return tokenData;
  }

  async refreshAccess(userEmail: string, refreshToken: string) {
    const user = await this.usersService.findUserByEmail(userEmail);

    if (!user || refreshToken !== user.refreshToken) {
      throw new HttpException(
        'Expired refresh token, login needed',
        HttpStatus.FORBIDDEN
      );
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
    });

    return {accessToken: tokens.accessToken};
  }

  async logout(userEmail: string) {
      return await this.updateRefreshToken(userEmail, null);
  }
}
