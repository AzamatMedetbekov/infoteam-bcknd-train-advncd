import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findUser(uuid: string): Promise<User> {
    return this.userRepository.findOne(uuid);
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(uuid, updateUserDto);
  }

  async deleteUser(uuid:string): Promise<User> {
    return this.userRepository.delete(uuid);
  }
}
