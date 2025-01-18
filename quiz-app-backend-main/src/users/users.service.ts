import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

// Dependency Injection
// Service here is to communicate to the database
// Logic for your app

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}


    // This function create the user to the data, Adds a user to a database
    async create(createUserDto: CreateUserDto) {

        // From this stage, you can perform additional password check
        // regex a-zA-Z1-9@^*()

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        
        // This is creating the user to the database
        return this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
                username: createUserDto.username,
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        });
    }

    // Fetches all users from users table
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        });
    }

    // Finds a user and returns based on the ID
    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    // This function updates the user
    async update(id: string, updateUserDto: Partial<CreateUserDto>) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                email: updateUserDto.email,
                password: updateUserDto.password,
                username: updateUserDto.username,
            },
            select: {
                id: true,
                email: true,
                username: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }


    async remove(id: string) {
        const user = await this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }
}