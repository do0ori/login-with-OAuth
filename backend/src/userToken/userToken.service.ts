import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTokenService {
    private readonly userToken = [];

    async create(token: any) {
        this.userToken.push(token);
        return token;
    }

    async find(userId: number) {
        return this.userToken.find((token) => token.userId === userId);
    }

    async update(userId: number, token: any) {
        const index = this.userToken.findIndex((existingUserToken) => existingUserToken.userId === userId);

        if (index === -1) throw new Error('User not found');

        this.userToken[index] = { ...this.userToken[index], ...token };

        return this.userToken[index];
    }
}
