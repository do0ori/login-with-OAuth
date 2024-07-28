import { Controller, Get, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users/me')
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
