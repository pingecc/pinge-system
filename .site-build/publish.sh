#!/bin/bash
# 一键发布：本地构建 -> 提交 -> 推送，GitHub Actions 会自动重新构建并部署。
set -euo pipefail
cd "$(dirname "$0")/.."

if ! git remote | grep -q '^origin$'; then
  echo "尚未配置远程仓库（origin），请先执行："
  echo "  gh repo create pinge-system --public --source . --remote origin --push"
  echo "（或网页创建仓库后：git remote add origin git@github.com:<用户名>/pinge-system.git）"
  exit 1
fi

echo "==> 1/3 本地构建（验证内容可编译）"
./.site-build/build.sh

echo "==> 2/3 提交改动"
git add -A
if git diff --cached --quiet; then
  echo "    没有新的内容改动，跳过提交"
else
  git commit -m "docs: $(date '+%Y-%m-%d %H:%M')"
fi

echo "==> 3/3 推送到 GitHub"
git push origin main
echo "已发布！GitHub Actions 构建完成后访问："
echo "  https://<你的GitHub用户名>.github.io/pinge-system/"
