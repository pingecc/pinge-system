import { defineConfig, type DefaultTheme } from "vitepress"
import fs from "node:fs"
import path from "node:path"
import obsidianLinks, { htmlSafety } from "./plugins/obsidian-links.mjs"
import fileNameHeading from "./plugins/file-name-heading.mjs"
import { navCategories, categoryDirs, categorySidebarMap } from "./generated/site-data.mjs"
import { descriptions } from "./generated/descriptions.mjs"
import { categoryEntryUrl } from "./theme/utils"

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
      // 另支持 title="..." 标注文件名：剥离后交给默认渲染保持 Shiki 高亮不变
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim()
        if (info === "mermaid") {
          return (
            '<div class="mermaid-block">' +
            `<pre class="mermaid-src">${md.utils.escapeHtml(token.content.trim())}</pre>` +
            '<div class="mermaid-target"></div></div>'
          )
        }
        const titled = info.match(/^(.*?)\s+title="([^"]+)"\s*$/)
        if (titled) {
          const original = token.info
          token.info = titled[1]
          let inner = ""
          try {
            inner = defaultFence(tokens, idx, options, env, self)
          } finally {
            token.info = original
          }
          return (
            '<div class="code-block-titled">' +
            `<div class="code-title"><span class="code-title-icon" aria-hidden="true"></span>${md.utils.escapeHtml(titled[2])}</div>` +
            inner +
            "</div>"
          )
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    }
  },
  themeConfig: {
    nav: navItems(),
    sidebar: sidebarConfig(),
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
    { text: "首页", link: "/", activeMatch: "^/$" },
    // 分类平铺为 tab（react.dev 式）：点击直达该分类首篇文章（进入内容区），
    // 浏览该分类文章时保持高亮；分类列表页仅由面包屑/分类徽章进入
    ...navCategories.map((c) => ({
      text: c.label,
      link: categoryEntryUrl(c),
      activeMatch: categoryActiveMatch(c.label)
    }))
  ]
}

const OTHER_LABEL = "其他"

function rx(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// activeMatch 同时命中「文章目录前缀」与「/categories/<分类>」两种路径；
// route.path 里中文可能出现 encode 形态，原文与 encodeURIComponent 各配一份
function categoryActiveMatch(label: string): string {
  const dirs = categoryDirs[label] ?? [label]
  const nameAlts = [label, encodeURIComponent(label)].map(rx)
  const dirAlts = [...new Set(dirs.flatMap((d) => [d, encodeURIComponent(d)]))].map(rx)
  const catPage = `categories/(?:${nameAlts.join("|")})`
  const articlePrefix = `(?:(?:${dirAlts.join("|")})/)`
  return `^/(?:${catPage}|${articlePrefix})`
}

// 侧边栏按分类切分：进入某分类后只显示该分类的文章树（react.dev 式分域导航）；
// 分类落地页 frontmatter 已设 sidebar: false，无需为 /categories/ 配置
function sidebarConfig(): DefaultTheme.SidebarMulti {
  const map: DefaultTheme.SidebarMulti = { "/": [] }
  for (const c of navCategories) {
    for (const dir of categoryDirs[c.label] ?? [c.label]) {
      map[`/${dir}/`] = categorySidebarMap[c.label] ?? []
    }
  }
  return map
}
