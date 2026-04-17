import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { CreatePostDto } from '@rainy/shared';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Post()
  create(@Body() payload: CreatePostDto) {
    return this.postsService.create(payload);
  }
}
