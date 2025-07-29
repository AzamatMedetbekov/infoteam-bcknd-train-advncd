import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { UserEntity, UserSubscriptionEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findUser(uuid: string): Promise<UserEntity> {
    return this.userRepository.findOne(uuid);
  }

  async updateUser(
    uuid: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    return this.userRepository.update(uuid, updateUserDto);
  }

  async deleteUser(uuid: string): Promise<UserEntity> {
    return this.userRepository.delete(uuid);
  }

  async subscribeToCategory(
    uuid: string,
    categoryId: number
  ): Promise<UserSubscriptionEntity> {
    return await this.userRepository.subscribe(uuid, categoryId);
  }

  async unsubscribeFromCategory(
    uuid: string,
    categoryId: number
  ): Promise<UserSubscriptionEntity> {
    return await this.userRepository.unsubscribe(uuid, categoryId);
  }

  async getUserSubscriptions(uuid: string): Promise<UserSubscriptionEntity[]> {
    return await this.userRepository.getUserSubscriptions(uuid);
  }
}
