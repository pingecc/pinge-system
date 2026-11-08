<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import { allArticles } from "../../generated/site-data.mjs"
import { articleFileName, formatDate } from "../utils"

const SHOW = 8

const recentCreated = computed(() =>
  [...allArticles].sort((a, b) => b.created - a.created).slice(0, SHOW)
)

const recentModified = computed(() =>
  [...allArticles].sort((a, b) => b.modified - a.modified).slice(0, SHOW)
)
</script>

<template>
  <section class="home-section recent-section">
    <div class="recent-grid">
      <div class="recent-col">
        <h2 class="section-title">🕘 最近发布</h2>
        <ol class="recent-list">
          <li v-for="a in recentCreated" :key="a.url">
            <a :href="withBase(a.url)" class="recent-item">
              <span class="recent-title">{{ articleFileName(a.url, a.category) }}</span>
              <span class="recent-date">{{ formatDate(a.created) }}</span>
            </a>
          </li>
        </ol>
      </div>
      <div class="recent-col">
        <h2 class="section-title">✏️ 最近修改</h2>
        <ol class="recent-list">
          <li v-for="a in recentModified" :key="a.url">
            <a :href="withBase(a.url)" class="recent-item">
              <span class="recent-title">{{ articleFileName(a.url, a.category) }}</span>
              <span class="recent-date">{{ formatDate(a.modified) }}</span>
            </a>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-section {
  max-width: 1120px;
  margin: 0 auto;
}

.recent-section {
  padding: 40px 24px 64px;
}

.recent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.recent-list {
  margin: 0;
  padding: 6px 18px;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--pl-card-bg);
}

.recent-list li + li {
  border-top: 1px dashed var(--vp-c-divider);
}

.recent-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 0;
  color: var(--vp-c-text-1);
}

.recent-title {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.25s;
}

.recent-item:hover .recent-title {
  color: var(--vp-c-brand-1);
}

.recent-date {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .recent-grid {
    grid-template-columns: 1fr;
  }
}
</style>
