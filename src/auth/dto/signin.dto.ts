import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignInDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}