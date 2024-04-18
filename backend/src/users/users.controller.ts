import { Controller, Get, Header, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create() {
    // return this.usersService.create(user);
  }

  @Get()
  findOne() {
    // return this.usersService.findOne(id);
  }
}
