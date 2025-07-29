import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @ApiProperty({
    description: 'The student ID of the user',
    example: '20240000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly studentId?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '01099881177',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'staff@gist.ac.kr or student@gm.gist.ac.kr',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  readonly email?: string;
}

export class SubscriptionDto {
  @ApiProperty({
    description: 'The ID of the category to subscribe to',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly categoryId: number;
}
