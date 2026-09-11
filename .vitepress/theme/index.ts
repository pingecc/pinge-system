import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import Comments from "./components/Comments.vue"
import ArticleMeta from "./components/ArticleMeta.vue"
import PagefindSearch from "./components/PagefindSearch.vue"
import SidebarActiveScroller from "./components/SidebarActiveScroller"
import OutlineFold from "./components/OutlineFold"
import ImageZoom from "./components/ImageZoom"
import MermaidRenderer from "./components/MermaidRenderer"
import "./custom.css"

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => [
        h(SidebarActiveScroller),
        h(OutlineFold),
        h(ImageZoom),
        h(MermaidRenderer)
      ],
      "doc-before": () => h(ArticleMeta),
      "doc-after": () => h(Comments),
      "nav-bar-content-after": () => h(PagefindSearch)
    })
  }
} satisfies Theme
