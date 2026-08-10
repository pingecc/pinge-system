#!/usr/bin/env python3
"""Zensical 知识库构建脚本。

流程：
  1. 把顶层文件夹复制到 content/（跳过 .obsidian、草稿类文件）
  2. 首页.md / 欢迎.md 改名为 index.md，作为分区落地页
  3. 把 Obsidian 双链 [[...]] / ![[...]] 转换为标准 Markdown 链接
  4. 生成首页 index.md、nav 配置 zensical.toml
  5. 调用 zensical build（或 zensical serve）

原库文件不会被修改，所有生成物都在本目录（.site-build/）内。
"""

import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# 可修改的配置
# ---------------------------------------------------------------------------

SITE_NAME = "我的学习笔记"
SITE_DESCRIPTION = "个人学习笔记知识库"
# GitHub Pages 地址
SITE_URL = "https://pingecc.github.io/pinge-system/"

# 顶层导航顺序（新出现的顶层文件夹会自动追加到末尾）
TOP_LEVEL_ORDER = [
    "前端",
    "Java",
    "Python",
    "系统架构",
    "English",
    "考证",
    "编程语言模型",
    "源码系列",
]

# 草稿排除规则（可按需修改）
EXCLUDE_FILE_PREFIXES = ("未命名",)
EXCLUDE_FILE_NAMES = {"草稿.md", "模板.md", "READEME.md", "AI 测试.md"}
EXCLUDE_FILE_SUFFIXES = (".excalidraw.md",)

# 仓库根目录下不参与构建的文件（如 README.md 操作文档）
EXCLUDE_ROOT_FILES = {"README.md"}

# 分区落地页：以下文件名会改名为 index.md
INDEX_RENAMES = ("首页.md", "欢迎.md")

MD_EXT = {".md", ".markdown"}
IMG_EXT = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
    ".bmp", ".ico", ".tiff", ".avif",
}

BUILD_ROOT = Path(__file__).resolve().parent
VAULT_ROOT = BUILD_ROOT.parent
CONTENT_DIR = BUILD_ROOT / "content"
SITE_DIR = BUILD_ROOT / "site"


# ---------------------------------------------------------------------------
# 基础工具
# ---------------------------------------------------------------------------

def natural_key(name: str):
    """数字感知的自然排序：01 < 02 < 10。"""
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", name)]


def should_exclude(name: str, is_dir: bool) -> bool:
    if name.startswith("."):
        return True  # .obsidian / .DS_Store / .site-build / .venv ...
    if is_dir:
        return False
    if name.startswith(EXCLUDE_FILE_PREFIXES):
        return True
    if name in EXCLUDE_FILE_NAMES:
        return True
    if name.endswith(EXCLUDE_FILE_SUFFIXES):
        return True
    return False


def copy_tree(src: Path, dst: Path) -> None:
    for entry in sorted(os.scandir(src), key=lambda e: natural_key(e.name)):
        try:
            is_dir = entry.is_dir()
        except OSError:
            continue
        if src == VAULT_ROOT and entry.name in EXCLUDE_ROOT_FILES:
            continue
        if should_exclude(entry.name, is_dir):
            continue
        s = Path(entry.path)
        d = dst / entry.name
        if is_dir:
            d.mkdir(parents=True, exist_ok=True)
            copy_tree(s, d)
        else:
            shutil.copy2(s, d)


def prune_empty_dirs(root: Path) -> None:
    for dirpath, dirnames, filenames in os.walk(root, topdown=False):
        d = Path(dirpath)
        try:
            d.rmdir()
        except OSError:
            pass


def rename_index_pages(root: Path) -> None:
    for dirpath, _dirnames, filenames in os.walk(root):
        d = Path(dirpath)
        if (d / "index.md").exists():
            continue
        for cand in INDEX_RENAMES:
            p = d / cand
            if p.exists():
                p.rename(d / "index.md")
                break


# ---------------------------------------------------------------------------
# 双链转换
# ---------------------------------------------------------------------------

