/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@prisma/client';

export class UserPresenter {
  constructor(private user: User) {}

  toResponse() {
    const {
      password,
      recoveryToken,
      refreshToken,
      created_at,
      updated_at,
      ...userWithoutPassword
    } = this.user;

    return userWithoutPassword;
  }
}
