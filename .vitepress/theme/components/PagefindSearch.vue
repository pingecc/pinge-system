<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

// Pagefind 索引只在构建后存在（dist/pagefind/），开发模式继续用 VitePress 内置搜索
const isDev = import.meta.env.DEV

const isMac = ref(false)

// 弹窗用命令式 DOM 挂到 body：不进 SSR 输出、不参与水合，也不受导航栏
// 潜在 backdrop-filter/transform 祖先对 position:fixed 的影响
let wrap: HTMLElement | null = null
let ui: any = null
let uiLoading = false

async function ensureUI(container: HTMLElement) {
  if (ui || uiLoading) return
  uiLoading = true
  try {
    // 包是 CJS：兼容 named/default 两种互操作形态
    const mod: any = await import("@pagefind/default-ui")
    const PagefindUI = mod.PagefindUI ?? mod.default
    await import("@pagefind/default-ui/css/ui.css")
    ui = new PagefindUI({
      element: container,
      bundlePath: import.meta.env.BASE_URL + "pagefind/",
      baseUrl: import.meta.env.BASE_URL,
      showImages: false,
      showSubResults: true,
      debounceTimeoutMs: 200,
      translations: {
        placeholder: "搜索文章…",
        clear_search: "清除",
        load_more: "加载更多结果",
        search_label: "搜索本站",
        zero_results: "没有找到与「[SEARCH_TERM]」相关的结果",
        many_results: "共 [COUNT] 个结果",
        one_result: "共 [COUNT] 个结果",
        searching: "搜索中…"
      }
    } as any)
    container.querySelector("input")?.focus()
  } finally {
    uiLoading = false
  }
}

function show() {
  if (!wrap) {
    wrap = document.createElement("div")
    wrap.className = "pf-overlay"
    wrap.innerHTML = '<div class="pf-modal"><div class="pf-container"></div></div>'
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) close()
    })
    document.body.appendChild(wrap)
  }
  wrap.style.display = "flex"
  ensureUI(wrap.querySelector(".pf-container") as HTMLElement)
}

function close() {
  if (wrap) wrap.style.display = "none"
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault()
    wrap && wrap.style.display === "flex" ? close() : show()
  } else if (e.key === "Escape") {
    close()
  } else if (e.key === "/") {
    const target = e.target as HTMLElement
    if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
      e.preventDefault()
      show()
    }
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)
})
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
  wrap?.remove()
  wrap = null
  ui?.destroy()
  ui = null
})
</script>

<template>
  <button v-if="!isDev" class="pf-trigger" aria-label="搜索" @click="show()">
    <svg class="pf-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span class="pf-trigger-label">搜索</span>
    <kbd class="pf-kbd">{{ isMac ? "⌘ K" : "Ctrl K" }}</kbd>
  </button>
</template>
