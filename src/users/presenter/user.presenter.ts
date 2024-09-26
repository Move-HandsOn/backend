import { User } from '@prisma/client';

export class UserPresenter {
  constructor(private user: User) {}

  toResponse() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this.user;
    return userWithoutPassword;
  }
}
