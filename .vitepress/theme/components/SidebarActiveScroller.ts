import { defineComponent, onMounted, watch } from "vue"
import { useData } from "vitepress"

// 无可见内容：路由切换后把侧边栏滚动到当前激活的目录项。
// 必须渲染 null 而不是注释模板——注释模板在 SSR 输出为空、客户端却产生注释节点，
// 会导致水合(hydration)不匹配，Vue 回退为全量重渲染，破坏静态节点。
export default defineComponent({
  name: "SidebarActiveScroller",
  setup() {
    // 注意：触发源必须用 page.relativePath（页面数据），不能用 route.path。
    // 点击目录后 route.path 立即变化，而页面数据是异步到达的，侧边栏的
    // is-active 类要等数据落地才更新——按 route.path 触发会读到上一页的
    // 激活项，把列表滑向旧位置（表现为点击目录项后列表跳向别处）。
    // page.relativePath 与侧边栏激活类同源同拍，watch flush:"post" 时 DOM 必然已更新。
    const { page } = useData()

    function scrollToActiveItem() {
      // 等侧边栏渲染完成（首次加载时激活类要等侧边栏挂载后才出现），最多重试 10 秒
      let attempts = 0
      const tryScroll = () => {
        const items = document.querySelectorAll<HTMLElement>(
          ".VPSidebar .VPSidebarItem.is-active"
        )
        const active = items[items.length - 1]
        const sidebarEl = document.querySelector<HTMLElement>(".VPSidebar")
        // 量几何要用整行（.item），激活项是分组时外层容器高度含全部子项，
        // 按外层量会算出错误的居中位置
        const row = active?.querySelector<HTMLElement>(":scope > .item") ?? active

        if (
          !row ||
          !sidebarEl ||
          row.getBoundingClientRect().height === 0 || // 分组尚未展开，位置无意义
          (!sidebarEl.classList.contains("open") && window.innerWidth < 960)
        ) {
          if (attempts < 100) {
            attempts += 1
            window.setTimeout(tryScroll, 100)
          }
          return
        }

        // 激活项已经完整可见时不要动侧边栏，否则点击目录后列表会“自己滑走”
        const rowRect = row.getBoundingClientRect()
        const sidebarRect = sidebarEl.getBoundingClientRect()
        const margin = 8
        if (
          rowRect.top >= sidebarRect.top + margin &&
          rowRect.bottom <= sidebarRect.bottom - margin
        ) {
          return
        }

        const rowTop = rowRect.top - sidebarRect.top + sidebarEl.scrollTop
        const targetTop = rowTop - sidebarEl.clientHeight / 2 + row.offsetHeight / 2

        sidebarEl.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth"
        })
      }
      tryScroll()
    }

    onMounted(scrollToActiveItem)
    watch(
      () => page.value.relativePath,
      () => {
        // 略等一拍：激活项所在折叠分组的展开（watchPostEffect）在下一拍渲染
        window.setTimeout(scrollToActiveItem, 60)
      },
      { flush: "post" }
    )

    return () => null
  }
})
