import { Injectable } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      name: 'rainy-cole-api',
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    };
  }
}
