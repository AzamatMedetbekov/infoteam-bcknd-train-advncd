import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @ApiProperty({
        example: 'Q7BsCkHPTAeaAQkgmL5L7KZ9GASIdtfpD02Zqxaq-ds'
    })
    readonly code: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Any string is ok. For example: Drive Slow Homie!'
    })
    readonly code_verifier
}