import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import type { CreatePostDto, UpdatePostDto } from '@rainy/shared';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts')
  async findAll() {
    return this.postsService.findAll();
  }

  @Get('posts/:slug')
  async findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Get('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async findAdminAll() {
    return this.postsService.findAdminAll();
  }

  @Get('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async findAdminOne(@Param('id') id: string) {
    return this.postsService.findAdminOne(id);
  }

  @Post('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async create(@Body() payload: CreatePostDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.postsService.create(payload, user);
  }

  @Patch('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async update(@Param('id') id: string, @Body() payload: UpdatePostDto) {
    return this.postsService.update(id, payload);
  }

  @Delete('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
