

`.command` 和 `.sh` 本质上都只是文本文件，里面写的是 shell 脚本，但 macOS 对它们的**双击行为**处理不同：

| 特性 | `.sh` | `.command` |
|------|-------|-----------|
| **双击效果** | 默认用文本编辑器打开（如 TextEdit） | 自动打开 Terminal 并执行脚本 |
| **来源** | 通用 Unix/Linux 标准 | macOS 特有 |
| **执行方式** | 需在终端手动运行：`bash script.sh` 或 `chmod +x script.sh` 后 `./script.sh` | 双击即可运行（需有执行权限） |
| **跨平台** | 各系统通用 | 主要在 macOS 有意义 |

**简单总结**：如果你希望脚本在 macOS 上**双击就能运行**，就用 `.command`；如果只是写个标准脚本供终端调用，用 `.sh` 更通用。

> 注意：无论哪种扩展名，要双击执行都需要文件有执行权限（`chmod +x file.command`），否则 Terminal 会提示权限不足。