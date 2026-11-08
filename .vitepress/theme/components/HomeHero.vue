<script setup lang="ts">
import { computed } from "vue"
import { allArticles, navCategories } from "../../generated/site-data.mjs"
import { formatDate } from "../utils"
import HomeSearch from "./HomeSearch.vue"

const total = allArticles.length
const categoryCount = navCategories.length

const lastUpdated = computed(() => {
  let max = 0
  for (const a of allArticles) {
    if (a.modified > max) max = a.modified
  }
  return formatDate(max)
})
</script>

<template>
  <section class="home-hero">
    <h1 class="hero-title">Pinge's Blog</h1>
    <p class="hero-tagline">It's never too late. Just do it better.</p>

    <!-- 内嵌搜索：输入即搜（生产为 PagefindUI 全文，开发为标题过滤） -->
    <HomeSearch />

    <p class="hero-stats">
      <span>📚 {{ total }} 篇笔记</span>
      <i class="dot">·</i>
      <span>🗂 {{ categoryCount }} 个分类</span>
      <i class="dot">·</i>
      <span>🕐 最近更新 {{ lastUpdated }}</span>
    </p>
  </section>
</template>

<style scoped>
.home-hero {
  max-width: 760px;
  margin: 0 auto;
  padding: 72px 24px 8px;
  text-align: center;
}

.hero-title {
  margin: 0 0 10px;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.hero-tagline {
  margin: 0 0 28px;
  font-size: 19px;
  font-weight: 600;
  background: linear-gradient(105deg, var(--vp-c-text-2) 30%, var(--vp-c-brand-1) 75%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.hero-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 20px 0 0;
  font-size: 13.5px;
  color: var(--vp-c-text-2);
}

.hero-stats .dot {
  margin: 0 8px;
  color: var(--vp-c-text-3);
  font-style: normal;
}

@media (max-width: 640px) {
  .home-hero {
    padding-top: 48px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-tagline {
    font-size: 16px;
  }
}
</style>
