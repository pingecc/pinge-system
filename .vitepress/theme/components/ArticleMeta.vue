<script setup lang="ts">
import { computed } from "vue"
import { useData, withBase } from "vitepress"
import { allArticles } from "../../generated/site-data.mjs"
import { categorySlug, formatDate } from "../utils"

const { page } = useData()

const meta = computed(() => {
  const rel = page.value.relativePath
  if (!rel || !rel.endsWith(".md")) return null
  const url = "/" + rel.slice(0, -3)
  return allArticles.find((a) => a.url === url) ?? null
})

// 手动加千分位而非 toLocaleString，避免 SSR/客户端 locale 差异导致水合不匹配
const wordsText = computed(() =>
  meta.value ? String(meta.value.words).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
)
</script>

<template>
  <div v-if="meta" class="article-meta">
    <a
      class="cat-badge"
      :class="`cat-${categorySlug(meta.category)}`"
      :href="withBase(`/categories/${encodeURIComponent(meta.category)}`)"
    >
      {{ meta.category }}
    </a>
    <span>创建于 {{ formatDate(meta.created) }}</span>
    <span class="meta-dot">·</span>
    <span>{{ wordsText }} 字</span>
    <span class="meta-dot">·</span>
    <span>约 {{ meta.minutes }} 分钟</span>
  </div>
</template>
