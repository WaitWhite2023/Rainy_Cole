import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SiteService } from './site.service';

@Controller('site-settings')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  async getSettings() {
    return this.siteService.getSettings();
  }

  @Patch('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateSettings(@Body() payload: Record<string, unknown>) {
    return this.siteService.updateSettings(payload);
  }
}
