


# 介绍

TypeScript（简称 TS） 是由微软开发的一门开源编程语言，是 JavaScript 的超集。它在 JS 的基础上增加了静态类型系统，最终通过编译器（tsc）转译成普通的 JavaScript，可以在任何支持 JS 的环境中运行（浏览器、Node.js、Deno 等）。

> 超集：指的是所有合法的JS代码都是合法的TS代码。

## ⁠1 ⁠环境说明


### ⁠1.1 ⁠1. `typescript`

**作用**  
TypeScript 官方编译器，提供 `tsc` 命令，负责类型检查和把 `.ts`/`.tsx` 编译成 JavaScript。

**应用场景**  
几乎所有 TypeScript 项目都要装，是基础依赖。

**常用命令**
```bash
npx tsc                    # 编译项目
npx tsc --noEmit           # 只做类型检查，不生成文件
npx tsc --watch            # 监听模式编译
npx tsc --init             # 生成 tsconfig.json
npx tsc --showConfig       # 查看最终合并后的配置
```

**相关配置**  
主要通过 `tsconfig.json` 控制：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

**安装**
```bash
pnpm add -D typescript
```

---

### ⁠1.2 ⁠2. `@types/node`

**作用**  
为 Node.js 内置模块（`fs`、`path`、`http`、`process` 等）提供类型定义。

**应用场景**  
所有跑在 Node.js 环境的 TypeScript 项目（后端、CLI、构建脚本等）。

**常用命令**  
无独立命令，安装后自动生效。

**相关配置**  
在 `tsconfig.json` 中指定：
```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```
如果不写 `types`，TypeScript 默认会自动加载所有 `@types/*`。

**安装**
```bash
pnpm add -D @types/node
```

---

### ⁠1.3 ⁠3. `@types/react` 和 `@types/react-dom`

**作用**  
为 React 和 ReactDOM 提供类型定义，让 TypeScript 认识 JSX、Hooks、组件 props 等。

**应用场景**  
所有 React + TypeScript 项目（Vite、Next.js、CRA 等）。

**常用命令**  
无独立命令。

**相关配置**  
通常不需要额外配置，安装后自动生效。如果用了 `jsx`，建议在 tsconfig 里写：
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

**安装**
```bash
pnpm add -D @types/react @types/react-dom
```

---

### ⁠1.4 ⁠4. `tsx`

**作用**  
基于 esbuild 的 TypeScript 执行器，可以直接运行 `.ts`/`.tsx` 文件，启动极快（毫秒级），无需先编译。

**应用场景**  
- 开发时运行后端服务
- 写脚本、CLI 工具
- 替代老旧的 `ts-node`

**常用命令**
```bash
tsx src/index.ts                  # 直接运行
tsx watch src/index.ts            # 监听文件变化自动重启
node --import tsx src/index.ts    # 通过 node 调用
```

**相关配置**  
几乎零配置，会读取 `tsconfig.json` 中的路径别名等。  
推荐在 `package.json` 中：
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

**安装**
```bash
pnpm add -D tsx
```

---

### ⁠1.5 ⁠5. `oxlint` + `oxlint-tsgolint`

**作用**  
超快的 Linter（Rust + Go 实现）。`oxlint` 负责语法检查，`oxlint-tsgolint` 负责类型感知检查（类似 typescript-eslint 的能力）。

**应用场景**  
现代 TypeScript 项目的代码检查，尤其适合大型项目或追求速度的团队。比 ESLint + typescript-eslint 快 10–20 倍。

**常用命令**
```bash
oxlint                          # 基础检查
oxlint --type-aware             # 开启类型感知检查
oxlint --type-aware --fix       # 自动修复
oxlint --type-aware --type-check  # 同时报告 TypeScript 错误
```

**相关配置**  
可创建 `.oxlintrc.json`：
```json
{
  "plugins": ["typescript", "react"],
  "categories": {
    "correctness": "error"
  },
  "rules": {
    "typescript/no-explicit-any": "warn"
  }
}
```

**安装**
```bash
pnpm add -D oxlint oxlint-tsgolint
```

---

### ⁠1.6 ⁠6. `@tsconfig/*` 系列（如 `@tsconfig/node24`、`@tsconfig/strictest`）

**作用**  
官方维护的 tsconfig 预设，帮你快速获得合理的编译器配置。

**应用场景**  
不想从零手写 `tsconfig.json` 的项目，尤其是 Node、React、Vite 等常见场景。

