import { Injectable } from '@nestjs/common';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    getUser(tokenPayloadParam: PayloadTokenDto) {
        const user = this.prisma.user.findMany({
            where: {
              id: {
                not: tokenPayloadParam.sub
              }
              
            },select: {
                id: true,
                name: true,
                email: true,
                status: true,
            }
          });
        return user;
    }
}
