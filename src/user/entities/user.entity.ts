import { Category, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  uuid: string;
  name: string;
  email: string;
  studentId: string;
  phoneNumber: string;

  @Exclude()
  password?: string;

  @Exclude()
  refresh_token?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class UserSubscriptionEntity {
  userId: string;
  categoryId: number;

  @Exclude()
  user?: User;

  @Exclude()
  category?: Category;

  constructor(partial: Partial<UserSubscriptionEntity>) {
    Object.assign(this, partial);
  }
}
