<template>
  <section class="space-y-8">
    <header class="section-card grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
      <div>
        <p class="eyebrow">Archive</p>
        <h1 class="font-display text-4xl leading-tight text-white sm:text-5xl">文章列表</h1>
      </div>
      <p class="max-w-xl text-sm leading-7 text-white/60">
        这里会承接分页、分类和标签筛选。当前先用设计化的归档布局，把未来内容系统的承载空间留出来。
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-[0.36fr_1fr]">
      <aside class="section-card space-y-5">
        <div>
          <p class="eyebrow">Filters</p>
          <h2 class="section-title">筛选维度</h2>
        </div>
        <div class="space-y-3">
          <div class="filter-chip">全部文章</div>
          <div class="filter-chip">工程系统</div>
          <div class="filter-chip">设计语言</div>
          <div class="filter-chip">写作方法</div>
        </div>
      </aside>

      <section class="space-y-4">
        <article class="section-card article-preview">
          <p class="story-meta">APR 17 · SYSTEMS</p>
          <h2 class="story-title text-3xl">从零开始搭一个可长期维护的个人博客系统</h2>
          <p class="story-summary">
            目录结构、共享类型、数据库、容器化和前端设计并不是几个独立话题，它们共同决定了项目能否安稳成长。
          </p>
        </article>
        <article class="section-card article-preview">
          <p class="story-meta">APR 14 · DESIGN</p>
          <h2 class="story-title text-3xl">让页面看起来更贵，不是靠装饰，而是靠秩序</h2>
          <p class="story-summary">
            通过留白、层次、对比和节奏构建一种更成熟的阅读气质，而不是依赖密集的视觉噪声。
          </p>
        </article>
        <article class="section-card article-preview">
          <p class="story-meta">APR 08 · NOTES</p>
          <h2 class="story-title text-3xl">写给前端：理解后端和部署之后，你的界面会更稳定</h2>
          <p class="story-summary">
            真正成熟的前端设计，不只考虑像素和组件，也会考虑接口形状、环境差异和可维护性。
          </p>
        </article>
      </section>
    </div>
  </section>
</template>
