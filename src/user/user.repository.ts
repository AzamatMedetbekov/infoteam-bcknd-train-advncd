import {ConflictException, Injectable, InternalServerErrorException, UseFilters } from '@nestjs/common';
import { UpdateUserDto,} from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity, UserSubscriptionEntity} from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll():Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => plainToInstance(UserEntity, user));
  }

   async findOne(uuid: string):Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { uuid: uuid },
    });
    if (!user) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);}
    return plainToInstance(UserEntity,user);
  }

  async update(uuid:string , {name, email, phoneNumber,studentId}: UpdateUserDto): Promise<UserEntity> {
  try{
    const user = await this.prisma.user.update({
        where:{uuid: uuid},
        data: {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          studentId: studentId,
        }
    })
      return plainToInstance(UserEntity, user);
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

  async delete(uuid: string): Promise<UserEntity> {
  try{
    await this.prisma.post.deleteMany({
        where: { authorId: uuid },
    });
    const user = await this.prisma.user.delete({
      where: { uuid },
  })
    return plainToInstance(UserEntity, user);
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

async subscribe(uuid: string, categoryId:number): Promise<UserSubscriptionEntity>{
try{
  const subs = await this.prisma.userSubscription.create({
    data: {
      user :{
        connect: {uuid: uuid}
      },
      category: {
        connect: {id: categoryId}
      }
    }
  })
  return plainToInstance(UserSubscriptionEntity, subs)
 }catch(error){
    if(error instanceof PrismaClientKnownRequestError && error.code === 'P2025'){
        throw new NotFoundException('User is not found')
    }
    throw new InternalServerErrorException('Internal Server Error')
 } 
}

  async unsubscribe(uuid: string, categoryId: number ): Promise<UserSubscriptionEntity>{
    try {
      const subs = await this.prisma.userSubscription.delete({
        where: {
         userId_categoryId: {
          userId: uuid,
          categoryId: categoryId,
         }
        }
      })
      return plainToInstance(UserSubscriptionEntity, subs)
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError && error.code === 'P2025'){
        throw new NotFoundException('Not Found')
      }
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

   async getUserSubscriptions(uuid: string): Promise<UserSubscriptionEntity[]> {
    try {
      const subscriptions = await this.prisma.userSubscription.findMany({
        where: {
          userId: uuid
        }
      });
      return subscriptions.map(sub => plainToInstance(UserSubscriptionEntity, sub));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async createCategory(name: string){
   try { await this.prisma.category.create({
      data:{
        name: name,
      }
    })
   }catch(error){
    if(error instanceof PrismaClientKnownRequestError && error.code === 'P2002'){
      throw new ConflictException("A category with this name already exists")
    }
    throw new InternalServerErrorException('Internal Server Error')
   }
  }

  async deleteCategory(categoryId: number){
    try{
      await this.prisma.category.delete({
        where: {
          id: categoryId,
        }
      })
    }catch(error){
      if(error instanceof PrismaClientKnownRequestError && error.code === 'P2025'){
        throw new NotFoundException('Category with this ID not found')
      }
      throw new InternalServerErrorException('Internal Server Error')
    }
  }
}
