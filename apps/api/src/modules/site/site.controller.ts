import { Controller, Get } from '@nestjs/common';

@Controller('site-settings')
export class SiteController {
  @Get()
  getSettings() {
    return {
      siteName: 'Rainy Cole',
      subtitle: '记录代码、生活与长期主义',
      aboutContent: '这是一个用于练手和长期运营的个人博客。',
      seoDefaultTitle: 'Rainy Cole Blog',
      seoDefaultDescription: '个人博客首版工程'
    };
  }
}