**常用命令**  
无独立命令。

**相关配置**  
在自己的 `tsconfig.json` 中继承：
```json
{
  "extends": [
    "@tsconfig/node24/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json"
  ],
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

**常用包**
- `@tsconfig/node24`（或对应 Node 版本）
- `@tsconfig/strictest`
- `@tsconfig/vite-react`

**安装**
```bash
pnpm add -D @tsconfig/node24 @tsconfig/strictest
```

---

### ⁠1.7 ⁠7. `rimraf`（或 `del`）

**作用**  
跨平台删除文件/文件夹（相当于 `rm -rf`），常用于清理构建产物。

**应用场景**  
构建前清理 `dist` 目录，保证构建干净。

**常用命令**
```bash
rimraf dist
# 或在脚本中
```

**相关配置**  
推荐在 `package.json` 中：
```json
{
  "scripts": {
    "clean": "rimraf dist",
    "prebuild": "pnpm run clean"
  }
}
```

**安装**
```bash
pnpm add -D rimraf
```

---

### ⁠1.8 ⁠8. `ts-node`（已不推荐新项目使用）

**作用**  
老牌的 TypeScript 运行器，支持完整类型检查，但启动慢，ESM 支持麻烦。

**应用场景**  
仅维护老项目时使用。新项目请用 `tsx` 替代。

**常用命令**
```bash
ts-node src/index.ts
ts-node --transpile-only src/index.ts   # 跳过类型检查，加快速度
```

---

### ⁠1.9 ⁠快速对照表

| 包名                  | 主要作用               | 是否必须 | 推荐程度 |
|-----------------------|------------------------|----------|----------|
| `typescript`          | 编译 + 类型检查        | 必须     | ★★★★★    |
| `@types/node`         | Node 类型              | 后端必须 | ★★★★★    |
| `@types/react`        | React 类型             | 前端必须 | ★★★★★    |
| `tsx`                 | 开发时直接运行 TS      | 强烈推荐 | ★★★★★    |
| `oxlint`              | 快速 Lint              | 推荐     | ★★★★☆    |
| `@tsconfig/*`         | 配置预设               | 推荐     | ★★★★☆    |
| `rimraf`              | 清理构建产物           | 常用     | ★★★☆☆    |
| `ts-node`             | 旧版运行器             | 不推荐   | ★☆☆☆☆    |

需要我针对某个具体包再深入讲解配置细节，或者给出一套完整的项目模板吗？



### ⁠1.10 ⁠手动挡，先编译成js代码，再运行js

```Bash
# 安装typescript编译器模块
npm install -g typescript
# 查看版本
tsc --v

# 编译 ts文件 会生成对应的demo.js
tsc demo.ts
# 再运行demo.js
node demp.js

# 如果希望在Node.js上直接运行typeScript代码，无需预编译，则可以按照tsx模块
npm install -g tsx

# 直接运行demo.ts
tsx demo.ts
```

### ⁠1.11 ⁠基于tsx直接运行

tsx是一个命令行工具，负责把 TypeScript 转换成可执行的 JS 并立刻运行（不做类型检查）。

1、准备环境
- 安装 [Node.js](https://nodejs.org/)（建议最新 LTS，目前是 Node 26）。
- 安装编辑器：推荐 **VS Code**（对 TypeScript 支持最好）。

2、 创建项目并安装工具
```bash
mkdir ts-playground
cd ts-playground
npm init -y
npm install -D tsx typescript @types/node
```

3、 `hello.ts`
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const user = { name: "张三", age: 25 };
console.log(greet(user.name));

// 你的IDE会类型错误示例（tsx 不会阻止运行，但编辑器会标红）
// greet(123);
```

4、直接运行
```bash
# 单次运行
npx tsx hello.ts

# 监听文件变化自动重启（类似 nodemon）
npx tsx watch hello.ts
```

5、 配置 package.json 方便使用
```json
{
  "scripts": {
    "dev": "tsx watch hello.ts",
    "start": "tsx hello.ts",
    "type-check": "tsc --noEmit"
  }
}
```

之后就可以：
```bash
npm run dev        # 开发时自动重启
npm run type-check # 单独做类型检查
```

---

### ⁠1.12 ⁠方式二：纯 Node.js 原生运行（零依赖）

如果你用的 Node.js ≥ 22.18（或 23.6+），可以直接：

```bash
node hello.ts
```

**注意限制**：
- 不支持 `enum`、`namespace`、构造函数参数属性等。
- 不会报类型错误（只是把类型擦掉后运行）。
- 适合练习基础类型、接口、泛型等「可删除语法」。

如果想让编辑器更严格地提示，可以加一个 `tsconfig.json`：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmit": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true
  }
}
```


## ⁠2 ⁠为什么采用类型注解后置的方式？

为什么TypeScript要基于注解的方式，不直接在变量，参数，或者返回值时，在它们的前面添加类型，这不是更加直观么，像Java C/C++ 一样。 


“在前面加类型”是 **Java / C# / C++** 的风格：

```java
int age = 25;
String name = "张三";
public int add(int a, int b) { ... }
```

而 TypeScript 用的是 **后置注解**风格：

```typescript
let age: number = 25;
let name: string = "张三";
function add(a: number, b: number): number { ... }
```

为什么 TypeScript 选择后置注解，主要有以下几个核心原因：

1、必须与 JavaScript 高度兼容（最重要的原因）
TypeScript 是 **JavaScript 的超集**，所有合法的 JS 代码必须也是合法的 TS 代码。
如果采用前置类型，会和现有的 JavaScript 语法产生严重冲突，例如：
- JS 里已经有**标签语句**（Label）：`loop: for (...)`
- 对象字面量：`{ name: "张三" }`
- 类型断言、泛型等都会变得很难解析
后置用冒号 `:` 的方式，解析器可以比较容易地识别出“这是类型注解”，并在编译时直接丢掉，不影响原来的 JS 语义。



其实很多现代语言在面对“和现有生态兼容”或“类型可选”时，也采用了类似策略：

| 语言       | 类型位置     | 备注                     |
|------------|--------------|--------------------------|
| TypeScript | 后置 `:`     | 为了兼容 JS              |
| Python     | 后置 `:`     | 类型提示（可选）         |
| Kotlin     | 后置 `:`     | 类型可推断               |
| Rust       | 后置 `:`     | 强类型 + 推断            |
| Go         | 后置         | 刻意简化                 |
| Java / C#  | 前置         | 强类型，从一开始就有类型 |

## ⁠3 ⁠为什么TypeScript被认为是一门新的语言？

问：TypeScript的作用只是在编译期间，提供类型支持，那为什么要新起一个编程语言名字，感觉也没做什么，python中也加了类型注解


你的感觉很敏锐，这个问题很多从其他语言转过来的人都会问。

**简短回答：**  
TypeScript 确实主要在**编译期**起作用（类型检查 + 转译成 JavaScript），运行时和普通 JavaScript 几乎没有区别。但它之所以被当成一门独立语言，而不是“JavaScript 加了类型注解”，是因为它的**类型系统规模和复杂度**已经远超“加注解”的范畴。

和 Python 类型注解的本质区别

| 维度 | Python 类型注解 | TypeScript |
|------|------------------|------------|
| **定位** | 可选的提示，解释器基本忽略 | 语言核心特性，有完整编译器 |
| **类型系统复杂度** | 相对简单（主要是基础类型 + 一些高级特性） | 非常强大（泛型、条件类型、映射类型、模板字面量类型等） |
| **语法扩展** | 基本不改变语法，只是加了注解 | 大量新语法（`interface`、`enum`、`type`、泛型尖括号、类型断言等） |
| **工具依赖** | 依赖第三方工具（mypy、pyright） | 官方编译器 `tsc` 是一等公民 |
| **生态** | 类型检查是附加的 | 整个前端/Node 生态大量围绕 TS 类型构建 |
| **运行时影响** | 几乎无 | 几乎无（类型被擦除） |

Python 的类型注解更像是“给已有语言贴标签”，而 TypeScript 从设计之初就是**带完整类型系统的语言**，只是最终编译目标是 JavaScript。





# 基本数据类型约束

1、通过类型注解后置的方式，**显式声明变量、参数、返回值的类型**，同时在首次赋值时可以不用写类型注解，支持类型推断。

2、核心思想：使用了类型注解之后，就相当于给该变量，参数指定了类型，不能随意赋值其它类型的数据，和强类型语言一样。

3、通常对函数参数、返回值、公共 API 显式加类型，对局部变量可依赖推断（减少冗余）

```TypeScript
// 语法
let 变量名: 类型 = 值;
function fn(参数: 类型): 返回类型 { ... }

// 示例
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let list1: number[] = [1, 2, 3];

function greet(user: string): string {
  return "Hello, " + user;
}

// 无法随意赋值其它类型的数据，编译报错。
let x: number = 42;
x = "hello"; // ❌ 编译错误：Type 'string' is not assignable to type 'number'
```


# 其它基础类型扩展

除了 JS 的原始类型，TS 还引入了以下类型：

| 类型                       | 实用程度  | 实际使用频率 | 说明                                                                    |
| ------------------------ | ----- | ------ | --------------------------------------------------------------------- |
| **字面量类型（Literal Types）** | ★★★★★ | 非常高    | 日常最常用之一；精确到具体值，如 `type Status = 'success'`                            |
| **void**                 | ★★★★★ | 非常高    | 几乎所有无返回值函数都用；表示函数无返回值                                                 |
| **unknown**              | ★★★★☆ | 较高     | 处理外部数据时强烈推荐；安全的“任意类型”，需类型守卫后才能使用                                      |
| **never**                | ★★★☆☆ | 中等     | 高级但很有价值；表示永远不会返回（如抛异常、死循环）                                            |
| 元组（Tuple）                | ★★★☆☆ | 中等     | 有特定场景；固定长度和类型的数组，如 `let rgb: [number, number, number] = [255, 0, 0];` |
| enum                     | ★★☆☆☆ | 较低     | 争议较大，很多项目少用                                                           |
| any                      | ★☆☆☆☆ | 尽量少用   | 能不用就不用；关闭类型检查（慎用）                                                     |

下面按合并表格中的 7 个类型分别讲解。它们都是 TypeScript 中常见且容易混淆的类型。

---

## ⁠1 ⁠1. 字面量类型（Literal Types）

**定义**：把类型限定为某个具体的值，而不是宽泛的 `string`、`number`、`boolean`。

**示例**：

```ts
type Status = 'success' | 'error' | 'loading';

let s: Status = 'success'; // ✅
// s = 'failed';           // ❌ 不在联合类型中

type Direction = 0 | 1 | 2;
type Flag = true;
```

也支持模板字面量类型：

```ts
type CSSSize = `${number}px`;
let w: CSSSize = '10px'; // ✅
```

**特点**：
- 常与联合类型一起用，替代部分 `enum` 场景。
- 能精确约束取值，提升类型安全。
- 日常非常常用，尤其用于状态、配置项、事件名等。

**建议**：状态值、固定配置项优先考虑字面量联合类型。

---

## ⁠2 ⁠2. void

**定义**：表示“没有返回值”。最常见于函数返回值类型。

**示例**：

```ts
function log(msg: string): void {
  console.log(msg);
}

const f: () => void = () => {
  // 可以不返回值
};
```

**注意点**：
- `void` 函数可以没有 `return`，或 `return;`，但不能 `return 具体值`。
- 在 `strictNullChecks` 下，`let x: void` 基本只能赋 `undefined`。
- 回调函数中 `() => void` 表示“返回值会被忽略”，并不强制函数真的不返回东西。

```ts
function run(cb: () => void) {}

run(() => 123); // ✅ 返回值被忽略，常见于回调
```

**建议**：无返回值函数明确写 `void`，可读性更好。

---

## ⁠3 ⁠3. unknown

**定义**：安全的“任意类型”。可以接收任何值，但在使用前必须通过类型守卫收窄。

**示例**：

```ts
let value: unknown = JSON.parse('{"name":"Tom"}');

// value.name; // ❌ 不能直接访问
if (typeof value === 'object' && value !== null && 'name' in value) {
  console.log((value as { name: string }).name);
}
```

更常见的写法：

```ts
function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function handle(v: unknown) {
  if (isString(v)) {
    console.log(v.toUpperCase()); // ✅ 已收窄为 string
  }
}
```

**和 any 的区别**：
- `any`：关闭类型检查，随便用。
- `unknown`：可以装任何值，但不能随便用，必须先检查/收窄。

**建议**：处理外部数据、`catch` 错误、JSON 解析结果时优先用 `unknown`，而不是 `any`。

---

## ⁠4 ⁠4. never

**定义**：表示“永远不会正常返回”或“不可能存在的值”。

**常见场景**：

1. 函数总是抛异常：

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

2. 死循环：

```ts
function loop(): never {
  while (true) {}
}
```

3. 穷尽检查：

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2;
    case 'square':
      return s.size ** 2;
    default:
      const _exhaustive: never = s;
      return _exhaustive;
  }
}
```

如果以后新增了 `Shape` 分支但忘记处理，`never` 检查会报错。

**特点**：
- `never` 是所有类型的子类型，可以赋给任何类型。
- 没有值能赋给 `never`，除了 `never` 自身。
- 高级但很有价值，常用于穷尽性检查和不可达分支。

**建议**：联合类型 `switch` 的 `default` 中用 `never` 做穷尽检查。

---

## ⁠5 ⁠5. 元组（Tuple）

**定义**：固定长度、固定位置类型的数组。

**示例**：

```ts
let rgb: [number, number, number] = [255, 0, 0];

// rgb = [255, 0];       // ❌ 长度不对
// rgb = [255, 0, '0'];  // ❌ 类型不对
```

可命名元素：

```ts
type Point = [x: number, y: number];
const p: Point = [10, 20];
```

可选元素和剩余元素：

```ts
type Range = [start: number, end?: number];
type Args = [string, ...number[]];

const args: Args = ['sum', 1, 2, 3];
```

**注意点**：
- 元组本质仍是数组，但长度和每项类型更精确。
- 访问越界元素在类型层面通常会报错或被视为可能 `undefined`，取决于配置。
- 适合表示“固定结构的小数组”，如坐标、RGB、键值对、函数参数列表。

**建议**：有明确位置语义的小数组用元组；普通列表仍用 `T[]`。

---

## ⁠6 ⁠6. enum

**定义**：枚举，用来定义一组命名常量。TypeScript 特有，JavaScript 没有原生 enum。

**数字枚举**：

```ts
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

let d: Direction = Direction.Up;
```

**字符串枚举**：

```ts
enum Status {
  Success = 'success',
  Error = 'error'
}
```

**常量枚举**：

```ts
const enum Color {
  Red,
  Green,
  Blue
}
```

`const enum` 会在编译时内联，不生成运行时对象。

**争议点**：
- 普通 `enum` 会生成运行时对象，有一定体积和运行时行为。
- 数字枚举有“反向映射”，容易产生意外。
- 很多项目更推荐用字面量联合类型替代：

```ts
type Status = 'success' | 'error' | 'loading';
```

**建议**：
- 简单状态优先用字面量联合类型。
- 确实需要命名常量、运行时对象或位标志时再用 `enum`。
- 避免异构枚举（数字和字符串混用）。

---

## ⁠7 ⁠7. any

**定义**：关闭类型检查的“逃生舱”。任何值都可以赋给 `any`，`any` 也可以赋给任何类型。

**示例**：

```ts
let data: any = 123;
data = 'hello';
data.foo.bar(); // ✅ 不报错，但运行时可能崩
```

**问题**：
- 失去类型安全。
- `any` 会“传染”，污染调用链。
- 重构时无法获得编译器帮助。

**替代方案**：
- 外部数据用 `unknown` + 类型守卫。
- 泛型 `<T>` 保留类型关系。
- 明确结构用 `interface` / `type`。
- 第三方库缺类型时，优先补声明或局部收窄。

**建议**：能不用就不用；如果必须用，尽量限制在很小范围内，并加注释说明原因。

---

## ⁠8 ⁠总结对比

| 类型 | 核心作用 | 推荐场景 | 注意点 |
|---|---|---|---|
| 字面量类型 | 精确到具体值 | 状态、配置、事件名 | 常与联合类型搭配 |
| void | 无返回值 | 函数返回值 | 回调中表示返回值被忽略 |
| unknown | 安全的任意类型 | 外部数据、错误处理 | 使用前必须收窄 |
| never | 不可能的值/不返回 | 抛异常、死循环、穷尽检查 | 没有值能赋给它 |
| 元组 | 固定长度和位置类型 | 坐标、RGB、键值对 | 不是普通可变长数组 |
| enum | 命名常量集合 | 需要运行时枚举对象 | 有争议，常被字面量联合替代 |
| any | 关闭类型检查 | 极少数逃生场景 | 慎用，会传染 |

整体建议：**优先用精确类型（字面量联合、unknown、元组、never 穷尽检查），少用 any，enum 按项目规范谨慎使用。**

# 结构化类型定义
    

用于描述复杂数据结构。

|   |   |
|---|---|
|特性|说明|
|接口（interface）|定义对象“形状”，支持继承、可选属性、只读等：  <br>interface User { name: string; age?: number; }|
|类型别名（type）|创建自定义类型，支持联合、交叉、泛型等：  <br>`type ID = string|
|interface vs type|interface 可合并、更适合对象；type 更灵活（支持原始类型、元组等）|

JavaScript 中的对象是灵活的“字典”，但缺乏对结构的约束。

TypeScript 提供了两种强大机制来精确描述对象、函数、类等复杂数据的“形状”（shape）：

- `interface`（接口）
    
- `type`（类型别名）
    

它们共同构成了 TypeScript 类型系统的骨架。

## ⁠1 ⁠**`interface`**
    

✅ 1. `interface`：定义对象契约

`interface` 用于描述对象必须具备的属性和方法

1. 语法
    

```TypeScript
interface User {
  name: string;
  age: number;
  isActive?: boolean;      // 可选属性（加 ?）
  readonly id: string;     // 只读属性（不可修改）
}
```

示例：

```TypeScript
const user: User = {
  name: "Alice",
  age: 30,
  id: "u123"
  // isActive 可省略（因为是可选的）
};

user.id = "u456"; // ❌ 错误！id 是 readonly
```

✅ 2. `interface` 的高级能力

(1) 函数类型

```TypeScript
interface GreetFunction {
  (name: string): string;
}

const greet: GreetFunction = (name) => `Hello, ${name}`;
```

(2) 索引签名（Index Signatures）

用于描述“任意键”的对象（如字典）：

```Go
interface StringMap {
  [key: string]: string; // 所有属性值必须是 string
}

const map: StringMap = {
  en: "Hello",
  zh: "你好"
};
```

(3) 继承（Extending Interfaces）

```TypeScript
interface Person {
  name: string;
}

interface Employee extends Person {
  employeeId: number;
}

// 等价于：
// interface Employee {
//   name: string;
//   employeeId: number;
// }
```

(4) 合并（Declaration Merging）

多个同名 `interface` 会自动合并

```TypeScript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 现在 User = { name: string; age: number }
```

> 💡 这在为第三方库扩展类型时非常有用（如全局变量增强）。

## ⁠2 ⁠**`type`****：类型别名**
    

基本用法：

```TypeScript
type UserID = string;
type Point = { x: number; y: number };
type Status = "active" | "inactive" | "pending";
```

支持更复杂的类型组合：

```TypeScript
// 联合类型
type ID = string | number;

// 元组
type RGB = [number, number, number];

// 交叉类型
type Name = { first: string; last: string };
type Age = { age: number };
type Person = Name & Age; // { first: string; last: string; age: number }

// 映射类型（稍后详解）
type ReadonlyUser = { readonly [K in keyof User]: User[K] };
```

📌 官方建议（来自 TypeScript 团队）：

> - 优先使用 `interface` 描述对象形状（如 API 响应、组件 props）
>     
> - 使用 `type` 当你需要：联合类型、元组、原始类型别名、或复杂类型操作
>     

# 高级类型操作
    

让类型具备“编程能力”。

|   |   |
|---|---|
|特性|说明|
|联合类型（Union）|`string|
|交叉类型（Intersection）|A & B 合并两个类型|
|泛型（Generics）|编写可复用、类型安全的组件：  <br>function identity<T>(arg: T): T { return arg; }|
|条件类型（Conditional Types）|T extends U ? X : Y|
|映射类型（Mapped Types）|基于现有类型生成新类型：  <br>{ [K in keyof T]: boolean }|
|工具类型（Utility Types）|内置高级类型：  <br>Partial<T>, Pick<T, K>, Omit<T, K>, Record<K, T>, ReturnType<F> 等|

## ⁠1 ⁠联合类型与交叉类型
    

✅ 1. 联合类型（Union Types）—— “或”关系（`|`）

表示一个值可以是多种类型中的任意一种。

基本语法

```TypeScript
type Status = "loading" | "success" | "error";
type ID = string | number;
```

示例

```TypeScript
function processInput(input: string | number) {
  if (typeof input === "string") {
    // TypeScript 知道这里是 string
    return input.toUpperCase();
  } else {
    // 这里 input 是 number
    return input.toFixed(2);
  }
}
```

✅ 2. 交叉类型（Intersection Types）—— “与”关系（`&`）

表示一个值同时满足多个类型的全部成员。

基本语法：

```TypeScript
type A = { x: number };
type B = { y: string };
type C = A & B; // { x: number; y: string }
```

示例

```TypeScript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

// Person 同时拥有 name 和 age
type Person = HasName & HasAge;

const p: Person = {
  name: "Alice",
  age: 30
};
```

## ⁠2 ⁠泛型
    

类似Java中的泛型，也只是编译期间存在，避免 `as any` 或类型断言。

### ⁠2.1 ⁠✅ 1. 泛型（Generics）—— 编写可复用的类型安全组件

泛型允许你在定义函数、接口或类时，不预先指定具体类型，而是在使用时再指定。

```TypeScript
function identity<T>(arg: T): T {
  return arg;
}

// 使用时指定类型
let output = identity<string>("hello"); // T = string
// 或让 TS 自动推断
let output2 = identity("hello"); // T 被推断为 string
```

1. 泛型接口
    

```TypeScript
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: "hi" };
```

2. 泛型类
    

```TypeScript
class Container<T> {
  private data: T[] = [];

  add(item: T) {
    this.data.push(item);
  }

  get(index: number): T {
    return this.data[index];
  }
}

const numContainer = new Container<number>();
numContainer.add(10); // ✅
numContainer.add("hi"); // ❌ Error!
```

#### ⁠2.1.1 ⁠泛型约束（Generic Constraints）

限制泛型参数必须满足某些条件：

```TypeScript
interface HasLength {
  length: number;
}

// T 必须包含 length 属性
function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");   // ✅ string 有 length
logLength([1, 2, 3]); // ✅ array 有 length
logLength(42);        // ❌ number 没有 length
```

还有：条件类型、映射类型、工具类型

# 面向对象增强
    

对 ES6+ class 的补充。

|   |   |
|---|---|
|特性|说明|
|访问修饰符|public（默认）、private、protected|
|抽象类（abstract class）|定义不能实例化的基类，包含抽象方法|
|参数属性（Parameter Properties）|在构造函数中直接声明并初始化字段：  <br>constructor(private name: string) {}|
|类与接口结合|类可通过 implements 实现一个或多个接口|

### ⁠0.1 ⁠✅ 1. 访问修饰符（Access Modifiers）

TypeScript 提供三种关键字，控制类成员的可见性：

|   |   |   |
|---|---|---|
|修饰符|作用范围|说明|
|public|任何地方|默认值，可省略|
|private|仅当前类内部|外部和子类都无法访问|
|protected|当前类 + 子类|外部不可访问，但子类可以|

```TypeScript
class Animal {
  public name: string;        // 公开（可省略 public）
  protected species: string;  // 子类可访问
  private secret: string;     // 仅本类可访问

  constructor(name: string, species: string, secret: string) {
    this.name = name;
    this.species = species;
    this.secret = secret;
  }

  public introduce() {
    console.log(`I'm ${this.name} (${this.species})`);
    // ✅ 可访问 private 成员
    console.log("Secret:", this.secret);
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} is barking`);     // ✅ public
    console.log("Species:", this.species);      // ✅ protected
    // console.log(this.secret);                // ❌ 错误！private 不可访问
  }
}

const dog = new Dog("Buddy", "Canis lupus", "likes cats");
console.log(dog.name);      // ✅
// console.log(dog.species); // ❌ 错误！protected 不能在外部访问
// console.log(dog.secret);  // ❌ 错误！private 不能在外部访问
```

### ⁠0.2 ⁠✅ 2. 参数属性（Parameter Properties）—— 构造函数语法糖

在构造函数参数前加上访问修饰符，自动声明并初始化同名字段。

对比：

传统写法（冗长）：

```TypeScript
class User {
  private name: string;
  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

参数属性（简洁）：

```TypeScript
class User {
  constructor(
    private name: string,  // 自动创建 private name: string
    public age: number     // 自动创建 public age: number
  ) {}
}
```

### ⁠0.3 ⁠✅ 3. 抽象类（Abstract Classes）

用于定义不能被实例化、只能被继承的基类，通常包含抽象方法（无实现）。

语法：

```TypeScript
abstract class Shape {
  // 抽象属性（可选）
  abstract name: string;

  // 抽象方法（必须由子类实现）
  abstract getArea(): number;

  // 具体方法（可提供默认实现）
  printInfo() {
    console.log(`${this.name} area: ${this.getArea()}`);
  }
}

class Circle extends Shape {
  name = "Circle";

  constructor(private radius: number) {
    super();
  }

  getArea() {
    return Math.PI * this.radius ** 2;
  }
}

// const s = new Shape(); // ❌ 错误！不能实例化抽象类
const circle = new Circle(5);
circle.printInfo(); // Circle area: 78.539...
```

### ⁠0.4 ⁠✅ 4. 类与接口结合（`implements`）

类可以通过 `implements` 实现一个或多个接口，确保满足接口契约。

```TypeScript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

// 实现多个接口
class Duck extends Animal implements Flyable, Swimmable {
  fly() {
    console.log("Duck is flying");
  }

  swim() {
    console.log("Duck is swimming");
  }
}
```

### ⁠0.5 ⁠✅ 5. 静态成员（Static Members）

与 JavaScript 一致，但 TypeScript 提供类型检查。

```TypeScript
class MathUtils {
  static PI = 3.14159;

  static add(a: number, b: number): number {
    return a + b;
  }
}

console.log(MathUtils.PI);        // ✅
console.log(MathUtils.add(1, 2)); // ✅
```

> ⚠️ 静态成员不属于实例，不能通过 `this` 访问（除非在静态方法内）。

### ⁠0.6 ⁠✅ 6. 类型兼容性：基于结构，而非名义（Structural Typing）

TypeScript 的类遵循结构子类型（Structural Subtyping），只要结构兼容，就认为类型兼容。

```TypeScript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function logPoint(p: Point) {
    console.log(p.x, p.y);
}

const pt = {
    "x":1,
    "y":2
}
logPoint(pt); // ✅ 即使 pt 没有显式实现接口，结构匹配即可
```

# 模块与命名空间增强
    

|   |   |
|---|---|
|特性|说明|
|完整的 ES Module 支持|import/export 与 JS 完全一致|
|命名空间（namespace）|（旧方案，现代项目推荐用 ES Module）用于组织全局代码|
|模块解析增强|支持路径映射（paths in tsconfig.json）|

✅ 1. 完整支持 ES 模块（ES Modules）

TypeScript 完全兼容现代 JavaScript 的 `import`/`export` 语法，并为其添加类型信息。

基本用法：

```TypeScript
// math.ts
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export default function multiply(a: number, b: number): number {
  return a * b;
}



// main.ts
import multiply, { PI, add } from "./math";

console.log(add(2, 3));        // 5
console.log(multiply(2, 3));   // 6
```

### ⁠0.1 ⁠✅ 2. 模块解析增强（Module Resolution）

TypeScript 提供灵活的模块查找策略，尤其适合大型项目。

路径映射（Path Mapping）

通过 `tsconfig.json` 配置别名，避免深层相对路径：

```JSON
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@utils/*": ["src/utils/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

```JavaScript
// 使用别名
import { formatDate } from "@utils/date";
import { Button } from "@components/Button";
```

> ✅ 优势：
> 
> - 提升可读性
>     
> - 便于重构（移动文件不影响导入路径）
>     
> - 与打包工具（Webpack、Vite）配合使用
>     
> 
> ⚠️ 注意：路径映射需在打包工具中同步配置（如 Webpack 的 `resolve.alias`）。

# 工程化与开发体验增强
    

|   |   |
|---|---|
|特性|说明|
|tsconfig.json|集中配置编译选项、包含/排除文件等|
|声明文件（.d.ts）|为纯 JavaScript 库提供类型定义|
|与主流框架深度集成|React（JSX 类型检查）、Vue、Angular、Node.js 等|
|强大的 IDE 支持|VS Code 原生支持：智能提示、跳转、重构、错误高亮等|
|逐步迁移支持|可将 .js 文件重命名为 .ts 逐步添加类型|

✅ 1. tsconfig.json —— 项目级配置中心

这是 TypeScript 项目的“心脏”，集中管理所有编译和类型检查行为。

```JSON
{
  "compilerOptions": {
    "target": "ES2020",          // 编译目标 JS 版本
    "module": "ESNext",          // 模块系统（CommonJS, ES6 等）
    "strict": true,              // 启用所有严格类型检查（强烈推荐！）
    "esModuleInterop": true,     // 兼容 CommonJS 与 ES 模块
    "skipLibCheck": true,        // 跳过声明文件检查（加快编译）
    "outDir": "./dist",          // 输出目录
    "rootDir": "./src"           // 源码目录
  },
  "include": ["src/**/*"],       // 包含的文件
  "exclude": ["node_modules"]    // 排除的文件
}
```

