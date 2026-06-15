import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaxonomyDto, UpdateTaxonomyDto } from '@rainy/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Returns category list' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create a category' })
  @ApiBody({ type: CreateTaxonomyDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: CreateTaxonomyDto) {
    return this.categoriesService.create(payload);
  }

  @Patch('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateTaxonomyDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() payload: UpdateTaxonomyDto) {
    return this.categoriesService.update(id, payload);
  }

  @Delete('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
