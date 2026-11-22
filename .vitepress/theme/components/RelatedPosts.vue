<script setup lang="ts">
// 文末"继续阅读"：来自 gen-site-data.mjs 的 relatedMap（同分类内按双链共引等打分取前 3）
import { computed } from "vue"
import { useData, withBase } from "vitepress"
import { allArticles, relatedMap } from "../../generated/site-data.mjs"
import { descriptions } from "../../generated/descriptions.mjs"
import { formatDate } from "../utils"

const { page } = useData()

const items = computed(() => {
  const rel = page.value.relativePath
  if (!rel || !rel.endsWith(".md")) return []
  const url = "/" + rel.slice(0, -3)
  return (relatedMap[url] || [])
    .map((u) => {
      const a = allArticles.find((x) => x.url === u)
      if (!a) return null
      return { ...a, desc: descriptions[u + ".md"] || "" }
    })
    .filter(Boolean) as { title: string; url: string; category: string; modified: number; desc: string }[]
})
</script>

<template>
  <div v-if="items.length" class="doc-links">
    <h2 class="doc-links-title">继续阅读</h2>
    <div class="doc-links-grid">
      <a v-for="it in items" :key="it.url" class="doc-link-card" :href="withBase(it.url)">
        <span class="doc-link-title">{{ it.title }}</span>
        <span v-if="it.desc" class="doc-link-desc">{{ it.desc }}</span>
        <span class="doc-link-meta">{{ it.category }} · {{ formatDate(it.modified) }} 更新</span>
      </a>
    </div>
  </div>
</template>
