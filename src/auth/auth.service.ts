import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol,

    ) {}

    async signUp (signInDto: SignInDto) {
        const { email, password, name } = signInDto;
        const hashedPassword = await this.hashingService.hash(password);

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new HttpException('Ja existe um usuario cadastrado com esse email', HttpStatus.BAD_REQUEST);
        }

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status: 'offline', 
            },select: {
                id: true,
                email: true,
                name: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }
}
