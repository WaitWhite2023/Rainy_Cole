<template>
  <div class="min-h-screen bg-stone-50 text-stone-900">
    <header class="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-2xl font-semibold">Rainy Cole</p>
          <p class="text-sm text-stone-500">记录代码、生活与长期主义</p>
        </div>
        <nav class="flex gap-6 text-sm text-stone-600">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/posts">文章</RouterLink>
          <RouterLink to="/search">搜索</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>
