import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SiteService } from './site.service';

@ApiTags('Site')
@Controller('site-settings')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  @ApiOperation({ summary: 'Get site settings' })
  @ApiResponse({ status: 200, description: 'Returns site settings' })
  async getSettings() {
    return this.siteService.getSettings();
  }

  @Patch('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update site settings' })
  @ApiBearerAuth()
  @ApiBody({ description: 'Partial site settings object' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSettings(@Body() payload: Record<string, unknown>) {
    return this.siteService.updateSettings(payload);
  }
}
