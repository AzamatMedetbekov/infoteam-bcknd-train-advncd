import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto{
    @ApiProperty({
        description:'The name of the category',
        example: 'Announcement',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string
}