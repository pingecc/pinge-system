<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue"
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
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
}

function getCategoryClass(category: string): string {
  return CATEGORY_CLASS[category] || "cat-other"
}

let unbindFadeHint: (() => void) | undefined

// 列表可滚动且未滚到底时，给卡片加底部渐隐提示；纯 CSS 无法感知滚动位置
function updateFadeHint() {
  document.querySelectorAll<HTMLElement>(".recent-articles .article-list").forEach((el) => {
    const section = el.closest(".articles-section")
    if (!section) return
    const overflowed = el.scrollHeight > el.clientHeight + 4
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 4
    section.classList.toggle("list-fade", overflowed && !atEnd)
  })
}

function bindFadeHint() {
  const lists = document.querySelectorAll<HTMLElement>(".recent-articles .article-list")
  lists.forEach((el) => el.addEventListener("scroll", updateFadeHint, { passive: true }))
  const ro = new ResizeObserver(updateFadeHint)
  lists.forEach((el) => ro.observe(el))
  updateFadeHint()
  return () => {
    lists.forEach((el) => el.removeEventListener("scroll", updateFadeHint))
    ro.disconnect()
  }
}

onMounted(() => {
  unbindFadeHint = bindFadeHint()
})

onBeforeUnmount(() => unbindFadeHint?.())
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
  position: relative;
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

/* 列表内容可滚动且未滚到底时，底部渐隐提示还有更多（list-fade 由脚本维护） */
.articles-section::after {
  content: "";
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 0;
  height: 40px;
  border-radius: 0 0 12px 12px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg-soft));
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

@media (min-width: 769px) {
  .articles-section.list-fade::after {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .articles-section {
    flex: 0 1 auto;
    width: 100%;
    max-width: none;
    max-height: none !important;
    padding: 16px 16px 8px;
    overflow: visible;
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
  width: 90px;
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

  .recent-articles .article-header {
    display: none;
  }

  .recent-articles .section-title {
    font-size: 17px;
    margin-bottom: 8px;
  }

  .recent-articles .article-link {
    padding: 12px 0;
  }

  .recent-articles .article-title {
    font-size: 15px;
    line-height: 1.5;
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
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
  width: 90px;
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

/* 分类配色：变量定义在 custom.css，明暗模式各一套 */
.cat-front {
  background: var(--cat-front-bg);
  color: var(--cat-front-text);
}

.cat-java {
  background: var(--cat-java-bg);
  color: var(--cat-java-text);
}

.cat-python {
  background: var(--cat-python-bg);
  color: var(--cat-python-text);
}

.cat-arch {
  background: var(--cat-arch-bg);
  color: var(--cat-arch-text);
}

.cat-english {
  background: var(--cat-english-bg);
  color: var(--cat-english-text);
}

.cat-ai {
  background: var(--cat-ai-bg);
  color: var(--cat-ai-text);
}

.cat-other {
  background: var(--cat-other-bg);
  color: var(--cat-other-text);
}
</style>
