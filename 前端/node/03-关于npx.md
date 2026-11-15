
**npx** 是 npm 自带的**包执行器**（Package Runner），全称可以理解为 “npm package execute”。从 npm 5.2.0（2017年）开始内置，现在几乎所有安装了 Node.js 的环境都能直接使用。

它的核心作用就一句话：

> **让你直接运行 npm 包里的命令行工具，而不需要先全局或本地安装。**

---

### ⁠0.1 ⁠为什么需要 npx？

以前用 npm 有两个痛点：

1. **全局安装污染系统**  
   比如想用 `create-react-app`、`vite`、`eslint` 等工具，得先 `npm install -g xxx`。时间一长，全局环境被各种版本的工具占满，还容易版本冲突。

2. **本地安装后运行麻烦**  
   包装在项目里后，可执行文件在 `node_modules/.bin/` 下，要运行得写完整路径：
   ```bash
   ./node_modules/.bin/mocha
   # 或
   node ./node_modules/.bin/webpack
   ```

npx 就是为了解决这两个问题而生的。

---

### ⁠0.2 ⁠npx 的工作原理

当你执行 `npx <命令>` 时，它会按这个顺序查找：

1. **先看本地**：检查当前项目的 `node_modules/.bin` 里有没有这个命令
2. **再看全局**：检查系统全局安装的包
3. **都没有就临时下载**：从 npm 仓库下载到缓存目录，运行完后清理（不会写入你的 `package.json`）

在 npm 7 之后，`npx` 本质上是 `npm exec` 的快捷方式，功能几乎一样。

---

### ⁠0.3 ⁠常见使用场景

#### ⁠0.3.1 ⁠场景1：运行本地已安装的工具（最常用）
```bash
# 以前
./node_modules/.bin/eslint src/

# 现在
npx eslint src/
```

#### ⁠0.3.2 ⁠场景2：临时运行脚手架/工具（不污染全局）
```bash
# 创建 React 项目
npx create-react-app my-app

# 创建 Vite 项目
npx create-vite my-app

# 创建 Next.js 项目
npx create-next-app@latest my-app
```

#### ⁠0.3.3 ⁠场景3：运行指定版本
```bash
npx create-next-app@14 my-app
npx eslint@8 .
```

#### ⁠0.3.4 ⁠场景4：运行一次性工具
```bash
npx cowsay "Hello npx"          # 经典小牛示例
npx serve dist                  # 快速起一个静态服务器
npx degit user/repo my-project  # 从 GitHub 拉取模板
```

#### ⁠0.3.5 ⁠场景5：强制不下载（只用本地）
```bash
npx --no-install eslint .       # 本地没有就直接报错
```
