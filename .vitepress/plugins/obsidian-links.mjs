// 渲染期把 Obsidian 双链 [[目标]] / ![[图片]] 转换为标准链接/图片（移植自旧 build.py 逻辑）
import { mdIndex, imgIndex } from "../generated/site-data.mjs"
import path from "node:path"
import { existsSync as fsExistsSync } from "node:fs"

const WIKI_RE = /!?\[\[([^\[\]]+)\]\]/g

function collectHit(index, target) {
  let hits = index[target] || []
  if (!hits.length) {
    const dot = target.lastIndexOf(".")
    const alt = dot > 0 ? target.slice(0, dot) : ""
    if (alt && alt !== target) hits = index[alt] || []
  }
  if (!hits.length && target.includes("/")) {
    const suffix = "/" + target
    hits = Object.values(index).flat().filter((rel) => rel.endsWith(suffix))
  }
  return hits
}

function pick(hits, parentDir) {
  if (!hits.length) return null
  const sameDir = hits.filter((h) => h.slice(0, h.lastIndexOf("/")) === parentDir)
  if (sameDir.length === 1) return sameDir[0]
  if (hits.length === 1) return hits[0]
  return hits.reduce((a, b) => (a.split("/").length <= b.split("/").length ? a : b))
}

function resolve(target, parentDir) {
  const bestMd = pick(collectHit(mdIndex, target), parentDir)
  const bestImg = pick(collectHit(imgIndex, target), parentDir)
  if (!bestMd && !bestImg) return null
  if (bestMd && bestImg) {
    if (bestMd === bestImg) return { type: "md", rel: bestMd }
    return bestMd.split("/").length <= bestImg.split("/").length
      ? { type: "md", rel: bestMd }
      : { type: "image", rel: bestImg }
  }
  return bestMd ? { type: "md", rel: bestMd } : { type: "image", rel: bestImg }
}

function hrefFor(rel) {
  return "/" + rel.replace(/\.md$/, "")
}

function srcFor(rel, parentDir) {
  const r = path.posix.relative(parentDir || ".", rel)
  return r.split("/").map((s) => s.replace(/ /g, "%20")).join("/")
}

function textToken(state, content) {
  const t = new state.Token("text", "", 0)
  t.content = content
  return t
}

function currentDirOf(env) {
  const rel = env?.relativePath || env?.page?.relativePath || ""
  const clean = rel.split("#")[0]
  const i = clean.lastIndexOf("/")
  return i > 0 ? clean.slice(0, i) : ""
}

function fileExists(rel) {
  try {
    return fsExistsSync(rel)
  } catch {
    return false
  }
}

function appendTokens(content, out, parentDir, state) {
  let last = 0
  WIKI_RE.lastIndex = 0
  let m
  while ((m = WIKI_RE.exec(content))) {
    if (m.index > last) out.push(textToken(state, content.slice(last, m.index)))
    const embed = m[0].startsWith("!")
    const inner = m[1]
    const sep = inner.indexOf("|")
    const targetRaw = (sep >= 0 ? inner.slice(0, sep) : inner).trim()
    const alias = sep >= 0 ? inner.slice(sep + 1).trim() : ""
    const resolved = resolve(targetRaw, parentDir)
    if (!resolved) {
      out.push(textToken(state, m[0]))
    } else if (resolved.type === "md") {
      const label = alias || targetRaw.split("#")[0].trim() || path.basename(resolved.rel, ".md")
      const open = new state.Token("link_open", "a", 1)
      open.attrSet("href", hrefFor(resolved.rel))
      open.attrSet("class", "internal-link")
      const close = new state.Token("link_close", "a", -1)
      out.push(open, textToken(state, label), close)
    } else {
      const img = new state.Token("image", "img", 0)
      img.attrSet("src", srcFor(resolved.rel, parentDir))
      img.attrSet("alt", alias || targetRaw)
      img.children = []
      out.push(img)
    }
    last = m.index + m[0].length
  }
  if (last < content.length) out.push(textToken(state, content.slice(last)))
}

