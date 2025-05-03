import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return {
            message: 'User logged in successfully',
            user: signInDto,
        };

    }

    @Post('register')
    signUp(@Body() signInDto: SignInDto) {
        return this.authService.signUp(signInDto);
    }
}
