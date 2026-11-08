// 阅读进度条：fixed 在页面顶边的 2px 品牌色细条，宽度随滚动比例伸缩。
// 不参与布局，路由切换后随 scroll 事件自然归零。
import { defineComponent, h, onBeforeUnmount, onMounted } from "vue"

export default defineComponent({
  name: "ReadingProgress",
  setup() {
    let barEl: HTMLElement | null = null
    let ticking = false

    function update() {
      ticking = false
      if (!barEl) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
      barEl.style.transform = `scaleX(${ratio})`
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    onMounted(() => {
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll, { passive: true })
      update()
    })
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    })

    return {
      setBar: (el: unknown) => {
        barEl = el as HTMLElement | null
      }
    }
  },
  render() {
    return h("div", {
      ref: this.setBar,
      class: "reading-progress",
      "aria-hidden": "true"
    })
  }
})
