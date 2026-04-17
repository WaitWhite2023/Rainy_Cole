<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="admin-shell min-h-screen text-white">
    <div class="admin-orb admin-orb-left"></div>
    <div class="admin-orb admin-orb-right"></div>

    <aside class="fixed inset-y-0 left-0 z-20 w-72 border-r border-white/8 bg-[rgba(8,10,15,0.82)] p-6 backdrop-blur-2xl">
      <div class="rounded-[1.6rem] border border-white/8 bg-white/[0.035] p-5">
        <p class="text-[11px] uppercase tracking-[0.38em] text-white/34">Admin</p>
        <p class="mt-3 font-['Bodoni_Moda'] text-3xl text-white">Rainy Cole</p>
        <p class="mt-4 text-sm text-white/48">{{ user?.nickname }} · {{ user?.role }}</p>
      </div>

      <nav class="mt-8 space-y-2 text-sm">
        <RouterLink to="/" class="admin-nav-link">仪表盘</RouterLink>
        <RouterLink to="/posts" class="admin-nav-link">文章管理</RouterLink>
        <RouterLink to="/posts/new" class="admin-nav-link">新建文章</RouterLink>
        <RouterLink to="/settings" class="admin-nav-link">站点设置</RouterLink>
      </nav>

      <div class="mt-10 rounded-[1.4rem] border border-white/8 bg-white/[0.035] p-5">
        <p class="text-[11px] uppercase tracking-[0.32em] text-white/32">System</p>
        <p class="mt-4 text-sm leading-7 text-white/54">
          后台不只是内容入口，也是一套长期维护的工作面板。这里的界面语言应该和站点一样安静、清晰、有秩序。
        </p>
        <el-button class="mt-5 w-full" plain @click="handleLogout">退出登录</el-button>
      </div>
    </aside>

    <main class="ml-72 min-h-screen px-8 py-8">
      <div class="mx-auto max-w-6xl">
        <div class="admin-topbar mb-6 flex items-center justify-between rounded-[1.6rem] border border-white/8 px-5 py-4">
          <div>
            <p class="text-[11px] uppercase tracking-[0.32em] text-white/34">Content OS</p>
            <p class="mt-2 text-sm text-white/58">一个更安静、可长期维护的内容后台。</p>
          </div>
          <div class="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/40">
            Vue 3 · NestJS
          </div>
        </div>

        <RouterView />
      </div>
    </main>
  </div>
</template>
