#!/usr/bin/env node
// 扫描主题目录，生成 .vitepress/generated/site-data.mjs（构建/开发前自动运行）
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = path.resolve(process.cwd())
const OUT_DIR = path.join(ROOT, ".vitepress", "generated")
const OUT_FILE = path.join(OUT_DIR, "site-data.mjs")

// 主题分类顺序（小目录并入"其他"）
const THEME_ORDER = ["前端", "Java", "Python", "系统架构", "English", "AI全栈应用"]
const OTHER_CATEGORY = "其他"
const SMALL_DIRS = ["服务器", "考证", "编程模型", "源码系列", "工具资源"]

// 排除规则（与旧 build.py 保持一致）
const EXCLUDE_FILE_PREFIXES = ["未命名"]
const EXCLUDE_FILE_NAMES = new Set(["草稿.md", "模板.md", "READEME.md", "AI 测试.md"])
const EXCLUDE_FILE_SUFFIXES = [".excalidraw.md"]
const EXCLUDE_DIR_NAMES = new Set([".obsidian", "zmg", ".DS_Store"])

const MD_EXT = ".md"
const IMG_EXTS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico", ".tiff", ".avif"
])

function naturalKey(name) {
  return name.split(/(\d+)/).filter(Boolean).map((t) => (t.match(/^\d+$/) ? parseInt(t, 10) : t))
}

function naturalCompare(a, b) {
  const ka = naturalKey(a)
  const kb = naturalKey(b)
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    const x = ka[i]
    const y = kb[i]
    if (x === undefined) return -1
    if (y === undefined) return 1
    if (x < y) return -1
    if (x > y) return 1
  }
  return 0
}

function isExcludedFile(name) {
  if (EXCLUDE_FILE_PREFIXES.some((p) => name.startsWith(p))) return true
  if (EXCLUDE_FILE_NAMES.has(name)) return true
  if (EXCLUDE_FILE_SUFFIXES.some((s) => name.endsWith(s))) return true
  return false
}

function walkFiles(dirAbs, posixRel, out, includeImages, includeZmgMd) {
  let entries
  try {
    entries = fs.readdirSync(dirAbs, { withFileTypes: true })
  } catch {
    return
  }
  entries.sort((a, b) => naturalCompare(a.name, b.name))
  for (const e of entries) {
    if (e.name === ".obsidian" || e.name === ".DS_Store") continue
    if (e.name === "zmg" && !includeImages) continue
    const abs = path.join(dirAbs, e.name)
    const rel = posixRel ? `${posixRel}/${e.name}` : e.name
    if (e.isDirectory()) {
      walkFiles(abs, rel, out, includeImages, includeZmgMd)
    } else if (e.name.endsWith(MD_EXT)) {
      if (isExcludedFile(e.name)) continue
      if (posixRel && posixRel.includes("/zmg") && !includeZmgMd) continue
      out.push(rel)
    } else if (includeImages && IMG_EXTS.has(path.extname(e.name).toLowerCase())) {
      out.push(rel)
    }
  }
}

function categoryOf(topDir) {
  return SMALL_DIRS.includes(topDir) ? OTHER_CATEGORY : topDir
}

// git 历史时间戳（创建/修改时间），失败回退文件 mtime
function getGitTimestamps() {
  const map = new Map()
  try {
    const out = execSync(
      'git log --format="%at %H" --name-only --diff-filter=ACMR',
      { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 }
    )
    let current = null
    for (const line of out.split("\n")) {
      if (!line.trim()) continue
      const m = line.match(/^(\d+)\s+[a-f0-9]+$/)
      if (m) {
        current = parseInt(m[1], 10) * 1000
      } else if (current !== null) {
        const abs = path.join(ROOT, line)
        if (!map.has(abs)) {
          map.set(abs, { modified: current, created: current })
        } else {
          map.get(abs).created = current
        }
      }
    }
  } catch {
    // 非 git 环境时回退 mtime
  }
  return map
}

