import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import {
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PostFullContent } from './entities/post.entity';
import { catchError, from, mergeMap, Observable, of, switchMap, toArray } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostRepository {
  private readonly pushServer
  constructor(private prisma: PrismaService, private httpService: HttpService, private configService: ConfigService) {
    this.pushServer = this.configService.get<string>('PUSH_SERVER')
  }

  private readonly authorSelect = {
    uuid: true,
    name: true,
    email: true,
  };

  private readonly categorySelect = {
    id: true,
    name: true,
  };

  private readonly includePostFullContent = {
    author: { select: this.authorSelect },
    category: { select: this.categorySelect },
  };

  private readonly baseWhereClause = {
    isDeleted: false,
    deletedAt: null,
  };

  private sendNotifications(categoryId: number): Observable<any[]> {
    return from(
      this.prisma.user.findMany({
        where: {
          subscriptions: { some: { categoryId: categoryId } }
        }
      })
    ).pipe(
      switchMap(users => {
        if (users.length == 0) {
          return of([]);
        }

        return from(users).pipe(
          mergeMap(user =>
            this.httpService.post(`${this.pushServer}/api/push`, {
              deviceId: user.uuid,
            }).pipe(
              catchError(error => {
                console.error(`Failed to send notificaiton to ${user.uuid}`, error);
                return of(null)
              })
            )
          ),
          toArray()
        );
      }),
      catchError(error => {
        console.error('Error fetching users for notifications', error);
        return of([]);
      })
    );
  }

  async create({ title, content, categoryId }: CreatePostDto, authorId: string): Promise<PostFullContent> {
    try {

      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, isDeleted: false }
      });

      if (!category) {
        throw new BadRequestException("Category not found or has been deleted")
      }

      const newPost = await this.prisma.post.create({
        data: {
          title: title,
          content: content,
          category: { connect: { id: categoryId } },
          author: { connect: { uuid: authorId } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: this.includePostFullContent,
      });

      this.sendNotifications(categoryId).subscribe({
        error: (error) => console.error('Notification error', error)
      });

      return newPost;

    } catch (error) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async update(uuid: string, { title, content, categoryId }: UpdatePostDto, authorId: string): Promise<PostFullContent> {
    try {

      if (categoryId) {
        const category = await this.prisma.category.findFirst({
          where: { id: categoryId, isDeleted: false }
        })
        if (!category) {
          throw new BadRequestException("Category not found or has been deleted")
        }
      }

      await this.validatePostOwnership(uuid, authorId);
      return await this.prisma.post.update({
        where: { uuid, ...this.baseWhereClause },
        data: {
          title: title,
          content: content,
          ...(categoryId && { category: { connect: { id: categoryId } } }),
          updatedAt: new Date()
        },
        include: this.includePostFullContent,
      });
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }

  //This is Soft  Delete
  async delete(uuid: string, authorId: string): Promise<PostFullContent> {
    try {
      await this.validatePostOwnership(uuid, authorId);

      return await this.prisma.post.update({
        where: { uuid, ...this.baseWhereClause },
        include: this.includePostFullContent,
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        }
      });
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }

  async hardDelete(uuid: string, authorId: string): Promise<PostFullContent> {
    try {
      await this.validatePostOwnership(uuid, authorId);

      return await this.prisma.post.delete({
        where: { uuid },
        include: this.includePostFullContent,
      });
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }

  async findOne(uuid: string): Promise<PostFullContent> {
    const post = await this.prisma.post.findFirst({
      where: { uuid, ...this.baseWhereClause },
      include: this.includePostFullContent,
    });

    if (!post) {
      throw new NotFoundException(`Post with uuid ${uuid} not found`);
    }
    return post;
  }

  async userPostList(userId: string) {
    try {
      const result = await this.prisma.post.findMany({
        skip: 5,
        take: 10,
        where: {
          authorId: userId,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      if (error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException) {
        throw error;
      }
      console.log(error)
      throw new InternalServerErrorException('Error when getting number of posts grouped by category');
    }
  }

  async restore(uuid: string, authorId: string): Promise<PostFullContent> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { uuid },
        select: { authorId: true, isDeleted: true }
      })

      if (!post) {
        throw new NotFoundException(`Post with UUID ${uuid} not found`)
      }

      if (post.authorId !== authorId) {
        throw new ForbiddenException('You are not authorized to perform this action')
      }

      if (!post.isDeleted) {
        throw new BadRequestException('Post is not deleted')
      }

      return await this.prisma.post.update({
        where: {
          uuid
        },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
        include: this.includePostFullContent,
      });
    } catch (error) {
      this.handlePrismaError(error, uuid)
    }
  }

  private async validatePostOwnership(uuid: string, authorId: string): Promise<void> {
    const existingPost = await this.prisma.post.findUnique({
      where: { uuid, ...this.baseWhereClause },
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
    if (error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof BadRequestException) {
      throw error;
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`Post with uuid ${uuid} not found`);
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new BadRequestException('Foreign key constraint failed')
    }

    console.log(error)
    throw new InternalServerErrorException('Internal server error');
  }
}