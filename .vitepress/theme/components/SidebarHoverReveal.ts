// 悬停弹出侧边栏（桌面端文章页）：
// 默认把 .VPSidebar 平移出屏幕，正文整页居中（CSS 见 custom.css 第 8 节）；
// 本组件只负责「状态」——渲染一条贴左缘的隐形热区，
// 指针进入热区或侧边栏本体时挂 sidebar-revealed，离开后延迟收起，
// 避免斜穿侧栏边缘时的来回抖动。Esc 立即收起。
// CSS 侧用 html:has(.VPSidebar) 判定启用，移动端抽屉与窄屏不受影响。
import { defineComponent, h, onBeforeUnmount, onMounted } from "vue"

const HIDE_DELAY = 280

export default defineComponent({
  name: "SidebarHoverReveal",
  setup() {
    let hideTimer: number | undefined

    function reveal() {
      if (hideTimer !== undefined) {
        clearTimeout(hideTimer)
        hideTimer = undefined
      }
      document.documentElement.classList.add("sidebar-revealed")
    }

    function scheduleHide(immediate = false) {
      const root = document.documentElement
      if (!root.classList.contains("sidebar-revealed")) return
      if (hideTimer !== undefined) clearTimeout(hideTimer)
      if (immediate) {
        root.classList.remove("sidebar-revealed")
        return
      }
      hideTimer = window.setTimeout(() => {
        hideTimer = undefined
        root.classList.remove("sidebar-revealed")
      }, HIDE_DELAY)
    }

    // mouseover 冒泡到 document 做委托：目标落在侧栏或热区内即视为悬停。
    // 侧栏随路由重渲染也不用重新绑事件。
    function onPointerOver(e: MouseEvent) {
      const target = e.target as Element | null
      if (!target || typeof target.closest !== "function") return
      const over = !!target.closest(".VPSidebar, .sidebar-hover-zone")
      over ? reveal() : scheduleHide()
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") scheduleHide(true)
    }

    onMounted(() => {
      document.addEventListener("pointerover", onPointerOver, true)
      window.addEventListener("keydown", onKeydown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener("pointerover", onPointerOver, true)
      window.removeEventListener("keydown", onKeydown)
      if (hideTimer !== undefined) clearTimeout(hideTimer)
      document.documentElement.classList.remove("sidebar-revealed")
    })

    return () => h("div", { class: "sidebar-hover-zone", "aria-hidden": "true" })
  }
})