function extractTitle(rel) {
  const abs = path.join(ROOT, rel)
  let content = ""
  try {
    content = fs.readFileSync(abs, "utf8")
  } catch {
    return path.basename(rel, MD_EXT)
  }
  let body = content
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fm) {
    const m = fm[1].match(/^title:\s*(.+)$/m)
    if (m) return m[1].trim().replace(/^["']|["']$/g, "")
    body = content.slice(fm[0].length)
  }
  const h1 = body.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return path.basename(rel, MD_EXT).replace(/\.excalidraw$/, "")
}

// 收集所有主题 md
const allThemeDirs = [...THEME_ORDER, ...SMALL_DIRS]
const allMds = []
for (const d of allThemeDirs) {
  walkFiles(path.join(ROOT, d), d, allMds, false, false)
}

// 标题 & 时间戳
const titles = new Map()
const timestamps = getGitTimestamps()
const articles = []
for (const rel of allMds) {
  const abs = path.join(ROOT, rel)
  const title = extractTitle(rel)
  titles.set(rel, title)
  const ts = timestamps.get(abs) || (() => {
    const st = fs.statSync(abs)
    return { created: st.mtimeMs, modified: st.mtimeMs }
  })()
  const topDir = rel.split("/")[0]
  articles.push({
    title,
    url: "/" + rel.slice(0, -MD_EXT.length),
    category: categoryOf(topDir),
    created: ts.created,
    modified: ts.modified
  })
}
articles.sort((a, b) => naturalCompare(a.url, b.url))

// 分类（含"其他"合并）
const categoryMap = new Map()
for (const art of articles) {
  if (!categoryMap.has(art.category)) categoryMap.set(art.category, [])
  categoryMap.get(art.category).push(art)
}
const categoryOrder = [...THEME_ORDER.filter((d) => categoryMap.has(d))]
if (categoryMap.has(OTHER_CATEGORY)) categoryOrder.push(OTHER_CATEGORY)

const navCategories = categoryOrder.map((label) => ({
  label,
  link: `/categories/${encodeURI(label)}`,
  count: categoryMap.get(label).length,
  articles: categoryMap.get(label).map((a) => ({ title: a.title, url: a.url, created: a.created, modified: a.modified }))
}))

// 侧边栏：按现有目录层级递归生成
function treeItems(dirAbs, posixRel) {
  let entries
  try {
    entries = fs.readdirSync(dirAbs, { withFileTypes: true })
  } catch {
    return []
  }
  const filtered = entries.filter(
    (e) =>
      !EXCLUDE_DIR_NAMES.has(e.name) &&
      (e.isDirectory() || (e.name.endsWith(MD_EXT) && !isExcludedFile(e.name)))
  )
  filtered.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
    return naturalCompare(a.name, b.name)
  })
  const items = []
  for (const e of filtered) {
    const abs = path.join(dirAbs, e.name)
    const rel = `${posixRel}/${e.name}`
    if (e.isDirectory()) {
      const children = treeItems(abs, rel)
      if (children.length) items.push({ text: e.name, collapsed: false, items: children })
    } else {
      items.push({ text: path.basename(e.name, MD_EXT), link: "/" + rel.slice(0, -MD_EXT.length) })
    }
  }
  return items
}

const sidebarGroups = []
for (const label of categoryOrder) {
  if (label === OTHER_CATEGORY) {
    const items = []
    for (const topDir of SMALL_DIRS) {
      if (!fs.existsSync(path.join(ROOT, topDir))) continue
      const children = treeItems(path.join(ROOT, topDir), topDir)
      if (children.length) items.push({ text: topDir, collapsed: false, items: children })
    }
    if (items.length) sidebarGroups.push({ text: label, items })
  } else {
    const items = treeItems(path.join(ROOT, label), label)
    if (items.length) sidebarGroups.push({ text: label, items })
  }
}

// 双链/嵌入索引（md 排除 zmg；图片包含 zmg）
const mdIndex = {}
for (const d of allThemeDirs) {
  const list = []
  walkFiles(path.join(ROOT, d), d, list, false, false)
  for (const rel of list) {
    const stem = path.basename(rel, MD_EXT)
    ;(mdIndex[stem] ||= []).push(rel)
  }
}
const imgIndex = {}
for (const d of allThemeDirs) {
  const list = []
  walkFiles(path.join(ROOT, d), d, list, true, false)
  for (const rel of list) {
    const stem = path.basename(rel, path.extname(rel))
    ;(imgIndex[stem] ||= []).push(rel)
  }
}

const navCategoryItems = navCategories.map((c) => ({ text: c.label, link: c.link }))

const out = `// 由 scripts/gen-site-data.mjs 自动生成，请勿手动修改
export const navCategories = ${JSON.stringify(navCategories, null, 2)}
export const navCategoryItems = ${JSON.stringify(navCategoryItems, null, 2)}
export const allArticles = ${JSON.stringify(articles, null, 2)}
export const sidebarGroups = ${JSON.stringify(sidebarGroups, null, 2)}
export const mdIndex = ${JSON.stringify(mdIndex, null, 2)}
export const imgIndex = ${JSON.stringify(imgIndex, null, 2)}
`
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, out, "utf8")

const total = articles.length
console.log(`[gen-site-data] 共 ${total} 篇文章, ${categoryOrder.length} 个分类:`)
for (const c of navCategories) {
  console.log(`  - ${c.label}: ${c.count}`)
}
