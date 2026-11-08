<script setup lang="ts">
import { withBase } from "vitepress"
import { navCategories } from "../../generated/site-data.mjs"
import { categoryEntryUrl, categorySlug, formatDate } from "../utils"

// 每个分类卡片的"最近更新"取该分类下文章 modified 的最大值
function latestModified(articles: { modified: number }[]): number {
  let max = 0
  for (const a of articles) {
    if (a.modified > max) max = a.modified
  }
  return max
}
</script>

<template>
  <section class="home-section">
    <h2 class="section-title">分类浏览</h2>
    <div class="category-grid">
      <a
        v-for="c in navCategories"
        :key="c.label"
        class="category-card"
        :class="`cat-${categorySlug(c.label)}`"
        :href="withBase(categoryEntryUrl(c))"
        :title="`进入 ${c.label} 内容`"
      >
        <div class="card-top">
          <span class="card-dot" aria-hidden="true"></span>
          <span class="card-name">{{ c.label }}</span>
          <span class="card-count">{{ c.count }} 篇</span>
        </div>
        <p class="card-meta">最近更新 {{ formatDate(latestModified(c.articles)) }}</p>
      </a>
    </div>
  </section>
</template>

<style scoped>
.home-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 0;
}

.section-title {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
}

.category-card {
  display: block;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.category-card:hover {
  border-color: var(--card-c);
  transform: translateY(-2px);
  /* 分类色悬停辉光（color-mix 不可用时回退中性阴影） */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 28px color-mix(in srgb, var(--card-c) 20%, transparent);
}

/* 分类主题色来自 custom.css 的全局 .cat-<slug> 映射（--card-c / --card-bg） */

.card-top {
  display: flex;
  align-items: center;
  gap: 9px;
}

.card-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--card-c);
  flex-shrink: 0;
}

.card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-count {
  padding: 1px 9px;
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--card-c);
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.card-meta {
  margin: 10px 0 0;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}
</style>
