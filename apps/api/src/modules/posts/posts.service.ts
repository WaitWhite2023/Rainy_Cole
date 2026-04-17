import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreatePostDto, PostDetailDto, PostListItemDto, UpdatePostDto } from '@rainy/shared';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PostListItemDto[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }]
    });

    return posts.map((post) => this.toListItem(post));
  }

  async findAdminAll(): Promise<PostListItemDto[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: [{ updatedAt: 'desc' }]
    });

    return posts.map((post) => this.toListItem(post));
  }

  async findAdminOne(id: string): Promise<PostDetailDto & { tagIds: string[]; categoryIds: string[] }> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!post) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    return {
      ...this.toDetailItem(post),
      tagIds: post.tags.map((item: any) => item.tagId),
      categoryIds: post.categories.map((item: any) => item.categoryId)
    };
  }

  async findOne(slug: string): Promise<PostDetailDto> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!post || post.status !== 'PUBLISHED') {
      throw new NotFoundException(`Post "${slug}" not found`);
    }

    return this.toDetailItem(post);
  }

  async create(payload: CreatePostDto, user?: CurrentUserPayload) {
    if (!user?.sub) {
      throw new NotFoundException('Authenticated user not found');
    }

    const post = await this.prisma.post.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary,
        content: payload.content,
        coverUrl: payload.coverUrl,
        status: payload.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        sourceType: payload.sourceType.toUpperCase() as 'DATABASE' | 'MARKDOWN',
        contentType: 'markdown',
        authorId: user.sub,
        publishedAt: payload.status === 'published' ? new Date() : null,
        tags: {
          create: payload.tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        },
        categories: {
          create: payload.categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        }
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return this.toDetailItem(post);
  }

  async update(id: string, payload: UpdatePostDto) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    if (payload.tagIds || payload.categoryIds) {
      await this.prisma.post.update({
        where: { id },
        data: {
          tags: {
            deleteMany: {}
          },
          categories: {
            deleteMany: {}
          }
        }
      });
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary,
        content: payload.content,
        coverUrl: payload.coverUrl,
        status: payload.status
          ? (payload.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')
          : undefined,
        sourceType: payload.sourceType
          ? (payload.sourceType.toUpperCase() as 'DATABASE' | 'MARKDOWN')
          : undefined,
        publishedAt:
          payload.status === 'published'
            ? existingPost.publishedAt ?? new Date()
            : payload.status === 'draft' || payload.status === 'archived'
              ? null
              : undefined,
        tags: payload.tagIds
          ? {
              create: payload.tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId }
                }
              }))
            }
          : undefined,
        categories: payload.categoryIds
          ? {
              create: payload.categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId }
                }
              }))
            }
          : undefined
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return this.toDetailItem(updatedPost);
  }

  async remove(id: string) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    await this.prisma.post.delete({
      where: { id }
    });

    return { success: true };
  }

  private toListItem(post: any): PostListItemDto {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      coverUrl: post.coverUrl ?? undefined,
      tags: post.tags.map((item: any) => item.tag.name),
      categories: post.categories.map((item: any) => item.category.name),
      status: post.status.toLowerCase(),
      sourceType: post.sourceType.toLowerCase(),
      publishedAt: post.publishedAt?.toISOString()
    };
  }

  private toDetailItem(post: any): PostDetailDto {
    return {
      ...this.toListItem(post),
      content: post.content,
      seoTitle: post.seoTitle ?? undefined,
      seoDescription: post.seoDescription ?? undefined,
      authorName: post.author.nickname,
      viewCount: post.viewCount
    };
  }
}
