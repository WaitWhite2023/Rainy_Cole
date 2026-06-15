import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto, UpdatePostDto } from '@rainy/shared';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Get all published posts' })
  @ApiResponse({ status: 200, description: 'Returns published post list' })
  async findAll() {
    return this.postsService.findAll();
  }

  @Get('posts/:slug')
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiParam({ name: 'slug' })
  @ApiResponse({ status: 200, description: 'Returns post detail' })
  async findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Get('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Get all posts (admin)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns all posts including drafts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAdminAll() {
    return this.postsService.findAdminAll();
  }

  @Get('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Get post by ID (admin)' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns post detail' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAdminOne(@Param('id') id: string) {
    return this.postsService.findAdminOne(id);
  }

  @Post('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: CreatePostDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.postsService.create(payload, user);
  }

  @Patch('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdatePostDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() payload: UpdatePostDto) {
    return this.postsService.update(id, payload);
  }

  @Delete('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
