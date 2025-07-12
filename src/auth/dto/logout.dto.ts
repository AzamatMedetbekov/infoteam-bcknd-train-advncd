import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LogoutDto {
    @IsString()
    @ApiProperty({
        example: 'kaka.kaka.kaka.kaka'
    })
    readonly access_token: string
}