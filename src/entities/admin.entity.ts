import { Exclude } from 'class-transformer';

@Exclude()
export class AdminEntity {
  id: number;
  firstname: string;
  lastname: string;
  username: string | null;
  email: string;
  password: string;
  resetPasswordToken: string | null;
  registrationToken: string | null;
  isActive: boolean;
  blocked: boolean;
  preferedLanguage: string | null;
  createdAt: string;
  updatedAt: string;
}
