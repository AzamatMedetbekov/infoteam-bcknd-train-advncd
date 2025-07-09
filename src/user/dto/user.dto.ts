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
    readonly name: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'staff@gist.ac.kr or  student@gm.gist.ac.kr',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @ApiProperty({
        description: 'The password of the user. Minimum length is 8 symbols.',
        example: 'password123',
        required: true,
    })
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}



export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John',
        required: false,
    })
    @IsString()
    readonly name?: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe',
        required: false,
    })
    @IsString()
    readonly username?: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'staff@gist.ac.kr or student@gm.gist.ac.kr',
        required: false,
    })
    @IsEmail()
    @IsString()
    readonly email?: string;

    @ApiProperty({
        description: 'The password of the user. Minimum length is 8 symbols.',
        example: 'password123',
        required: false,
    })
    @MinLength(8)
    @IsString()
    readonly password?: string;   
}
