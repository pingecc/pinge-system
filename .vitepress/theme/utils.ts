// 文章显示名 = 完整文件名（不含 .md，保留所在子目录），不使用文章内标题
export function articleFileName(url: string, category: string): string {
  const segments = url.split("/").filter(Boolean)
  // 去掉顶级主题目录；"其他"为合并分类，不存在顶级目录，保留真实子目录
  if (category !== "其他") segments.shift()
  return segments.join("/")
}

// 分类入口：点击分类（首页卡片 / 顶部导航 tab）直接进入其首篇文章
// （自然序 = 阅读顺序），跳过分类列表页；列表页仅由面包屑/分类徽章进入
export function categoryEntryUrl(cat: { link: string; articles: { url: string }[] }): string {
  return cat.articles[0]?.url ?? cat.link
}

// 分类 → 徽章类名（custom.css 里定义了 --cat-<slug>-bg / -text 两套配色）
const CATEGORY_SLUGS: Record<string, string> = {
  前端: "front",
  Java: "java",
  Python: "python",
  系统架构: "arch",
  English: "english",
  AI全栈应用: "ai",
  其他: "other"
}

export function categorySlug(label: string): string {
  return CATEGORY_SLUGS[label] ?? "other"
}

// 统一日期格式（手动补零，不用 toLocaleString，避免 SSR/客户端 locale 差异导致水合不匹配）
export function formatDate(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
}
