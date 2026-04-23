import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import type { AuthTokensDto, LoginDto } from '@rainy/shared';
import { UsersService } from '../users/users.service';
import { verifyPassword } from '../../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async login(payload: LoginDto): Promise<AuthTokensDto> {
    let user;

    try {
      user = await this.usersService.findByUsername(payload.username);
    } catch (error) {
      if (this.isDatabaseBootstrapError(error)) {
        throw new ServiceUnavailableException(
          '数据库尚未初始化，请先执行 pnpm db:setup'
        );
      }

      throw error;
    }

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordMatched = await verifyPassword(payload.password, user.passwordHash);

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.issueTokens({
      sub: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role.code as 'admin' | 'editor'
    });
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });

      return this.issueTokens({
        sub: payload.sub,
        username: payload.username,
        nickname: payload.nickname,
        role: payload.role
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async issueTokens(user: {
    sub: string;
    username: string;
    nickname: string;
    role: 'admin' | 'editor';
  }): Promise<AuthTokensDto> {
    const tokenPayload = {
      sub: user.sub,
      username: user.username,
      nickname: user.nickname,
      role: user.role
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h'
    });

    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.sub,
        username: user.username,
        nickname: user.nickname,
        role: user.role
      }
    };
  }

  private isDatabaseBootstrapError(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '';
    const prismaCode =
      error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string'
        ? ((error as { code: string }).code as string)
        : null;

    if (prismaCode) {
      return ['P2021', 'P1001'].includes(prismaCode);
    }

    if (
      /P2021|P1001/.test(errorMessage) ||
      /does not exist|relation .* does not exist|can'?t reach database server/i.test(errorMessage)
    ) {
      return true;
    }

    return error instanceof Prisma.PrismaClientKnownRequestError && ['P2021', 'P1001'].includes(error.code);
  }
}
