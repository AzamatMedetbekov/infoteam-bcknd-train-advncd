import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Category } from "@prisma/client";

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'this is title' })
  readonly title: string;

  @IsString()
  @ApiProperty({ example: 'this is content' })
  readonly content: string;

  @IsNumber()
  @ApiProperty({ example: '(ANNOUNCEMENT, or QNA, or MISC)' })
  readonly categoryId: number;
}


export class UpdatePostDto extends PartialType(CreatePostDto){
    @IsString()
    @ApiProperty({ example: 'this is title' })
    title?:string;

    @IsString()
    @ApiProperty({ example: 'this is content' })
    content?: string;

    @ApiProperty({ example: '(ANNOUNCEMENT, or QNA, or MISC)' })
    categoryId?: number;
}
