import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Announcement',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class CategoryInfoForUser {
  @ApiProperty({ description: 'The ID of the category.' })
  id: string;

  @ApiProperty({ description: 'Name of the category.' })
  name: string;

  @ApiProperty({
    description:
      'True if the user is subscribed to this category, false otherwise.',
  })
  isSubscribed: boolean;

  @ApiProperty({
    description: 'The number of posts by the current user in this category.',
  })
  postCount: number;
}

export class postNumberByCategory {
  categoryId: string;
  name: string;
  count: number;
}
