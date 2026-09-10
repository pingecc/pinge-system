import { defineComponent, onMounted, watch } from "vue"
import { useRoute } from "vitepress"

// 无可见内容：负责将侧边栏滚动到当前激活的目录项。
// 必须渲染 null 而不是注释模板——注释模板在 SSR 输出为空、客户端却产生注释节点，
// 会导致水合(hydration)不匹配，Vue 回退为全量重渲染，破坏静态节点。
export default defineComponent({
  name: "SidebarActiveScroller",
  setup() {
    const route = useRoute()

    function scrollToActiveItem() {
      // 等侧边栏渲染完成（含可折叠分组展开），最多重试 20 次
      let attempts = 0
      const tryScroll = () => {
        const items = document.querySelectorAll(".VPSidebar .VPSidebarItem.is-active")
        const active = items[items.length - 1]
        const sidebarEl = document.querySelector<HTMLElement>(".VPSidebar")

        if (
          !active ||
          !sidebarEl ||
          (!sidebarEl.classList.contains("open") && window.innerWidth < 960)
        ) {
          if (attempts < 20) {
            attempts += 1
            window.setTimeout(tryScroll, 50)
          }
          return
        }

        const sidebarRect = sidebarEl.getBoundingClientRect()
        const itemRect = active.getBoundingClientRect()
        const itemTop = itemRect.top - sidebarRect.top + sidebarEl.scrollTop
        const targetTop = itemTop - sidebarEl.clientHeight / 2 + active.offsetHeight / 2

        sidebarEl.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth"
        })
      }
      tryScroll()
    }

    onMounted(scrollToActiveItem)
    watch(() => route.path, scrollToActiveItem)

    return () => null
  }
})
