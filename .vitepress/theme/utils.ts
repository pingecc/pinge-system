// 文章显示名 = 完整文件名（不含 .md，保留所在子目录），不使用文章内标题
export function articleFileName(url: string, category: string): string {
  const segments = url.split("/").filter(Boolean)
  // 去掉顶级主题目录；"其他"为合并分类，不存在顶级目录，保留真实子目录
  if (category !== "其他") segments.shift()
  return segments.join("/")
}
