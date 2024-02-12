import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  username: string;
  email: string;
  provider: string;
  @Exclude()
  password: string;
  @Exclude()
  resetPasswordToken: string | null;
  @Exclude()
  confirmationToken: string | null;
  @Exclude()
  confirmed: boolean;
  @Exclude()
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

interface UserRole {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
