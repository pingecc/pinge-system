// 链接预取（instant.page 思路）：悬停/聚焦 80ms 后预取目标页 HTML，
// 并解析其 <link rel=modulepreload>/<script type=module> 提前拉取页面 chunk，
// 点击时页面数据已在缓存里，翻页接近零感。纯客户端，生产/开发均可运行
import { defineComponent, h, onMounted, onUnmounted } from "vue"

const fetched = new Set<string>()
let timer: number | undefined

function isInternal(href: string) {
  if (!href || href.startsWith("#")) return false
  if (/^(mailto|tel|javascript):/i.test(href)) return false
  try {
    const url = new URL(href, location.href)
    if (url.origin !== location.origin) return false
    if (url.pathname.endsWith(".md") || url.pathname.includes("/zmg/")) return false
    return true
  } catch {
    return false
  }
}

function normalize(href: string) {
  return new URL(href, location.href).href
}

function prefetch(href: string) {
  const url = normalize(href)
  if (fetched.has(url)) return
  fetched.add(url)
  fetch(url, { credentials: "same-origin" })
    .then((r) => (r.ok ? r.text() : null))
    .then((html) => {
      if (!html) return
      const doc = new DOMParser().parseFromString(html, "text/html")
      const chunks: string[] = []
      doc.querySelectorAll('link[rel="modulepreload"]').forEach((el) => {
        const u = el.getAttribute("href")
        if (u) chunks.push(u)
      })
      doc.querySelectorAll('script[type="module"][src]').forEach((el) => {
        const u = el.getAttribute("src")
        if (u) chunks.push(u)
      })
      for (const u of chunks) {
        const full = normalize(u)
        if (fetched.has(full)) continue
        fetched.add(full)
        fetch(full, { credentials: "same-origin" }).catch(() => {})
      }
    })
    .catch(() => {})
}

function onIntent(e: Event) {
  const target = e.target as HTMLElement | null
  const a = target?.closest?.("a[href]") as HTMLAnchorElement | null
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return
  const href = a.getAttribute("href") || ""
  if (!isInternal(href)) return
  clearTimeout(timer)
  timer = window.setTimeout(() => prefetch(href), 80)
}

export default defineComponent({
  name: "LinkPrefetcher",
  setup() {
    if (import.meta.env.SSR) return () => null
    const connection = (navigator as any).connection
    const allowed = () => !connection?.saveData // 流量节省模式不预取
    onMounted(() => {
      if (!allowed()) return
      document.addEventListener("pointerover", onIntent, { passive: true })
      document.addEventListener("focusin", onIntent, { passive: true })
    })
    onUnmounted(() => {
      document.removeEventListener("pointerover", onIntent)
      document.removeEventListener("focusin", onIntent)
    })
    return () => null
  }
})
