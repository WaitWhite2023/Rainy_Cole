<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiGet } from '../services/api';
import { fetchAdminPosts, fetchCategories, fetchTags } from '../services/content';

const cards = ref([
  { label: '文章总数', value: 0 },
  { label: '分类数量', value: 0 },
  { label: '标签数量', value: 0 },
  { label: '后台用户', value: 0 }
]);

onMounted(async () => {
  const [posts, categories, tags, users] = await Promise.all([
    fetchAdminPosts(),
    fetchCategories(),
    fetchTags(),
    apiGet<Array<unknown>>('/admin/users', true)
  ]);

  cards.value = [
    { label: '文章总数', value: posts.length },
    { label: '分类数量', value: categories.length },
    { label: '标签数量', value: tags.length },
    { label: '后台用户', value: users.length }
  ];
});
</script>

<template>
  <section class="space-y-8">
    <div class="admin-hero grid gap-6 rounded-[2rem] border border-white/8 px-7 py-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p class="admin-eyebrow">Dashboard</p>
        <h1 class="mt-4 font-['Bodoni_Moda'] text-5xl leading-[0.96] text-white">后台总览</h1>
        <p class="mt-5 max-w-2xl text-sm leading-8 text-white/58">
          这里作为内容系统的总入口，不只展示数字，更需要让你快速感受到当前系统状态、内容规模和工作流节奏。
        </p>
      </div>
      <div class="admin-panel flex flex-col justify-between rounded-[1.6rem] p-5">
        <p class="admin-eyebrow">Current status</p>
        <div>
          <p class="font-['Bodoni_Moda'] text-4xl text-white">Writing system is active.</p>
          <p class="mt-3 text-sm leading-7 text-white/52">
            登录、文章管理、站点设置、上传链路都已经进入可联调状态，下一步继续完善搜索和内容同步。
          </p>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in cards" :key="card.label" class="admin-metric-card">
        <p class="admin-eyebrow">{{ card.label }}</p>
        <p class="mt-5 font-['Bodoni_Moda'] text-5xl text-white">{{ card.value }}</p>
      </article>
    </div>

    <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article class="admin-panel rounded-[1.8rem] p-6">
        <p class="admin-eyebrow">Focus</p>
        <h2 class="mt-4 font-['Bodoni_Moda'] text-3xl text-white">今天的重点不是做更多，而是让系统更稳。</h2>
        <p class="mt-4 text-sm leading-8 text-white/58">
          保持清晰的边界、统一的类型、稳定的接口和一致的设计语言，会让后面的每一天都更轻松。
        </p>
      </article>

      <article class="admin-panel rounded-[1.8rem] p-6">
        <p class="admin-eyebrow">Checklist</p>
        <div class="mt-5 space-y-4">
          <div class="admin-check-row">
            <span>01</span>
            <p>确认数据库与种子数据已跑通</p>
          </div>
          <div class="admin-check-row">
            <span>02</span>
            <p>确认后台登录、文章列表与编辑流可以联调</p>
          </div>
          <div class="admin-check-row">
            <span>03</span>
            <p>开始接搜索与 Markdown 同步链路</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
