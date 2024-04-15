import { Request } from 'express';
import { User as UserType } from '@prisma/client';

declare global {
  interface CustomRequest extends Request {
    user?: UserType;
  }

  type User = UserType;
}
