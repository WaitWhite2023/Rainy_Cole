import type { PostSourceType, PostStatus, UserRole } from '../enums';

export interface LoginDto {
  username: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthUserDto {
  id: string;
  username: string;
  nickname: string;
  role: UserRole;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export interface PostListItemDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverUrl?: string;
  tags: string[];
  categories: string[];
  status: PostStatus;
  sourceType: PostSourceType;
  publishedAt?: string;
}

export interface PostDetailDto extends PostListItemDto {
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  authorName: string;
  viewCount: number;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl?: string;
  status: PostStatus;
  sourceType: PostSourceType;
  tagIds: string[];
  categoryIds: string[];
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
}

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface CreateTaxonomyDto {
  name: string;
  slug: string;
}

export interface UpdateTaxonomyDto extends Partial<CreateTaxonomyDto> {}

export interface UserSummaryDto {
  id: string;
  username: string;
  nickname: string;
  role: UserRole;
  status: 'active' | 'disabled';
}
