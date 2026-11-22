import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
// 阅读字体：霞鹜文楷 Screen（unicode-range 切片按需加载，仅"文楷"模式拉取）
import "lxgw-wenkai-screen-webfont/lxgwwenkaiscreen.css"
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
import SidebarHoverReveal from "./components/SidebarHoverReveal"
import ViewTransitions from "./components/ViewTransitions"
import LinkPrefetcher from "./components/LinkPrefetcher"
import RelatedPosts from "./components/RelatedPosts.vue"
import Backlinks from "./components/Backlinks.vue"
import { initReaderPrefs } from "./reader-prefs"
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
        h(BackToTop),
        h(SidebarHoverReveal),
        h(ViewTransitions),
        h(LinkPrefetcher)
      ],
      // 侧边栏顶部：当前分类头（名称/篇数/总览）+ 文章筛选框
      "sidebar-nav-before": () => [h(SidebarCategoryTitle), h(SidebarFilter)],
      // 文章标题上方：面包屑 → 元信息（分类徽章/日期/字数/时长 + 内联阅读器设置）
      "doc-before": () => [h(Breadcrumbs), h(ArticleMeta)],
      // 文末：继续阅读 → 反向链接 → 评论
      "doc-after": () => [h(RelatedPosts), h(Backlinks), h(Comments)],
      "nav-bar-content-after": () => h(PagefindSearch)
    })
  },
  enhanceApp() {
    // 客户端尽早应用阅读器偏好，避免首屏闪默认样式
    if (typeof window !== "undefined") initReaderPrefs()
  }
} satisfies Theme
