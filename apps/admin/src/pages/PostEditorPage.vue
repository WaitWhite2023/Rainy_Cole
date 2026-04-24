<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MdEditor } from 'md-editor-v3';
import type { CategoryDto, TagDto } from '@rainy/shared';
import {
  createCategory,
  createPost,
  createTag,
  deleteCategory,
  deleteTag,
  fetchAdminPost,
  fetchCategories,
  fetchTags,
  updatePost,
  uploadAsset
} from '../services/content';

const router = useRouter();
const route = useRoute();
const postId = route.params.id as string | undefined;
const isEdit = Boolean(postId);
const loading = ref(false);
const categories = ref<CategoryDto[]>([]);
const tags = ref<TagDto[]>([]);
const newCategory = reactive({ name: '', slug: '' });
const newTag = reactive({ name: '', slug: '' });

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  content: '',
  coverUrl: '',
  status: 'draft',
  sourceType: 'database',
  categoryIds: [] as string[],
  tagIds: [] as string[]
});

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function dedupeTaxonomy<T extends { name: string; slug: string }>(items: T[]) {
  const picked = new Map<string, T>();
  for (const item of items) {
    const key = `${normalizeText(item.name)}::${normalizeText(item.slug)}`;
    if (!picked.has(key)) {
      picked.set(key, item);
    }
  }
  return [...picked.values()];
}

async function bootstrap() {
  loading.value = true;
  try {
    const [categoryList, tagList] = await Promise.all([fetchCategories(), fetchTags()]);
    categories.value = dedupeTaxonomy(categoryList);
    tags.value = dedupeTaxonomy(tagList);

    if (isEdit && postId) {
      const post = await fetchAdminPost(postId);
      form.title = post.title;
      form.slug = post.slug;
      form.summary = post.summary;
      form.content = post.content;
      form.coverUrl = post.coverUrl || '';
      form.status = post.status;
      form.categoryIds = post.categoryIds;
      form.tagIds = post.tagIds;
    }
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  const payload = {
    ...form
  };

  if (isEdit && postId) {
    await updatePost(postId, payload);
    ElMessage.success('文章已更新');
  } else {
    await createPost(payload);
    ElMessage.success('文章已创建');
  }

  router.push('/posts');
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const result = await uploadAsset(file);
    if (result.url) {
      form.coverUrl = result.url;
      ElMessage.success('封面上传成功');
      return;
    }

    ElMessage.warning('上传完成，但未返回可用地址');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '封面上传失败');
  } finally {
    input.value = '';
  }
}

async function handleCreateCategory() {
  if (!newCategory.name || !newCategory.slug) return;
  const sameName = categories.value.some((item) => normalizeText(item.name) === normalizeText(newCategory.name));
  const sameSlug = categories.value.some((item) => normalizeText(item.slug) === normalizeText(newCategory.slug));
  if (sameName || sameSlug) {
    ElMessage.warning(sameName ? '分类名称已存在' : '分类 slug 已存在');
    return;
  }
  const created = await createCategory(newCategory);
  categories.value = dedupeTaxonomy([...categories.value, created]);
  form.categoryIds.push(created.id);
  newCategory.name = '';
  newCategory.slug = '';
  ElMessage.success('分类已创建');
}

async function handleDeleteCategory(id: string, name: string) {
  await ElMessageBox.confirm(`确定删除分类「${name}」吗？该分类会从已关联文章中移除。`, '删除分类', {
    type: 'warning'
  });
  await deleteCategory(id);
  categories.value = categories.value.filter((item) => item.id !== id);
  form.categoryIds = form.categoryIds.filter((categoryId) => categoryId !== id);
  ElMessage.success('分类已删除');
}

async function handleCreateTag() {
  if (!newTag.name || !newTag.slug) return;
  const sameName = tags.value.some((item) => normalizeText(item.name) === normalizeText(newTag.name));
  const sameSlug = tags.value.some((item) => normalizeText(item.slug) === normalizeText(newTag.slug));
  if (sameName || sameSlug) {
    ElMessage.warning(sameName ? '标签名称已存在' : '标签 slug 已存在');
    return;
  }
  const created = await createTag(newTag);
  tags.value = dedupeTaxonomy([...tags.value, created]);
  form.tagIds.push(created.id);
  newTag.name = '';
  newTag.slug = '';
  ElMessage.success('标签已创建');
}

