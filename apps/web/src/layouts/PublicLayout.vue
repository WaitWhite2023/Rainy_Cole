<template>
  <div class="site-shell">
    <header class="site-topbar sticky top-0 z-30">
      <div class="content-wrap flex flex-wrap items-center justify-between gap-4 py-5">
        <RouterLink to="/" class="brand">Rainy</RouterLink>
        <nav class="site-nav">
          <RouterLink to="/" class="nav-link">首页</RouterLink>
          <RouterLink to="/posts" class="nav-link">文章</RouterLink>
          <RouterLink to="/search" class="nav-link">搜索</RouterLink>
          <RouterLink to="/about" class="nav-link">关于</RouterLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <RouterView v-slot="{ Component }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="site-footer">
      <div class="content-wrap flex flex-wrap items-end justify-end gap-5">
        <p class="eyebrow">Built with Vue · NestJS · Prisma</p>
      </div>
    </footer>
  </div>
</template>
