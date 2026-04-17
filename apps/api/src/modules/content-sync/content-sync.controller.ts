import { Controller, Post } from '@nestjs/common';

@Controller('content-sync')
export class ContentSyncController {
  @Post('markdown')
  syncMarkdown() {
    return {
      status: 'queued',
      contentDir: 'content/posts'
    };
  }
}
