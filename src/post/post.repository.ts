import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import {
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PostFullContent } from './entities/post.entity';

export class PostRepository {
  constructor(private prisma: PrismaService) {}

  private readonly authorSelect = {
    uuid: true,
    name: true,
    email: true,
  };

  private readonly includeAuthor = {
    author: { select: this.authorSelect },
  };

  async create(createPostDto: CreatePostDto, authorId: string): Promise<PostFullContent> {
    try {
      return await this.prisma.post.create({
        data: {
          ...createPostDto,
          author: { connect: { uuid: authorId } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: this.includeAuthor,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async update(uuid: string, updatePostDto: UpdatePostDto, authorId: string): Promise<PostFullContent> {
    try {
      await this.validatePostOwnership(uuid, authorId);
      
      return await this.prisma.post.update({
        where: { uuid },
        data: { ...updatePostDto, updatedAt: new Date() },
        include: this.includeAuthor,
      });
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }

  async delete(uuid: string, authorId: string): Promise<PostFullContent> {
    try {
      await this.validatePostOwnership(uuid, authorId);
      
      return await this.prisma.post.delete({
        where: { uuid },
        include: this.includeAuthor,
      });
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }

  async findOne(uuid: string): Promise<PostFullContent> {
    const post = await this.prisma.post.findUnique({
      where: { uuid },
      include: this.includeAuthor,
    });

    if (!post) {
      throw new NotFoundException(`Post with uuid ${uuid} not found`);
    }

    return post;
  }

  private async validatePostOwnership(uuid: string, authorId: string): Promise<void> {
    const existingPost = await this.prisma.post.findUnique({
      where: { uuid },
      select: { authorId: true },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with uuid ${uuid} not found`);
    }

    if (existingPost.authorId !== authorId) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }
  }

  private handlePrismaError(error: any, uuid: string): never {
    if (error instanceof NotFoundException || error instanceof ForbiddenException) {
      throw error;
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`Post with uuid ${uuid} not found`);
    }

    throw new InternalServerErrorException('Internal server error');
  }
}