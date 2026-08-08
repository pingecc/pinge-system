# 知识库站点操作文档

本仓库托管你的 Markdown 知识库，自动构建并发布到 GitHub Pages。

- 仓库：`github.com/pingecc/pinge-system`（公开）
- 站点：<https://pingecc.github.io/pinge-system/>
- 构建工具：Zensical（Material 主题）

## 工作原理

```text
修改笔记（.md）
    ↓  .site-build/publish.sh（一条命令）
本地构建验证 → git 提交 → git push
    ↓  GitHub Actions（自动）
重新构建站点 → 部署到 GitHub Pages（约 1-2 分钟）
```

所有生成物（`.site-build/content`、`.site-build/site`、`.venv`）不入库，每次由 Actions 在云端重新构建。

## 日常更新（改完笔记后）

1. 在 Obsidian 或任意编辑器中修改、保存笔记
2. 打开终端，进入项目目录：

   ```bash
   cd /Users/ping/pinge-system/doc
   ```

3. 执行发布命令：

   ```bash
   ./.site-build/publish.sh
   ```

   脚本会自动完成：本地构建验证 → `git add` → `git commit` → `git push`

4. 等 1-2 分钟，刷新站点查看：<https://pingecc.github.io/pinge-system/>

如果没有任何改动，脚本会提示“没有新的内容改动，跳过提交”，不会产生空提交。

## 本地预览（可选）

```bash
./.site-build/build.sh serve
```

打开 http://localhost:8000 即可实时预览，改动即时刷新；`Ctrl+C` 退出。

## 站点自动规则（无需手动维护）

- 每个顶层文件夹 = 顶部导航标签；文件夹内的层级 = 左侧导航
- 文件夹里的 `首页.md` / `欢迎.md` 自动作为该分区的落地页
- Obsidian 双链 `[[笔记]]`、`![[图片]]` 构建时自动转换为普通链接
- 以下文件自动排除（不在站点也不在仓库提交之外，仅站点中不展示）：
  `未命名*`、`草稿.md`、`模板.md`、`READEME.md`、`AI 测试.md`、`*.excalidraw.md`
- 顶层导航顺序：前端 → Java → Python → 系统架构 → English → 考证 → 编程语言模型 → 源码系列（新文件夹自动追加末尾）

## 不修改内容时手动触发构建

- 打开仓库 Actions 页面（<https://github.com/pingecc/pinge-system/actions>）
- 点 **Re-run** 重跑最近一次，或点 **Run workflow** 手动触发

## 常见问题

### 推送被 GitHub 拦截（GH013 密钥保护）

说明笔记里含有真实密钥（如 API Key）。公开仓库不允许提交密钥：

1. 打开提示中的文件，把密钥替换成占位符（如 `sk-你的Key`）
2. 重新运行 `./.site-build/publish.sh`
3. 到密钥服务商平台重新生成一个新密钥（旧的视为已泄露）

### Actions 构建失败

1. 打开 Actions 页面查看失败日志
2. 确认仓库 Settings → Pages → Build and deployment → Source 是 **GitHub Actions**
3. 修复后点 Re-run

### 推送慢或超时

已配置 SSH 走 443 端口备用通道（`ssh.github.com`），网络波动时直接重试一次即可。

### 想调整站点配置

编辑 `.site-build/build.py` 顶部的配置区（站点名、站点地址、导航顺序、排除规则），保存后重新运行 `./.site-build/publish.sh`。

## 目录说明

```text
README.md                        本文档
笔记文件夹/                     知识库内容（md + 图片）
.site-build/
  ├─ build.sh                   一键构建入口（自动准备环境）
  ├─ build.py                   暂存复制 + 双链转换 + 生成导航配置
  ├─ publish.sh                 发布命令（构建 + 提交 + 推送）
  ├─ zensical.toml              站点配置（构建时自动生成）
  ├─ content/                   构建暂存副本（不入库）
  └─ site/                      构建产物（不入库）
.github/workflows/docs.yml       GitHub Actions 自动部署
```
