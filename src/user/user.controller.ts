import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { UserService } from './user.service';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthTokenGuard)
    @Get()
    getUser(@TokenPayloadParam() tokenPayloadParam: PayloadTokenDto) {
        return this.userService.getUser(tokenPayloadParam);
    }
}