def build_link_index():
    md_index, img_index = {}, {}
    for p in CONTENT_DIR.rglob("*"):
        if not p.is_file():
            continue
        stem = p.stem
        rel = p.relative_to(CONTENT_DIR)
        if p.suffix.lower() in MD_EXT:
            md_index.setdefault(stem, []).append(rel)
        elif p.suffix.lower() in IMG_EXT:
            img_index.setdefault(stem, []).append(rel)
    return md_index, img_index


def _collect(index: dict, target: str) -> list:
    hits = index.get(target, [])
    if not hits:
        alt = Path(target).stem
        if alt != target:
            hits = index.get(alt, [])
    if not hits and "/" in target:
        suffix = "/" + target
        hits = [rel for rel in sum(index.values(), []) if str(rel).endswith(suffix)]
    return hits


def resolve_wikilink(target: str, md_rel: Path):
    """返回 (相对路径, 类型)，类型为 'md' 或 'image'；未解析返回 None。"""
    md_hits = _collect(md_index, target)
    img_hits = _collect(img_index, target)
    parent = str(md_rel.parent)

    def pick(hits):
        if not hits:
            return None
        same_dir = [h for h in hits if str(h.parent) == parent]
        if len(same_dir) == 1:
            return same_dir[0]
        if len(hits) == 1:
            return hits[0]
        return min(hits, key=lambda h: len(h.parts))

    best_md, best_img = pick(md_hits), pick(img_hits)
    if best_md and best_img:
        if best_md == best_img:
            return best_md, "md"
        return min([(best_md, "md"), (best_img, "image")],
                   key=lambda x: len(x[0].parts))
    if best_md:
        return best_md, "md"
    if best_img:
        return best_img, "image"
    return None


def link_url(md_rel: Path, target_rel: Path) -> str:
    rel = os.path.relpath(str(target_rel), str(md_rel.parent)).replace("\\", "/")
    return rel.replace(" ", "%20")


def mask_code(text: str):
    parts = []

    def _mask(m):
        parts.append(m.group(0))
        return f"\x00{len(parts) - 1}\x00"

    text = re.sub(r"```.*?```", _mask, text, flags=re.S)
    text = re.sub(r"`+[^`\n]+`+", _mask, text)
    return text, parts


def unmask(text: str, parts: list) -> str:
    return re.sub(r"\x00(\d+)\x00", lambda m: parts[int(m.group(1))], text)


def convert_wikilinks(text: str, md_rel: Path) -> str:
    masked, parts = mask_code(text)

    def _repl(m):
        embed = m.group(0).startswith("!")
        inner = m.group(1)
        target_raw, sep, alias = inner.partition("|")
        target = target_raw.split("#", 1)[0].strip()
        alias = alias.strip() if sep else ""
        label = alias or Path(target_raw.split("#", 1)[0]).stem or target_raw
        if not target:
            return label
        res = resolve_wikilink(target, md_rel)
        if res is None:
            return label  # 未解析目标：转纯文本
        dest, kind = res
        url = link_url(md_rel, dest)
        if kind == "image" and embed:
            return f"![]({url})"
        return f"[{label}]({url})"

    converted = re.sub(r"!?\[\[([^\[\]]+)\]\]", _repl, masked)
    return unmask(converted, parts)


def convert_all() -> None:
    for p in CONTENT_DIR.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in MD_EXT:
            continue
        rel = p.relative_to(CONTENT_DIR)
        original = p.read_text(encoding="utf-8", errors="replace")
        converted = convert_wikilinks(original, rel)
        if converted != original:
            p.write_text(converted, encoding="utf-8")


# ---------------------------------------------------------------------------
# 首页与导航
# ---------------------------------------------------------------------------

def has_md(d: Path) -> bool:
    return any(p.suffix.lower() in MD_EXT for p in d.rglob("*") if p.is_file())


def ordered_top_levels() -> list:
    dirs = [e.name for e in os.scandir(VAULT_ROOT)
            if e.is_dir() and not should_exclude(e.name, True)]
    known = [d for d in TOP_LEVEL_ORDER if d in dirs]
    rest = sorted((d for d in dirs if d not in TOP_LEVEL_ORDER), key=natural_key)
    return known + rest


