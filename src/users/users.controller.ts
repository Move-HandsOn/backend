import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { UserPresenter } from './presenter/user.presenter';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('user')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);

    if (!user) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Email already exists.',
      });
    }

    const userPresenter = new UserPresenter(user);
    return res.status(HttpStatus.CREATED).json(userPresenter.toResponse());
  }

  @Get('profile')
  async findOne(@GetUser() user: User, @Res() res: Response) {
    const userFound = await this.usersService.getAllUserData(user.id);

    if (!userFound) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found.',
      });
    }

    return res.status(HttpStatus.OK).json(userFound);
  }

  @Patch('profile')
  async update(
    @GetUser() user: Partial<User>,
    @Res() res: Response,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const updatedUser = await this.usersService.update(
      user.email,
      updateUserDto
    );

    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found.',
      });
    }

    const userPresenter = new UserPresenter(updatedUser);
    return res.status(HttpStatus.OK).json(userPresenter.toResponse());
  }

  @Delete('profile')
  async remove(@GetUser() user: Partial<User>, @Res() res: Response) {
    await this.usersService.remove(user.id);
    return res
      .status(HttpStatus.NO_CONTENT)
      .json({ messgae: 'Account successfully deleted.' });
  }
}
