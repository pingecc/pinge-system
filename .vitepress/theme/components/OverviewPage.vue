<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import { allArticles, navCategories } from "../../generated/site-data.mjs"
import { articleFileName, categoryEntryUrl, categorySlug, formatDate } from "../utils"

// 每个分类的统计：篇数 / 最近更新 / 子目录分布 / 最近更新的文章
interface SubStat {
  name: string
  count: number
  latest: number
}

interface CatStat {
  label: string
  count: number
  latest: number
  entry: string
  subs: SubStat[]
  recent: { title: string; url: string; date: string }[]
}

const stats = computed<CatStat[]>(() =>
  navCategories.map((c) => {
    const subs = new Map<string, SubStat>()
    let latest = 0
    for (const a of c.articles) {
      if (a.modified > latest) latest = a.modified
      const segs = a.url.split("/").filter(Boolean)
      // 子目录名：常规分类取第二段；"其他"取第一段（小目录名）；散篇归"（根目录）"
      const name = c.label === "其他" ? segs[0] : segs.length > 2 ? segs[1] : "（根目录）"
      const s = subs.get(name) ?? { name, count: 0, latest: 0 }
      s.count++
      if (a.modified > s.latest) s.latest = a.modified
      subs.set(name, s)
    }
    const recent = [...c.articles]
      .sort((a, b) => b.modified - a.modified)
      .slice(0, 3)
      .map((a) => ({
        title: articleFileName(a.url, c.label),
        url: a.url,
        date: formatDate(a.modified)
      }))
    return {
      label: c.label,
      count: c.count,
      latest,
      entry: categoryEntryUrl(c),
      subs: [...subs.values()],
      recent
    }
  })
)

// 全站统计（手动千分位，避免水合差异）
const totalArticles = allArticles.length
const totalWords = allArticles.reduce((n, a) => n + a.words, 0)
const totalWordsText = String(totalWords).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const lastUpdated = formatDate(Math.max(...allArticles.map((a) => a.modified)))
</script>

<template>
  <div class="overview-page">
    <header class="overview-hero">
      <h1 class="overview-title">全站总览</h1>
      <p class="overview-sub">
        共 {{ totalArticles }} 篇 · {{ stats.length }} 个分类 · 约 {{ totalWordsText }} 字 ·
        最近更新 {{ lastUpdated }}
      </p>
    </header>

    <section v-for="s in stats" :key="s.label" class="ov-cat" :class="`cat-${categorySlug(s.label)}`">
      <header class="ov-cat-head">
        <span class="ov-dot" aria-hidden="true"></span>
        <a
          class="ov-cat-name"
          :href="withBase(`/categories/${encodeURIComponent(s.label)}`)"
          title="查看文章列表"
        >{{ s.label }}</a>
        <span class="ov-cat-count">{{ s.count }} 篇</span>
        <span class="ov-cat-latest">最近更新 {{ formatDate(s.latest) }}</span>
        <a class="ov-cat-enter" :href="withBase(s.entry)">进入内容 →</a>
      </header>

      <div class="ov-subs">
        <span v-for="sub in s.subs" :key="sub.name" class="ov-sub" :title="`最近更新 ${formatDate(sub.latest)}`">
          {{ sub.name }}<i>{{ sub.count }}</i>
        </span>
      </div>

      <ul class="ov-recent">
        <li v-for="r in s.recent" :key="r.url">
          <a :href="withBase(r.url)">{{ r.title }}</a>
          <span class="ov-recent-date">{{ r.date }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.overview-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 32px 64px;
}

.overview-hero {
  padding-bottom: 20px;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.overview-title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.overview-sub {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* 分类统计块 */
.ov-cat {
  margin-top: 20px;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
}

.ov-cat-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ov-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--card-c);
  flex-shrink: 0;
}

.ov-cat-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.ov-cat-name:hover {
  color: var(--vp-c-brand-1);
}

.ov-cat-count {
  padding: 1px 9px;
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--card-c);
  font-size: 12px;
  font-weight: 500;
}

.ov-cat-latest {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

.ov-cat-enter {
  margin-left: auto;
  font-size: 13px;
  color: var(--card-c);
  opacity: 0.85;
  transition: opacity 0.2s;
}

.ov-cat-enter:hover {
  opacity: 1;
}

/* 子目录分布统计 */
.ov-subs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.ov-sub {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

.ov-sub i {
  font-style: normal;
  font-weight: 600;
  color: var(--card-c);
}

/* 该分类最近更新的文章 */
.ov-recent {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.ov-recent li {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 0;
}

.ov-recent li + li {
  border-top: 1px dashed var(--vp-c-divider);
}

.ov-recent a {
  flex: 1;
  min-width: 0;
  font-size: 13.5px;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.ov-recent a:hover {
  color: var(--vp-c-brand-1);
}

.ov-recent-date {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .overview-page {
    padding: 16px 16px 48px;
  }

  .ov-cat-enter {
    margin-left: 0;
  }
}
</style>
