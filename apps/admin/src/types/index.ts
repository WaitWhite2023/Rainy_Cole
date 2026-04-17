import type { PostDetailDto, SiteSettings as SharedSiteSettings } from '@rainy/shared';

export type EditablePost = PostDetailDto & {
  tagIds: string[];
  categoryIds: string[];
};

export type AdminSiteSettings = SharedSiteSettings & {
  id?: string;
};
