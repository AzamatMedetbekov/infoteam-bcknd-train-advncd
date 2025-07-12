import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class PayloadDto{

    @IsString()
    @ApiProperty({
        example: 'abc@gm.gist.ac.kr'
    })
    readonly email: string

    @IsString()
    @ApiProperty({
        example: '2d87779b-7632-4163-afa0-5062d83e325b'
    })
    readonly uuid: string
}