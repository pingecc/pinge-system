<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import { allArticles } from "../../generated/site-data.mjs"
import { articleFileName } from "../utils"

const CATEGORY_CLASS: Record<string, string> = {
  前端: "cat-front",
  Java: "cat-java",
  Python: "cat-python",
  系统架构: "cat-arch",
  English: "cat-english",
  AI全栈应用: "cat-ai",
  其他: "cat-other"
}

const recentlyCreated = computed(() =>
  [...allArticles].sort((a, b) => b.created - a.created).slice(0, 10)
)
const recentlyModified = computed(() =>
  [...allArticles].sort((a, b) => b.modified - a.modified).slice(0, 10)
)

function formatDate(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getCategoryClass(category: string): string {
  return CATEGORY_CLASS[category] || "cat-other"
}
</script>

<template>
  <div class="recent-articles">
    <div class="articles-section">
      <h3 class="section-title">最新发布</h3>
      <div class="article-header">
        <span class="header-title">标题</span>
        <span class="header-category">分类</span>
        <span class="header-date">发布时间</span>
      </div>
      <ul class="article-list">
        <li v-for="art in recentlyCreated" :key="art.url" class="article-item">
          <a :href="withBase(art.url)" class="article-link">
            <span class="article-title" :title="art.title">{{ articleFileName(art.url, art.category) }}</span>
            <span class="article-category" :class="getCategoryClass(art.category)">{{ art.category }}</span>
            <span class="article-date">{{ formatDate(art.created) }}</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="articles-section">
      <h3 class="section-title">最近修改</h3>
      <div class="article-header">
        <span class="header-title">标题</span>
        <span class="header-category">分类</span>
        <span class="header-date">修改时间</span>
      </div>
      <ul class="article-list">
        <li v-for="art in recentlyModified" :key="art.url" class="article-item">
          <a :href="withBase(art.url)" class="article-link">
            <span class="article-title" :title="art.title">{{ articleFileName(art.url, art.category) }}</span>
            <span class="article-category" :class="getCategoryClass(art.category)">{{ art.category }}</span>
            <span class="article-date">{{ formatDate(art.modified) }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.recent-articles {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 30px;
  max-width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 0;
}

@media (max-width: 768px) {
  .recent-articles {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}

.articles-section {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px 24px;
  max-width: 560px;
  max-height: var(--home-recent-articles-max-height, none);
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .articles-section {
    flex: 0 1 auto;
    width: 100%;
    max-width: none;
  }
}

.section-title {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.article-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.header-title {
  flex: 1;
  min-width: 0;
}

.header-category {
  width: 80px;
  text-align: center;
  flex-shrink: 0;
}

.header-date {
  width: 145px;
  text-align: right;
  flex-shrink: 0;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

@media (min-width: 769px) {
  .article-list {
    padding-right: 6px;
  }
}

@media (max-width: 768px) {
  .recent-articles .articles-section:first-child {
    display: none;
  }
}

.article-list::-webkit-scrollbar {
  width: 6px;
}

.article-list::-webkit-scrollbar-track {
  background: transparent;
}

.article-list::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.article-list::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.article-item {
  margin: 0;
  padding: 0;
}

.article-link {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.2s ease;
}

.article-item:last-child .article-link {
  border-bottom: none;
}

.article-link:hover,
.article-link:hover .article-title {
  color: var(--vp-c-brand-1);
}

.article-title {
  font-size: 14px;
  color: var(--vp-c-text-1);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
  transition: color 0.2s ease;
}

.article-category {
  width: 80px;
  font-size: 11px;
  color: var(--vp-c-text-2);
  text-align: center;
  flex-shrink: 0;
  background: var(--vp-c-default-soft);
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
  white-space: nowrap;
}

.article-date {
  width: 145px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: right;
  flex-shrink: 0;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}

@media (max-width: 1200px) {
  .header-date,
  .article-date {
    display: none;
  }
}

@media (max-width: 900px) {
  .header-category,
  .article-category {
    display: none;
  }
}

/* 分类配色 */
.cat-front {
  background: rgba(59, 130, 246, 0.15);
  color: rgb(59, 130, 246);
}

.cat-java {
  background: rgba(236, 72, 153, 0.15);
  color: rgb(236, 72, 153);
}

.cat-python {
  background: rgba(34, 197, 94, 0.15);
  color: rgb(34, 197, 94);
}

.cat-arch {
  background: rgba(139, 92, 246, 0.15);
  color: rgb(139, 92, 246);
}

.cat-english {
  background: rgba(233, 84, 32, 0.15);
  color: rgb(233, 84, 32);
}

.cat-ai {
  background: rgba(14, 165, 233, 0.15);
  color: rgb(14, 165, 233);
}

.cat-other {
  background: rgba(100, 116, 139, 0.15);
  color: rgb(148, 163, 184);
}
</style>
