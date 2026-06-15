import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search/posts')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search posts' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Returns matched posts' })
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
