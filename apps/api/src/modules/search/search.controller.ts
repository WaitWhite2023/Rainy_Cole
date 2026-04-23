import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search/posts')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('keyword') keyword = '',
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('limit') limit?: string
  ) {
    const normalizedLimit = limit ? Number.parseInt(limit, 10) : undefined;
    const hits = await this.searchService.search(keyword, {
      category,
      tag,
      limit: Number.isFinite(normalizedLimit) ? normalizedLimit : undefined
    });

    return {
      keyword,
      total: hits.length,
      hits
    };
  }
}
