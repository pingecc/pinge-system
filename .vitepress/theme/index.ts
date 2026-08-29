import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import Comments from "./components/Comments.vue"
import SidebarActiveScroller from "./components/SidebarActiveScroller.vue"
import "./custom.css"

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => h(SidebarActiveScroller),
      "doc-after": () => h(Comments)
    })
  }
} satisfies Theme
