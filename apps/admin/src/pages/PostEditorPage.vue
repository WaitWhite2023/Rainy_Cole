<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { CategoryDto, TagDto } from '@rainy/shared';
import { createCategory, createPost, createTag, fetchAdminPost, fetchCategories, fetchTags, updatePost, uploadAsset } from '../services/content';

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

async function bootstrap() {
  loading.value = true;
  try {
    const [categoryList, tagList] = await Promise.all([fetchCategories(), fetchTags()]);
    categories.value = categoryList;
    tags.value = tagList;

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

  const result = await uploadAsset(file);
  if (result.url) {
    form.coverUrl = result.url;
    ElMessage.success('封面上传成功');
  }
}

async function handleCreateCategory() {
  if (!newCategory.name || !newCategory.slug) return;
  const created = await createCategory(newCategory);
  categories.value.push(created);
  form.categoryIds.push(created.id);
  newCategory.name = '';
  newCategory.slug = '';
  ElMessage.success('分类已创建');
}

async function handleCreateTag() {
  if (!newTag.name || !newTag.slug) return;
  const created = await createTag(newTag);
  tags.value.push(created);
  form.tagIds.push(created.id);
  newTag.name = '';
  newTag.slug = '';
  ElMessage.success('标签已创建');
}

onMounted(() => {
  bootstrap();
});
</script>

<template>
  <section class="space-y-8">
    <div class="admin-hero flex flex-col gap-5 rounded-[2rem] border border-white/8 px-7 py-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="admin-eyebrow">Editor</p>
        <h1 class="mt-4 font-['Bodoni_Moda'] text-5xl leading-[0.96] text-white">{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
        <p class="mt-4 max-w-2xl text-sm leading-8 text-white/58">支持草稿、发布、封面上传与标签分类绑定。视觉上保持更沉静、清楚的编辑氛围。</p>
      </div>
      <el-button size="large" @click="router.push('/posts')">返回列表</el-button>
    </div>

    <el-form label-position="top" class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div v-loading="loading" class="admin-panel rounded-[1.8rem] p-6">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="form.slug" placeholder="例如：hello-rainy-cole" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="form.content" type="textarea" :rows="16" placeholder="首版先用 textarea，后续再接 Markdown 编辑器" />
        </el-form-item>
      </div>

      <div class="space-y-6">
        <div class="admin-panel rounded-[1.8rem] p-6">
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

          <label class="block text-sm text-stone-600">上传封面</label>
          <input type="file" accept="image/*" @change="handleUpload" />
        </div>

        <div class="admin-panel rounded-[1.8rem] p-6">
          <el-form-item label="分类">
            <el-select v-model="form.categoryIds" multiple class="w-full">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div class="grid gap-2 md:grid-cols-2">
            <el-input v-model="newCategory.name" placeholder="分类名称" />
            <el-input v-model="newCategory.slug" placeholder="分类 slug" />
          </div>
          <el-button plain @click="handleCreateCategory">新增分类</el-button>
        </div>

        <div class="admin-panel rounded-[1.8rem] p-6">
          <el-form-item label="标签">
            <el-select v-model="form.tagIds" multiple class="w-full">
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div class="grid gap-2 md:grid-cols-2">
            <el-input v-model="newTag.name" placeholder="标签名称" />
            <el-input v-model="newTag.slug" placeholder="标签 slug" />
          </div>
          <el-button plain @click="handleCreateTag">新增标签</el-button>
        </div>

        <div class="flex justify-end gap-3">
          <el-button @click="router.push('/posts')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存文章</el-button>
        </div>
      </div>
    </el-form>
  </section>
</template>
