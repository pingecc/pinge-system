

![[Pasted image 20261026195417.png]]




# 介绍


**Node.js** 是一个基于 Chrome V8 引擎的 **JavaScript 运行时环境**，让 JavaScript 可以在服务器端（而不仅仅是浏览器）运行。

它由 Ryan Dahl 在 2009 年发布，核心设计理念是：**事件驱动 + 非阻塞 I/O**。这意味着它特别擅长处理大量并发连接，同时保持较高的性能和较低的资源占用。


**核心特点**

| 特点 | 说明 |
|------|------|
| **单线程 + 事件循环** | 主线程是单线程的，通过事件循环（Event Loop）处理异步任务，避免了传统多线程模型的线程切换开销 |
| **非阻塞 I/O** | 文件读写、网络请求等 I/O 操作不会阻塞主线程，适合高并发场景 |
| **基于 V8** | 执行速度快，接近原生性能 |
| **npm 生态** | 拥有目前最大的包管理生态系统之一，几乎能找到各种功能的库 |
| **跨平台** | 支持 Windows、macOS、Linux |

简单理解：Node.js 把 JavaScript 从“浏览器脚本语言”变成了可以做后端服务、工具、甚至桌面应用的全栈语言。

**主要应用场景**

1、开发服务器应用
   - 用 Express、Koa、NestJS、Fastify 等框架快速搭建 RESTful API 或 GraphQL 服务
   - 轻量、启动快，适合做网关、代理、数据转换层
   - 作为 BFF（Backend For Frontend）层，聚合多个后端服务数据再返回给前端
   - 简单爬虫、定时任务、脚本自动化
   - Serverless 函数（很多云厂商的 Serverless 都支持 Node.js）

2、开发工具类应用（CLI）
   - 很多流行工具用 Node.js 写：webpack、Vite、ESLint、TypeScript 编译器、各种脚手架等
   - 用 Commander、yargs 等库可以很方便地做命令行程序

3、桌面应用
   - 通过 **Electron** 可以开发跨平台桌面软件（VS Code、Slack、Discord、Notion 等很多知名软件都是 Electron）



# 模块化

Node 里**每个 `.js` 文件天生就是一个模块**。通过导入导出机制互相协作。Node.js 原生支持两种模块系统：

| 模块系统           | 语法                           | 文件扩展名建议                                      | 加载方式     | 现状           |
| -------------- | ---------------------------- | -------------------------------------------- | -------- | ------------ |
| **CommonJS**   | `require` / `module.exports` | `.js`                                        | 同步       | 传统默认，兼容性最好   |
| **ES Modules** | `import` / `export`          | `.mjs` 或 `package.json` 里 `"type": "module"` | 异步（静态分析） | 现代标准，推荐新项目使用 |





## ⁠1 ⁠CommonJS

1、使用 module.exports 设置导出对象
```js
// math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };          // 导出对象
// 或 module.exports.add = add;

```


2、使用 module.require 导入对象

```js 
// app.js
const math = require('./math');    // 相对路径
console.log(math.add(2, 3));       // 5
```

特点：
- 同步加载
- 每个模块只执行一次（有缓存）
- 可以动态 `require`（根据条件加载）


### ⁠1.1 ⁠module机制


当你写一个 `.js` 文件时，Node.js 实际会把你的代码包装成类似这样的函数再执行：

```js
(function (exports, require, module, __filename, __dirname) {
  // 你写的代码在这里
  // 所以你能直接使用 module、exports、require 这些变量
})(module.exports, require, module, filename, dirname);
```

也就是说，`module` 不是全局变量，而是每个模块私有的局部变量，module的常见属性如下：

| 属性                | 类型             | 说明                                 |
| ----------------- | -------------- | ---------------------------------- |
| `module.exports`  | Object         | **最重要**。模块真正导出的内容，`require` 拿到的就是它 |
| `module.id`       | string         | 模块的标识符，通常是文件的绝对路径                  |
| `module.filename` | string         | 模块文件的绝对路径                          |
| `module.loaded`   | boolean        | 模块是否已经加载完成（`true` 表示加载完毕）          |
| `module.parent`   | Module \| null | 第一个 `require` 当前模块的模块（已逐渐废弃）       |
| `module.children` | Array          | 当前模块 `require` 过的子模块列表             |
| `module.paths`    | Array          | Node 查找模块时会搜索的路径                   |
| `module.require`  | Function       | 当前模块专用的 `require` 方法               |


如图所示，所以 `module.exports` 表达的含义也非常简单，就是个当前的module的exports 属性设置一个值。

![[Pasted image 20261026211044.png]]

