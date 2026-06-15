import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ContentSyncService } from './content-sync.service';

@ApiTags('Content Sync')
@Controller('content-sync')
export class ContentSyncController {
  constructor(private readonly contentSyncService: ContentSyncService) {}

  @Post('markdown')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Sync markdown posts to database' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Sync completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async syncMarkdown() {
    return this.contentSyncService.syncMarkdownPosts();
  }
}
