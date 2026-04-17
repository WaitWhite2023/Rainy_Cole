import { Injectable } from '@nestjs/common';
import type { CreatePostDto, PostDetailDto, PostListItemDto } from '@rainy/shared';

const mockPosts: PostDetailDto[] = [
  {
    id: '1',
    title: '欢迎来到 Rainy Cole',
    slug: 'welcome-to-rainy-cole',
    summary: '这是项目初始化后的示例文章。',
    content: '这篇文章用于联通前后台的基本链路。',
    tags: ['初始化'],
    categories: ['公告'],
    status: 'published',
    sourceType: 'database',
    authorName: 'Admin',
    viewCount: 1,
    publishedAt: new Date().toISOString(),
    coverUrl: ''
  }
];

@Injectable()
export class PostsService {
  findAll(): PostListItemDto[] {
    return mockPosts.map(({ content, authorName, viewCount, seoTitle, seoDescription, ...item }) => item);
  }

  findOne(slug: string) {
    return mockPosts.find((post) => post.slug === slug) ?? null;
  }

  create(payload: CreatePostDto) {
    return {
      id: crypto.randomUUID(),
      ...payload
    };
  }
}
