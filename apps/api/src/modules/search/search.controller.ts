import { Controller, Get, Query } from '@nestjs/common';

@Controller('posts/search')
export class SearchController {
  @Get()
  search(@Query('keyword') keyword = '') {
    return {
      keyword,
      hits: [],
      message: 'Search endpoint placeholder for Meilisearch integration'
    };
  }
}
