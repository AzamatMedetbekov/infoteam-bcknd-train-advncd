import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";

export class CategoryRepository{
    constructor(private readonly prisma: PrismaService){}
    
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