<template>
  <section>
    <section class="page-hero">
      <div class="page-hero-inner space-y-4">
        <p class="page-kicker !text-[0.95rem] !font-bold tracking-[0.08em]">关于我们</p>
        <h1 class="page-title !text-[clamp(2.4rem,5.2vw,4rem)] !leading-[0.94]">关于本站</h1>
        <p class="page-copy !max-w-[38ch] !text-[1.08rem] !font-semibold !leading-[1.68]">
          这是一个长期写作与工程实践并行的个人站点，核心目标是清晰表达、快速阅读与持续维护。
        </p>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap list-shell">
        <article class="list-row">
          <p class="list-date">01</p>
          <div class="list-body">
            <h2 class="list-title">统一视觉语言</h2>
            <p class="list-summary">前台页面使用一致的配色、字体层级与交互控件，减少跳转时的风格割裂感。</p>
          </div>
        </article>
        <article class="list-row">
          <p class="list-date">02</p>
          <div class="list-body">
            <h2 class="list-title">内容优先布局</h2>
            <p class="list-summary">把阅读与检索作为主要流程，优先展示标题、摘要与时间信息，便于快速判断内容价值。</p>
          </div>
        </article>
        <article class="list-row">
          <p class="list-date">03</p>
          <div class="list-body">
            <h2 class="list-title">可扩展结构</h2>
            <p class="list-summary">底层采用可复用的 Tailwind 组件层，后续扩展新页面时无需从头设计。</p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