另外可以观察到loaded属性的值是false，这个和我们前面的讲解的module加载是完全吻合的，整个过程如下：
- 初始化：Node.js 准备加载 `demo.js`，创建一个新的 `module` 对象，并默认设置 `module.loaded = false`。
- 代码执行：Node.js 将你的代码放入内部的模块包装器（一个闭包函数）中开始同步执行。此时遇到了 `console.log(module)`，它如实打印了当前的加载中状态（`false`）。
- 加载完成：当 `demo.js` 里的最后一行同步代码执行完毕，并将控制权交还给 Node.js 的模块系统后，Node.js 才会将 `module.loaded` 修改为 `true`。

总结：我们编写的每一个模块，Node在加载时会创建对应的module对象，并将模块的代码放入内部的模块包装器执行，所以在模块中可以直接拿到module.exports，require来设置导出导入对象。所以不同模块之间的：module.exports 完全独立。

#### ⁠1.1.1 ⁠关于exports和module.exports

问：在模块包装器函数里，提供了module和 exports参数，为何要提供exports参数呢，如果要设置导出对象，通常只能通过module.exports来设置，而不能直接在模块中通过exports= 来设置？
```js 
// 1. 创建 module 对象，它的 exports 属性默认是一个空对象
const module = { exports: {} };

// 2. 将 exports 变量指向 module.exports
let exports = module.exports; 

// 3. 执行模块包装器（你的代码就在这里面）
(function(exports, require, module, __filename, __dirname) {
    /* --- 你写的代码开始 --- */
    
    // 情况 A：添加属性 (有效)
    exports.name = "demo"; 
    
    // 情况 B：直接赋值 (无效)
    // exports = { name: "demo" }; 
    
    /* --- 你写的代码结束 --- */
})(exports, require, module, filename, dirname);

// 4. require 函数最终返回的是 module.exports，而不是 exports 变量
return module.exports;
```

从上面的逻辑可以看出，`exports` 和 `module.exports` 初始时指向内存中的同一个空对象 `{}`。那在设置导出对象时为什么不能直接 exports=... ？
这是 JavaScript 中经典的“引用赋值”机制导致的。
- **如果你写 `exports.name = "demo"`：** 你是在修改这两个变量共同指向的那个内存对象。`module.exports` 也能“看到”这个变化。最终 Node.js 返回 `module.exports` 时，导出的内容是正确的。
- **如果你写 `exports = { name: "demo" }`：** 你实际上是把 `exports` 这个局部变量指向了一块**全新的内存地址**（一个新的对象）。这就**切断了它与 `module.exports` 之间的联系**。但是，Node.js 的 `require()` 底层只认 `module.exports`。无论你的 `exports` 变量跑去了哪里，Node.js 最终返回的依然是 `module.exports` 指向的那个原始对象（如果没有修改过，那就是一个空对象 `{}`）。

正确使用：

1、修改零散的导出对象或者属性时，用 `exports` 偷懒（当然用 `module.exports.xxx` 也可以）：
```js 
exports.a = 1;
exports.b = 2;
```

2、**导出一个完整的类、函数或重写整个对象时**，必须直接修改 `module.exports`：
```js 
module.exports = {
    "name": "demo",
    "desc": "随便写一下"
};
// 或者导出函数
// module.exports = function() { ... }
```


#### ⁠1.1.2 ⁠require函数

`require` 是 Node.js CommonJS 模块系统的核心函数，用来**加载并执行**一个模块，然后返回该模块的 `module.exports`。

下面从原理到使用细节，系统讲清楚。

```js
const result = require(模块路径或名称);
```

它做了以下几件事：

1. 根据路径/名称找到对应的模块文件
2. 如果这个模块还没加载过，就执行它
3. 返回该模块的 `module.exports`
4. 把结果缓存起来，下次直接返回缓存

 require 的三种常见用法

```js
// 1. 加载核心模块（Node 内置）
const fs = require('fs');
const path = require('path');
const http = require('http');

// 2. 加载本地文件（相对/绝对路径）
const math = require('./math');          // 同级目录
const utils = require('../utils');       // 上一级目录
const config = require('/Users/xxx/config'); // 绝对路径

// 3. 加载第三方包（从 node_modules 找）
const express = require('express');
const lodash = require('lodash');
const axios = require('axios');
```



`require` 查找模块的顺序大致如下：

```
require('xxx')
    │
    ├─ 1. 是不是核心模块？（fs、path、http...）
    │     是 → 直接返回
    │
    ├─ 2. 路径是不是以 ./  ../  / 开头？
    │     是 → 按文件路径查找
    │         ├── 精确匹配文件
    │         ├── 自动补全 .js / .json / .node
    │         └── 如果是目录，找 package.json 的 main 字段，或 index.js
    │
    └─ 3. 否则当作包名，去 node_modules 里找
          ├── 当前目录的 node_modules
          ├── 上一级的 node_modules
          ├── 再上一级...
          └── 直到根目录
```

