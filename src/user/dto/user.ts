import { PickType } from '@nestjs/mapped-types';
import { IsUUID, IsString, IsInt } from 'class-validator';

export class User {
  @IsUUID(4)
  id: string; // uuid v4

  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsInt()
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export class UserId extends PickType(User, ['id'] as const) {}
