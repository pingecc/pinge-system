

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



# 包（Package）是什么
在 Node.js 的世界里，如果说模块（Module）**是一块块精心打磨的乐高积木，那么**包（Package）就是一套装在纸盒里、带有说明书和组装图纸的乐高套装。而 **npm**，则是全世界最大的乐高玩具集散中心和快递员。

  

我们可以将 Node.js 中的包和 npm 拆解为以下几个核心维度来理解：

  

## ⁠1 ⁠1. 什么是包（Package）？

包的本质，其实就是一个**包含了 `package.json` 文件的普通文件夹**。

  

以前面聊过的模块为例，单独的一个 `math.js` 文件就是一个模块。但如果你写了一套非常牛的数学计算代码，包含了几十个文件，你想把它分享给别人用。你不能直接把几十个散落的文件扔给别人，你需要：

  

1. 建一个文件夹把它们装起来。
    
      
    
2. 在里面放一个 `index.js` 作为对外的总入口。
    
      
    
3. **最重要的一步**：在根目录建一个 `package.json` 文件。
    
      
    

一旦有了 `package.json`（相当于这个包的“身份证”和“说明书”），这个文件夹就不再是一个普通的文件夹，它正式蜕变成为了一个**包（Package）**。别人只需要 `require('你的包名')`，Node.js 就会自动去找你包里的 `package.json`，根据里面的配置找到正确的入口文件来执行。

  

## ⁠2 ⁠2. 什么是 npm？

npm（Node Package Manager）通常指代三个互相关联的事物：

  

- **Registry（全球软件注册表）**：这是一个巨大的云端数据库（类似于开发者的 App Store）。全世界的开发者都会把自己的包发布到这里（比如 Vue、React、Express 都在这里）。
    
      
    
- **CLI（命令行工具）**：这就是你平时在终端里敲的 `npm install`。它是安装在你的电脑上的客户端软件，负责与云端的 Registry 通信，把别人写好的包下载到你的本地项目里。
    
      
    
- **企业/社区**：维护上述两者的组织。
    
      
    

## ⁠3 ⁠3. 包的“心脏”：`package.json`

当你在空文件夹里运行 `npm init`，就会生成这个文件。它不仅记录了你的项目名叫什么、版本号是多少，更重要的是，它管理着你的**依赖（Dependencies）**。

  

在实际开发中，我们通常会用到两种依赖：

  

- **`dependencies`（生产依赖）**：你的代码**运行**时必不可少的包。比如你用 Vue 写网页，没有 Vue 网页就跑不起来。安装命令：`npm install vue`。
    
      
    
- **`devDependencies`（开发依赖）**：只有在**开发和测试**阶段才需要的包。比如代码格式化工具、测试框架（Jest）、打包工具（Webpack）。一旦代码打包上线，这些工具就不需要了。安装命令：`npm install jest -D`（或 `--save-dev`）。
    
      
    

## ⁠4 ⁠4. npm 的物理仓库：`node_modules`

当你执行 `npm install` 时，npm 会根据 `package.json` 里的清单，去云端把包下载下来，并全部塞进项目根目录下的 `node_modules` 文件夹中。

  

关于 `node_modules` 有两个著名的梗：

  

1. **体积黑洞**：因为包是可以互相依赖的。你可能只安装了一个包 A，但 A 依赖了 B 和 C，B 又依赖了 D... 最终 npm 会顺藤摸瓜，把你不知道的几百个包全都下载下来。这也是为什么 `node_modules` 动辄几百兆甚至上 G 的原因。
    
      
    
2. **永远不要提交它**：因为体积太大且包含操作系统相关的二进制编译文件，我们**绝对不会**把 `node_modules` 提交到 Git 仓库。我们只提交 `package.json`。同事拉取代码后，在本地自己跑一次 `npm install`，就能完美复现相同的 `node_modules`。
    
      
    

## ⁠5 ⁠5. 版本锁：`package-lock.json`

既然大家都靠 `package.json` 来重新下载依赖，那如果某个依赖包的作者偷偷更新了代码，包含了一个 bug 怎么办？

  

为了防止“在我的电脑上能跑，在你的电脑上跑报错”的悲剧，npm 引入了 `package-lock.json`。`package.json` 里写的通常是**版本范围**（比如 `"express": "^4.17.1"`，意思是只要是 4.x 版本的最新版都可以）。 而 `package-lock.json` 会死死记住你当时安装时的**绝对精确版本号**（甚至包括下载地址的哈希值），以及整棵依赖树的结构。当你或者同事再次 `npm install` 时，npm 会优先按照 lock 文件来下载，确保每个人本地的代码环境连一个字节都不差。

  

包和 npm 的出现，彻底改变了前端和 Node.js 的开发模式。我们不再需要去各个官网下载 JS 文件，而是通过简单的命令行指令，就能站在全世界百万开发者的肩膀上构建应用。
