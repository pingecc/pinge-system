// 阅读器偏好：字号/行距/字体/宽度/专注模式
// 状态持久化在 localStorage，通过 html 的 data-* 属性 + focus-mode 类驱动 CSS
// （属性定义与默认值见 custom.css 第 1 节 tokens）

export type ReaderPrefs = {
  size: 0 | 1 | 2 // 小 / 中 / 大（映射 --pl-doc-fs 15/16.5/18px）
  line: 0 | 1 | 2 // 紧凑 / 标准 / 宽松（映射 --pl-doc-lh 1.7/1.8/1.95）
  font: "sans" | "kai" // 黑体 / 文楷
  width: "normal" | "wide" // 840 / 960
  focus: boolean // 专注模式（隐藏导航/侧栏/右栏，Esc 退出）
}

// key 带 v2：默认字体改为文楷时作废旧存储，避免旧默认值（sans）残留在用户 localStorage
const KEY = "pl-reader-prefs-v2"

export const DEFAULT_PREFS: ReaderPrefs = { size: 1, line: 1, font: "kai", width: "normal", focus: false }

export function loadPrefs(): ReaderPrefs {
  if (typeof localStorage === "undefined") return { ...DEFAULT_PREFS }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(p: ReaderPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* 隐私模式等场景写入失败可忽略 */
  }
}

export function applyPrefs(p: ReaderPrefs) {
  const el = document.documentElement
  el.dataset.plSize = String(p.size)
  el.dataset.plLine = String(p.line)
  el.dataset.plFont = p.font
  el.dataset.plWidth = p.width
  el.classList.toggle("focus-mode", p.focus)
}

// 在 enhanceApp（客户端）里尽早调用，避免首屏闪一下默认样式
export function initReaderPrefs() {
  if (typeof document === "undefined") return
  applyPrefs(loadPrefs())
}
