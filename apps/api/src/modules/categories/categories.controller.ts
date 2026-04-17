import { Controller, Get } from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
  @Get()
  findAll() {
    return [
      { id: 'cat-1', name: '公告', slug: 'announcement' },
      { id: 'cat-2', name: '技术', slug: 'tech' }
    ];
  }
}
