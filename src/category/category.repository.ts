import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryInfoForUser, postNumberByCategory } from './dto/category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(name: string) {
    try {
      await this.prisma.category.create({
        data: {
          name: name,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A category with this name already exists');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      await this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Category with this ID not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // SELECT "categoryId", COUNT(*) AS user_count
  // FROM "UserSubscription"
  // GROUP BY "categoryId";
  async subscribersPerCategory() {
    try {
      return await this.prisma.userSubscription.groupBy({
        by: ['categoryId'],
        _count: {
          _all: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException(
        'Error when getting number of subscribers grouped by category'
      );
    }
  }

  async getCategoryInfoForUser(userId: string): Promise<CategoryInfoForUser[]> {
    try {
      const queryResults: Array<{
        id: string;
        name: string;
        isSubscribed: boolean | null;
        postCount: bigint;
      }> = await this.prisma.$queryRaw`
        SELECT
        c.id,
        c.name,
        (us."userId" IS NOT NULL) AS "isSubscribed",
        COUNT(p.id) AS "postCount" 
      FROM "Category" c
      INNER JOIN "UserSubscription" us
        ON c.id = us."categoryId" AND us."userId" = ${userId}
      LEFT JOIN "Post" p
        ON p."categoryId" = c.id AND p."authorId" = ${userId}
      GROUP BY c.id, c.name, us."userId"
      ORDER BY c.name; 
    `;

      return queryResults.map((row) => ({
        id: row.id,
        name: row.name,
        isSubscribed: !!row.isSubscribed,
        postCount: Number(row.postCount),
      }));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error when getting category information for user'
      );
    }
  }

  async postNumberByCategory(): Promise<postNumberByCategory[]> {
    try {
      const queryResults: Array<{
        categoryId: string;
        name: string;
        count: bigint;
      }> = await this.prisma.$queryRaw`
      SELECT c.id as "categoryId", c.name, COALESCE(COUNT(p.uuid), 0) as count
      FROM "Category" c
      LEFT JOIN "Post" p ON c.id = p."categoryId"
      GROUP BY c.id, c.name
      ORDER BY c.id
    `;

      return queryResults.map((query) => ({
        categoryId: query.categoryId,
        name: query.name,
        count: Number(query.count),
      }));
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException(
        'Error when getting number of posts grouped by category'
      );
    }
  }
}
