import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [];

  create(user) {
    this.users.push(user);
    return user;
  }

  async findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
