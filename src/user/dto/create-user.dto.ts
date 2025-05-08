import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    status: string

    @IsBoolean()
    @IsNotEmpty()
    active: boolean

    @IsString()
    @IsOptional()
    avatar?: string;
    
}