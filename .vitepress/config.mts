import { defineConfig, type DefaultTheme } from "vitepress"
import fs from "node:fs"
import path from "node:path"
import obsidianLinks, { htmlSafety } from "./plugins/obsidian-links.mjs"
import fileNameHeading from "./plugins/file-name-heading.mjs"
import { navCategoryItems, sidebarGroups } from "./generated/site-data.mjs"

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
  markdown: {
    config: (md) => {
      md.use(obsidianLinks)
      md.use(htmlSafety)
      md.use(fileNameHeading)
    }
  },
  themeConfig: {
    nav: navItems(),
    sidebar: { "/": sidebarGroups },
    outline: "deep",
    search: {
      provider: "local",
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: false,
            combineWith: "AND"
          }
        }
      }
    },
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
  async buildEnd(siteConfig) {
    // GitHub Pages 需要 .nojekyll
    fs.writeFileSync(path.join(siteConfig.outDir, ".nojekyll"), "")
  }
})

function navItems(): DefaultTheme.NavItem[] {
  return [
    { text: "Home", link: "/" },
    { text: "Notes", items: navCategoryItems }
  ]
}
