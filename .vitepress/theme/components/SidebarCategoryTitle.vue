<script setup lang="ts">
import { computed } from "vue"
import { useData, withBase } from "vitepress"
import { categoryDirs, navCategories } from "../../generated/site-data.mjs"

const { page } = useData()

// relativePath 首段 → 所属分类（"其他"为多目录合并，需反查）。
// 用 page.relativePath 而非 route.path：SSR 与客户端水合两侧都可靠
// （面包屑组件同款取法）；分类列表页与首页本就无侧边栏
const current = computed(() => {
  const rel = page.value.relativePath ?? ""
  if (!rel.endsWith(".md")) return null
  const top = rel.split("/")[0]
  for (const [label, dirs] of Object.entries(categoryDirs)) {
    if ((dirs as string[]).includes(top)) {
      const cat = navCategories.find((c) => c.label === label)
      return cat ? { label, count: cat.count, link: cat.link } : null
    }
  }
  return null
})
</script>

<template>
  <div v-if="current" class="sidebar-cat">
    <span class="sidebar-cat-name">{{ current.label }}</span>
    <span class="sidebar-cat-count">{{ current.count }} 篇</span>
    <a class="sidebar-cat-overview" :href="withBase(current.link)" title="本分类统计总览">总览</a>
  </div>
</template>

<style scoped>
.sidebar-cat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px 10px;
}

.sidebar-cat-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.sidebar-cat-count {
  padding: 0 8px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  font-size: 11.5px;
  line-height: 18px;
  color: var(--vp-c-text-3);
}

.sidebar-cat-overview {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color 0.25s;
}

.sidebar-cat-overview:hover {
  color: var(--vp-c-brand-1);
}
</style>
