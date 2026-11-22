<script setup lang="ts">
// 文末"反向链接"：哪些笔记引用了本文（Obsidian 双链反向视图，数据来自 gen-site-data.mjs）
import { computed } from "vue"
import { useData, withBase } from "vitepress"
import { allArticles, backlinksMap } from "../../generated/site-data.mjs"

const { page } = useData()

const items = computed(() => {
  const rel = page.value.relativePath
  if (!rel || !rel.endsWith(".md")) return []
  const url = "/" + rel.slice(0, -3)
  return (backlinksMap[url] || [])
    .map((u) => allArticles.find((x) => x.url === u))
    .filter(Boolean) as { title: string; url: string }[]
})
</script>

<template>
  <div v-if="items.length" class="doc-backlinks">
    <h2 class="doc-backlinks-title">
      反向链接<span class="doc-backlinks-count">{{ items.length }}</span>
    </h2>
    <div class="doc-backlinks-list">
      <a
        v-for="it in items"
        :key="it.url"
        class="doc-backlinks-item"
        :href="withBase(it.url)"
      >
        <svg class="doc-backlinks-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M9 14l-4-4 4-4" />
          <path d="M5 10h9a5 5 0 0 1 5 5v4" />
        </svg>
        {{ it.title }}
      </a>
    </div>
  </div>
</template>