async function handleDeleteTag(id: string, name: string) {
  await ElMessageBox.confirm(`确定删除标签「${name}」吗？该标签会从已关联文章中移除。`, '删除标签', {
    type: 'warning'
  });
  await deleteTag(id);
  tags.value = tags.value.filter((item) => item.id !== id);
  form.tagIds = form.tagIds.filter((tagId) => tagId !== id);
  ElMessage.success('标签已删除');
}

onMounted(() => {
  bootstrap();
});
</script>

<template>
  <section class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
        <p class="admin-page-copy">按“内容主区 + 发布侧栏”结构填写文章信息并完成发布配置。</p>
      </div>
      <div class="admin-head-actions">
        <div class="admin-chip">{{ isEdit ? 'Editing' : 'Creating' }}</div>
        <el-button @click="router.push('/posts')">返回列表</el-button>
      </div>
    </div>

    <el-form label-position="top" class="admin-post-editor" v-loading="loading">
      <div class="admin-post-settings-grid">
        <div class="admin-surface">
          <p class="admin-form-title">发布设置</p>
          <el-form-item label="状态">
            <el-select v-model="form.status" class="w-full">
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
              <el-option label="已归档" value="archived" />
            </el-select>
          </el-form-item>

          <el-form-item label="封面地址">
            <el-input v-model="form.coverUrl" placeholder="/uploads/xxx.png" />
          </el-form-item>

          <label class="block text-sm text-[#53607e]">上传封面</label>
          <input type="file" accept="image/*" @change="handleUpload" />
        </div>

        <div class="admin-surface">
          <p class="admin-form-title">分类管理</p>
          <el-form-item label="分类">
            <el-select v-model="form.categoryIds" multiple class="w-full">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div class="admin-inline-fields">
            <el-input v-model="newCategory.name" placeholder="分类名称" />
            <el-input v-model="newCategory.slug" placeholder="分类 slug" />
          </div>
          <el-button plain class="mt-3" @click="handleCreateCategory">新增分类</el-button>
          <div v-if="categories.length" class="admin-taxonomy-list">
            <div v-for="item in categories" :key="item.id" class="admin-taxonomy-item">
              <p class="admin-taxonomy-meta">
                <span>{{ item.name }}</span>
                <span>/{{ item.slug }}</span>
              </p>
              <button type="button" class="admin-action-link is-danger" @click="handleDeleteCategory(item.id, item.name)">删除</button>
            </div>
          </div>
        </div>

        <div class="admin-surface">
          <p class="admin-form-title">标签管理</p>
          <el-form-item label="标签">
            <el-select v-model="form.tagIds" multiple class="w-full">
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div class="admin-inline-fields">
            <el-input v-model="newTag.name" placeholder="标签名称" />
            <el-input v-model="newTag.slug" placeholder="标签 slug" />
          </div>
          <el-button plain class="mt-3" @click="handleCreateTag">新增标签</el-button>
          <div v-if="tags.length" class="admin-taxonomy-list">
            <div v-for="item in tags" :key="item.id" class="admin-taxonomy-item">
              <p class="admin-taxonomy-meta">
                <span>{{ item.name }}</span>
                <span>/{{ item.slug }}</span>
              </p>
              <button type="button" class="admin-action-link is-danger" @click="handleDeleteTag(item.id, item.name)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-surface">
        <p class="admin-form-title">文章内容</p>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="form.slug" placeholder="例如：hello-rainy-cole" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="正文（Markdown）">
          <MdEditor
            v-model="form.content"
            class="admin-md-editor"
            :preview="true"
            :toolbars-exclude="['github']"
          />
        </el-form-item>
      </div>

      <div class="admin-stack">
        <div class="admin-surface">
          <p class="admin-form-title">编辑建议</p>
          <div class="admin-rows">
            <div class="admin-row">
              <span class="admin-row-index">01</span>
              <p>标题和摘要先决定这篇文章的阅读入口，正文在其后展开。</p>
            </div>
            <div class="admin-row">
              <span class="admin-row-index">02</span>
              <p>分类用于归档，标签用于横向连接，不建议两者承担同一种职责。</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <el-button @click="router.push('/posts')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存文章</el-button>
        </div>
      </div>
    </el-form>
  </section>
</template>
