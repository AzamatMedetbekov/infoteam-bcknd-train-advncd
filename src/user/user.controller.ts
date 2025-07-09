import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided details',
  })
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'User created successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Details of the user to be created',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  @ApiOkResponse({
    type: [User],
    isArray: true,
    description: 'All users retrieved successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',})
  @ApiNotFoundResponse({
    description: 'No users found',
  })
  findAll() {
    return this.userService.findAllUsers();
  }

    @Get(':uuid')
  @ApiOperation({
    summary: 'Get a user by UUID',
    description: 'Retrieve a user using UUID',
  })
  @ApiOkResponse({
    type: User,
    description: 'User found successfully',
  })
  @ApiParam({
    name: 'uuid',
    type: String, 
    description: 'The UUID of the user',
  })
    @ApiInternalServerErrorResponse({
      description: 'Internal server error',
    })
    @ApiNotFoundResponse({
      description: 'User not found',
    })
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findUser(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update a user by UUID',
    description: 'Update user details using UUID',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Details of the user to be updated',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the user to update',
  })
  @ApiOkResponse({
    type: User,
    description: 'User updated successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  updateUser(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a user by UUID',
    description: 'Remove a user from the system using UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the user to delete',
  })
  @ApiOkResponse({
    type:User,
    description: 'User deleted successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  deleteUser(@Param('uuid') uuid: string) {
    return this.userService.deleteUser(uuid);
  }
}
