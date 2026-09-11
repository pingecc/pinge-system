<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"
import { allArticles } from "../../generated/site-data.mjs"

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

function formatDate(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
}
</script>

<template>
  <div v-if="meta" class="article-meta">
    <span>约 {{ meta.minutes }} 分钟</span>
    <span class="meta-dot">·</span>
    <span>{{ wordsText }} 字</span>
    <span class="meta-dot">·</span>
    <span>创建于 {{ formatDate(meta.created) }}</span>
  </div>
</template>
