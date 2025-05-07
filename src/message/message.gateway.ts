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
 
  // @SubscribeMessage('getMessages')
  // async handleGetMessages(@MessageBody() payload: { senderId: number; receiverId: number }) {
  //   const messages = await this.messageService.getMessagesBetweenUsers(payload.senderId, payload.receiverId);
  //   this.server.emit('messages', messages);
  //   return messages;
  // }

}
