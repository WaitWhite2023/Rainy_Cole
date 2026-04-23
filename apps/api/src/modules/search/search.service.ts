import { Injectable, Logger } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import type { PostListItemDto } from '@rainy/shared';
import { PrismaService } from '../../common/prisma/prisma.service';

type SearchDocument = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  tagSlugs: string[];
  categories: string[];
  categorySlugs: string[];
  status: string;
  sourceType: string;
  publishedAt: string | null;
};

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly host = process.env.MEILI_HOST?.trim() || 'http://localhost:7700';
  private readonly indexName = process.env.MEILI_POST_INDEX || 'posts';
  private readonly client = this.host
    ? new MeiliSearch({
        host: this.host,
        apiKey: process.env.MEILI_MASTER_KEY
      })
    : null;
  private settingsReady = false;

  constructor(private readonly prisma: PrismaService) {}

  async search(
    keyword: string,
    options?: { category?: string; tag?: string; limit?: number }
  ): Promise<PostListItemDto[]> {
    const normalizedKeyword = keyword.trim();
    const limit = options?.limit ?? 20;

    if (!normalizedKeyword) {
      return [];
    }

    if (this.client) {
      try {
        await this.ensureIndexSettings();

        const filters: string[] = [];
        if (options?.category) {
          filters.push(`categorySlugs = "${this.escapeFilterValue(options.category)}"`);
        }
        if (options?.tag) {
          filters.push(`tagSlugs = "${this.escapeFilterValue(options.tag)}"`);
        }

        const result = await this.client
          .index<SearchDocument>(this.indexName)
          .search(normalizedKeyword, {
            limit,
            filter: filters.length ? filters : undefined
          });

        return result.hits.map((hit) => this.toListItem(hit));
      } catch (error) {
        this.logger.warn(`Meilisearch query failed, fallback to DB search. ${this.toErrorMessage(error)}`);
      }
    }

    return this.searchFromDatabase(normalizedKeyword, options);
  }

  async syncPostById(postId: string) {
    if (!this.client) {
      return;
    }

    try {
      await this.ensureIndexSettings();

      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          categories: {
            include: { category: true }
          },
          tags: {
            include: { tag: true }
          }
        }
      });

      const index = this.client.index<SearchDocument>(this.indexName);

      if (!post || post.status !== 'PUBLISHED') {
        await index.deleteDocument(postId);
        return;
      }

      await index.addDocuments([this.toSearchDocument(post)]);
    } catch (error) {
      this.logger.warn(`Sync post index failed(${postId}): ${this.toErrorMessage(error)}`);
    }
  }

  async rebuildIndexFromPublishedPosts() {
    if (!this.client) {
      return {
        enabled: false,
        indexed: 0
      };
    }

    try {
      await this.ensureIndexSettings();
      const posts = await this.prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          author: true,
          categories: {
            include: { category: true }
          },
          tags: {
            include: { tag: true }
          }
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
      });

      const index = this.client.index<SearchDocument>(this.indexName);
      await index.deleteAllDocuments();

      const documents = posts.map((post) => this.toSearchDocument(post));
      if (documents.length) {
        await index.addDocuments(documents);
      }

      return {
        enabled: true,
        indexed: documents.length
      };
    } catch (error) {
      this.logger.warn(`Rebuild search index failed: ${this.toErrorMessage(error)}`);
      return {
        enabled: true,
        indexed: 0,
        error: this.toErrorMessage(error)
      };
    }
  }

  private async searchFromDatabase(
    keyword: string,
    options?: { category?: string; tag?: string; limit?: number }
  ): Promise<PostListItemDto[]> {
    const loweredKeyword = keyword.toLowerCase();
    const posts = await this.prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(options?.category
          ? {
              categories: {
                some: {
                  category: {
                    slug: options.category
                  }
                }
              }
            }
          : {}),
        ...(options?.tag
          ? {
              tags: {
                some: {
                  tag: {
                    slug: options.tag
                  }
                }
              }
            }
          : {})
      },
      include: {
        author: true,
        categories: {
          include: { category: true }
        },
        tags: {
          include: { tag: true }
        }
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: Math.max((options?.limit ?? 20) * 3, 60)
    });

    const matchedPosts = posts.filter((post) =>
      `${post.title}\n${post.summary}\n${post.content}`.toLowerCase().includes(loweredKeyword)
    );

    return matchedPosts.slice(0, options?.limit ?? 20).map((post) => this.toListItem(post));
  }

  private async ensureIndexSettings() {
    if (!this.client || this.settingsReady) {
      return;
    }

    const index = this.client.index<SearchDocument>(this.indexName);
    await index.updateSearchableAttributes(['title', 'summary', 'content', 'tags', 'categories']);
    await index.updateFilterableAttributes(['categorySlugs', 'tagSlugs']);
    await index.updateSortableAttributes(['publishedAt']);
    this.settingsReady = true;
  }

  private toSearchDocument(post: any): SearchDocument {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      tags: post.tags.map((item: any) => item.tag.name),
      tagSlugs: post.tags.map((item: any) => item.tag.slug),
      categories: post.categories.map((item: any) => item.category.name),
      categorySlugs: post.categories.map((item: any) => item.category.slug),
      status: post.status.toLowerCase(),
      sourceType: post.sourceType.toLowerCase(),
      publishedAt: post.publishedAt?.toISOString() ?? null
    };
  }

  private toListItem(post: any): PostListItemDto {
    const tags = Array.isArray(post.tags)
      ? post.tags.map((item: any) => (typeof item === 'string' ? item : item.tag?.name))
      : [];
    const categories = Array.isArray(post.categories)
      ? post.categories.map((item: any) =>
          typeof item === 'string' ? item : item.category?.name
        )
      : [];

    const normalizedStatus =
      typeof post.status === 'string' ? post.status.toLowerCase() : 'published';
    const normalizedSourceType =
      typeof post.sourceType === 'string' ? post.sourceType.toLowerCase() : 'database';
    const normalizedPublishedAt =
      post.publishedAt instanceof Date
        ? post.publishedAt.toISOString()
        : typeof post.publishedAt === 'string'
          ? post.publishedAt
          : undefined;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      coverUrl: post.coverUrl ?? undefined,
      tags: tags.filter(Boolean),
      categories: categories.filter(Boolean),
      status: normalizedStatus as PostListItemDto['status'],
      sourceType: normalizedSourceType as PostListItemDto['sourceType'],
      publishedAt: normalizedPublishedAt
    };
  }

  private escapeFilterValue(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  private toErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
