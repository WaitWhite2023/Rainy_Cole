<template>
  <section class="space-y-8">
    <header class="section-card">
      <p class="eyebrow">Search</p>
      <h1 class="font-display text-4xl text-white sm:text-5xl">搜索文章</h1>
      <p class="mt-4 max-w-2xl text-sm leading-7 text-white/60">
        这里后续会接入 Meilisearch。当前先把搜索的视觉节奏搭好，让它保持和首页一致的深色、清洁、优雅气质。
      </p>
      <div class="mt-6 max-w-2xl">
        <input class="search-input" placeholder="搜索关键词，例如：monorepo、设计系统、长期写作" />
      </div>
    </header>

    <section class="grid gap-4">
      <article class="section-card article-preview">
        <p class="story-meta">Result 01</p>
        <h2 class="story-title text-2xl">如何把规范变成真正可维护的工作方式</h2>
        <p class="story-summary">当团队开始共享类型、共享约定和共享部署流程时，很多低级返工会自然消失。</p>
      </article>
      <article class="section-card article-preview">
        <p class="story-meta">Result 02</p>
        <h2 class="story-title text-2xl">为什么好的博客应该像一座缓慢生长的档案馆</h2>
        <p class="story-summary">搜索不是为了信息爆炸，而是为了让你能重新找到那些曾经写下但仍然有价值的内容。</p>
      </article>
    </section>
  </section>
</template>
