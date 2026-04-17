<template>
  <article class="space-y-8">
    <header class="section-card overflow-hidden">
      <p class="eyebrow">Essay · April 2026</p>
      <h1 class="mt-5 max-w-4xl font-display text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">
        文章详情页需要一种更沉静的阅读氛围，而不是普通资讯站的标准模板。
      </h1>
      <p class="mt-6 max-w-2xl text-sm leading-8 text-white/62">
        这里后续会接真实 Markdown 渲染、目录、上一篇/下一篇与 SEO 元信息。当前先把阅读型页面的视觉基调定下来。
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-[0.28fr_1fr]">
      <aside class="section-card space-y-4 self-start lg:sticky lg:top-28">
        <p class="eyebrow">Metadata</p>
        <div class="space-y-3 text-sm text-white/58">
          <p>Published: 2026.04.17</p>
          <p>Category: Engineering Systems</p>
          <p>Tags: Monorepo, Vue, NestJS</p>
        </div>
      </aside>

      <section class="section-card reading-surface">
        <p>
          一篇真正适合阅读的文章页，不应该把注意力浪费在多余的栏位、过度饱和的颜色和过密的边界上。它需要的是节奏、呼吸感和对正文的尊重。
        </p>
        <p>
          所以这版设计刻意把背景压暗、把装饰收进边缘，再通过宽行距、较低对比度的辅助文字和更有性格的标题字体，建立一种接近深夜书桌的阅读感受。
        </p>
        <p>
          当后续接入真实内容时，这一页会继续扩展目录、高亮代码块和相关文章推荐，但整体语气会保持克制，不会因为功能变多就失去现在这份优雅。
        </p>
      </section>
    </div>
  </article>
</template>
