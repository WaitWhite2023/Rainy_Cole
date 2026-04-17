import { Injectable } from '@nestjs/common';
import type { UserSummaryDto } from '@rainy/shared';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserSummaryDto[]> {
    const users = await this.prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'asc' }
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role.code as UserSummaryDto['role'],
      status: user.status === 'disabled' ? 'disabled' : 'active'
    }));
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { role: true }
    });
  }
}
