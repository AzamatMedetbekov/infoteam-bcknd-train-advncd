import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @ApiProperty({
        example: 'abcde@gm.gist.ac.kr'
    })
    readonly email: string

    @IsString()
    @ApiProperty({
        description: 'password',
        example: 'abcde'
    })
    readonly password: string
}