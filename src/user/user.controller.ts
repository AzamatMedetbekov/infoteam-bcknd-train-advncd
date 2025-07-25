import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, SubscriptionDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity, UserSubscriptionEntity } from './entities/user.entity';
import { jwtAuthGuard } from 'src/auth/strategy/jwtAuth.guard';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  @ApiOkResponse({
    type: [UserEntity],
    isArray: true,
    description: 'All users retrieved successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
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
    type: UserEntity,
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

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Patch('profile')
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Update the authenticated user\'s profile details',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Details of the user to be updated',
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'User updated successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  updateUser(@Body(ValidationPipe) updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req.user.uuid;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a user by UUID',
    description: 'Remove a user from the system using UUID (Admin only)',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the user to delete',
  })
  @ApiOkResponse({
    type: UserEntity,
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

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Post('subscriptions')
  @ApiOperation({
    summary: 'Subscribe to a category',
    description: 'Create a user subscription to a category'
  })
  @ApiBody({
    type: SubscriptionDto,
    description: 'Category subscription details'
  })
  @ApiOkResponse({
    type: UserSubscriptionEntity,
    description: 'User subscribed successfully'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error'
  })
  @ApiNotFoundResponse({
    description: 'Category not found'
  })
  subscribeToCategory(@Body(ValidationPipe) subscriptionDto: SubscriptionDto, @Request() req) {
    const userId = req.user.uuid;
    return this.userService.subscribeToCategory(userId, subscriptionDto.categoryId);
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Delete('subscriptions/:categoryId')
  @ApiOperation({
    summary: 'Unsubscribe from a category',
    description: 'Remove a user subscription from a category'
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'The ID of the category to unsubscribe from'
  })
  @ApiOkResponse({
    type: UserSubscriptionEntity,
    description: 'Subscription removed successfully'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error'
  })
  @ApiNotFoundResponse({
    description: 'Subscription not found'
  })
  unsubscribeFromCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Request() req) {
    const userId = req.user.uuid;
    return this.userService.unsubscribeFromCategory(userId, categoryId);
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Get('subscriptions')
  @ApiOperation({
    summary: 'Get user subscriptions',
    description: 'Retrieve all categories the current user is subscribed to'
  })
  
  @ApiOkResponse({
    type: [UserSubscriptionEntity],
    isArray: true,
    description: 'User subscriptions retrieved successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error'
  })
  getUserSubscriptions(@Request() req) {
    const userId = req.user.uuid;
    return this.userService.getUserSubscriptions(userId);
  }
}