## ⁠2 ⁠ES Modules（现代写法）

ES Modules (ESM) 是 JavaScript 的官方标准化模块系统、背后底层的运行和加载机制主要分为三个独立且连续的阶段：构建（Construction）、实例化（Instantiation）和求值（Evaluation）。

### ⁠2.1 ⁠加载机制

1、 构建阶段 (Construction)

在这个阶段，JavaScript 引擎会寻找、读取并将所有的代码文件解析为内部的数据结构。
- **查找与获取：** 引擎从入口文件开始，遇到 `import` 语句时，根据指定的路径或 URL 获取对应的文件内容（浏览器中是网络请求，Node.js 中是磁盘读取）。
- **生成模块记录：** 引擎不执行代码，而是将代码文本解析成抽象语法树（AST），并转换为包含模块元数据的“模块记录”（Module Record）。
- **构建依赖图：** 引擎顺藤摸瓜，递归解析所有依赖，最终在内存中拼凑出一张完整的“模块依赖图”。
    

 2、实例化阶段 (Instantiation)

依赖图构建完成后，引擎开始为模块中的变量分配内存，并将 `import` 和 `export` 连接起来。
- **内存分配：** 引擎遍历所有模块记录，为所有的导出变量（`export`）在内存中开辟空间，但此时**不执行代码，不赋予实际值**（相当于只是占了个位置）。
- **建立活绑定 (Live Bindings)：** 引擎会将导入方（`import`）的变量直接指向导出方在内存中的同一地址。导入方的这个变量是一个**只读的引用（指针）**，这意味着模块间的关联在代码运行前就已经在底层“硬连接”好了。
    
      
    

3、求值阶段 (Evaluation)

连接全部建立后，引擎终于开始逐行运行代码，用真实的值填满刚才分配的内存空间。

  

- 引擎按照依赖树进行深度优先、后序遍历的代码执行。这意味着最底层的、没有任何外部依赖的模块（叶子节点）会最先被执行。
- 随着代码一层层向上执行，各个导出变量被赋予了真正的计算结果。由于前面建立了“活绑定”，导入方模块此时就能立刻读到内存中最新计算出来的值。
    
      
    

通过这三个阶段的设计，ESM 在底层表现出了与 CommonJS 完全不同的特性：

| **核心维度**  | **CommonJS (require)**                    | **ES Modules (import)**                         |
| --------- | ----------------------------------------- | ----------------------------------------------- |
| **执行时机**  | **运行时同步执行**。遇到 `require` 立即停下来执行被引入的模块代码。 | **编译时静态解析**。先完全理清依赖并建立连接，最后再统一执行。               |
| **变量传递**  | **值的拷贝**。导出的是对象的一个快照，模块内部后续的值变化不会反映到外部。   | **活绑定（内存引用）**。导入和导出指向同一个内存地址，导出方的数据变化，导入方能实时感知。 |
| **语法限制**  | 动态语法，`require` 可以写在 `if` 语句或函数内部。         | 静态语法，`import` 必须写在文件的最顶层（顶层作用域）。                |
| **死代码消除** | 难以分析，打包工具通常只能将整个对象打包。                     | 静态结构清晰，非常利于打包工具进行 **Tree Shaking**，剔除未使用的代码。    |

```js
// math.mjs 或 package.json 设置 "type": "module"
export function add(a, b) {
  return a + b;
}
export default function multiply(a, b) {
  return a * b;
}

// app.js
import multiply, { add } from './math.js';
console.log(add(2, 3));
console.log(multiply(2, 3));
```

特点：
- 静态分析（编译期就能确定依赖）
- 支持 tree-shaking（打包时删除未使用代码）
- 顶层 `await` 支持
- 浏览器和 Node 都能用同一套语法

**模块查找规则**（简化版）：
1. 核心模块（如 `fs`、`path`、`http`）直接用名字
2. 相对/绝对路径（`./`、`../`、`/`）
3. `node_modules` 目录向上查找

### ⁠2.2 ⁠导入导出

掌握 ES Modules (ESM) 的用法，核心在于理解**静态的声明式语法**（`import`/`export`）以及**动态按需加载**（`import()`）。以下是 ESM 在实际开发中的全场景用法指南。

  
1、静态的声明式导出：
- 命名导出（Named Exports）：导入时必须使用真实名称
- 默认导出（Default Export）：由于一个模块只有一个默认导出，在导入时可以随便起名字，且可以不用加大括号



#### ⁠2.2.1 ⁠基础静态声明式导入导出

1、export导出

```js
// 方式 1：就地导出
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// 方式 2：统一导出（推荐，结构更清晰）
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
export { multiply, divide };
```


2、import导入

