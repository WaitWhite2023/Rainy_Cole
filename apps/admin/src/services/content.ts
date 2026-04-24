import type { CategoryDto, PostListItemDto, SiteSettings, TagDto } from '@rainy/shared';
import { apiDelete, apiGet, apiPatch, apiPost } from './api';
import type { EditablePost } from '../types';

export function fetchAdminPosts() {
  return apiGet<PostListItemDto[]>('/admin/posts', true);
}

export function fetchAdminPost(id: string) {
  return apiGet<EditablePost>(`/admin/posts/${id}`, true);
}

export function createPost(payload: Record<string, unknown>) {
  return apiPost<PostListItemDto>('/admin/posts', payload, true);
}

export function updatePost(id: string, payload: Record<string, unknown>) {
  return apiPatch<PostListItemDto>(`/admin/posts/${id}`, payload, true);
}

export function deletePost(id: string) {
  return apiDelete<{ success: boolean }>(`/admin/posts/${id}`, true);
}

export function fetchCategories() {
  return apiGet<CategoryDto[]>('/categories');
}

export function createCategory(payload: Record<string, unknown>) {
  return apiPost<CategoryDto>('/admin/categories', payload, true);
}

export function deleteCategory(id: string) {
  return apiDelete<{ success: boolean }>(`/admin/categories/${id}`, true);
}

export function fetchTags() {
  return apiGet<TagDto[]>('/tags');
}

export function createTag(payload: Record<string, unknown>) {
  return apiPost<TagDto>('/admin/tags', payload, true);
}

export function deleteTag(id: string) {
  return apiDelete<{ success: boolean }>(`/admin/tags/${id}`, true);
}

export function fetchSiteSettings() {
  return apiGet<SiteSettings>('/site-settings');
}

export function updateSiteSettings(payload: Record<string, unknown>) {
  return apiPatch<SiteSettings>('/site-settings/admin', payload, true);
}

export function uploadAsset(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return apiPost<{
    url: string | null;
    fileName?: string;
    originalName?: string;
  }>('/admin/upload', formData, true);
}
