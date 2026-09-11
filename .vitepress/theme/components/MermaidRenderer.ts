import { defineComponent, nextTick, onMounted, watch } from "vue"
import { useData, useRoute } from "vitepress"

type MermaidAPI = typeof import("mermaid").default

// mermaid 体积大，按需动态加载：仅当页面真的有 mermaid 图时才拉取 chunk
let mermaidPromise: Promise<MermaidAPI> | null = null
function loadMermaid() {
  mermaidPromise ||= import("mermaid").then((m) => m.default)
  return mermaidPromise
}

// 无可见内容：把 SSR 输出的 <pre class="mermaid-src"> 源码渲染成 SVG，
// 主题切换（明/暗）时清空重画。渲染约定同 SidebarActiveScroller——渲染 null。
export default defineComponent({
  name: "MermaidRenderer",
  setup() {
    const route = useRoute()
    const { isDark } = useData()
    let seq = 0

    async function renderPending() {
      const blocks = document.querySelectorAll<HTMLElement>(".mermaid-block:not([data-done])")
      if (!blocks.length) return
      const mermaid = await loadMermaid()
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: isDark.value ? "dark" : "neutral"
      })
      for (const block of Array.from(blocks)) {
        const src = block.querySelector(".mermaid-src")
        const target = block.querySelector<HTMLElement>(".mermaid-target")
        if (!src || !target) continue
        try {
          const { svg } = await mermaid.render(`mermaid-svg-${++seq}`, (src.textContent ?? "").trim())
          target.innerHTML = svg
          block.setAttribute("data-done", "true")
        } catch {
          // 语法错误等渲染失败：保留源码展示，CSS 会把 pre 显示出来
          block.classList.add("mermaid-error")
        }
      }
    }

    function resetAndRender() {
      document.querySelectorAll(".mermaid-block[data-done]").forEach((block) => {
        block.removeAttribute("data-done")
        const target = block.querySelector<HTMLElement>(".mermaid-target")
        if (target) target.innerHTML = ""
      })
      renderPending()
    }

    onMounted(renderPending)
    watch(() => route.path, () => nextTick(renderPending))
    watch(isDark, resetAndRender)

    return () => null
  }
})
