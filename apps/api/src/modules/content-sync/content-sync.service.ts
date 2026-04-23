import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { access, readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';

type MarkdownFrontmatter = {
  title?: string;
  slug?: string;
  summary?: string;
  tags?: string[];
  categories?: string[];
  publishedAt?: string;
};

@Injectable()
export class ContentSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService
  ) {}

  async syncMarkdownPosts() {
    const contentDir = await this.resolveContentDir();
    const files = await readdir(contentDir);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    const admin = await this.prisma.user.findFirst({
      where: { username: 'admin' },
      select: { id: true }
    });

    if (!admin) {
      throw new Error('缺少 admin 用户，请先执行 pnpm db:setup');
    }

    const syncedPosts: Array<{ id: string; slug: string; status: string }> = [];

    for (const fileName of markdownFiles) {
      const filePath = join(contentDir, fileName);
      const content = await readFile(filePath, 'utf-8');
      const parsed = matter(content);
      const frontmatter = parsed.data as MarkdownFrontmatter;

      const title = (frontmatter.title || fileName.replace(/\.md$/, '')).trim();
      const slug = this.normalizeSlug(frontmatter.slug || title);
      const summary = (frontmatter.summary || parsed.content.slice(0, 140)).trim();
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.filter(Boolean) : [];
      const categories = Array.isArray(frontmatter.categories)
        ? frontmatter.categories.filter(Boolean)
        : [];
      const publishedAt = frontmatter.publishedAt ? new Date(frontmatter.publishedAt) : null;
      const status = publishedAt ? 'PUBLISHED' : 'DRAFT';

      const categoryIds = await Promise.all(
        categories.map(async (name) => {
          const category = await this.prisma.category.upsert({
            where: { slug: this.normalizeSlug(name) },
            update: { name },
            create: {
              name,
              slug: this.normalizeSlug(name)
            }
          });

          return category.id;
        })
      );

      const tagIds = await Promise.all(
        tags.map(async (name) => {
          const tag = await this.prisma.tag.upsert({
            where: { slug: this.normalizeSlug(name) },
            update: { name },
            create: {
              name,
              slug: this.normalizeSlug(name)
            }
          });

          return tag.id;
        })
      );

      const post = await this.prisma.post.upsert({
        where: { slug },
        update: {
          title,
          summary,
          content: parsed.content.trim(),
          sourceType: 'MARKDOWN',
          sourcePath: `content/posts/${fileName}`,
          contentType: 'markdown',
          status,
          publishedAt,
          authorId: admin.id,
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } }
            }))
          },
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } }
            }))
          }
        },
        create: {
          title,
          slug,
          summary,
          content: parsed.content.trim(),
          sourceType: 'MARKDOWN',
          sourcePath: `content/posts/${fileName}`,
          contentType: 'markdown',
          status,
          publishedAt,
          authorId: admin.id,
          tags: {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } }
            }))
          },
          categories: {
            create: categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } }
            }))
          }
        },
        select: {
          id: true,
          slug: true,
          status: true
        }
      });

      syncedPosts.push({
        id: post.id,
        slug: post.slug,
        status: post.status.toLowerCase()
      });
    }

    const searchResult = await this.searchService.rebuildIndexFromPublishedPosts();

    return {
      contentDir,
      totalFiles: markdownFiles.length,
      syncedCount: syncedPosts.length,
      syncedPosts,
      search: searchResult
    };
  }

  private normalizeSlug(raw: string) {
    const base = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (base) {
      return base;
    }

    return `item-${Buffer.from(raw).toString('hex').slice(0, 12)}`;
  }

  private async resolveContentDir() {
    const candidates = [
      resolve(process.cwd(), 'content/posts'),
      resolve(process.cwd(), '../../content/posts')
    ];

    for (const candidate of candidates) {
      try {
        await access(candidate);
        return candidate;
      } catch {
        continue;
      }
    }

    return candidates[0];
  }
}
