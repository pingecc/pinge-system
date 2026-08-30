<script setup lang="ts">
import { ref } from "vue"
import { withBase } from "vitepress"
import { navCategories } from "../../generated/site-data.mjs"
import { articleFileName } from "../utils"

const showDropdown = ref<string | null>(null)
let openTimer: number | undefined
let closeTimer: number | undefined

function onEnter(label: string) {
  clearTimeout(closeTimer)
  openTimer = window.setTimeout(() => {
    showDropdown.value = label
  }, 150)
}

function onLeave() {
  clearTimeout(openTimer)
  closeTimer = window.setTimeout(() => {
    showDropdown.value = null
  }, 200)
}
</script>

<template>
  <nav class="categories" aria-label="分类导航">
    <div
      v-for="cat in navCategories"
      :key="cat.label"
      class="category-wrapper"
      @mouseenter="onEnter(cat.label)"
      @mouseleave="onLeave"
    >
      <a :href="withBase(cat.link)" class="category-link">{{ cat.label }}</a>
      <Transition name="dropdown-fade">
        <div v-if="showDropdown === cat.label" class="dropdown">
          <a
            v-for="art in cat.articles"
            :key="art.url"
            :href="withBase(art.url)"
            class="dropdown-item"
            :title="art.title"
          >
            {{ articleFileName(art.url, cat.label) }}
          </a>
          <div v-if="cat.articles.length === 0" class="dropdown-empty">暂无文章</div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
.categories {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 12px;
  padding: 15px 20px 20px;
  margin: 0 auto;
  flex-shrink: 0;
}

.category-wrapper {
  position: relative;
  padding-bottom: 12px;
  margin-bottom: -12px;
}

.category-link {
  display: inline-block;
  padding: 8px 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-wrapper:hover .category-link {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 240px;
  max-width: 320px;
  max-height: 540px;
  overflow-y: auto;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 100;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 13px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.dropdown-empty {
  padding: 12px 16px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  text-align: center;
}

@media (max-width: 640px) {
  .categories {
    flex-wrap: wrap;
    gap: 8px;
  }

  .category-link {
    padding: 6px 14px;
    font-size: 14px;
  }

  .dropdown {
    min-width: 200px;
    max-width: 280px;
    left: 0;
    transform: none;
  }

  .dropdown-fade-enter-from,
  .dropdown-fade-leave-to {
    transform: translateY(-8px);
  }

  .dropdown-fade-enter-to,
  .dropdown-fade-leave-from {
    transform: translateY(0);
  }
}
</style>