```js
import { PI, add, multiply } from './math.js';

// 使用 as 关键字重命名，防止命名冲突
import { divide as div } from './math.js'; 
```
> 注意：ESM 的 `import { ... }` 是一种底层的、静态的语法（称为**命名导入 Named Imports**）。不是对象的解构赋值，它们是2个完全不同的语法。

3、默认导出 export default

```js
// 方式 1：直接默认导出匿名函数或类
export default function(msg) {
  console.log(`[LOG]: ${msg}`);
}

// 方式 2：先声明后导出
const config = { level: 'debug' };
export default config;
```

```js
// 名字可以随便起，这里叫 myLogger 和 myConfig
import myLogger from './logger.js';
```

4、混合导入，

```js
// 假设 config.js 导出了 default 和 API_KEY
import globalConfig, { API_KEY, PORT } from './config.js';
```

_(注意：默认导入 `globalConfig` 必须放在大括号前面)_

  

5、命名空间导入：使用 `* as` 语法，把一个模块里所有的命名导出统一挂载到一个对象上


```js
import * as Utils from './math.js';

console.log(Utils.PI);
console.log(Utils.add(1, 2));
```

6、聚合导出

在构建大型项目或组件库时，通常会有一个 `index.js` 作为“统一入口”（Barrel Pattern），把分散在各个文件里的模块聚合后重新导出。
**`index.js` (聚合层)：**

```js
// 1. 转发特定的命名导出
export { Button, Input } from './components.js';

// 2. 转发另一个文件的所有命名导出
export * from './utils.js';

// 3. 将另一个文件的默认导出，转化为当前的命名导出
export { default as Theme } from './theme.js';
```

#### ⁠2.2.2 ⁠动态导入

前文提到 ESM 的 `import` 必须写在文件顶层，它是静态的。但如果需要**按需加载**（例如点击按钮才加载某个庞大的图表库以优化首屏速度），就需要用到动态 `import()` 函数。

  

动态 `import()` 返回一个 Promise，完全不阻塞主线程。


```js
button.addEventListener('click', async () => {
  try {
    // 运行时按需异步下载并执行该模块
    const echarts = await import('./heavy-echarts.js');
    echarts.init(document.getElementById('chart'));
  } catch (err) {
    console.error('模块加载失败', err);
  }
});
```


  

### ⁠2.3 ⁠A. 顶层 Await (Top-level Await)

在 CommonJS 中，`await` 必须被包裹在 `async` 函数内部。而在 ESM 的顶层作用域中，你可以直接使用 `await`。这对于模块初始化时需要拉取异步配置非常有用：

  

JavaScript

```js
// db-connection.js
import { createConnection } from 'db-driver';

// 模块会被“暂停”，直到连接成功，导入此模块的其他文件也会等待
export const db = await createConnection({ host: 'localhost' }); 
console.log("数据库连接已就绪");
```

### ⁠2.4 ⁠B. 模块元数据 `import.meta`

它提供关于当前模块的上下文信息，最常用的是获取当前文件的路径（替代了 CommonJS 中不可用的 `__dirname` 和 `__filename`）：


```js
console.log(import.meta.url); // 返回当前模块的绝对 URL (file://...)
```

### ⁠2.5 ⁠6. 在不同环境中开启 ESM

为了与传统的环境兼容，你需要明确告诉运行环境“这是一个 ESM 模块”。
**在 Node.js 中（两种方式任选）：**
1. 把文件后缀改为 `.mjs`。  
2. 在项目的 `package.json` 中添加 `"type": "module"` 字段。此时该项目下的所有 `.js` 文件都会被视为 ESM。（如果偶尔需要写 CommonJS，可将后缀改为 `.cjs`）。

**在浏览器 (HTML) 中：** 必须在 `<script>` 标签上添加 `type="module"` 属性：

```html
<script type="module" src="./app.js"></script>
<!-- 带有 type="module" 的脚本会自动拥有 defer 属性（延迟且按顺序执行） -->
```



# 包和npm

在Node.js中，包是一个**包含了 `package.json` 文件的普通文件夹**，用于管理多个模块，可以使用npm工具来去下载和管理包。
>包用于打包和发布多个模块，类似于Java中的jar，可以使用maven工具进行发布到公共仓库中，当在我们的项目中想方便的使用公共仓库中别人写好的包，**就需要让我们的项目遵循标准的结构，比如在Java中使用maven来创建项目，初始化项目结构，在node.js中通过npm来创建项目，初始化项目结构**，然后就可以方便的使用仓库中的包。
  

