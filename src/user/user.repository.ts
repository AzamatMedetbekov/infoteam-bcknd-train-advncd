import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto,
        UpdateUserDto,} from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<User>{
    try{
      const user = await this.prisma.user.create({
            data: createUserDto
        })
      return user;
    } catch (error) {
      if(error.code === 'P2002' && error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(`User with email ${createUserDto.email} already exists`);
      }
      console.error(error);
      throw new InternalServerErrorException(`Internal server error`);
    }
    }

  async findAll():Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => plainToInstance(User, user));
  }

  async findOne(uuid: string):Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });
    if (!user) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);}
    return plainToInstance(User,user);
  }

  async update(uuid:string , updateUserDto: UpdateUserDto): Promise<User> {
  try{
    const user = await this.prisma.user.update({
        where:{uuid: uuid},
        data: updateUserDto,
    })
      return plainToInstance(User, user);
  } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with uuid ${uuid} not found`);
        }
      }
      console.error(error);
      throw new InternalServerErrorException(`Internal server error`);
    }
  } 

  async delete(uuid: string): Promise<User> {
  try{
    const user = await this.prisma.user.delete({
      where: { uuid },
  })
    return plainToInstance(User, user);
} catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with uuid ${uuid} not found`);
      }
    }
    console.error(error);
    throw new InternalServerErrorException(`Internal server error`);
  }
}
}
