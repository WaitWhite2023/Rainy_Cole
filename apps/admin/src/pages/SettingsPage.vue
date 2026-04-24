<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchSiteSettings, updateSiteSettings } from '../services/content';

const loading = ref(false);
const form = reactive({
  siteName: '',
  subtitle: '',
  aboutContent: '',
  seoDefaultTitle: '',
  seoDefaultDescription: '',
  socialLinks: [] as Array<{ name: string; url: string }>
});

async function bootstrap() {
  loading.value = true;
  try {
    const settings = await fetchSiteSettings();
    form.siteName = settings.siteName;
    form.subtitle = settings.subtitle;
    form.aboutContent = settings.aboutContent;
    form.seoDefaultTitle = settings.seoDefaultTitle;
    form.seoDefaultDescription = settings.seoDefaultDescription;
    form.socialLinks = Array.isArray(settings.socialLinks) ? [...settings.socialLinks] : [];
  } finally {
    loading.value = false;
  }
}

function addSocialLink() {
  form.socialLinks.push({ name: '', url: '' });
}

function removeSocialLink(index: number) {
  form.socialLinks.splice(index, 1);
}

async function handleSave() {
  await updateSiteSettings(form);
  ElMessage.success('站点设置已保存');
}

onMounted(() => {
  bootstrap();
});
</script>

<template>
  <section class="admin-page">
    <div class="admin-page-head admin-page-head-split">
      <div>
        <h1 class="admin-page-title">站点设置</h1>
        <p class="admin-page-copy admin-page-copy-tight">集中维护站点名称、副标题、关于页内容和默认 SEO 信息。</p>
      </div>
    </div>

    <div v-loading="loading" class="admin-surface">
      <el-form label-position="top" class="grid gap-4">
        <el-form-item label="站点名称">
          <el-input v-model="form.siteName" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" />
        </el-form-item>
        <el-form-item label="关于页内容">
          <el-input v-model="form.aboutContent" type="textarea" :rows="8" />
        </el-form-item>
        <el-form-item label="默认 SEO 标题">
          <el-input v-model="form.seoDefaultTitle" />
        </el-form-item>
        <el-form-item label="默认 SEO 描述">
          <el-input v-model="form.seoDefaultDescription" type="textarea" :rows="3" />
        </el-form-item>

        <div class="space-y-3">
          <div class="admin-toolbar">
            <p class="admin-form-title !mb-0">社交链接</p>
            <el-button plain size="small" @click="addSocialLink">新增链接</el-button>
          </div>
          <div v-if="!form.socialLinks.length" class="admin-empty">暂无社交链接，点击“新增链接”添加。</div>
          <div
            v-for="(item, index) in form.socialLinks"
            :key="`social-${index}`"
            class="admin-inline-row"
          >
            <el-input v-model="item.name" placeholder="名称，例如 GitHub" />
            <el-input v-model="item.url" placeholder="链接，例如 https://github.com/xxx" />
            <el-button type="danger" plain @click="removeSocialLink(index)">删除</el-button>
          </div>
        </div>

        <div class="flex justify-end">
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>
