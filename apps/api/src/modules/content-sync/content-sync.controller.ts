import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ContentSyncService } from './content-sync.service';

@Controller('content-sync')
export class ContentSyncController {
  constructor(private readonly contentSyncService: ContentSyncService) {}

  @Post('markdown')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async syncMarkdown() {
    return this.contentSyncService.syncMarkdownPosts();
  }
}
