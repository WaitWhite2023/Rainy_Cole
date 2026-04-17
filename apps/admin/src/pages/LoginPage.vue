<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const form = reactive({
  username: 'admin',
  password: '123456'
});

async function handleLogin() {
  loading.value = true;
  try {
    await authStore.login(form.username, form.password);
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#07090d] px-6 py-8 text-white">
    <div class="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(185,160,122,0.38),transparent_65%)] blur-3xl"></div>
    <div class="pointer-events-none absolute right-[-5rem] top-[-2rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(85,111,159,0.28),transparent_68%)] blur-3xl"></div>
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25"></div>

    <div class="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="flex items-center">
        <div class="max-w-2xl">
          <p class="text-xs uppercase tracking-[0.4em] text-white/35">Rainy Cole Admin</p>
          <h1 class="mt-6 font-['Bodoni_Moda'] text-5xl leading-[0.94] text-white sm:text-6xl lg:text-7xl">
            用更安静、
            <span class="block text-white/58">更长期的方式管理内容。</span>
          </h1>
          <p class="mt-8 max-w-xl text-base leading-8 text-white/62">
            后台不应该只是“功能凑齐”的工具页，它也应该有节奏、有边界、有秩序感。这里承接文章、设置、资源和长期写作系统的管理入口。
          </p>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p class="font-['Bodoni_Moda'] text-3xl text-[#d3b991]">01</p>
              <p class="mt-3 text-sm text-white/72">Calm</p>
              <p class="mt-2 text-xs leading-6 text-white/42">用克制的层次组织复杂功能。</p>
            </div>
            <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p class="font-['Bodoni_Moda'] text-3xl text-[#d3b991]">02</p>
              <p class="mt-3 text-sm text-white/72">Precise</p>
              <p class="mt-2 text-xs leading-6 text-white/42">保持内容、接口和权限边界清晰。</p>
            </div>
            <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p class="font-['Bodoni_Moda'] text-3xl text-[#d3b991]">03</p>
              <p class="mt-3 text-sm text-white/72">Elegant</p>
              <p class="mt-2 text-xs leading-6 text-white/42">让管理工具也具备审美一致性。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="flex items-center justify-center lg:justify-end">
        <div class="w-full max-w-md rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.045))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.35em] text-white/34">Sign in</p>
              <h2 class="mt-3 font-['Bodoni_Moda'] text-4xl text-white">登录后台</h2>
            </div>
            <div class="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.25em] text-white/58">
              RC
            </div>
          </div>

          <p class="mt-5 text-sm leading-7 text-white/54">
            默认种子账号：`admin / 123456`、`editor / 123456`。如果你已经跑过数据库种子数据，这里可以直接登录联调。
          </p>

          <el-form label-position="top" class="mt-8 space-y-4" @submit.prevent="handleLogin">
            <el-form-item label="用户名">
              <el-input v-model="form.username" size="large" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" size="large" type="password" show-password placeholder="请输入密码" />
            </el-form-item>
            <el-button class="mt-4 w-full" size="large" type="primary" :loading="loading" @click="handleLogin">
              进入后台
            </el-button>
          </el-form>

          <div class="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs uppercase tracking-[0.24em] text-white/32">
            <span>Monorepo</span>
            <span>NestJS · Vue 3</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
