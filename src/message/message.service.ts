import { HttpException, Injectable } from '@nestjs/common';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {

    constructor(private prisma: PrismaService) {}  

   async createMessage(senderId: number, receiverId: number, content: string) {

        const sender = await this.prisma.user.findFirst({
            where: { id: senderId },
        });
        const receiver = await this.prisma.user.findFirst({
            where: { id: receiverId },
        });
        if (!sender || !receiver) {
            throw new HttpException('User not found', 404);
        }

       await this.prisma.message.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
                content: content,
            },
        })
        console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
    }

    async getMessagesBetweenUsers(tokenPayload: PayloadTokenDto, receiver: number) {
        return await this.prisma.message.findMany({
          where: {
            OR: [
              { senderId: tokenPayload.sub, receiverId: receiver },
              { senderId: receiver, receiverId: tokenPayload.sub },
            ],
          },
          orderBy: { createdAt: 'asc' },
        });
      }
}
