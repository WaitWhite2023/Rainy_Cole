<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { SiteSettings } from '@rainy/shared';
import { fetchSiteSettings } from '../services/content';
import { setSeo } from '../utils/seo';

type TestimonialItem = {
  quote: string;
  author: string;
};

const loading = ref(false);
const errorMessage = ref('');
const settings = ref<SiteSettings | null>(null);
const activeIndex = ref(0);

const testimonials = computed<TestimonialItem[]>(() => {
  const siteName = settings.value?.siteName || 'Rainy Cole';
  const aboutContent = settings.value?.aboutContent || '我们坚持内容优先、表达清晰、长期维护。';
  const lines = aboutContent.split(/\n+/).map((item) => item.trim()).filter(Boolean);

  const items = lines.map((line) => ({
    quote: line,
    author: siteName
  }));

  if (!items.length) {
    return [
      {
        quote: '我们坚持内容优先、表达清晰、长期维护。',
        author: siteName
      }
    ];
  }

  return items;
});

const activeTestimonial = computed(() => testimonials.value[activeIndex.value] || testimonials.value[0]);
const socialLinks = computed(() => settings.value?.socialLinks || []);

function prevTestimonial() {
  const total = testimonials.value.length;
  activeIndex.value = (activeIndex.value - 1 + total) % total;
}

function nextTestimonial() {
  const total = testimonials.value.length;
  activeIndex.value = (activeIndex.value + 1) % total;
}

async function bootstrap() {
  loading.value = true;
  errorMessage.value = '';
  try {
    settings.value = await fetchSiteSettings();
    setSeo({
      title: `${settings.value.siteName} - 关于`,
      description: settings.value.seoDefaultDescription || settings.value.subtitle,
      path: '/about'
    });
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
    setSeo({
      title: '关于本站',
      description: '关于本站',
      path: '/about'
    });
  } finally {
    loading.value = false;
  }
}

onMounted(bootstrap);
</script>

<template>
  <section class="about-showcase">
    <section class="about-hero">
      <div class="content-wrap about-hero-inner">
        <p class="about-contact-title">What Our Readers Say</p>
        <p v-if="loading" class="about-quote">正在加载关于信息...</p>
        <p v-else-if="errorMessage" class="about-quote">{{ errorMessage }}</p>
        <template v-else>
          <p class="about-quote">“{{ activeTestimonial.quote }}”</p>
          <p class="about-author">{{ activeTestimonial.author }}</p>
          <div class="about-nav">
            <button class="about-nav-btn" type="button" @click="prevTestimonial" aria-label="previous">
              ←
            </button>
            <button class="about-nav-btn" type="button" @click="nextTestimonial" aria-label="next">
              →
            </button>
          </div>
        </template>
      </div>
    </section>

    <section class="about-contact">
      <div class="about-grid-bg" aria-hidden="true"></div>
      <div class="content-wrap about-contact-inner">
        <p class="about-contact-title">Contact Us</p>
        <p class="about-contact-item">{{ settings?.siteName || 'Rainy Cole' }}</p>
        <p class="about-contact-item">{{ settings?.subtitle || '记录代码、生活与长期主义' }}</p>
        <p class="about-contact-item">SEO Title: {{ settings?.seoDefaultTitle || '-' }}</p>
        <p class="about-contact-item">SEO Description: {{ settings?.seoDefaultDescription || '-' }}</p>
        <div v-if="socialLinks.length" class="about-links">
          <a
            v-for="(item, index) in socialLinks"
            :key="`social-link-${index}`"
            class="about-link"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.name || item.url }}
          </a>
        </div>
      </div>
    </section>
  </section>
</template>
