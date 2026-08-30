# 站点改造任务文档：Zensical → VitePress

> 目标：把"我的学习笔记"（https://pingecc.github.io/pinge-system/）改造成类似
> https://hansimov.github.io/blog/ 的形态（VitePress + 首页标语/分类胶囊/最近发布修改 + 侧边栏 + 搜索 + 评论 + 查看原文）。
> 本文档是执行的唯一依据，按阶段依次完成；每阶段完成需可验证（本地构建通过/站点冒烟通过）。

## 0. 已确认决策（2026-08-29）

| # | 决策 | 结论 |
|---|------|------|
| 1 | 框架 | 整体迁移到 VitePress（替换 Zensical + build.py） |
| 2 | 首页形态 | 照搬"标语 + 分类胶囊 + 最新发布/最近修改"布局 |
| 3 | 小目录 | 1-2 篇的小主题并入"其他"分类 |
| 4 | 长笔记 | 第一阶段不拆分，一篇 = 一个文档，侧边栏沿用现有目录层级 |
| 5 | 功能 | 本地搜索、深色模式、giscus 评论、查看原文、最后更新时间，全要 |
| 6 | 时间戳 | 用 git 历史驱动的创建/修改时间（当前历史 23 个 commit，粒度粗可接受） |

## 1. 现状盘点

- 仓库根 = `/Users/ping/pinge-system/doc`（git remote: `pingecc/pinge-system`，main）
- 内容：189 篇 md（排除 `.obsidian`/`zmg`/`.site-build` 后），11 个主题顶层目录
- 主题文件数：Java 100、系统架构 32、前端 23、Python 11、AI全栈应用 10、English 7、
  服务器 2、考证 1、编程模型 1、源码系列 1、工具资源 1
- 分类映射（小目录并入"其他"）：
  `前端 / Java / Python / 系统架构 / English / AI全栈应用 / 其他(=服务器+考证+编程模型+源码系列+工具资源)`
- 现状工具链：`.site-build/build.py` 复制内容 → 转双链 → 生成 nav → zensical 构建
- 现有排除规则（移植到新方案）：`.obsidian`/隐藏目录、`未命名*`、`草稿.md`、`模板.md`、
  `READEME.md`、`AI 测试.md`、`*.excalidraw.md`、根 `README.md`
- 40+ 文件使用 Obsidian `[[双链]]` / `![[嵌入]]`，需在渲染层做转换

## 2. 目标形态（对标 https://hansimov.github.io/blog/）

- 技术：VitePress 1.6.x + GitHub Actions → Pages（base 保持 `/pinge-system/`，不破旧链）
- 首页：居中标语 + 分类胶囊（悬停下拉文章列表）+ 两栏"最新发布 / 最近修改"（标题/分类标签/时间）
- 笔记页：顶部导航（Home + 笔记分类下拉）、左侧分类树侧边栏、右侧目录大纲、本地搜索、
  `last-updated`、页尾 giscus 评论、导航栏"查看原文"按钮
- 分类落地页：`/categories/<分类>` 列出该分类全部文章（标题 + 创建/修改时间）
- 深色/浅色随系统切换

## 3. 实施阶段

### 阶段 1：工程骨架
- [x] 根目录 `package.json`（vitepress、docs:dev/build/preview，predev/prebuild 先跑数据生成）
- [x] `.gitignore` 增加 `node_modules/`、`.vitepress/dist/`、`.vitepress/cache/`
- [x] `.vitepress/config.mts`：base `/pinge-system/`、中文标题、本地搜索、outline、lastUpdated、
  写 `.nojekyll`（"查看原文"按钮已移除，不再复制 md，见 2026-08-29 优化）
- [x] `.vitepress/theme/index.ts` + `custom.css` 挂载自定义组件

### 阶段 2：数据层（脚本生成 + 提交）
- [x] `scripts/gen-site-data.mjs`：扫描主题目录 → 生成 `.vitepress/generated/site-data.mjs`：
  - `categories`（含"其他"合并、固定顺序）
  - `articles`（标题=frontmatter title → 首个 # 标题 → 文件名；创建/修改时间=git log，回退 mtime）
  - `sidebar`（按现有目录层级递归生成，自然排序，多级折叠）
  - `mdIndex` / `imgIndex`（双链解析用，移植 build.py 的索引逻辑）
- [x] 分类动态路由：根 `categories/[category].md` + `[category].paths.ts`

### 阶段 3：首页与分类页
- [x] 根 `index.md`：标语 + CategoryNav + RecentArticles
- [x] 组件：`CategoryNav.vue`（胶囊 + 悬停下拉）、`RecentArticles.vue`（最新发布/最近修改）、
  `CategoryPage.vue`（分类落地页列表）
