import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FileUploadDTO } from 'src/supabase/dto/upload.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService
  ) {}

  async create(createUserDto: CreateUserDto, file: FileUploadDTO) {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) {
      return null;
    }

    let uploadedFileUrl: string | undefined = undefined;
    if (file) {
      uploadedFileUrl = await this.supabaseService.upload(file);
    }

    const hashedPass = this.generateHash(createUserDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        profile_image: uploadedFileUrl,
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
        activities: {
          include: {
            media: { select: { media_url: true } },
            comments: true,
            likes: true,
          }
        },
        interests: true,
        feed: true,
        groups: true,
        followers: true,
        following: true,
        events: true,
      },
    });

    if (!user) {
      return null;
    }

    const followerCount = user.followers.length;
    const followingCount = user.following.length;
    const groupCount = user.groups.length;
    const activityCount = user.activities.length;

    const { averageDaily, weeklyProgress, weekdayDuration} = this.calculateActivityStats(user.activities);

    const activities = user.activities.map(activity => ({
      ...activity,
      media: activity.media.map(media => media.media_url),
  }));

    return {
        ...user,
        activities,
        followerCount,
        followingCount,
        groupCount,
        activityCount,
        averageDaily,
        weeklyProgress,
        weekdayDuration,
    };
  }

  calculateActivityStats(activities: Array<{ activity_date: Date, duration: number }>) {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const recentActivities = activities.filter(({ activity_date }) => {
        return activity_date >= sevenDaysAgo && activity_date <= today;
    });

    const dailyDurations = recentActivities.reduce((acc, { activity_date, duration }) => {
        const day = activity_date.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + duration;
        return acc;
    }, {} as Record<string, number>);

    const averageDaily =
        Object.values(dailyDurations).reduce((sum, duration) => sum + duration, 0) /
        Object.keys(dailyDurations).length;

    const weeklyProgress = Object.entries(dailyDurations).reduce((acc, [day, duration]) => {
        const date = new Date(day);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().slice(0, 10);
        acc[weekStart] = (acc[weekStart] || 0) + duration;
        return acc;
    }, {} as Record<string, number>);

    const weekdayDurationsValues = Object.entries(dailyDurations).reduce((acc, [day, duration]) => {
        const weekday = new Date(day).toLocaleString('pt-BR', { weekday: 'short' });
        acc[weekday] = (acc[weekday] || 0) + duration;
        return acc;
    }, {} as Record<string, number>);

    const weekdayDuration = Object.entries(weekdayDurationsValues).map(([day, hours]) => ({
        day,
        hours,
    }));

    return {
        weekdayDuration,
        dailyDurations,
        averageDaily,
        weeklyProgress,
    };
}

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async update(
    email: string,
    updateUserDto: UpdateUserDto,
    file?: FileUploadDTO
  ) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!this.hasUpdate(updateUserDto, file)) {
      throw new BadRequestException(
        'At least one field or the profile image must be updated.'
      );
    }

    if (updateUserDto.email && updateUserDto.email !== email) {
      const existingEmail = await this.findUserByEmail(updateUserDto.email);
      if (existingEmail) {
        throw new BadRequestException('Email already in use.');
      }
    }

    const updateData = await this.prepareUpdateData(user, updateUserDto, file);

    return this.prismaService.user.update({
      data: updateData,
      where: { id: user.id },
    });
  }

  private hasUpdate(
    updateUserDto: UpdateUserDto,
    file?: FileUploadDTO
  ): boolean {
    return Object.keys(updateUserDto).length > 0 || !!file;
  }

  private async prepareUpdateData(
    user: User,
    updateUserDto: UpdateUserDto,
    file?: FileUploadDTO
  ) {
    const updateData = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = this.generateHash(updateUserDto.password);
    }

    if (file) {
      updateData.profile_image = await this.handleProfileImageUpdate(user, file);
    }

    return updateData;
  }

  private async handleProfileImageUpdate(
    user: User,
    file: FileUploadDTO
  ) {

    let deletePromise: Promise<void> | undefined;

    if (user.profile_image) {
      deletePromise = this.supabaseService.delete(user.profile_image);
    }
    const uploadPromise = this.supabaseService.upload(file);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, uploadedFileUrl] = await Promise.all([
      deletePromise,
      uploadPromise,
    ]);

    return uploadedFileUrl;
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
