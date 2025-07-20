import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostRepository } from './post.repository';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
  imports: [PrismaModule, HttpModule]
})
export class PostModule {}
