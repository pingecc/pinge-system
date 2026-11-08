<script setup lang="ts">
import { computed } from "vue"
import { useData, withBase } from "vitepress"
import { categoryDirs } from "../../generated/site-data.mjs"

const { page } = useData()

// 顶级目录 → 所属分类（"其他"由多个小目录合并，需反查）
const dirToCategory = (() => {
  const map: Record<string, string> = {}
  for (const [label, dirs] of Object.entries(categoryDirs)) {
    for (const d of dirs as string[]) map[d] = label
  }
  return map
})()

interface Crumb {
  label: string
  link: string | null
}

// 面包屑 = 首页 / 分类(链接) / 中间目录(纯文本) / 当前页标题；
// 中间目录没有落地页，只作方位提示
const crumbs = computed<Crumb[]>(() => {
  const rel = page.value.relativePath ?? ""
  if (!rel.endsWith(".md")) return []
  const segments = rel.slice(0, -3).split("/")
  if (segments.length < 2) return []
  const top = segments[0]
  const category = dirToCategory[top] ?? top
  const items: Crumb[] = [{ label: category, link: `/categories/${encodeURIComponent(category)}` }]
  // "其他"为多目录合并分类：真实顶级目录名作为方位提示补回
  if (top !== category) items.push({ label: top, link: null })
  for (let i = 1; i < segments.length - 1; i++) {
    items.push({ label: segments[i], link: null })
  }
  return items
})
</script>

<template>
  <nav v-if="crumbs.length" class="breadcrumbs" aria-label="面包屑">
    <a :href="withBase('/')">首页</a>
    <template v-for="c in crumbs" :key="c.label + (c.link ?? '')">
      <span class="crumb-sep">/</span>
      <a v-if="c.link" :href="withBase(c.link)">{{ c.label }}</a>
      <span v-else class="crumb-text">{{ c.label }}</span>
    </template>
    <span class="crumb-sep">/</span>
    <span class="crumb-current">{{ page.title }}</span>
  </nav>
</template>

<style scoped>
.crumb-text {
  color: var(--vp-c-text-3);
}
</style>
