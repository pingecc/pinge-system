// 回到顶部浮动按钮：滚动超过一屏高度后淡入，点击平滑回顶。
// 与 ReadingProgress 一样走闭包 + 直接 DOM 操作，不引入响应式开销。
import { defineComponent, h, onBeforeUnmount, onMounted } from "vue"

export default defineComponent({
  name: "BackToTop",
  setup() {
    let btnEl: HTMLElement | null = null
    let visible = false

    function update() {
      const show = window.scrollY > window.innerHeight * 0.8
      if (show === visible) return
      visible = show
      btnEl?.classList.toggle("is-visible", show)
    }

    function onScroll() {
      requestAnimationFrame(update)
    }

    function onClick() {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    onMounted(() => {
      window.addEventListener("scroll", onScroll, { passive: true })
      update()
    })
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", onScroll)
    })

    return {
      setBtn: (el: unknown) => {
        btnEl = el as HTMLElement | null
      },
      onClick
    }
  },
  render() {
    return h(
      "button",
      {
        ref: this.setBtn,
        class: "back-to-top",
        type: "button",
        "aria-label": "回到顶部",
        title: "回到顶部",
        onClick: this.onClick
      },
      [
        h("svg", {
          width: 18,
          height: 18,
          viewBox: "0 0 24 24",
          fill: "none",
          innerHTML:
            '<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
        })
      ]
    )
  }
})