- [x] `custom.css`：胶囊、下拉、文章列表、分类彩色标签，适配亮/暗色

### 阶段 4：单页增强
- [x] 本地搜索（config 内置）、大纲、最后更新时间
- [ ] ~~`RawTextButton.vue`：查看原文~~（2026-08-29 按用户要求移除）
- [x] `Comments.vue`：giscus 挂载点（仓库 id/分类 id 需用户到 giscus.app 补齐，见阶段 7）

### 阶段 5：Obsidian 兼容
- [x] `.vitepress/plugins/obsidian-links.mjs`：markdown-it 插件，渲染时把 `[[目标]]` / `![[图]]`
  转成标准链接/图片（代码块内跳过；解析失败保留原文，不产生死链）

### 阶段 6：发布链路
- [x] `.github/workflows/docs.yml`：npm ci + prebuild 数据生成 + `npm run build`
  + 上传 `.vitepress/dist`（checkout 需 `fetch-depth: 0` 保证时间戳/最后更新正确）
- [x] 根 `publish.sh`：本地构建 → 提交 → 推送（替代 `.site-build/publish.sh`）
- [x] `README.md`：更新为 VitePress 使用说明 + giscus 配置步骤

### 阶段 7：验证与上线
- [x] 本地 `npm run build` 通过（175+ 页 / 7 分类）
- [x] `vitepress preview` 冒烟：首页、分类页、深层笔记、"查看原文"、双链转换、图片兜底
- [ ] 推送后确认线上 https://pingecc.github.io/pinge-system/ 正常
- [ ] 手动步骤（需用户）：giscus 评论配置（启用 Discussions → giscus.app 生成
  `data-repo-id` / `data-category-id` 填入 `Comments.vue`）

## 5. 实施记录（2026-08-29）

- 工程：`package.json`（vitepress ^1.6.4）、`.vitepress/config.mts`（base=/pinge-system/）、
  主题挂载、首页 `index.md`、分类动态路由 `categories/[category].md`
- 数据层：`scripts/gen-site-data.mjs` 生成 `.vitepress/generated/site-data.mjs`
  （7 分类 = 前端23 / Java89 / Python11 / 系统架构32 / English6 / AI全栈应用8 / 其他6，
  共 175 篇；标题 = frontmatter title → 首个 # 标题 → 文件名；时间戳 = git log，回退 mtime）
- 组件：CategoryNav（胶囊+悬停下拉）、RecentArticles（最新发布/最近修改）、
  CategoryPage、Comments（giscus 占位）、RawTextButton（原文）
- 插件：`obsidian-links.mjs`（双链/嵌入转换、未配对 HTML 转义、坏图片引用兜底）
- 已知限制（后续处理）：
  - 未命中双链（如改名/已删除的旧标题）原样显示为文字
  - 少量笔记含 `{{ }}` 模板语法时按 Vue 插值规则处理，个别示例需加 `::: v-pre`（后续整理）
  - git 历史仅 23 个提交，创建/修改时间粒度较粗（已确认接受）

## 6. 界面优化记录（2026-08-29）

- 移除导航栏"原文"按钮（含对应 buildEnd 的 .md 复制逻辑，保留 .nojekyll）
- 顶部导航：首页 → Home、笔记 → Notes
- 首页标语 → It's never too late. Just do it better.
- 站点标题 → Pinge's Blog
- 分类样式全面对齐目标站点：胶囊 hover 上浮、下拉用 bg-elv、最近发布/修改卡片化
  （bg-soft 卡片 + 品牌色下划线 + 等宽字体日期 + rgba 分类标签 + 列表内部滚动）、
  分类落地页带发布时间/修改时间排序；首页随视口高度自适应，窄屏只显示"最近修改"
- 首页分类下拉、最新发布、最近修改的文章名统一改为显示完整文件名（含子目录，
  与分类落地页一致，不使用文章内标题；悬停提示仍显示文章标题）

## 4. 遗留事项（不阻塞上线，后续单独处理）

- Excalidraw / 草稿文件的展示策略（当前按原规则排除 `*.excalidraw.md`）
- 长文拆分（把"一篇 = 一章"逐步拆成"一篇 = 一个知识点"，与目标站风格对齐）
- `[[双链]]` 歧义解析（同名文件取同目录优先，与 build.py 一致）
- 资源整理：zmg 图片目录统一管理、无用附件清理
- 旧工具链 `.site-build/`（build.py / zensical）验证稳定后归档删除
