// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';


export class CreateUserDto {
    @ApiProperty({
        example: 'john@example.com',
        description: 'The email address of the user'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'The user password - minimum 6 characters',
        minimum: 6
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'The username for the account'
    })
    @IsString()
    username: string;
}