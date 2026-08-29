# Pinge's Blog

个人 Markdown 知识库，基于 **VitePress** 构建并发布到 GitHub Pages。

- 仓库：`github.com/pingecc/pinge-system`（公开）
- 站点：<https://pingecc.github.io/pinge-system/>
- 构建：VitePress 1.6 + GitHub Actions

## 工作原理

```text
修改笔记（.md）
    ↓  publish.sh（一条命令）
npm run build（生成分类/索引数据 + 构建） → git 提交 → git push
    ↓  GitHub Actions（自动）
npm ci + npm run build → 部署到 GitHub Pages
```

## 本地开发

```bash
npm install      # 首次
npm run dev      # 本地预览 http://localhost:15173/pinge-system/
npm run build    # 生成站点到 .vitepress/dist
```

## 日常更新（改完笔记后）

1. 在 Obsidian 或任意编辑器中修改、保存笔记
2. 执行 `./publish.sh`（本地构建验证 → 提交 → 推送）
3. 等待 GitHub Actions 构建完成（约 1-2 分钟），访问站点确认

## 站点特性

- 首页：分类胶囊导航 + 最新发布 / 最近修改
- 分类落地页：`/categories/<分类>`（小主题自动并入"其他"）
- 左侧分类目录树侧边栏、右侧大纲、本地全文搜索（Ctrl+K）
- Obsidian 双链 `[[笔记]]`、图片嵌入 `![[图片]]` 渲染时自动转换
- 每篇笔记显示创建 / 修改时间（取 git 历史）
- 深色 / 浅色主题跟随系统

## 目录结构

```text
.
├── index.md               # 首页（标语 + 分类胶囊 + 最近文章）
├── categories/            # 分类落地页（动态路由）
├── .vitepress/
│   ├── config.mts         # 站点配置
│   ├── generated/         # 自动生成的分类/索引数据（勿手改）
│   ├── plugins/           # Obsidian 双链 & HTML 安全插件
│   └── theme/             # 自定义主题组件与样式
├── scripts/gen-site-data.mjs  # 扫描笔记，生成分类/侧边栏/时间戳数据
├── Java/ 前端/ 系统架构/ …     # 笔记主题目录（11 个）
└── publish.sh             # 一键发布
```

主题目录说明（小目录自动并入"其他"分类）：前端、Java、Python、系统架构、English、
AI全栈应用；服务器、考证、编程模型、源码系列、工具资源 → 其他。

## 评论功能（giscus，需手动配置一次）

1. 在仓库 Settings 勾选 Discussions，并创建一个分类（如 `General`）
2. 打开 <https://giscus.app/>，填入仓库 `pingecc/pinge-system`，按指引获取
   `repo-id` 与 `category-id`
3. 将三个值填入 `.vitepress/theme/components/Comments.vue` 顶部的
   `GISCUS_REPO_ID`、`GISCUS_CATEGORY`、`GISCUS_CATEGORY_ID`，重新发布

## 写作规范

- 笔记用标准 Markdown；文件名即 URL，建议 `01-xxx`、`02-xxx` 编号排序
- 支持 Obsidian 双链 `[[...]]` 与 `![[图片]]`（构建时自动转换，未命中的原样显示）
- 图片粘贴到各文件夹 `zmg/` 即可；引用不存在的图片会显示文字占位
- 以下文件/目录不会生成页面：`.obsidian/`、`zmg/` 目录内、`*.excalidraw.md`、
  `草稿.md`、`模板.md`、`READEME.md`、`AI 测试.md`、`未命名*` 开头文件

## 迁移说明

旧工具链（Zensical + `.site-build/build.py`）已由 VitePress 取代，详见
`MIGRATION.md`；`.site-build/` 目录仅作存档，不再参与构建。
