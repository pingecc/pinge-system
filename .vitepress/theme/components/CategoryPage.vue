<script setup lang="ts">
import { ref, computed } from "vue"
import { withBase } from "vitepress"
import { navCategories } from "../../generated/site-data.mjs"
import { articleFileName } from "../utils"

const props = defineProps<{ categoryName: string }>()

// 排序状态: 'default' | 'created-asc' | 'created-desc' | 'modified-asc' | 'modified-desc'
const sortBy = ref<string>("default")

const categoryArticles = computed(() => {
  const articles =
    navCategories.find((c) => c.label === props.categoryName)?.articles || []
  if (sortBy.value === "default") {
    return articles
  } else if (sortBy.value === "created-asc") {
    return [...articles].sort((a, b) => a.created - b.created)
  } else if (sortBy.value === "created-desc") {
    return [...articles].sort((a, b) => b.created - a.created)
  } else if (sortBy.value === "modified-asc") {
    return [...articles].sort((a, b) => a.modified - b.modified)
  } else if (sortBy.value === "modified-desc") {
    return [...articles].sort((a, b) => b.modified - a.modified)
  }
  return articles
})

function formatDate(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toggleSort(field: "created" | "modified") {
  const currentField = sortBy.value.split("-")[0]
  const currentDir = sortBy.value.split("-")[1]
  if (currentField === field) {
    if (currentDir === "desc") sortBy.value = `${field}-asc`
    else if (currentDir === "asc") sortBy.value = "default"
    else sortBy.value = `${field}-desc`
  } else {
    sortBy.value = `${field}-desc`
  }
}

function getSortIcon(field: "created" | "modified"): string {
  const currentField = sortBy.value.split("-")[0]
  const currentDir = sortBy.value.split("-")[1]
  if (currentField === field) {
    if (currentDir === "asc") return "↑"
    if (currentDir === "desc") return "↓"
  }
  return ""
}
</script>

<template>
  <div class="category-page">
    <h1 class="category-title">{{ props.categoryName }}</h1>
    <p class="category-count">共 {{ categoryArticles.length }} 篇文章</p>

    <div v-if="categoryArticles.length > 0" class="article-list">
      <div class="article-header">
        <span class="header-title">文件名</span>
        <span class="header-created sortable" @click="toggleSort('created')">
          发布时间 <span class="sort-icon">{{ getSortIcon("created") }}</span>
        </span>
        <span class="header-modified sortable" @click="toggleSort('modified')">
          修改时间 <span class="sort-icon">{{ getSortIcon("modified") }}</span>
        </span>
      </div>
      <a
        v-for="art in categoryArticles"
        :key="art.url"
        :href="withBase(art.url)"
        class="article-item"
      >
        <span class="article-title" :title="art.title">{{ articleFileName(art.url, props.categoryName) }}</span>
        <span class="article-created">{{ formatDate(art.created) }}</span>
        <span class="article-modified">{{ formatDate(art.modified) }}</span>
      </a>
    </div>

    <div v-else class="no-articles">暂无文章</div>
  </div>
</template>

<style scoped>
.category-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.category-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.category-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px 0;
}

.article-list {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 16px 20px;
}

.article-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-title {
  flex: 1;
  min-width: 0;
}

.header-created,
.header-modified {
  width: 145px;
  text-align: right;
  flex-shrink: 0;
}

.header-created {
  margin-right: 16px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}

.sortable:hover {
  color: var(--vp-c-brand-1);
}

.sort-icon {
  display: inline-block;
  width: 12px;
  margin-left: 2px;
  color: var(--vp-c-brand-1);
}

.article-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.2s ease;
}

.article-item:last-child {
  border-bottom: none;
}

.article-item:hover,
.article-item:hover .article-title {
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
  transition: color 0.2s ease;
}

.article-created,
.article-modified {
  width: 145px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: right;
  flex-shrink: 0;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}

.article-created {
  margin-right: 16px;
}

.no-articles {
  padding: 40px 0;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

/* 移动端：去掉三列表头，标题整行展示，日期降为第二行小字 */
@media (max-width: 768px) {
  .category-page {
    padding: 16px;
  }

  .category-title {
    font-size: 24px;
  }

  .article-list {
    padding: 12px 16px;
  }

  .article-header {
    display: none;
  }

  .article-item {
    flex-wrap: wrap;
    padding: 14px 0;
    row-gap: 4px;
  }

  .article-title {
    flex: 1 1 100%;
    font-size: 15px;
    line-height: 1.5;
    white-space: normal;
    overflow: visible;
  }

  .article-created,
  .article-modified {
    width: auto;
    font-size: 11px;
  }

  .article-created {
    margin-right: 16px;
  }
}
</style>
