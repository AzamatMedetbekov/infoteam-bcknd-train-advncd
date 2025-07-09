import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Category } from "@prisma/client";

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'this is title' })
  readonly title: string;

  @IsString()
  @ApiProperty({ example: 'this is content' })
  readonly content: string;

  @IsArray()
  @ApiProperty({ example: ['abc', 'def'] })
  readonly tags: string[];

  @ApiProperty({ example: 'ACADEMIC' })
  readonly category: Category;
}


export class UpdatePostDto extends PartialType(CreatePostDto){
    @IsString()
    @ApiProperty({ example: 'this is title' })
    title?:string;

    @IsString()
    @ApiProperty({ example: 'this is content' })
    content?: string;

    @IsArray()
    @ApiProperty({ example: ['abc', 'def'] })
    tags?: string[];

    @ApiProperty({ example: 'ACADEMIC' })
    category?: Category;
}
