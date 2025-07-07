import { PartialType } from "@nestjs/swagger";

export class CreatePostDto {
    title:string;
    content: string;
    authorId: string;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}


export class UpdatePostDto extends PartialType(CreatePostDto){
    title?:string;
    content?: string;
    authorId?: string;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
