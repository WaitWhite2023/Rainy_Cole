import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  POST_STATUSES,
  POST_SOURCE_TYPES,
  type PostSourceType,
  type PostStatus,
  type UserRole,
} from '../enums';

// ── Auth ──

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthUserDto {
  id: string;
  username: string;
  nickname: string;
  role: UserRole;
}

export class AuthTokensDto {
  accessToken: string;
  refreshToken: string;

  @ValidateNested()
  @Type(() => AuthUserDto)
  user: AuthUserDto;
}

// ── Posts ──

export class PostListItemDto {
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

export class PostDetailDto extends PostListItemDto {
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  authorName: string;
  viewCount: number;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsIn(POST_STATUSES)
  status: PostStatus;

  @IsIn(POST_SOURCE_TYPES)
  sourceType: PostSourceType;

  @IsArray()
  @IsString({ each: true })
  tagIds: string[];

  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsIn(POST_STATUSES)
  status?: PostStatus;

  @IsOptional()
  @IsIn(POST_SOURCE_TYPES)
  sourceType?: PostSourceType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}

// ── Taxonomy ──

export class CategoryDto {
  id: string;
  name: string;
  slug: string;
}

export class TagDto {
  id: string;
  name: string;
  slug: string;
}

export class CreateTaxonomyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class UpdateTaxonomyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}

// ── Users ──

export class UserSummaryDto {
  id: string;
  username: string;
  nickname: string;
  role: UserRole;
  status: 'active' | 'disabled';
}
