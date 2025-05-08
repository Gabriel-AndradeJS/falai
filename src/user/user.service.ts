import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { extname, resolve } from 'path';
import * as fs from 'node:fs/promises'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async getUser(tokenPayloadParam: PayloadTokenDto) {
    const user = this.prisma.user.findMany({
      where: {
        id: {
          not: tokenPayloadParam.sub
        }

      }, select: {
        id: true,
        name: true,
        email: true,
        status: true,
      }
    });
    return user;
  }

  async uploadAvatarImage(tokenPayload: PayloadTokenDto, file: Express.Multer.File) {
    try {

      const fileExtension = extname(file.originalname);
      const fileName = `${tokenPayload.sub}${fileExtension}`;
      const filePath = resolve(process.cwd(), 'files', fileName);

      await fs.writeFile(filePath, file.buffer);

      const findUser = await this.prisma.user.findFirst({
        where: { id: tokenPayload.sub },
      });

      if (!findUser) {
        throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);
      }

      const updateUser = await this.prisma.user.update({
        where: { id: findUser.id },
        data: {
          avatar: fileName,
        }, select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      })

      return updateUser

    } catch (e) {
      throw new HttpException('Erro ao fazer upload da imagem!', HttpStatus.BAD_REQUEST);
    }
  }
}
