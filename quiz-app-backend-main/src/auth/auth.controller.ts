import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("me")
    me() {}

    @Post("signup")
    signup() {
        // implement a singup codes here
    }

    @Post("login")
    login() {}

    @Post("forgot-password")
    forgotPassword() {}

    @Post("reset-password")
    resetPassword() {}
}