```bash
my-awesome-package/
├── package.json        # 核心：包的元数据和依赖清单
├── README.md           # 文档：详细的使用说明
├── LICENSE             # 法律：开源许可协议
├── .gitignore          # 忽略：控制哪些文件不提交到 Git
├── .npmignore          # 忽略：控制发布到 npm 时剔除哪些文件
├── index.js            # 入口：模块的默认导出入口
├── src/                # 源码目录：存放所有的原始代码
│   ├── utils.js
│   └── api.js
├── dist/ (或 lib/)     # 产物目录：编译、打包后的代码
├── test/               # 测试目录：存放所有的单元测试用例
└── node_modules/       # 依赖目录：第三方包（绝不提交 Git，也不随包发布）
```

- 一旦有了 `package.json`（相当于这个包的“身份证”和“说明书”），这个文件夹就不再是一个普通的文件夹，它正式蜕变成为了一个**包（Package）**。别人只需要 `require('你的包名')`，Node.js 就会自动去找你包里的 `package.json`，根据里面的配置找到正确的入口文件来执行。
- 当在项目根目录下执行 `npm install` 时，npm 会根据 `package.json` 里的清单，去云端把包下载下来，并全部塞进项目根目录下的 `node_modules` 文件夹中。


目前Node.js 主流包管理器：
- **npm (Node Package Manager)**：Node.js 内置的默认包管理器。在 Node.js 20 的优化下，性能和磁盘效率已大幅提升，单项目场景下与其他工具差异不大，但在处理大量本地项目时存在依赖冗余问题。
    
- **Yarn**：Facebook 早期为解决 npm 速度慢和依赖锁定问题推出的替代品。经典版 (Yarn 1) 相比最新版 npm 优势不再明显，而 Yarn Berry (v2+) 采用了 Plug'n'Play 机制，但对老项目的兼容性可能存在挑战。
    
- **pnpm (Performant npm)**：目前前端生态极受欢迎的工具。通过“全局 Store + 硬链接 / 软链接”机制，在多项目或 Monorepo 场景下能爆炸性地节省磁盘空间，并显著提升安装速度。
    
- **Bun**：基于 Zig 语言编写的全能型运行时和包管理器，拥有极高的极限安装速度。不过其在去重和节省磁盘空间上的优化机制目前还不如 pnpm

## ⁠1 ⁠npm常用命令

```bash
# 1. 新建一个项目
mkdir my-project && cd my-project
npm init -y

# 2. 安装常用依赖
npm install express cors dotenv
npm install -D nodemon typescript @types/node

# 3. 查看当前安装了哪些包
npm list --depth=0

# 4. 运行开发脚本
npm run dev

# 5. 检查并更新依赖
npm outdated
npm update

# 6. 清理重装（遇到依赖问题时常用）
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
## ⁠2 ⁠CommonJS 下的标准包结构

```bash
my-cjs-package/
├── package.json
├── index.js            # 对外暴露的主入口
└── src/
    ├── utils.js        # 内部业务逻辑 1
    └── api.js          # 内部业务逻辑 2
