import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseFilters } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/post.dto';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/strategy/jwtAuth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @ApiBearerAuth()
  @Post()
  @UseGuards(jwtAuthGuard)
  @ApiOperation({
    summary: "Create a new post",
  })
  @ApiOkResponse({
    description: "Post created successfully",
  })
  @ApiBody({
    type: CreatePostDto,
    description: "Details of the post to be created",
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const authorId = req.user.uuid;
    return this.postService.createPost(createPostDto, authorId);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: "Get a post via UUID",
  })
  @ApiOkResponse({
    description: "Found a post via UUID",})
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the post to retrieve',
  })
  @ApiInternalServerErrorResponse({
      description: 'Internal server error',
    })
  @ApiNotFoundResponse({
      description: 'User not found',
    })
  findPost(@Param('uuid') uuid: string) {
    return this.postService.findPost(uuid);
  }

  @ApiBearerAuth()
  @Patch(':uuid')
  @UseGuards(jwtAuthGuard)
  @ApiOperation({
    summary: "Update a post by UUID",
  })
  @ApiOkResponse({
    description: "Post updated successfully",
  })
  @ApiBody({
    type: UpdatePostDto,
    description: "Details of the post to be updated",
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the post to update',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
})
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  updatePost(@Param('uuid') uuid: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    const authorId = req.user.uuid;
    return this.postService.updatePost(uuid, updatePostDto, authorId);
  }

  @ApiBearerAuth()
  @Delete(':uuid')
  @UseGuards(jwtAuthGuard)
  @ApiOperation({
    summary: "Soft delete a post by UUID",})
  @ApiOkResponse({
    description: "Post soft-deleted successfully",
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the post to delete',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  softDeletePost(@Param('uuid') uuid: string, @Request() req) {
    const authorId = req.user.uuid;
    return this.postService.deletePost(uuid, authorId);
  }

  @ApiBearerAuth()
  @Delete(':uuid')
  @UseGuards(jwtAuthGuard)
  @ApiOperation({
    summary: "Delete a post by UUID permanently",})
  @ApiOkResponse({
    description: "Post deleted successfully",
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the post to delete',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  hardDeletePost(@Param('uuid') uuid: string, @Request() req) {
    const authorId = req.user.uuid;
    return this.postService.hardDeletePost(uuid, authorId);
  }

  @ApiBearerAuth()
  @Patch(':uuid/restore')
  @UseGuards(jwtAuthGuard)
  @ApiOperation({
    summary: "Restore a post by UUID",
  })
  @ApiOkResponse({
    description: "Post updated successfully",
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The UUID of the post to restore',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
})
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  restorePost(@Param('uuid') uuid: string, @Request() req) {
    const authorId = req.user.uuid;
    return this.postService.restorePost(uuid, authorId);
  }
}