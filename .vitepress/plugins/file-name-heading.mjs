// 文档页首个 H1 使用文件名（与侧边栏"按文件名递归展示"保持一致）
// 并把该 H1 放到内容最前面（无 H1 时在开头注入 "# 文件名"）
// home/page 等自定义布局跳过
import path from "node:path"

export default function fileNameHeading(md) {
  md.core.ruler.push("file-name-heading", (state) => {
    const layout = state.env?.frontmatter?.layout
    if (layout && layout !== "doc") return
    const rel = state.env?.relativePath
    if (!rel) return
    const name = path.basename(rel, path.extname(rel))

    let h1 = -1
    for (let i = 0; i < state.tokens.length; i++) {
      if (state.tokens[i].type === "heading_open" && state.tokens[i].tag === "h1") {
        h1 = i
        break
      }
    }

    if (h1 >= 0) {
      const inline = state.tokens[h1 + 1]
      if (inline && inline.type === "inline") {
        const text = new state.Token("text", "", 0)
        text.content = name
        inline.children = [text]
        inline.content = name
      }
      const close = state.tokens[h1 + 2]
      if (h1 !== 0 && close && close.type === "heading_close") {
        const trio = state.tokens.splice(h1, 3)
        state.tokens.unshift(...trio)
      }
    } else {
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
