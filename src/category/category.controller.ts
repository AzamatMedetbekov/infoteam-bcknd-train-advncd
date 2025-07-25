import { Controller, Post, Body, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe, Get, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/strategy/jwtAuth.guard';
import { CategoryInfoForUser, CreateCategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Post('categories')
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Details of the new category'
  })
  @ApiOkResponse({
    description: 'Category created successfully'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error'
  })
  createCategory(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto.name)
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Delete('categories/:categoryId')
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Delete one type of category from DB'
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'The ID of the category to delete'
  })
  @ApiOkResponse({
    type: String,
    description: 'Category deleted successfully'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error'
  })
  @ApiNotFoundResponse({
    description: 'Category not found'
  })
  deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoryService.deleteCategory(categoryId);
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Get('overview/subscribers')
  @ApiOperation({
    summary: 'Get overview of categories',
    description: 'Get number of subscribers per category',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  getSubscriberNumberPerCategory() {
    return this.categoryService.getSubscribersPerCategory();
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Get('user-summary')
  @ApiOperation({
    summary: 'Get user category info',
    description: 'Get category information for the user, including subscription status and post count.'
  })
  @ApiOkResponse({
    type: [CategoryInfoForUser],
    isArray: true,
    description: 'User category information retrived successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  getCategoryInfoForUser(@Request() req) {
    const userId = req.user.uuid;
    return this.categoryService.getCategoryInfoForCurrentUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Get('overview/posts')
  @ApiOperation({
    summary: 'Get overview of categories',
    description: 'Get number of posts per category',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  getPostNumberByCategory() {
    return this.categoryService.postNumberByCategory();
  }
}
