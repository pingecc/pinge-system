import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from "vue"
import { useRoute } from "vitepress"
import mediumZoom from "medium-zoom"

// 无可见内容：给正文图片绑定点击放大（medium-zoom），路由切换后重新绑定。
// 渲染约定同 SidebarActiveScroller——必须渲染 null 避免水合不匹配。
export default defineComponent({
  name: "ImageZoom",
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null

    function attach() {
      if (!zoom) {
        zoom = mediumZoom({ background: "rgba(0, 0, 0, 0.75)", margin: 24 })
      }
      zoom.detach()
      const imgs = Array.from(document.querySelectorAll<HTMLElement>(".vp-doc img")).filter(
        (img) => !img.closest("a") && !img.classList.contains("no-zoom")
      )
      if (imgs.length) zoom.attach(imgs)
    }

    onMounted(attach)
    watch(() => route.path, () => nextTick(attach))
    onBeforeUnmount(() => zoom?.detach())

    return () => null
  }
})
