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

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,

    ) {}


    async signIn (signInDto: SignInDto) {
        const { email, password } = signInDto;
        const user = await this.prisma.user.findFirst({
            where: { 
                email,
                active: true,
             },
        });

        await this.prisma.user.update({
            where: { email },
            data: { status: 'online' },
        });


        if (!user) {
            throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await this.hashingService.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('Senha/Usuario incorreta', HttpStatus.UNAUTHORIZED);
        }

        const token = this.jwtService.sign({ sub: user.id, email: user.email }, {
            secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
        });

        return { 
                id: user.id,
                email: user.email,
                name: user.name,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                token:  token,
         };
    }



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
