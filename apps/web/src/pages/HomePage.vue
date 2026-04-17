<template>
  <section class="space-y-10">
    <section class="hero-panel overflow-hidden rounded-[2rem] border border-white/10 px-7 py-10 lg:px-10 lg:py-14">
      <div class="grid gap-10 lg:grid-cols-[1.45fr_0.7fr] lg:items-end">
        <div class="space-y-6">
          <p class="eyebrow">Editorial blog · personal archive · crafted with intention</p>
          <h1 class="font-display text-5xl leading-[0.92] tracking-[0.02em] text-white sm:text-6xl lg:text-8xl">
            为长期写作保留一块
            <span class="block text-white/55">安静但有力度的空间。</span>
          </h1>
          <p class="max-w-2xl text-base leading-8 text-white/68 lg:text-lg">
            这里不是资讯流，也不是高频更新的内容工厂。它更像一座缓慢生长的数字书房，用来记录系统、工具、设计审美，以及那些值得反复琢磨的想法。
          </p>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/posts" class="cta-primary">进入文章库</RouterLink>
            <RouterLink to="/about" class="cta-secondary">了解这个项目</RouterLink>
          </div>
        </div>

        <div class="space-y-4">
          <div class="glass-card p-5">
            <p class="eyebrow">Current direction</p>
            <p class="mt-4 text-3xl font-medium text-white">Writing systems with calm contrast.</p>
            <p class="mt-4 text-sm leading-7 text-white/55">
              深色场域、大留白、细密的秩序感，是这版博客想保留的核心语气。
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="glass-card p-5">
              <p class="metric-value">12</p>
              <p class="metric-label">planned essays</p>
            </div>
            <div class="glass-card p-5">
              <p class="metric-value">03</p>
              <p class="metric-label">active themes</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="section-card space-y-6">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="eyebrow">Latest writing</p>
            <h2 class="section-title">最新文章</h2>
          </div>
          <RouterLink to="/posts" class="section-link">查看全部</RouterLink>
        </div>

        <div class="space-y-4">
          <article class="story-row">
            <div>
              <p class="story-meta">SYSTEMS · APR 17</p>
              <h3 class="story-title">从前端到全栈，如何建立一套可维护的个人系统</h3>
            </div>
            <p class="story-summary">从目录结构、共享类型、部署约定，到为什么规范比灵感更重要。</p>
          </article>

          <article class="story-row">
            <div>
              <p class="story-meta">DESIGN · APR 14</p>
              <h3 class="story-title">为什么优雅的界面，往往来自节制而不是堆叠</h3>
            </div>
            <p class="story-summary">写给喜欢极简，但不想把页面做得“空而无物”的设计实践笔记。</p>
          </article>

          <article class="story-row">
            <div>
              <p class="story-meta">NOTES · APR 08</p>
              <h3 class="story-title">搭建博客时，那些最容易被忽略的基础设施决定</h3>
            </div>
            <p class="story-summary">环境变量、代理、容器、索引与上传，看似不显眼，却决定后续开发效率。</p>
          </article>
        </div>
      </article>

      <article class="section-card space-y-6">
        <div>
          <p class="eyebrow">Focus map</p>
          <h2 class="section-title">主题索引</h2>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="tag-card">
            <p class="tag-card-title">工程系统</p>
            <p class="tag-card-copy">Monorepo、接口边界、部署规范与长期维护。</p>
          </div>
          <div class="tag-card">
            <p class="tag-card-title">设计语言</p>
            <p class="tag-card-copy">前端美学、排版、节奏与页面结构的克制表达。</p>
          </div>
          <div class="tag-card">
            <p class="tag-card-title">工具工作流</p>
            <p class="tag-card-copy">AI 协作、开发脚手架、内容系统与效率方法。</p>
          </div>
          <div class="tag-card">
            <p class="tag-card-title">长期写作</p>
            <p class="tag-card-copy">把博客当作知识资产，而不是瞬时分发工具。</p>
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <article class="section-card space-y-4">
        <p class="eyebrow">Operating principle</p>
        <h2 class="section-title">这不是信息流，而是个人档案。</h2>
        <p class="text-sm leading-7 text-white/62">
          每一篇文章都应该能在几个月后重新阅读，仍然成立。所以内容更偏结构化、可复用、可回看，而不是追求一次性的“热点时效”。
        </p>
      </article>

      <article class="section-card grid gap-4 sm:grid-cols-3">
        <div class="mini-panel">
          <p class="mini-panel-value">01</p>
          <p class="mini-panel-title">清晰结构</p>
          <p class="mini-panel-copy">内容和工程一样，需要有边界和目录感。</p>
        </div>
        <div class="mini-panel">
          <p class="mini-panel-value">02</p>
          <p class="mini-panel-title">优雅表达</p>
          <p class="mini-panel-copy">简洁不是空白，而是把重要内容推到前面。</p>
        </div>
        <div class="mini-panel">
          <p class="mini-panel-value">03</p>
          <p class="mini-panel-title">长期维护</p>
          <p class="mini-panel-copy">页面、内容和系统都应适合长期迭代。</p>
        </div>
      </article>
    </section>
  </section>
</template>
