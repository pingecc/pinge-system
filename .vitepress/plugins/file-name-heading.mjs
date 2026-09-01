// 保证文档页首个 H1 存在且位于内容最前，与侧边栏"按文件名递归展示"保持一致：
// - 页面已有首个 H1 时：保留原标题内容（它可能是"第 1 层：…"这类真实标题，
//   直接替换成文件名会把标题吞掉，右侧目录也会丢失该一级标题），仅把它挪到最前；
// - 页面没有 H1 时：在开头注入 "# 文件名"。
// home/page 等自定义布局跳过
import path from "node:path"

export default function fileNameHeading(md) {
  md.core.ruler.push("file-name-heading", (state) => {
    const layout = state.env?.frontmatter?.layout
    if (layout && layout !== "doc") return
    const rel = state.env?.relativePath
    if (!rel) return

    let h1 = -1
    for (let i = 0; i < state.tokens.length; i++) {
      if (state.tokens[i].type === "heading_open" && state.tokens[i].tag === "h1") {
        h1 = i
        break
      }
    }

    if (h1 >= 0) {
      // 已存在首个 H1：不改动内容，只保证位于最前
      const close = state.tokens[h1 + 2]
      if (h1 !== 0 && close && close.type === "heading_close") {
        const trio = state.tokens.splice(h1, 3)
        state.tokens.unshift(...trio)
      }
    } else {
      const name = path.basename(rel, path.extname(rel))
      const open = new state.Token("heading_open", "h1", 1)
      const inline = new state.Token("inline", "", 0)
      const text = new state.Token("text", "", 0)
      text.content = name
      inline.content = name
      inline.children = [text]
      const close = new state.Token("heading_close", "h1", -1)
      state.tokens.unshift(open, inline, close)
    }
  })
}