```

package.json 说明：如果不写 `"type"` 字段，Node.js 默认将所有 `.js` 文件作为 CommonJS 处理。

```json 
{
  "name": "my-cjs-package",
  "version": "1.0.0",
  "description": "基于 CommonJS 规范的包",
  "main": "index.js",
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

`index.js` 主入口：通过 `require` 引入私有文件，再通过 `module.exports` 组合暴露出一个统一的对象。
```js 
// 1. 同步引入内部模块
const utils = require('./src/utils');
const api = require('./src/api');

// 2. 统一暴露给调用方
module.exports = {
  formatDate: utils.formatDate,
  calculate: utils.calculate,
  fetchData: api.fetchData
};
```



## ⁠3 ⁠ES Module下的标准包结构

在 ESM 规范下，包结构外观没有改变，但配置文件必须声明 `"type": "module"`，并推荐使用 `"exports"` 字段进行严格的路径封装。入口代码则转变为声明式的重导出语法。
> 在CommonJS下，即使用户不通过 `index.js`，也可以强行写路径引入你包里的内部私有文件（例如 `require('your-package/src/utils.js')`），这破坏了包的封装性。而在 ESM 的 `"exports"` 下，**没有被显式声明的路径，外部绝对无法访问**。Node.js 会直接抛出 `ERR_PACKAGE_PATH_NOT_EXPORTED` 错误 



```bash 
my-esm-package/
├── package.json
├── index.js            # 对外暴露的主入口
└── src/
    ├── utils.js        # 内部业务逻辑 1
    └── api.js          # 内部业务逻辑 2
```

`package.json` ：必须显式声明 `"type": "module"`。使用 `"exports"` 替代 `"main"`，以实现更细粒度的导出控制。

```json 
{
  "name": "my-esm-package",
  "version": "1.0.0",
  "description": "基于 ES Modules 规范的包",
  "type": "module",
  "exports": {
    ".": "./index.js",             // 默认入口：import { xxx } from 'my-esm-package'
    "./utils": "./src/utils.js"    // 按需入口：import { xxx } from 'my-esm-package/utils'
  },
  "dependencies": {
    "lodash-es": "^4.17.21"
  }
}
```


`index.json`主入口：不需要先用变量接收再导出，直接利用 ESM 的中转导出（Re-exporting）语法，在引入的同时将其暴露出去。**注意：引入相对路径时必须带上 `.js` 后缀。**

```js
// 1. 将 utils.js 中的所有命名导出，直接暴露出去
export * from './src/utils.js';

// 2. 挑选 api.js 中的特定函数暴露
export { fetchData, uploadData } from './src/api.js';

// 3. 将某个默认导出，重命名后作为命名导出暴露
export { default as ApiClient } from './src/api.js';
```

## ⁠4 ⁠package.json说明

`package.json` 既是 Node.js 项目的“身份证”，也是整个项目依赖和生命周期的“控制中心”。
常见的属性可以按照功能划分为以下五大核心区块：

  

### ⁠4.1 ⁠1. 身份与基础信息

这是你的包在 npm 仓库中独一无二的标识。如果你只是在本地写项目不打算发布，这些属性主要起说明作用。

- **`name`**: 包的名称。必须是小写字母，不能包含空格（通常用中划线连接）。在 npm 仓库中必须唯一。
- **`version`**: 版本号。npm 严格遵循**语义化版本控制 (SemVer)**。格式为 `主版本号.次版本号.修订号`（如 `1.0.0`）。
- **`description`**: 简短的项目描述，方便在 npm 上被搜索到。
- **`author`**: 创作者信息。
- **`license`**: 软件授权协议（如 `MIT`、`ISC`、`Apache-2.0`）。商业项目中，合规团队会严格审查依赖包的此项属性。
    
      
    

### ⁠4.2 ⁠2. 模块规范与入口

这些属性决定了 Node.js 如何解析和运行你的代码。
- **`main`**: 传统的 CommonJS 默认入口文件。当别人 `require('你的包')` 时，Node.js 实际上加载的就是这个属性指定的文件（默认是 `index.js`）。
- **`type`**: 模块系统开关。如果设置为 `"module"`，Node.js 会将该项目下的所有 `.js` 文件按照 ES Modules (ESM) 规范来解析（支持顶层 `import/export`）。默认值是 `"commonjs"`。
- **`exports`**: 现代 Node.js 的高级入口映射表（优先级高于 `main`）。它不仅可以配置不同环境的入口（比如按需提供 ESM 或 CJS 版本），还能严格控制哪些内部文件允许被外部访问，实现“私有 API 保护”。
    
      
    

### ⁠4.3 ⁠3. 依赖管理

这是 `package.json` 最核心的作用：管理第三方包。
- **`dependencies`**: **生产环境依赖**。代码在生产服务器上运行时必不可少的包（如 `express`、`react`、`axios`）。使用 `npm install <包名>` 时，默认记录在这里。
- **`devDependencies`**: **开发环境依赖**。只在开发、编译或测试阶段需要，项目打包上线后不需要的包（如 `webpack`、`eslint`、`jest`）。使用 `npm install <包名> -D` 记录在此。
- **`peerDependencies`**: **同伴依赖**。通常在你写插件时使用。比如你写了一个 Vue 组件，你期望使用你组件的项目环境里已经安装了特定版本的 Vue，但你不希望自己的包把 Vue 重新下载一遍，此时就会用到它。
    
      
    

### ⁠4.4 ⁠4. 脚本与自动化

- **`scripts`**: 项目的“快捷指令表”。它允许你封装复杂的终端命令。
    ```json
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "build": "webpack --mode production"
    }
    ```

一个标准的现代化 Node.js 项目（无论是后端服务还是前端工程），其 `package.json` 中的 `scripts` 字段通常会涵盖本地开发、代码检查、测试、构建和自动生命周期等全套流程。

  

以下是一个完整且经典的 `package.json` 配置示例，随后我们将逐一拆解每个命令的详细作用与适用场景。

  

JSON

```
{
  "name": "enterprise-standard-project",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.js",
    
    "clean": "rimraf dist",
    "prebuild": "npm run clean",
    "build": "webpack --mode production",
    
    "lint": "eslint \"src/**/*.{js,ts}\"",
    "lint:fix": "eslint \"src/**/*.{js,ts}\" --fix",
    "format": "prettier --write \"src/**/*.{js,ts,json,md}\"",
    
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    
    "prepare": "husky install",
    "postinstall": "node scripts/check-env.js"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "rimraf": "^5.0.0",
    "webpack": "^5.88.2",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "jest": "^29.6.1",
    "husky": "^8.0.3"
  }
}
```

1、运行与开发环境 (Execution & Dev)
- **`"start": "node dist/index.js"`**
    - **触发方式**：`npm start`
    - **详解**：这是标准的**生产环境启动命令**。当你的代码被部署到服务器（如 Docker 容器、PM2 等）时，系统默认执行此命令。注意，这里直接使用原生的 `node` 运行编译后（`dist/`目录）的代码，绝不能在生产环境使用 `nodemon`，因为这会消耗大量不必要的内存。    
    
- **`"dev": "nodemon src/index.js"`**
    - **触发方式**：`npm run dev`
    - **详解**：**本地开发专属**。借助 `nodemon` 工具，它会监视 `src/` 目录下文件的变化。只要你按下保存键，它就会自动重启 Node.js 进程，免去了手动打断（Ctrl+C）再重启的痛苦。
        
          
        

2、构建与清理流程 (Build & Clean)
- **`"clean": "rimraf dist"`**
    - **触发方式**：`npm run clean`
    - **详解**：在每次打包前清理旧的构建产物。这里没有使用 `rm -rf dist`，而是使用了第三方包 `rimraf`，因为 `rm -rf` 是 Linux/Mac 独有的命令，在 Windows 终端下会报错。`rimraf` 保证了团队中无论是用什么操作系统的成员都能正常运行。
- **`"prebuild": "npm run clean"`**
    - **触发方式**：自动触发
    - **详解**：这是 npm 的生命周期魔法。只要命名为 `pre + 主命令`，npm 就会在执行主命令之前先执行它。当你运行 `npm run build` 时，npm 会**自动先运行 `npm run clean`**。 
- **`"build": "webpack --mode production"`**
    - **触发方式**：`npm run build`
    - **详解**：将 `src/` 目录下的源码进行编译、压缩、混淆，生成最终可以直接在生产环境运行的代码到 `dist/` 目录。这里以 Webpack 为例，实际开发中也可能是 `tsc`（TypeScript 编译）或 `vite build`。


3、质量与规范控制 (Lint & Format)

- **`"lint": "eslint \"src/**/*.{js,ts}\""`**  
    - **触发方式**：`npm run lint`
    - **详解**：静态代码检查。扫描整个 `src` 目录，找出定义了但没使用的变量、可能引发 Bug 的逻辑错误，或者不符合团队规范的代码，并在终端打印出警告和错误。
- **`"lint:fix": "eslint \"src/**/*.{js,ts}\" --fix"`**
    - **触发方式**：`npm run lint:fix`
    - **详解**：不仅检查问题，还会**自动修复**那些可以通过代码规则直接解决的问题（比如去除了未使用的变量，补全了遗漏的逗号）。冒号 `:` 是一种约定俗成的命名法，用于给脚本进行分组。
- **`"format": "prettier --write \"src/**/*.{js,ts,json,md}\""`**

    - **触发方式**：`npm run format`
    - **详解**：强制格式化代码。无论你的同事喜欢加空格还是用 Tab，只要运行这个命令，所有代码的排版（缩进、换行、单双引号）都会被 Prettier 瞬间格式化成统一标准。
        
          
        

4、自动化测试 (Testing)
- **`"test": "jest"`**
    - **触发方式**：`npm test`
    - **详解**：执行一次全量的单元测试，报告哪些测试用例通过，哪些失败。通常在提交代码前由 CI/CD 机器人自动运行。  
- **`"test:watch": "jest --watch"`**  
    - **触发方式**：`npm run test:watch` 
    - **详解**：测试驱动开发（TDD）时的最爱。它会一直运行在后台，你每次修改代码保存时，它只针对你刚才修改的文件重新跑一次相关的测试用例。  
- **`"test:coverage": "jest --coverage"`**
    - **触发方式**：`npm run test:coverage`
    - **详解**：生成测试覆盖率报告。运行结束后会在根目录生成一个 `coverage/` 文件夹，里面有 HTML 文件，打开后可以直观地看到你的代码有多少行被测试覆盖到了，有多少行是“裸奔”的。
        
          
        

5、npm 内置生命周期与钩子 (Lifecycle Hooks)

- **`"postinstall": "node scripts/check-env.js"`**
    - **触发方式**：自动触发
    - **详解**：在任何人（或服务器）运行完 `npm install` 下载完依赖之后，npm 会自动执行这个脚本。常用于检查开发者的 Node 版本是否达标，或者拉取某些私有配置。
- **`"prepare": "husky install"`**
    - **触发方式**：自动触发
    - **详解**：这是一个非常关键的特殊钩子，它在本地 `npm install` 完成后以及发布包（`npm publish`）之前触发。通常配合 `husky` 工具使用，用于拦截 Git 操作。比如：当你敲下 `git commit` 时，它会强行先去跑一遍 `npm run lint` 和 `npm test`，如果不通过就不允许提交代码。
    
      
    

5、发布与运行限制
- **`private`**: 这是一个安全阀。如果设置为 `true`，npm 将**绝对禁止**你把这个项目发布到公共仓库，有效防止企业内部闭源项目被意外开源。
- **`files`**: 一个数组，决定了当你发布到 npm 时，哪些文件或目录会被打包上传。相当于发布时的“白名单”。
- **`engines`**: 运行环境声明。用于限制你的包只能在特定版本的 Node.js 下运行。
    ```json
    "engines": {
      "node": ">= 18.0.0"
    }
    ```
    
    如果用户使用了 Node 16 安装你的包，npm 会在终端抛出警告（或通过严格模式直接报错）。



## ⁠5 ⁠前端构建工具

所谓的构建工具一般是指node.js在前端的应用，比如vite，webpack，用来翻译一些vue、react这些代码，后端没有什么构建工具，最多就是一个ts编译器，把ts代码翻译成标准的js代码。

1、为什么会出现**构建工具**

一开始编写标准的HTML/CSS/JavaScript，也不用什么构建工具，浏览器可以直接解析运行，但是后来前端的代码越写越复杂，开始使用什么Less写样式，用 ES6 甚至 TypeScript 写逻辑，还发明了 React (JSX) 和 Vue (`.vue`)。但是这些东西浏览器都无法直接解析运行，只认识标准的HTML/JS/CSS，于是前端界就开发了构建工具，比如早起的Webpack，把这些浏览器不认识的高级语法，翻译、打包、压缩成浏览器认识的标准 HTML/JS/CSS

2、有了构建工具之后，但是配置却依赖越复杂——**脚手架** 
Webpack 极其复杂，它只是一个空壳引擎。你要处理图片，得自己配置 `url-loader`；你要处理 Vue 文件，得自己装 `vue-loader`；你要处理 TypeScript，还得搞 `ts-loader`。 当时，你要想在本地从零搭建一个能跑 React 的项目，你需要手写长达几百行的 `webpack.config.js` 配置文件。2016 年左右，React 官方推出了 `create-react-app`，Vue 官方推出了 `vue-cli`。这就是最早期的**脚手架**。把最完美、最标准的 Webpack 配置提前写好，打包成一个黑盒工具：一键生成项目初始目录、核心配置文件和基础代码”的自动化程序。

3、现在我们在使用React或者vue官方最新的脚手架，默认就是使用vite构建工具


## ⁠6 ⁠关于编译后的产物

运行 `npm run build` 编译后，产物会进入到 `dist/` 目录里


### ⁠6.1 ⁠前端项目

如果你写的是 Vue、React 或普通的 HTML/网页应用，运行 `npm run build` 之后生成的 `dist/` 目录里，全都是**静态文件**（`.html`, `.css`, 浏览器版的 `.js` 图片等）。这个时候会把这些静态资源放入到nginx中进行部署，Nginx 本身**没有任何执行 JavaScript 的能力**。当用户访问你的网址时，Nginx 只是把 `dist/` 里的这些静态文件通过网络发送给用户。真正执行这些 JS 代码的，是**用户电脑里的浏览器**（比如 Chrome 内部的 V8 引擎）。在这个场景下，不需要 Node.js。

  

### ⁠6.2 ⁠后端项目

如果你写的是一个 Node.js 后端服务（比如连接 MySQL 数据库、提供 API 接口、监听 3000 端口）。


1、如果你使用原生 JavaScript 编写后端逻辑，Node.js 底层的 V8 引擎完全认识这些代码。
- 你的 `package.json` 里通常只有启动命令，比如 `"start": "node app.js"`。
- 这就相当于写 Python 或 PHP 脚本，写完直接丢到服务器上跑，**没有编译阶段**。
    

2、如果使用 TypeScript 后端（如 NestJS，或 TS 版 Express）

**需要编译，但不依赖 Webpack 或 Vite，而是依赖编译器（如 `tsc`）。**因为 Node.js 原生**不认识** TypeScript 语法，所以必须有一个“翻译”过程，把带有类型声明的 TS 代码翻译成 Node.js 能看懂的普通 JS 代码。

- 当你执行 `npm run build` 时，底层调用的通常是 **`tsc`（TypeScript 官方编译器）** 或者 **`swc`（一个极速的 Rust 编译器）**。
- 以你之前问过的 NestJS 为例，它的 `package.json` 里是 `"build": "nest build"`。这个命令底层就是调用了 `tsc`，仅仅是把 `src/main.ts` 翻译成了 `dist/main.js`，**并没有把文件打包合并在一起**，各个文件依然是独立存在的。
    


# 核心模块


