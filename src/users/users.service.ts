import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) {
      return null;
    }

    const hashedPass = this.generateHash(createUserDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPass,
      },
    });

    return newUser;
  }

  async getAllUserData(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_image: true,
        bio: true,
        gender: true,
        interests: true,
        activities: true,
        feed: true,
        groups: true,
        followers: true,
        following: true,
        events: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const updateData = { ...updateUserDto };

    if (updateUserDto.password) {
      const hashedPass = this.generateHash(updateUserDto.password);
      updateData.password = hashedPass;
    }

    return await this.prismaService.user.update({
      data: updateData,
      where: {
        id: user.id,
      },
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async changePassword(recoveryToken: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        recoveryToken,
      },
    });

    const isValid = await this.jwtService.verifyAsync(recoveryToken, {
      secret: process.env.JWT_SECRET,
    });

    if (!isValid) return null;

    user.recoveryToken = null;

    return await this.update(user.email, { ...user, password });
  }

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
