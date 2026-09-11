import { defineConfig, type DefaultTheme } from "vitepress"
import fs from "node:fs"
import path from "node:path"
import obsidianLinks, { htmlSafety } from "./plugins/obsidian-links.mjs"
import fileNameHeading from "./plugins/file-name-heading.mjs"
import { navCategoryItems, sidebarGroups } from "./generated/site-data.mjs"
import { descriptions } from "./generated/descriptions.mjs"

// 站点对外地址（sitemap / og:url 用），必须带 base 路径和结尾斜杠
const SITE_URL = "https://pingecc.github.io/pinge-system/"

// 不参与正文页面生成的目录/文件（buildEnd 复制 .md 时会同步跳过）
const EXCLUDE_GLOBS = [
  "README.md",
  "MIGRATION.md",
  ".site-build/**",
  "**/zmg/**",
  "**/.obsidian/**",
  "node_modules/**",
  "**/未命名*",
  "**/草稿.md",
  "**/模板.md",
  "**/READEME.md",
  "**/AI 测试.md",
  "**/*.excalidraw.md"
]

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  const re = escaped
    .replace(/\*\*/g, "__GLOB_DOUBLE__")
    .replace(/\*/g, "[^/]*")
    .replace(/__GLOB_DOUBLE__/g, ".*")
  return new RegExp("^" + re + "$")
}

export default defineConfig({
  title: "Pinge's Blog",
  description: "个人学习笔记知识库",
  lang: "zh-CN",
  base: "/pinge-system/",
  lastUpdated: true,
  ignoreDeadLinks: true,
  srcExclude: EXCLUDE_GLOBS,
  sitemap: { hostname: SITE_URL },
  markdown: {
    config: (md) => {
      md.use(obsidianLinks)
      md.use(htmlSafety)
      md.use(fileNameHeading)
      // mermaid 代码块：SSR 输出隐藏源码，客户端由 MermaidRenderer 渲染成 SVG
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === "mermaid") {
          return (
            '<div class="mermaid-block">' +
            `<pre class="mermaid-src">${md.utils.escapeHtml(token.content.trim())}</pre>` +
            '<div class="mermaid-target"></div></div>'
          )
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    }
  },
  themeConfig: {
    nav: navItems(),
    sidebar: { "/": sidebarGroups },
    outline: { level: [1, 6], label: "本页目录" },
    // Pagefind 索引只在 npm run build 后生成，开发模式仍用内置本地搜索
    search: isDev()
      ? {
          provider: "local",
          options: {
            miniSearch: {
              searchOptions: {
                fuzzy: false,
                combineWith: "AND"
              }
            }
          }
        }
      : undefined,
    socialLinks: [{ icon: "github", link: "https://github.com/pingecc/pinge-system" }],
    lastUpdated: { text: "最后更新", formatOptions: { dateStyle: "short", timeStyle: "short" } },
    docFooter: { prev: "上一篇", next: "下一篇" },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    langMenuLabel: "切换语言"
  },
  vite: {
    server: {
      allowedHosts: true
    }
  },
  // 每页注入 SEO 摘要与 OG/Twitter 卡片标签（构建与开发时都会执行）
  transformPageData(pageData) {
    const desc = descriptions[pageData.relativePath]
    if (!desc) return
    pageData.description = desc
    const url = SITE_URL + pageData.relativePath.replace(/\.md$/, ".html")
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ["meta", { property: "og:title", content: pageData.title }],
      ["meta", { property: "og:description", content: desc }],
      ["meta", { property: "og:type", content: "article" }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:site_name", content: "Pinge's Blog" }],
      ["meta", { property: "og:locale", content: "zh_CN" }],
      ["meta", { name: "twitter:card", content: "summary" }],
      ["meta", { name: "twitter:title", content: pageData.title }],
      ["meta", { name: "twitter:description", content: desc }]
    )
  },
  // 限定 Pagefind 只索引正文区域（<main class="main">），排除导航/侧边栏噪音；
  // 没有该标记的页面（首页、404）不参与索引
  transformHtml(html) {
    return html.replace('<main class="main"', '<main data-pagefind-body class="main"')
  },
  async buildEnd(siteConfig) {
    // GitHub Pages 需要 .nojekyll
    fs.writeFileSync(path.join(siteConfig.outDir, ".nojekyll"), "")
    fs.writeFileSync(
      path.join(siteConfig.outDir, "robots.txt"),
      `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`
    )
  }
})

function isDev() {
  // vitepress build 会强制 NODE_ENV=production，dev 下为 development/未设置
  return process.env.NODE_ENV !== "production"
}


function navItems(): DefaultTheme.NavItem[] {
  return [
    { text: "Home", link: "/" },
    { text: "Notes", items: navCategoryItems }
  ]
}
