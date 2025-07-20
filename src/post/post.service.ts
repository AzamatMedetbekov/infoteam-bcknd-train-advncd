import { Injectable } from '@nestjs/common';
import { CreatePostDto , UpdatePostDto} from './dto/post.dto';
import { PostRepository } from './post.repository';
import { from, mergeMap } from 'rxjs';
@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(createPostDto: CreatePostDto, authorId: string) {
    return await this.postRepository.create(createPostDto, authorId)
  }

  async findPost(uuid: string) {
    return await this.postRepository.findOne(uuid);
  }

  async updatePost(uuid: string, updatePostDto: UpdatePostDto, authorId: string) {
    return await this.postRepository.update(uuid, updatePostDto, authorId);
  }

  async deletePost(uuid: string, authorId: string) {
    return await this.postRepository.delete(uuid, authorId);
  }

  async hardDeletePost(uuid: string, authorId:string){
    return await this.postRepository.hardDelete(uuid, authorId);
  }

  async restorePost(uuid: string, authorId: string) {
    return await this.postRepository.restore(uuid, authorId);
  }
}