def build_section(dir_rel: str) -> list:
    d = CONTENT_DIR / dir_rel
    items = []
    index_md = d / "index.md"
    if index_md.is_file():
        items.append({dir_rel.rsplit("/", 1)[-1]: f"{dir_rel}/index.md"})
    entries = sorted(
        (e for e in os.listdir(d) if e != "index.md"),
        key=natural_key,
    )
    for e in entries:
        p = d / e
        if p.is_dir():
            if has_md(p):
                items.append({e: build_section(f"{dir_rel}/{e}")})
        elif p.suffix.lower() in MD_EXT:
            items.append({p.stem: f"{dir_rel}/{e}"})
    return items


def first_page_of(section_items: list):
    """从分区结构中取第一个可访问的页面路径。"""
    for it in section_items:
        if isinstance(it, dict):
            v = next(iter(it.values()))
            if isinstance(v, list):
                sub = first_page_of(v)
                if sub:
                    return sub
            elif isinstance(v, str):
                return v
        elif isinstance(it, str):
            return it
    return None


def write_section_indexes() -> None:
    """为没有落地页的顶层分区生成 index.md（Java / Python / 考证 等）。"""
    for name in ordered_top_levels():
        d = CONTENT_DIR / name
        if not d.is_dir() or (d / "index.md").exists():
            continue
        lines = [f"# {name}", ""]
        for e in sorted(os.listdir(d), key=natural_key):
            p = d / e
            if p.is_dir():
                if not has_md(p):
                    continue
                sub = f"{name}/{e}"
                if (p / "index.md").is_file():
                    target = f"{sub}/index.md"
                else:
                    target = first_page_of(build_section(sub))
                if target:
                    rel = os.path.relpath(target, name).replace("\\", "/")
                    lines.append(f"- [{e}]({rel})")
            elif p.suffix.lower() in MD_EXT:
                lines.append(f"- [{p.stem}]({e})")
        (d / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def build_nav() -> list:
    nav = [{"首页": "index.md"}]
    root_md = sorted(
        (p for p in CONTENT_DIR.iterdir()
         if p.is_file() and p.suffix.lower() in MD_EXT and p.name != "index.md"),
        key=lambda p: natural_key(p.name),
    )
    for p in root_md:
        nav.append({p.stem: p.name})
    for name in ordered_top_levels():
        section = build_section(name)
        if section:
            nav.append({name: section})
    return nav


def write_home_page() -> None:
    lines = [f"# {SITE_NAME}", "", SITE_DESCRIPTION, "", "按主题浏览：", ""]
    for name in ordered_top_levels():
        section_dir = CONTENT_DIR / name
        if not section_dir.is_dir():
            continue
        target = first_page_of(build_section(name)) or f"{name}/index.md"
        lines.append(f"- [{name}]({target})")
    (CONTENT_DIR / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# zensical.toml 生成
# ---------------------------------------------------------------------------

def dump_nav(items: list, indent: int = 1) -> str:
    pad = "  " * indent
    out = []
    for it in items:
        if isinstance(it, dict) and len(it) == 1:
            k, v = next(iter(it.items()))
            if isinstance(v, list):
                out.append(f"{pad}{{ {json.dumps(k, ensure_ascii=False)} = [")
                out.append(dump_nav(v, indent + 1))
                out.append(f"{pad}] }},")
            else:
                out.append(
                    f"{pad}{{ {json.dumps(k, ensure_ascii=False)} = "
                    f"{json.dumps(v, ensure_ascii=False)} }},"
                )
        else:
            out.append(f"{pad}{json.dumps(it, ensure_ascii=False)},")
    return "\n".join(out)


def write_zensical_toml(nav: list) -> None:
    site_url_line = (
        f'site_url = "{SITE_URL}"' if SITE_URL
        else '# site_url = "https://你的域名/"  # 部署时取消注释并填写'
    )
    nav_text = dump_nav(nav)
    content = f"""# 由 build.py 自动生成；如需调整站点信息/导航顺序，请修改 build.py 顶部的配置后重新构建。
[project]
site_name = "{SITE_NAME}"
{site_url_line}
site_description = "{SITE_DESCRIPTION}"
site_dir = "site"
docs_dir = "content"
language = "zh"

nav = [
{nav_text}
]

[project.theme]
language = "zh"
features = [
  "navigation.sections",
  "navigation.expand",
  "navigation.indexes",
  "navigation.top",
  "navigation.instant",
  "navigation.footer",
  "content.code.copy",
  "content.tabs.link",
  "search.highlight",
]

[[project.theme.palette]]
media = "(prefers-color-scheme)"
toggle.icon = "lucide/sun-moon"
toggle.name = "Switch to light mode"

[[project.theme.palette]]
media = "(prefers-color-scheme: light)"
scheme = "default"
toggle.icon = "lucide/sun"
toggle.name = "Switch to dark mode"

[[project.theme.palette]]
media = "(prefers-color-scheme: dark)"
scheme = "slate"
toggle.icon = "lucide/moon"
toggle.name = "Switch to system preference"

[project.markdown_extensions]
abbr = {{}}
admonition = {{}}
attr_list = {{}}
def_list = {{}}
footnotes = {{}}
md_in_html = {{}}
toc = {{ permalink = true }}
pymdownx.arithmatex = {{ generic = true }}
pymdownx.betterem = {{}}
pymdownx.caret = {{}}
pymdownx.details = {{}}
pymdownx.emoji = {{ emoji_generator = "zensical.extensions.emoji.to_svg", emoji_index = "zensical.extensions.emoji.twemoji" }}
pymdownx.highlight = {{ anchor_linenums = true, line_spans = "__span", pygments_lang_class = true }}
pymdownx.inlinehilite = {{}}
pymdownx.keys = {{}}
pymdownx.magiclink = {{}}
pymdownx.mark = {{}}
pymdownx.smartsymbols = {{}}
pymdownx.superfences = {{ custom_fences = [ {{ name = "mermaid", class = "mermaid", format = "pymdownx.superfences.fence_code_format" }} ] }}
pymdownx.tabbed = {{ alternate_style = true, combine_header_slug = true }}
pymdownx.tasklist = {{ custom_checkbox = true }}
pymdownx.tilde = {{}}
"""
    (BUILD_ROOT / "zensical.toml").write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------

def run_zensical(*args: str) -> int:
    exe = Path(sys.executable).parent / "zensical"
    if not exe.exists():
        exe = shutil.which("zensical") or "zensical"
    return subprocess.run([str(exe), *args], cwd=BUILD_ROOT).returncode


def main() -> int:
    mode = "serve" if len(sys.argv) > 1 and sys.argv[1] == "serve" else "build"

    for d in (CONTENT_DIR, SITE_DIR):
        shutil.rmtree(d, ignore_errors=True)
    CONTENT_DIR.mkdir(parents=True)

    print(f"1/4 暂存内容 -> {CONTENT_DIR.relative_to(BUILD_ROOT.parent)}")
    copy_tree(VAULT_ROOT, CONTENT_DIR)
    prune_empty_dirs(CONTENT_DIR)
    rename_index_pages(CONTENT_DIR)

    print("2/4 转换 Obsidian 双链")
    global md_index, img_index
    md_index, img_index = build_link_index()
    convert_all()

    print("3/4 生成首页与导航配置")
    write_section_indexes()
    write_home_page()
    nav = build_nav()
    write_zensical_toml(nav)
    print(f"    导航分区：{len(nav) - 1} 个顶层项")

    print(f"4/4 运行 zensical {mode}")
    code = run_zensical(mode)
    if code != 0:
        return code

    if mode == "build":
        md_count = sum(1 for p in CONTENT_DIR.rglob("*.md"))
        size = sum(
            f.stat().st_size for f in SITE_DIR.rglob("*") if f.is_file()
        ) / 1024 / 1024
        print(f"构建完成：{md_count} 个页面，产物 {SITE_DIR.relative_to(BUILD_ROOT.parent)}"
              f"（{size:.1f} MB）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
