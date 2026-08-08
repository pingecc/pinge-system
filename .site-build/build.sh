#!/bin/bash
# Zensical 一键构建入口：自动准备虚拟环境并执行 build.py
# 用法：
#   ./.site-build/build.sh        构建静态站点
#   ./.site-build/build.sh serve  本地预览（http://localhost:8000）
set -euo pipefail
cd "$(dirname "$0")"

PY="${PYTHON:-python3}"
if [ ! -x .venv/bin/python ]; then
  "$PY" -m venv .venv
fi
if ! .venv/bin/python -c "import zensical" >/dev/null 2>&1; then
  echo "首次运行：安装 zensical ..."
  .venv/bin/pip install --quiet zensical
fi

exec .venv/bin/python build.py "$@"
