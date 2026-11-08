<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { withBase } from "vitepress"
import { allArticles } from "../../generated/site-data.mjs"
import { articleFileName } from "../utils"

// 首页内嵌搜索：生产环境把 PagefindUI 直接渲染在 hero（输入即搜、结果内联展示，
// 不弹窗）；开发环境没有 Pagefind 索引，退化为按标题/路径即时过滤
const isDev = import.meta.env.DEV
const total = allArticles.length

const pfHost = ref<HTMLElement | null>(null)
const query = ref("")

// 开发模式：标题 + 显示路径匹配，取前 8 条
const devResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  const hit = (a: (typeof allArticles)[number]) =>
    a.title.toLowerCase().includes(q) ||
    articleFileName(a.url, a.category).toLowerCase().includes(q)
  return allArticles.filter(hit).slice(0, 8)
})

let ui: any = null
onMounted(async () => {
  if (isDev || !pfHost.value) return
  try {
    // 包是 CJS：兼容 named/default 两种互操作形态
    const mod: any = await import("@pagefind/default-ui")
    const PagefindUI = mod.PagefindUI ?? mod.default
    await import("@pagefind/default-ui/css/ui.css")
    ui = new PagefindUI({
      element: pfHost.value,
      bundlePath: import.meta.env.BASE_URL + "pagefind/",
      baseUrl: import.meta.env.BASE_URL,
      showImages: false,
      showSubResults: true,
      debounceTimeoutMs: 200,
      translations: {
        placeholder: `搜索全部 ${total} 篇笔记…`,
        clear_search: "清除",
        load_more: "加载更多结果",
        search_label: "搜索本站",
        zero_results: "没有找到与「[SEARCH_TERM]」相关的结果",
        many_results: "共 [COUNT] 个结果",
        one_result: "共 [COUNT] 个结果",
        searching: "搜索中…"
      }
    } as any)
  } catch (e) {
    console.error("[home-search] PagefindUI 加载失败", e)
  }
})

onBeforeUnmount(() => {
  ui?.destroy()
  ui = null
})
</script>

<template>
  <div class="home-search">
    <!-- 生产：PagefindUI 自带输入框与内联结果 -->
    <div v-if="!isDev" ref="pfHost" class="home-pf"></div>

    <!-- 开发：Pagefind 索引不存在，退化为标题即时过滤 -->
    <div v-else class="home-dev">
      <div class="home-dev-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input
          v-model="query"
          type="text"
          :placeholder="`搜索全部 ${total} 篇笔记…`"
          spellcheck="false"
        />
      </div>
      <div v-if="query.trim()" class="home-dev-results">
        <a v-for="a in devResults" :key="a.url" :href="withBase(a.url)">
          <span class="dev-title">{{ articleFileName(a.url, a.category) }}</span>
          <span class="dev-cat">{{ a.category }}</span>
        </a>
        <p v-if="!devResults.length" class="dev-empty">
          没有找到与「{{ query.trim() }}」相关的笔记（开发模式仅搜索标题，发布后支持全文）
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-search {
  width: min(560px, 100%);
  margin: 0 auto;
  text-align: left;
}

/* 开发模式退化搜索的样式 */
.home-dev-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  transition: border-color 0.25s, background-color 0.25s;
}

.home-dev-box:focus-within {
  border-color: var(--vp-c-brand-1);
  background: var(--pl-card-bg);
}

.home-dev-box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14.5px;
  font-family: inherit;
}

.home-dev-box input::placeholder {
  color: var(--vp-c-text-3);
}

.home-dev-results {
  margin-top: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
  overflow: hidden;
}

.home-dev-results a {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
}

.home-dev-results a + a {
  border-top: 1px dashed var(--vp-c-divider);
}

.home-dev-results a:hover {
  background: var(--vp-c-bg-soft);
}

.home-dev-results a:hover .dev-title {
  color: var(--vp-c-brand-1);
}

.dev-title {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.dev-cat {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.dev-empty {
  margin: 0;
  padding: 12px 16px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
