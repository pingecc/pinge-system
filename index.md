---
layout: home
---

<script setup>
import { nextTick, ref, onMounted, onUnmounted } from 'vue'
import CategoryNav from './.vitepress/theme/components/CategoryNav.vue'
import RecentArticles from './.vitepress/theme/components/RecentArticles.vue'

const showHero = ref(true)
const heightThreshold = 600
const widthThreshold = 768
let layoutFrame = 0

function clearRecentArticlesMaxHeight() {
  document.documentElement.style.removeProperty('--home-recent-articles-max-height')
}

function updateRecentArticlesMaxHeight() {
  if (layoutFrame) cancelAnimationFrame(layoutFrame)
  layoutFrame = requestAnimationFrame(() => {
    const vpContent = document.querySelector('.VPContent.is-home')
    const recentArticles = document.querySelector('.recent-articles')
    if (!vpContent || !recentArticles) {
      clearRecentArticlesMaxHeight()
      return
    }
    const availableHeight = Math.max(
      0,
      Math.floor(vpContent.getBoundingClientRect().bottom - recentArticles.getBoundingClientRect().top)
    )
    document.documentElement.style.setProperty(
      '--home-recent-articles-max-height',
      `${availableHeight}px`
    )
  })
}

function checkSize() {
  // 大屏才显示 hero 标语；分类导航在所有屏幕下都显示
  showHero.value = window.innerHeight >= heightThreshold && window.innerWidth >= widthThreshold
  nextTick(updateRecentArticlesMaxHeight)
}

onMounted(() => {
  checkSize()
  window.addEventListener('resize', checkSize)
  window.addEventListener('load', updateRecentArticlesMaxHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkSize)
  window.removeEventListener('load', updateRecentArticlesMaxHeight)
  if (layoutFrame) cancelAnimationFrame(layoutFrame)
  clearRecentArticlesMaxHeight()
})
</script>

<div v-if="showHero" class="hero-section">
  <p class="tagline">It's never too late. Just do it better.</p>
</div>

<CategoryNav />

<RecentArticles />

<style>
.hero-section {
  display: flex;
  justify-content: center;
  padding: 30px 20px 5px;
  flex-shrink: 0;
}

.tagline {
  font-size: 32px;
  font-weight: bold;
  color: var(--vp-c-text-2);
  margin: 0;
  text-align: center;
}

@media (max-width: 640px) {
  .tagline {
    font-size: 24px;
  }
}
</style>
