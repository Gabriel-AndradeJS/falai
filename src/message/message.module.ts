import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageController } from './message.controller';

@Module({
  imports: [PrismaModule],
  providers: [MessageService, MessageGateway],
  controllers: [MessageController],
})
export class MessageModule {}
