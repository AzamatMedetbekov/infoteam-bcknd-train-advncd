import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository){}

   async createCategory(name: string){
    return await this.categoryRepository.createCategory(name);
  }

  async deleteCategory(categoryId: number){
    return await this.categoryRepository.deleteCategory(categoryId);
  }

}
