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
    private readonly usersService: UsersService // injects the UsersService, allowing for circular dependency
  ) {}

  // generates both access and refresh tokens
  async generateTokens(payload: AuthDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // generates both tokens asynchronously
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: payload.email, // includes email in the token payload
          sub: payload.sub, // includes user ID (subject)
        },
        {
          expiresIn: '2h', // access token expires in 2 hours
        }
      ),
      this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.sub,
        },
        {
          expiresIn: '90d', // refresh token expires in 90 days
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // updates the user's refresh token in the database
  async updateRefreshToken(userEmail: string, refreshToken: string) {
    await this.usersService.updateUser(userEmail, { refreshToken });
  }

  // validates user credentials during login
  async validateUser(userData: LoginDto) {
    const user = await this.usersService.findUserByEmail(userData.email);

    // compares the provided password with the hashed password stored in the database
    if (!user || !(await bcrypt.compare(userData.password, user.password))) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST
      );
    }

    return user;
  }

  // handles user login, generating tokens after validation
  async login(userData: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userFound = await this.validateUser(userData);

    const payload = {
      sub: userFound.id,
      email: userFound.email,
    };

    const tokens = await this.generateTokens(payload); // Generates tokens
    await this.updateRefreshToken(userFound.email, tokens.refreshToken); // Updates the refresh token in the database
    return tokens;
  }

  // decrypts the token and returns the payload data
  async decryptToken(bearerToken: string): Promise<AuthDto> {
    const token = bearerToken.replace('Bearer', '').trim();
    const tokenData = await this.jwtService.verifyAsync(token); // Verifies the token and returns its payload

    return tokenData;
  }

  // updates the access token using the refresh token
  async refreshAccess(userEmail: string, refreshToken: string) {
    const user = await this.usersService.findUserByEmail(userEmail);

    // checks if the user exists and if the refresh token matches the one stored in the database
    if (!user || refreshToken !== user.refreshToken) {
      throw new HttpException(
        'Expired refresh token, login needed',
        HttpStatus.FORBIDDEN
      );
    }

    // generates new access and refresh tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
    });

    return tokens.accessToken; // returns the new access token
  }

  // logs out the user by invalidating the refresh token
  async logout(userEmail: string, refreshToken: string) {
    if (userEmail) {
      return await this.updateRefreshToken(userEmail, refreshToken); // sets the refresh token to null or empty
    }
  }
}
