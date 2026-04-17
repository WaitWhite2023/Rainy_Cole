import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import type { CreateTaxonomyDto, UpdateTaxonomyDto } from '@rainy/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TagsService } from './tags.service';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tags')
  async findAll() {
    return this.tagsService.findAll();
  }

  @Post('admin/tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async create(@Body() payload: CreateTaxonomyDto) {
    return this.tagsService.create(payload);
  }

  @Patch('admin/tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async update(@Param('id') id: string, @Body() payload: UpdateTaxonomyDto) {
    return this.tagsService.update(id, payload);
  }

  @Delete('admin/tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
