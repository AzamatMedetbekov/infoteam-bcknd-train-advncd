import { Controller, Post, Body, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/strategy/jwtAuth.guard';
import { CreateCategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('category')
export class CategoryController{
  constructor(private readonly categoryService: CategoryService){}
  
  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @Post('categories')
  @ApiOperation({
    summary:'Create a new category',
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
  createCategory(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto){
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
}
