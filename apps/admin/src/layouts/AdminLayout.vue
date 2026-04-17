<template>
  <div class="min-h-screen bg-stone-100 text-stone-900">
    <aside class="fixed inset-y-0 left-0 w-64 border-r border-stone-200 bg-stone-950 p-6 text-stone-50">
      <p class="text-xs uppercase tracking-[0.4em] text-stone-400">Admin</p>
      <p class="mt-3 text-2xl font-semibold">Rainy Cole</p>
      <nav class="mt-8 flex flex-col gap-3 text-sm">
        <RouterLink to="/admin/">仪表盘</RouterLink>
        <RouterLink to="/admin/posts">文章管理</RouterLink>
        <RouterLink to="/admin/settings">站点设置</RouterLink>
      </nav>
    </aside>
    <main class="ml-64 p-8">
      <RouterView />
    </main>
  </div>
</template>
