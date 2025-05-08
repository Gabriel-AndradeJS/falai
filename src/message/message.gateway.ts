import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'http';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class MessageGateway implements OnModuleInit {
  @WebSocketServer() 
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
    });
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: {
    senderId: number;
    receiverId: number;
    content: string;
  }) {
    await this.messageService.createMessage(payload.senderId, payload.receiverId, payload.content);
    this.server.emit('message', payload.content);
  }

}
