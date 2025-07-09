import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/post.dto';
import { ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
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
  createPost(@Body() createPostDto: CreatePostDto, authorId: string) {
    return this.postService.createPost(createPostDto, authorId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all posts",
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

  @Patch(':uuid')
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
  updatePost(@Param('uuid') uuid: string, @Body() updatePostDto: UpdatePostDto, authorId: string) {
    return this.postService.updatePost(uuid, updatePostDto, authorId);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: "Delete a post by UUID",})
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
  deletePost(@Param('uuid') uuid: string, authorId: string) {
    return this.postService.deletePost(uuid, authorId);
  }
}