export default function obsidianLinks(md) {
  md.core.ruler.after("inline", "obsidian_links", (state) => {
    const parentDir = currentDirOf(state.env)
    for (const token of state.tokens) {
      if (token.type !== "inline" || !token.children) continue
      const out = []
      let changed = false
      for (const child of token.children) {
        if (child.type === "text" && child.content.includes("[[")) {
          appendTokens(child.content, out, parentDir, state)
          changed = true
        } else {
          out.push(child)
        }
      }
      if (changed) token.children = out
    }
  })
  // 标准图片引用兜底：相对路径指向的文件不存在时，按文件名在 imgIndex 里找可用图；
  // 找不到则转成文字占位，避免 Vite 打包资源时直接报错。
  md.core.ruler.after("inline", "image_fallback", (state) => {
    const parentDir = currentDirOf(state.env)
    for (const token of state.tokens) {
      if (token.type !== "inline" || !token.children) continue
      const out = []
      let changed = false
      for (const child of token.children) {
        if (child.type !== "image") {
          out.push(child)
          continue
        }
        const src = child.attrGet("src") || ""
        if (/^(https?:|data:|\/)/.test(src) || fileExists(parentDir ? `${parentDir}/${src}` : src)) {
          out.push(child)
          continue
        }
        const stem = path.basename(src).replace(/\.[^.]+$/, "")
        const hits = collectHit(imgIndex, stem)
        const best = pick(hits, parentDir)
        if (best) {
          child.attrSet("src", srcFor(best, parentDir))
          out.push(child)
        } else {
          out.push(textToken(state, `（图片缺失: ${src}）`))
        }
        changed = true
      }
      if (changed) token.children = out
    }
  })
}

// 把"未配对的 HTML 开放标签"（如 <commit-A>、<html>…<body> 示例）转义为纯文本，
// 避免 Vue 模板编译报 "Element is missing end tag"；配对完整的 HTML 示例保持原样。
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr"
])
const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^<>]*?)?\/?>/g
const SINGLE_TAG_RE = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^<>]*?)?\/?>$/

function scanTags(content) {
  const stack = []
  TAG_RE.lastIndex = 0
  let m
  while ((m = TAG_RE.exec(content))) {
    const raw = m[0]
    const name = m[1].toLowerCase()
    const closing = raw.startsWith("</")
    const selfClosing = /\/>$/.test(raw)
    if (closing) {
      if (stack.pop() !== name) return null
    } else if (!selfClosing && !VOID_TAGS.has(name)) {
      stack.push(name)
    }
  }
  return stack
}

function isEscapeWorthy(content) {
  const t = content.trim()
  if (!t.startsWith("<") || t.startsWith("<!--")) return false
  const m = t.match(SINGLE_TAG_RE)
  if (!m) return false
  const name = m[1].toLowerCase()
  return !/\/>$/.test(t) && !VOID_TAGS.has(name)
}

function neutralizeUnbalancedHtml(state) {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === "html_block") {
      const stack = scanTags(token.content)
      if (stack === null || stack.length > 0) {
        const text = new state.Token("text", "", 0)
        text.content = token.content
        tokens[i] = text
      }
      continue
    }
    if (token.type !== "inline" || !token.children) continue
    // 行内：整段配对则保留，否则把孤立的开放/闭合标签都转义成文本
    const inlineStack = []
    let inlineOk = true
    for (const child of token.children) {
      if (child.type !== "html_inline") continue
      const partial = scanTags(child.content)
      if (partial === null) {
        inlineOk = false
        break
      }
      inlineStack.push(...partial)
    }
    if (inlineOk && inlineStack.length === 0) continue
    const out = []
    let changed = false
    for (const child of token.children) {
      if (child.type === "html_inline" && isEscapeWorthy(child.content)) {
        out.push(textToken(state, child.content))
        changed = true
      } else {
        out.push(child)
      }
    }
    if (changed) token.children = out
  }
}

export function htmlSafety(md) {
  md.core.ruler.after("inline", "html_safety", neutralizeUnbalancedHtml)
}
