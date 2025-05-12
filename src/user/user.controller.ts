import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { UserService } from './user.service';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthTokenGuard)
    @Get()
    getUser(@TokenPayloadParam() tokenPayloadParam: PayloadTokenDto) {
        return this.userService.getUser(tokenPayloadParam);
    }

    @UseGuards(AuthTokenGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('upload')
    async uploadAvatar(
        @TokenPayloadParam() tokenPayload: PayloadTokenDto,
        @UploadedFile(
            new ParseFilePipeBuilder().addFileTypeValidator({
                fileType: /jpg|jpeg|png/g,
            }).addMaxSizeValidator({
                maxSize: 5 * (1024 * 1024), 
            }).build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            })
        ) file: Express.Multer.File) {
        return this.userService.uploadAvatarImage(tokenPayload, file);
    }

    @UseGuards(AuthTokenGuard)
    @Patch()
    async updateUser(@TokenPayloadParam() tokenPayloadParam: PayloadTokenDto, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(tokenPayloadParam, updateUserDto);
    }
}
