<template>
  <div class="site-shell min-h-screen">
    <div class="ambient-orb ambient-orb-left"></div>
    <div class="ambient-orb ambient-orb-right"></div>

    <header class="sticky top-0 z-30 border-b border-white/10 bg-[rgba(7,10,16,0.72)] backdrop-blur-2xl">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <RouterLink to="/" class="flex items-center gap-4">
          <div class="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-white/65">
            RC
          </div>
          <div>
            <p class="font-display text-2xl tracking-[0.08em] text-white">Rainy Cole</p>
            <p class="text-xs uppercase tracking-[0.38em] text-white/45">Quiet systems for long-form thinking</p>
          </div>
        </RouterLink>

        <nav class="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <RouterLink to="/" class="nav-link">首页</RouterLink>
          <RouterLink to="/posts" class="nav-link">文章</RouterLink>
          <RouterLink to="/search" class="nav-link">搜索</RouterLink>
          <RouterLink to="/about" class="nav-link">关于</RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 pb-16 pt-8 lg:pt-12">
      <RouterView />
    </main>

    <footer class="mx-auto flex max-w-6xl flex-col gap-6 border-t border-white/10 px-6 py-10 text-sm text-white/50 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-xl">
        <p class="font-display text-2xl tracking-[0.08em] text-white">Rainy Cole</p>
        <p class="mt-3 leading-7">
          一个偏安静、偏长期主义的个人博客实验。记录系统、写作、审美与软件工程的慢变量。
        </p>
      </div>
      <div class="space-y-2 text-right">
        <p class="uppercase tracking-[0.3em] text-white/35">Sections</p>
        <p>Writing · Systems · Notes · Essays</p>
      </div>
    </footer>
  </div>
</template>
