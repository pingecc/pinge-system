<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"

const { frontmatter, title } = useData()

// TODO(手动配置): 在 GitHub 仓库开启 Discussions，到 giscus.app 生成以下三个值（见 README）
const GISCUS_REPO = "pingecc/pinge-system"
const GISCUS_REPO_ID = ""
const GISCUS_CATEGORY = "Announcements"
const GISCUS_CATEGORY_ID = ""

const enabled = computed(() => GISCUS_REPO_ID.startsWith("R_") && GISCUS_CATEGORY_ID !== "")
</script>

<template>
  <div v-if="frontmatter.comments !== false" :key="title" class="giscus-comments">
    <h2 class="giscus-title">评论</h2>
    <component
      :is="'script'"
      v-if="enabled"
      src="https://giscus.app/client.js"
      :data-repo="GISCUS_REPO"
      :data-repo-id="GISCUS_REPO_ID"
      :data-category="GISCUS_CATEGORY"
      :data-category-id="GISCUS_CATEGORY_ID"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="preferred_color_scheme"
      data-lang="zh-CN"
      crossorigin="anonymous"
      async
    />
    <p v-else class="giscus-tip">
      评论功能待配置：请在仓库开启 Discussions，并按 README 指引把 giscus 参数填入
      <code>Comments.vue</code>。
    </p>
  </div>
</template>
