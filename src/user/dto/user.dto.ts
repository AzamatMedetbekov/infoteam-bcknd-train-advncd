import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'staff@gist.ac.kr or  student@gm.gist.ac.kr',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'The password of the user. Minimum length is 8 symbols.',
        example: 'password123',
        required: true,
    })
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    password: string;
}



export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John',
        required: false,
    })
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe',
        required: false,
    })
    @IsString()
    username?: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'staff@gist.ac.kr or student@gm.gist.ac.kr',
        required: false,
    })
    @IsEmail()
    @IsString()
    email?: string;

    @ApiProperty({
        description: 'The password of the user. Minimum length is 8 symbols.',
        example: 'password123',
        required: false,
    })
    @MinLength(8)
    @IsString()
    password?: string;   
}
