<template>
  <section class="space-y-8">
    <header class="section-card">
      <p class="eyebrow">About</p>
      <h1 class="font-display text-4xl text-white sm:text-5xl">关于这个博客</h1>
      <p class="mt-5 max-w-3xl text-sm leading-8 text-white/62">
        这是一个把个人写作、系统设计和审美表达放在一起思考的空间。它不追求高频更新，而是希望每一次更新都足够清晰、足够耐看，也足够值得以后再翻回来。
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="section-card">
        <p class="eyebrow">Intent</p>
        <h2 class="section-title">我想把它做成一个长期工程。</h2>
        <p class="mt-4 text-sm leading-8 text-white/62">
          内容上，它是一份个人档案；工程上，它是一套从前台到后台、从数据到部署都能持续演进的系统。两者叠在一起，才是这个博客最有意思的地方。
        </p>
      </article>

      <article class="section-card grid gap-4 sm:grid-cols-2">
        <div class="tag-card">
          <p class="tag-card-title">写作</p>
          <p class="tag-card-copy">记录系统、设计、长期主义与软件工程实践。</p>
        </div>
        <div class="tag-card">
          <p class="tag-card-title">工程</p>
          <p class="tag-card-copy">验证前后端分离、共享类型和部署约定的长期价值。</p>
        </div>
        <div class="tag-card">
          <p class="tag-card-title">审美</p>
          <p class="tag-card-copy">希望页面克制、优雅、耐看，不被模板感主导。</p>
        </div>
        <div class="tag-card">
          <p class="tag-card-title">维护</p>
          <p class="tag-card-copy">让内容与代码都适合被长时间使用与迭代。</p>
        </div>
      </article>
    </div>
  </section>
</template>
