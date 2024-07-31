import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly users = [];

    create(user: any) {
        this.users.push(user);
        return user;
    }

    async findById(id: number) {
        return this.users.find((user) => user.id === id);
    }

    async findBySocialId(socialId: string) {
        return this.users.find((user) => user.socialId === socialId);
    }

    async update(id: number, user: any) {
        const index = this.users.findIndex((existingUser) => existingUser.id === id);

        if (index === -1) throw new Error('User not found');

        this.users[index] = { ...this.users[index], ...user };

        return this.users[index];
    }
}
