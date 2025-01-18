import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// Controllers are used to define the endpoints, your endpoints for example
// GET/users
// POST/users/:id

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Endpoint -> POST/users -> Controller

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ 
        status: 201, 
        description: 'The user has been successfully created.',
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }


    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return all users',
    })
    findAll() {
        return this.usersService.findAll();
    }

    // GET/users/:id
    @Get(':id')
    @ApiOperation({ summary: 'Get a user by id' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return the user',
    })
    @ApiResponse({ 
        status: 404, 
        description: 'User not found',
    })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ 
        status: 200, 
        description: 'The user has been successfully updated.',
    })
    @ApiResponse({ 
        status: 404, 
        description: 'User not found',
    })
    update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ 
        status: 200, 
        description: 'The user has been successfully deleted.',
    })
    @ApiResponse({ 
        status: 404, 
        description: 'User not found',
    })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Get("/:id/stats")
    getUserPerformanceData() {}

    @Get("themes")
    getAvailableThemes() {}

    @Post("themes")
    savesUsersThemes() {}
}
