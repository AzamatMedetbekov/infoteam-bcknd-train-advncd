import { Exclude } from 'class-transformer';

export class User {
  uuid: string;
  name: string;
  email: string;

  
  @Exclude()
  password?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
