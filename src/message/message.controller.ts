import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @UseGuards(AuthTokenGuard)
    @Get()
    getAllMessages(@TokenPayloadParam() tokenPayloadParam: PayloadTokenDto, @Query('receiver', ParseIntPipe) receiver: number) {
        return this.messageService.getMessagesBetweenUsers(tokenPayloadParam, receiver);
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    deleteMessage(@Param('id', ParseIntPipe) messageId: number, @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto) {
        return this.messageService.deleteMessage(messageId, tokenPayloadParam);
    }
    
}
