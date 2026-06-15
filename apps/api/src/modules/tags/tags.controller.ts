import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaxonomyDto, UpdateTaxonomyDto } from '@rainy/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Returns tag list' })
  async findAll() {
    return this.tagsService.findAll();
  }

  @Post('admin/tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create a tag' })
  @ApiBody({ type: CreateTaxonomyDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Tag created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: CreateTaxonomyDto) {
    return this.tagsService.create(payload);
  }

  @Patch('admin/tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateTaxonomyDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() payload: UpdateTaxonomyDto) {
    return this.tagsService.update(id, payload);
  }

  @Delete('admin/tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
