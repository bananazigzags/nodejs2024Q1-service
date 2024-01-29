import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FormattedUser, User, UserId } from './dto/user';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private users: { [id: UserId['id']]: User } = {};

  createUser(user: CreateUserDto) {
    const id: string = uuid();
    const createdAt = new Date().getTime();
    const updatedAt = new Date().getTime();
    const version = 1;
    this.users[id] = {
      ...user,
      id,
      createdAt,
      updatedAt,
      version,
    };
    return this.formatUserForReturn(this.users[id]);
  }

  deleteUser(id: string) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    delete this.users[id];
  }

  updatePassword(id: string, data: UpdatePasswordDto) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const currentPassword = this.users[id].password;
    if (data.oldPassword === currentPassword) {
      this.users[id].password = data.newPassword;
      this.users[id].updatedAt = new Date().getTime();
      this.users[id].version++;
      return this.formatUserForReturn(this.users[id]);
    } else {
      throw new ForbiddenException('Wrong password');
    }
  }

  formatUserForReturn(user: User): FormattedUser {
    const formattedUser = { ...user };
    delete formattedUser.password;
    return formattedUser;
  }

  findAll(): User[] {
    return Object.values(this.users);
  }

  findById(id: string): User {
    return this.users[id];
  }
}
