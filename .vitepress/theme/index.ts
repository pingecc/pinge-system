import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import Comments from "./components/Comments.vue"
import ArticleMeta from "./components/ArticleMeta.vue"
import PagefindSearch from "./components/PagefindSearch.vue"
import Breadcrumbs from "./components/Breadcrumbs.vue"
import SidebarCategoryTitle from "./components/SidebarCategoryTitle.vue"
import SidebarActiveScroller from "./components/SidebarActiveScroller"
import OutlineFold from "./components/OutlineFold"
import ImageZoom from "./components/ImageZoom"
import MermaidRenderer from "./components/MermaidRenderer"
import ReadingProgress from "./components/ReadingProgress"
import BackToTop from "./components/BackToTop"
import SidebarFilter from "./components/SidebarFilter"
import "./custom.css"

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => [
        h(SidebarActiveScroller),
        h(OutlineFold),
        h(ImageZoom),
        h(MermaidRenderer),
        h(ReadingProgress),
        h(BackToTop)
      ],
      // 侧边栏顶部：当前分类头（名称/篇数/总览）+ 文章筛选框
      "sidebar-nav-before": () => [h(SidebarCategoryTitle), h(SidebarFilter)],
      // 文章标题上方：面包屑 → 元信息（分类徽章/日期/字数/时长）
      "doc-before": () => [h(Breadcrumbs), h(ArticleMeta)],
      "doc-after": () => h(Comments),
      "nav-bar-content-after": () => h(PagefindSearch)
    })
  }
} satisfies Theme
