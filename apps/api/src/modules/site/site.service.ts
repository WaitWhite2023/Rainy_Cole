import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.siteSetting.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    if (!settings) {
      return {
        siteName: 'Rainy Cole',
        subtitle: '记录代码、生活与长期主义',
        aboutContent: '这是一个用于练手和长期运营的个人博客。',
        seoDefaultTitle: 'Rainy Cole Blog',
        seoDefaultDescription: '个人博客首版工程',
        socialLinks: []
      };
    }

    return settings;
  }

  async updateSettings(payload: Record<string, unknown>) {
    const settings = await this.prisma.siteSetting.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    const normalizedPayload = {
      siteName: String(payload.siteName ?? 'Rainy Cole'),
      subtitle: String(payload.subtitle ?? ''),
      aboutContent: String(payload.aboutContent ?? ''),
      seoDefaultTitle: String(payload.seoDefaultTitle ?? ''),
      seoDefaultDescription: String(payload.seoDefaultDescription ?? ''),
      socialLinks: Array.isArray(payload.socialLinks) ? payload.socialLinks : []
    };

    if (!settings) {
      return this.prisma.siteSetting.create({
        data: normalizedPayload
      });
    }

    return this.prisma.siteSetting.update({
      where: { id: settings.id },
      data: normalizedPayload
    });
  }
}
