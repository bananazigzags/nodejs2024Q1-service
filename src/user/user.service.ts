import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoredUser, FormattedUser, User } from './dto/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
    const createdUser = await this.prismaService.user.create({
      data: { ...user, version: 1 },
    });
    return this.formatUserForReturn(createdUser);
  }

  async deleteUser(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prismaService.user.delete({ where: { id } });
  }

  async updatePassword(id: string, data: UpdatePasswordDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const currentPassword = user.password;
    if (data.oldPassword === currentPassword) {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: { password: data.newPassword, version: { increment: 1 } },
      });
      return this.formatUserForReturn(updatedUser);
    } else {
      throw new ForbiddenException('Wrong password');
    }
  }

  formatUserForReturn(user: StoredUser): FormattedUser {
    const formattedUser: User = {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
    delete formattedUser.password;
    return formattedUser;
  }

  async findAll(): Promise<FormattedUser[]> {
    const users = await this.prismaService.user.findMany();
    const usersToReturn = users.map((user) => this.formatUserForReturn(user));
    return usersToReturn;
  }

  async findById(id: string): Promise<FormattedUser> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.formatUserForReturn(user);
  }
}
