import { Injectable } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

@Injectable()
export class MessageService {

    // constructor(private prisma: PrismaModule) {}  

    createMessage(senderId: number, receiverId: number, content: string) {
        console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
    }
}
