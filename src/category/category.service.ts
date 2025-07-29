import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryInfoForUser } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(name: string) {
    return await this.categoryRepository.createCategory(name);
  }

  async deleteCategory(categoryId: number) {
    return await this.categoryRepository.deleteCategory(categoryId);
  }

  async getCategoryInfoForCurrentUser(
    uuid: string
  ): Promise<CategoryInfoForUser[]> {
    return await this.categoryRepository.getCategoryInfoForUser(uuid);
  }

  async getSubscribersPerCategory() {
    return await this.categoryRepository.subscribersPerCategory();
  }

  async postNumberByCategory() {
    return await this.categoryRepository.postNumberByCategory();
  }
}
