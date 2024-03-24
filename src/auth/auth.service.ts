import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/auth';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async upsertRtHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prismaService.refreshToken.upsert({
      where: { userId },
      update: { hashedRt: hash },
      create: { userId, hashedRt: hash },
    });
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, login },
        {
          expiresIn: process.env.TOKEN_EXPIRE_TIME || 60,
          secret: process.env.JWT_SECRET_KEY,
        },
      ),
      this.jwtService.signAsync(
        { userId, login },
        {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || 60 * 3,
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(dto: CreateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: { login: dto.login },
    });
    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    console.log(passwordMatches);
    if (!passwordMatches) {
      throw new ForbiddenException('Authentication failed');
    }
    const tokens = await this.getTokens(user.id, user.login);
    console.log(tokens);
    await this.upsertRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser = await this.userService.createUser({
      login: dto.login,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.upsertRtHash(newUser.id, tokens.refreshToken);
    return { ...newUser, ...tokens };
  }

  async refresh(userId: string, dto: RefreshTokenDto): Promise<Tokens> {
    const refreshToken = await this.prismaService.refreshToken.findUnique({
      where: { userId },
    });
    if (!refreshToken) {
      throw new ForbiddenException('Authentication failed');
    }
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }
    console.log(`inside refresh: ${JSON.stringify(refreshToken)}`);
    const rtMatches = await bcrypt.compare(
      dto.refreshToken,
      refreshToken.hashedRt,
    );
    if (!rtMatches) {
      throw new ForbiddenException('Authentication failed');
    }
    const tokens = await this.getTokens(user.id, user.login);
    await this.upsertRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prismaService.refreshToken.delete({
      where: { userId },
    });
  }
}
