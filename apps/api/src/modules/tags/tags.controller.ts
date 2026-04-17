import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  @Get()
  findAll() {
    return [
      { id: 'tag-1', name: 'NestJS', slug: 'nestjs' },
      { id: 'tag-2', name: 'Vue', slug: 'vue' }
    ];
  }
}
