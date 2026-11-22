// View Transition 增强（两件事）：
// 1. 暗色切换圆形扩散（覆盖默认主题的 toggle-appearance，从指针位置扩散）
// 2. 路由切换整体 crossfade（包装 router.go，让翻页不再"闪一下"）
// 均尊重系统"减弱动态效果"设置；不支持 View Transition API 的浏览器自动回退原行为
import { defineComponent, h, nextTick, onMounted, onUnmounted, provide } from "vue"
import { useData, useRouter } from "vitepress"

const VT_DARK_CLASS = "vt-appearance"

export default defineComponent({
  name: "ViewTransitions",
  setup() {
    const { isDark } = useData()
    const router = useRouter()

    if (import.meta.env.SSR) {
      provide("toggle-appearance", () => {
        isDark.value = !isDark.value
      })
      return () => null
    }

    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const canVT = () => "startViewTransition" in document && !reduced()

    // 默认主题的外观切换按钮不回传事件坐标，全局记录最近指针位置代替
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }

    onMounted(() => {
      window.addEventListener("mousemove", onMove, { passive: true })

      // 路由切换 crossfade：startViewTransition 等待 router.go 完成 DOM 更新后
      // 捕捉新状态做淡入淡出；同页 hash 跳转只滚动不触发过渡
      const originalGo = router.go.bind(router)
      router.go = async (href?: string) => {
        const target = (href ?? "").split("#")[0]
        const samePage = target === window.location.pathname + window.location.search
        if (!canVT() || samePage) return originalGo(href)
        const vt = (document as any).startViewTransition(async () => {
          await originalGo(href)
          await nextTick()
        })
        await (vt as any).updateCallbackDone
      }
    })

    onUnmounted(() => window.removeEventListener("mousemove", onMove))

    // 圆形扩散暗色切换（覆盖默认主题对 toggle-appearance 的注入）
    provide("toggle-appearance", async () => {
      if (!canVT()) {
        isDark.value = !isDark.value
        return
      }
      const { x, y } = pointer
      const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const root = document.documentElement
      root.classList.add(VT_DARK_CLASS)
      const transition = (document as any).startViewTransition(async () => {
        isDark.value = !isDark.value
        await nextTick()
      })
      transition.finished.finally(() => root.classList.remove(VT_DARK_CLASS))
      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
        // 暗色 = 新视图从指针处扩散展开；亮色 = 旧视图收缩回去
        root.animate(
          { clipPath: isDark.value ? clipPath : clipPath.slice().reverse() },
          {
            duration: 400,
            easing: "ease-in-out",
            pseudoElement: isDark.value ? "::view-transition-new(root)" : "::view-transition-old(root)"
          }
        )
      })
    })

    return () => null
  }
})
