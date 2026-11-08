<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import { allArticles, navCategories } from "../../generated/site-data.mjs"
import { articleFileName, categorySlug, formatDate } from "../utils"

const props = defineProps<{ categoryName: string }>()

interface SubStat {
  name: string
  count: number
  pct: number
  latest: string
}

interface RecentArticle {
  title: string
  url: string
  date: string
}

const cat = computed(() => navCategories.find((c) => c.label === props.categoryName))

// 统计瓦片：篇数 / 总字数 / 总阅读时长 / 最近更新（字数与时长取自 allArticles）
const catArticles = computed(() =>
  allArticles.filter((a) => a.category === props.categoryName)
)

const totalWords = computed(() =>
  catArticles.value.reduce((n, a) => n + a.words, 0)
)
const totalMinutes = computed(() =>
  catArticles.value.reduce((n, a) => n + a.minutes, 0)
)
const latest = computed(() =>
  catArticles.value.length ? Math.max(...catArticles.value.map((a) => a.modified)) : 0
)

function thousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// 子目录分布（条形图数据）：常规分类取第二段，"其他"取第一段，散篇归"（根目录）"
const subs = computed<SubStat[]>(() => {
  if (!cat.value) return []
  const map = new Map<string, { count: number; latest: number }>()
  for (const a of cat.value.articles) {
    const segs = a.url.split("/").filter(Boolean)
    const name =
      props.categoryName === "其他" ? segs[0] : segs.length > 2 ? segs[1] : "（根目录）"
    const s = map.get(name) ?? { count: 0, latest: 0 }
    s.count++
    if (a.modified > s.latest) s.latest = a.modified
    map.set(name, s)
  }
  const max = Math.max(...[...map.values()].map((s) => s.count), 1)
  return [...map.entries()]
    .map(([name, s]) => ({
      name,
      count: s.count,
      latest: formatDate(s.latest),
      // 最小 6% 保证单篇文章的条也可见
      pct: Math.max(6, Math.round((s.count / max) * 100))
    }))
})

// 最近更新 5 篇
const recent = computed<RecentArticle[]>(() => {
  if (!cat.value) return []
  return [...cat.value.articles]
    .sort((a, b) => b.modified - a.modified)
    .slice(0, 5)
    .map((a) => ({
      title: articleFileName(a.url, props.categoryName),
      url: a.url,
      date: formatDate(a.modified)
    }))
})
</script>

<template>
  <div class="category-page" :class="`cat-${categorySlug(props.categoryName)}`">
    <header class="category-hero">
      <div class="hero-main">
        <h1 class="category-title">{{ props.categoryName }}</h1>
        <p class="category-sub">共 {{ catArticles.length }} 篇 · 最近更新 {{ formatDate(latest) }}</p>
      </div>
      <a class="hero-global" :href="withBase('/overview')">全站总览 →</a>
    </header>

    <!-- 统计瓦片 -->
    <div class="stat-tiles">
      <div class="tile">
        <i>文章</i>
        <b>{{ catArticles.length }}<u>篇</u></b>
      </div>
      <div class="tile">
        <i>总字数</i>
        <b>{{ thousands(totalWords) }}</b>
      </div>
      <div class="tile">
        <i>读完约需</i>
        <b>{{ totalMinutes }}<u>分钟</u></b>
      </div>
      <div class="tile">
        <i>最近更新</i>
        <b class="tile-date">{{ formatDate(latest) }}</b>
      </div>
    </div>

    <!-- 子目录分布（条形图） -->
    <section class="stat-block">
      <h2 class="block-title">子目录分布</h2>
      <div class="bar-list">
        <div v-for="sub in subs" :key="sub.name" class="bar-row" :title="`${sub.name}：${sub.count} 篇，最近更新 ${sub.latest}`">
          <span class="bar-name">{{ sub.name }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: sub.pct + '%' }"></div>
          </div>
          <span class="bar-num">{{ sub.count }}</span>
        </div>
      </div>
    </section>

    <!-- 最近更新 -->
    <section class="stat-block">
      <h2 class="block-title">最近更新</h2>
      <ul class="recent-list">
        <li v-for="r in recent" :key="r.url">
          <a :href="withBase(r.url)">{{ r.title }}</a>
          <span class="recent-date">{{ r.date }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.category-page {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px 32px 64px;
}

.category-hero {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.category-title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.category-sub {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.hero-global {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
  transition: color 0.2s;
}

.hero-global:hover {
  color: var(--vp-c-brand-1);
}

/* 统计瓦片 */
.stat-tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.tile {
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
}

.tile i {
  display: block;
  margin-bottom: 6px;
  font-style: normal;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.tile b {
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.tile b u {
  margin-left: 2px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-decoration: none;
}

.tile .tile-date {
  font-size: 15px;
  font-family: var(--vp-font-family-mono);
}

/* 统计块 */
.stat-block {
  margin-top: 28px;
}

.block-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* 子目录分布条形图 */
.bar-list {
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.bar-name {
  width: 150px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 14px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  /* color-mix 不可用时回退纯色 */
  background: var(--card-c);
  background: linear-gradient(90deg, var(--card-c), color-mix(in srgb, var(--card-c) 55%, transparent));
  transition: width 0.4s ease;
}

.bar-num {
  width: 34px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  text-align: right;
}

/* 最近更新 */
.recent-list {
  margin: 0;
  padding: 4px 16px;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
}

.recent-list li {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 9px 0;
}

.recent-list li + li {
  border-top: 1px dashed var(--vp-c-divider);
}

.recent-list a {
  flex: 1;
  min-width: 0;
  font-size: 13.5px;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.recent-list a:hover {
  color: var(--vp-c-brand-1);
}

.recent-date {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .category-page {
    padding: 16px 16px 48px;
  }

  .stat-tiles {
    grid-template-columns: repeat(2, 1fr);
  }

  .bar-name {
    width: 96px;
  }
}
</style>
