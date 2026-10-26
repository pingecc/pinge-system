https://react.docschina.org/learn
# 什么是React？

传统将数据渲染到页面的步骤：
1. 发送请求获取数据
2. 处理数据（过滤、整理格式）
3. **操作DOM 呈现页面**

React 就做了第三步。

React 是一个将 **数据** 渲染为 **HTML视图**的开源JavaScript 库。也即你给React数据，React帮你渲染视图。

为什么需要React？

1. 原生JavaScript操作DOM繁琐，效率低（DOM- API操作UI）
2. 使用原生Java Script操作DOM，浏览器会进行大量的重绘重排：很多情况下你可能只需要改变页面中部分节点的内容，但是你直接调用API会导致浏览器对这块的所有节点内容进行重新创建。
3. 原生javaScript没有**组件化**编码方案，代码复用率低




![[react_note.png]]
1. 提供JSX语法，非常清晰直接的将数据和UI联系在一起。
2. 通过提供各种函数，来实现状态的管理。

# 从改DOM到改状态

## ⁠1 ⁠命令式改DOM

页面上有个点赞按钮，点一下数字加一。用原生 JavaScript（不用任何框架），大概是这样：

```js 
const btn = document.querySelector('#likeBtn');
const countEl = document.querySelector('#likeCount');
let likes = 0;

btn.addEventListener('click', () => {
  likes = likes + 1;                          // ① 数据 +1
  countEl.textContent = likes;                    // ② 手动找到节点，手动更新文字
});
```

**数据变了之后，界面不会自己变**——你必须亲手「找到那个 DOM 节点，亲手把新值塞进去」。这种一步一步指挥浏览器**怎么改**界面的写法。一个数字的时候还好。现在需求升级了：点赞数要显示在**三个地方**——按钮上、进度条上、还有一行文案里。命令式世界意味着：每次数据变化，**三处你都得记得改**。

> 数据和界面是**两份东西**，靠你手写代码保持同步。每加一个显示数据的地方，就多一个「必须记得更新」的坑。代码量越大，忘记的概率越接近 100%。

## ⁠2 ⁠返回状态的界面函数

不再写「怎么改界面」的施工指令，而是写一份**图纸**——一个函数，它接收[状态](../reference/glossary.html)，返回「在这个状态下，界面应该长什么样」：

```js 
function renderUI(state) {
  return `
    <button>👍 点赞（${state.likes}）</button>
    <div class="bar" style="width: ${state.likes * 10}%"></div>
    <p>${state.likes === 0 ? '还没有人点赞' : `目前有 ${state.likes} 人点赞`}</p>
  `;
}
```

## ⁠3 ⁠定义 · React 的核心公式
**UI = f(state)**：组件，返回界面的函数。state来自外部，也可以在内部定义。

界面（UI）是状态（state）的函数（f 是你写的那份图纸）。这条公式推出三件大事：

① 状态变 → 界面跟着变；
② 状态不变 → 界面绝不乱变；
③ 界面不对时，嫌疑人只有两个——**要么状态算错了，要么图纸写错了**。以后你排查 React 项目的 bug，本质上就是在审这两个嫌疑人。



```js 
import { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);  // ② 状态：界面唯一的数据源

  function handleClick() {
    setLikes(likes + 1);             // ③ 改状态，而不是改 DOM
  }

  return (                            // ① 图纸：每个 likes 值下按钮的样子
    <button onClick={handleClick}>
      👍 点赞（{likes}）
    </button>
  );
}
```
# 组件与 JSX：函数即组件

## ⁠1 ⁠什么是组件化

关于组件化：传统的设计只能说是模块化，也即拆JS，把功能单独拆成一个js ，而组件化不仅仅是拆js，还拆结构HTML 还有CSS，也即从页面视图的角度进行拆。


![[component_note.png]]


返回界面的 JavaScript 函数


## ⁠2 ⁠组件：返回界面的JavaScript函数
组件是返回标签的JavaScript函数。

```js 
function Avatar() {
  return <span className="avatar">🦊</span>;
}

function ProfileCard() {
  return (
    <div className="card">
      <Avatar />                          // ② 像用 HTML 标签一样用自己的组件
      <h3>阿狸</h3>
      <p>正在用 React 做自己的项目</p>
    </div>
  );
}
```


- **组件名必须大写字母开头**：`<Avatar />` 是组件，`<div>` 是原生标签——React 就靠首字母大小区分这两者。
- **组件可以嵌套组件**：`ProfileCard` 里放了一个 `<Avatar />`，像搭积木一样层层组合出整个页面。
- **每个组件自己就是一张小图纸**，第 1 课的「UI = f(state)」在每一块积木上分别成立。

`return` 后面像 HTML 的东西，就是 **JSX**。JSX 不是浏览器直接认识的语法——构建工具会把它编译成普通的 JavaScript（`<h1>你好</h1>` 本质上是一次创建标签的函数调用。


## ⁠3 ⁠JSX

之所以出现JSX，就是为了编写虚拟DOM更加方便，也即它是原生JS编写虚拟DOM的语法糖。

![[Pasted image 20260920214839.png]]
```JavaScript
function AboutPage() {
    return (
        <>
            <h1>关于</h1>
            <p>你好。<br />最近怎么样？</p>
        </>
    );
}
```

想在标签里写 JavaScript，必须装进花括号 `{…}`，JSX 里的 JavaScript：花括号、条件与列表


# 组件通信
## ⁠1 ⁠通过props进行数据传递

React 组件使用 _props_ 来互相通信。每个父组件都可以提供 props 给它的子组件，从而将一些信息传递给它。

### ⁠1.1 ⁠传递普通数据

子组件通过props参数来接收父组件传过来的数据，props 就是父组件调用子组件时传给它的参数。父组件像写 HTML 属性一样传： `<Avatar name="贝贝" />`；子组件像收函数参数一样接：`function Avatar(props) {…}`。**UI = f(props)——同样的 props，永远渲染出同样的界面。

> 由于组件其实就是一个返回JSX标签（虚拟DOM）的函数，所以父组件向子组件传递数据顺理成章的理解为在调用一个函数，传递参数。这份数据子组件只能读，不能写。


**1、父组件如何传参**

 直接按照key = value 给子组件传值，如果是传字符串，则直接使用引号，如果是传数字或者变量，泽需要使用{}
```js 
function App() {
  return (
    <div>
      <Avatar name="贝贝" emoji="🦊" size={52} />
      <Avatar name="皮蛋" emoji="🐼" size={38} />
    </div>
  );
}
```

另外如果是把一个对象的所有属性都传给子组件，还有更加简单的写法，不用一个个的从对象中取属性 

```js 
const user = { name: '贝贝', emoji: '🦊', size: 52 };

// 啰嗦：
<Avatar name={user.name} emoji={user.emoji} size={user.size} />

// 等价简写：
<Avatar {...user} />
```


**2、子组件如何接参**


```js 
// 写法一：整个 props 对象，用点取值
function Avatar(props) {
  return <span>{props.emoji} {props.name}</span>;
}

// 写法二（推荐）：参数位置直接解构，少打字
function Avatar({ name, emoji, size }) {
  return <span className="avatar">{emoji} {name}</span>;
}

// 给prop 一个默认值
function Avatar({ person, size = 100 }) { 
// ... 

}
```

### ⁠1.2 ⁠传递JSX

#### ⁠1.2.1 ⁠通过children 打包传递
当你在一对组件标签 ... 之间嵌套内容时，React 会自动将这些内容打包，并通过一个名为 children 的 prop 传递给该组件。

1、定义容器组件

```js 
function Card(props) {
  return (
    <div className="card-shadow border-radius-8 padding-16">
      {/* 在这里渲染传入的 JSX */}
      {props.children} 
    </div>
  );
}
```


2、使用组件并传递JSX 

```js 
function App() {
  return (
    <Card>
      <h2>用户信息</h2>
      <Avatar name="张三" />
      <p>前端开发工程师</p>
    </Card>
  );
}
```

在这个例子中，`<h2>`、`<Avatar>` 和 `<p>` 组合成的 JSX 结构，会被当作 `props.children` 完整地塞进 `<Card>` 内部的 `<div>` 中。`Card` 组件根本不需要知道它里面装的是文字、图片还是其他复杂的组件。

#### ⁠1.2.2 ⁠通过自定义prop传递

`children`  ：直接使用名为children的prop来传递JSX时，适用于子组件渲染的位置固定，就像是一个普通的“快递箱”：组件内部只预留了一个空间，你在组件标签之间塞入什么（JSX），它就在那个固定的位置整体展示。它专门用于传递组件的**主要内容**。

当子组件想要区分接收不同的JSX时，单纯靠children就不够用了，可以直接通过将JSX作为普通的prop进行传递。子组件内部提前规划好了多个特定的位置（例如头部、侧边栏、底部）。通过指定明确的属性名，你可以精准地进行“一对一投递”——这段 JSX 去头部，那段 JSX 去侧边栏。


```js 
<PageLayout 
  // 1. 我们自定义了一个叫 topBar 的 prop，把一段 JSX 传给它
  topBar={<TopNavigation title="主页" />} 
  
  // 2. 我们又自定义了一个叫 sidebar 的 prop，把另一段 JSX 传给它
  sidebar={<UserMenu />}
>
  {/* 中间这部分会自动变成 props.children */}
</PageLayout>
```

组件内部，它通过 props 对象接收到了这些自定义的名字，并把它们放在了对应的 HTML 结构里。
```js 
function PageLayout(props) {
  return (
    <div className="layout">
      {/* 渲染接收到的 topBar 属性中的 JSX */}
      <header className="top-bar">{props.topBar}</header>
      
      {/* 渲染接收到的 sidebar 属性中的 JSX */}
      <aside className="sidebar">{props.sidebar}</aside>
      
      <main className="content">{props.children}</main>
    </div>
  );
}
```
## ⁠2 ⁠组件之间共享状态

场景：成员列表上方放一个搜索框，**输入关键词，下面的列表实时过滤**。拆成两个组件很自然：`SearchBar`（搜索框）和 `MemberList`（列表）——它是兄弟关系。问题来了：

props 只能**父 → 子**（第 4 课纪律）。搜索词放在 SearchBar 自己的 state 里？List 是它兄弟，拿不到。放在 List 里？用户在 SearchBar 打字，List 也不知道。**两个兄弟组件之间，没有任何直接的数据通道。**

**状态提升**：兄弟组件之间如果需要公用一个state的话，那把这个state放到共同的父组件里，**父组件把数据用 props 分发下去，把「修改权」用回调函数也分发下去。**

```js 
function MemberPage() {                        // 状态的「家」：共同父组件
  const [query, setQuery] = useState('');

  return (
    <>
      <SearchBar query={query} onQueryChange={setQuery} />
      <MemberList query={query} />
    </>
  );
}

function SearchBar({ query, onQueryChange }) {   // 哑组件：自己零状态
  return (
    <input value={query}
      onChange={(e) => onQueryChange(e.target.value)} />
  );
}

function MemberList({ query, members }) {
  const shown = members.filter(m => m.name.includes(query));
  return (
    <ul>
      {shown.map(m => <li key={m.id}>{m.name}</li>)}
    </ul>
  );
}
```

## ⁠3 ⁠使用Context

在 React 中，数据通常是通过 `props` 从父组件一层层传递给子组件的。但当组件树变得很深，或者多个毫不相干的组件需要共享同一份数据时，这种方式就会变得非常痛苦。

**React Context 的核心目的只有一个：跨层级传递数据，避免“属性透传（Prop Drilling）”。**
可以把 Context 想象成一个**全局的广播站**。只要你在顶层架设了广播（Provider），底下的任何组件无论嵌套多深，只要带了收音机（useContext），就能直接收听到广播里的内容，而不需要经过中间组件的传递。

### ⁠3.1 ⁠为什么需要Context

React 的组件通常通过 `props` 接收父组件传递的数据。

例如，我们有三个组件：`App`、`Layout` 和 `UserProfile`。组件结构如下：

```text
App
 └── Layout
      └── UserProfile
```

`App` 中保存当前用户的信息，**而 `UserProfile` 需要展示这个用户的信息，它只能向自己的父组件去要，而Layout组件也没有，它也继续向自己的父组件App要，最终用户信息被App组件通过 props 逐层传递。**

```js 
function App() {
  const user = {
    id: 1,
    name: "张三",
    role: "admin",
  };

  return <Layout user={user} />;
}

function Layout({ user }) {
  return <UserProfile user={user} />;
}

function UserProfile({ user }) {
  return <div>当前用户：{user.name}</div>;
}
```

当需要的数据离自己更远时，中间越过很多的组件，每一层的组件都不得不传递这个属性。

Context 提供了另一种数据传递方式：**让上层组件提供数据，让后代组件直接读取数据，而不必经过每一层中间组件。**

### ⁠3.2 ⁠使用Context的三个核心步骤
  
实现这个“广播”机制只需要三步：**创建**、**提供**和**使用**。

 #### ⁠3.2.1 ⁠1. 创建 Context

首先，我们需要使用 `createContext` 凭空创造一个上下文对象。


```js
import { createContext } from 'react';

// 创建一个 Context，并给一个默认值（可选）
export const ThemeContext = createContext('light');
```

#### ⁠3.2.1 ⁠2. 提供 Context

在组件树的上层，**用 `Context.Provider` 包裹需要接收数据的子组件**，并通过 `value` 属性传入你要广播的数据。



```js
import { ThemeContext } from './ThemeContext';
import MainScreen from './MainScreen';

function App() {
  const currentTheme = 'dark'; // 这是你要跨层级共享的数据

  return (
    // 用 Provider 包裹，所有内部组件都能拿到 'dark'
    <ThemeContext.Provider value={currentTheme}>
      <MainScreen />
    </ThemeContext.Provider>
  );
}
```

#### ⁠3.2.2 ⁠3. 使用 Context

在任何被 `Provider` 包裹的后代组件中，直接使用 `useContext` 钩子获取数据。中间的组件完全不需要知道这个数据的存在。


```js
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function DeeplyNestedButton() {
  // 直接拿到顶层 App 广播的 value，跳过了中间所有组件
  const theme = useContext(ThemeContext); 
  
  return (
    <button className={`btn-${theme}`}>
      当前主题是 {theme}
    </button>
  );
}
```

### ⁠3.3 ⁠什么时候该用 Context？

Context 非常适合那些“全局性且不常频繁变动”的数据。

推荐使用的场景：
- 主题外观（暗黑模式 / 明亮模式）
- 当前登录的用户信息（头像、权限、用户名）
- 多语言本地化配置（中文 / 英文）
- 全局路由/导航状态

不推荐使用的场景：
- 高频更新的数据：Context 有一个致命缺点。只要 Provider 的 `value` 发生变化，**所有**消费了该 Context 的组件都会重新渲染。如果你把每秒都在变化的数据放进 Context，会导致严重的性能问题。对于复杂的全局状态管理，Redux 或 Zustand 等专门的状态管理库会更合适。
- 为了图省事滥用：如果数据只传递一两层，普通的 `props` 依然是最清晰、最容易维护的做法。




# Hook
钩子，在 Hooks 出现之前：
- 函数组件只能接收 props 并返回 JSX（“纯展示”） 
- 想用 state、生命周期 → 必须写成 class 组件 
有了 Hooks 之后：
- 函数组件也能管理状态、执行副作用、订阅数据……变得和类组件一样强大，甚至更灵活。

| 类型   | 代表 Hook                       | 作用                |
| ---- | ----------------------------- | ----------------- |
| 状态   | `useState`、`useReducer`       | 管理组件内部数据          |
| 副作用  | `useEffect`、`useLayoutEffect` | 处理数据获取、订阅、DOM 操作等 |
| 上下文  | `useContext`                  | 跨层级传递数据           |
| 性能优化 | `useMemo`、`useCallback`       | 缓存计算结果和函数         |
| 引用   | `useRef`                      | 保存可变值、操作 DOM      |
| 自定义  | 自己写的 `useXxx`                 | 复用逻辑              |

- 函数组件本身是无普通函数，每次渲染都会重新执行。
- Hook 让这个函数在多次执行之间“记住”一些东西（状态、副作用清理函数等）。 
- React 在内部用一个链表按调用顺序把这些“记住的东西”存起来。 
- 你写的 useState、useEffect 只是在这个链表上读取/写入数据。

## ⁠1 ⁠状态管理

随着你的应用不断变大，更有意识的去关注应用状态如何组织，以及数据如何在组件之间流动。冗余或重复的状态往往是缺陷的根源。学习如何组织好状态，如何保持状态更新逻辑的可维护性，以及如何跨组件共享状态。

### ⁠1.1 ⁠useState()
用于在函数组件中添加和更新状态（state）。
- useState(初始值) 返回一个**数组**，包含两个元素：
    1. 当前的 state 值（count）
    2. 更新这个 state 的函数（setCount）
- 我们用数组解构的方式把它们取出来：const [state, setState] = useState(初始值)

| 特点          | 说明                                                |
| ----------- | ------------------------------------------------- |
| **状态持久**    | 组件重新渲染时，state 的值会保留，不会重置                          |
| **触发重新渲染**  | 调用 `setState` 后，React 会重新渲染该组件                    |
| **异步更新**    | `setState` 不会立即改变当前渲染中的值（类似 class 组件的 `setState`） |
| **可以放任意类型** | 数字、字符串、布尔、对象、数组、null 都可以                          |

>组件函数中的JSX标签，使用到的数据发生变化时，React就会重新调用组件进行计算返回新的标签应用到页面中。**那React如何得知某个数据发生了变化呢？只能是把数据交给React进行代理**，才有可能实现这个功能，充当这一桥梁的就是 useState()  函数


#### ⁠1.1.1 ⁠基本使用


```js 
import { useState } from 'react';

function LikeButton() {
  // 声明一个likes变量，初始值为0
  const [likes, setLikes] = useState(0);
  //      ①        ②           ③   ④

  function handleClick() {
    setLikes(likes + 1);        // ⑤ 只能通过 ② 改，不能 likes++
  }

  return (
    <button onClick={handleClick}>
      👍 点赞（{likes}）          // ⑥ 像用普通变量一样读它
    </button>
  );
}
```

① 用户点击 → ② 事件函数里调 `setLikes(新值)` → ③ React 重新调用组件函数（likes 已是新值）→ ④ 函数返回新 JSX → ⑤ React 比对前后差异，只改动变化的 DOM。


关于给标签绑定事件函数：React 把它变成了一个属性——事件名驼峰命名，值是**函数本身**：
```js 
// 原生 JS：
btn.addEventListener('click', handleClick);

// React：像传一个 prop 一样传事件处理函数
<button onClick={handleClick}>点我</button>

// 或直接内联箭头函数：
<button onClick={() => alert('点了')}>点我</button>
```


#### ⁠1.1.2 ⁠更新state的方式

方式一：直接传新值（适合简单情况）
```js 
setCount(count + 1);          // 基于当前渲染时的 count
setUser({ name: '张三' });     // 直接替换整个对象
```

方式二：传函数（推荐，特别是依赖上一次的值时）
```js 
setCount(prev => prev + 1);           // 更安全，总是基于最新的值
setTodos(prev => [...prev, newTodo]); // 添加元素到数组
```
>当多次连续触发时，因为 React 可能会把多个 setState 合并（批量更新），直接用外部变量可能会拿到过期的值。


**正确更新对象的状态：** 要更新一个对象时，需要创建一个新的对象（或者将其拷贝一份），然后将 state 更新为此对象。因为React 靠Object.is 来判断数据有没有变，如果相同则会跳过渲染，它对对象**只比引用**——看是不是同一个对象，不看内容。当需要修改对象中的一个字段时，常常使用展开运算符进行复制：`setUser({ ...user, age: 31 });

```js 
const [user, setUser] = useState({ name: '小明', age: 18 });

// ❌ 错误：直接修改原对象
user.age = 19;
setUser(user);

// ✅ 正确：创建新对象
setUser({ ...user, age: 19 });
// 或者
setUser(prev => ({ ...prev, age: 19 }));
```

**正确的更新数组的状态：**

```js 
const [list, setList] = useState([1, 2, 3]);

// 添加
setList(prev => [...prev, 4]);

// 删除某个元素
setList(prev => prev.filter(item => item !== 2));

// 修改某个元素
setList(prev => prev.map(item => item === 2 ? 20 : item));
```

#### ⁠1.1.3 ⁠合理的设计state的结构

首先在一个组件内部，是可以多次调用useState()的，也即可以通过多个state来管理不同的数据，
```js 
const [bookmarks, setBookmarks] = useState(seed);     // 书签列表
const [query, setQuery] = useState('');               // 搜索词
const [activeTag, setActiveTag] = useState('全部');   // 标签过滤
```

三次调用、三份独立状态：每次调用在实例上申请一个独立状态槽，返回各自专属的 `[值, setX]`

但是为了让组件变得易于修改和调试，我们要考虑应该是使用单个state变量还是使用多个state变量。

1、**合并关联的 state**。如果你总是同时更新两个或更多的 state 变量，请考虑将它们合并为一个单独的 state 变量。

```js 
const [x, setX] = useState(0);  
const [y, setY] = useState(0);

// 或者这样
const [position, setPosition] = useState({ x: 0, y: 0 });
```

从技术上讲，你可以使用其中任何一种方法。但是，**如果某两个 state 变量总是一起变化，则将它们统一成一个 state 变量可能更好**。


#### ⁠1.1.4 ⁠使用state变量控制输入框
使用React的状态(State)来控制表单元素。
> 这种也称为受控组件，受到React统一的State控制，与之对应的是非受控组件，它们将数据交由 DOM 节点自己管理，通常通过 useRef 获取节点真实的值。绝大多数情况下，React 官方推荐使用受控组件来处理表单。


**工作原理：**
受控组件通过以下两个属性将表单元素与 React 状态绑定：
- value 属性： 绑定到组件的一个状态变量（State）。这决定了输入框当前显示的内容。
- onChange 事件： 当用户尝试在输入框中输入内容时触发。该事件的回调函数会获取用户的最新输入，并调用状态更新函数（如 setState）来更新状态。

当状态更新后，React 会重新渲染组件，输入框的 value 也随之更新为最新的状态值。


```js 
<input onChange={handleChange} />

function handleChange(e) {   // e：事件对象，React 传入，恰好 1 个参数
  // e 的核心成员（合成事件 SyntheticEvent——包装原生事件，接口兼容）：
  e.target              // 触发事件的 DOM 元素（这个 input）
  e.target.value         // 输入框当前内容 —— 永远是字符串！
  e.target.checked       // checkbox / radio 的勾选状态（布尔）
  e.target.name          // 元素的 name 属性（多字段表单的关键，见演示）
  e.preventDefault()      // 阻止默认行为（如 form 提交引发的页面刷新）
}
```

e.target.value 永远是字符串：哪怕 `<input type="number">`，`e.target.value` 拿到的也是字符串——DOM 的 value 属性本来就是文本。要参与计算就得转换：`Number(e.target.value)`


在表单中的套路写法：
```js 
const [name, setName] = useState('');            // ① state 存内容

<input
  value={name}                                 // ② 显示：输入框内容由 state 驾驶
  onChange={(e) => setName(e.target.value)}   // ③ 输入：新内容写回 state
/>
```

其它类型的表单也是一样的套路写法：
```js 
<textarea value={bio} onChange={(e) => setBio(e.target.value)} />

<select value={city} onChange={(e) => setCity(e.target.value)}>
  <option value="bj">北京</option>
  <option value="sh">上海</option>
</select>

<input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
```

通常情况下表单中的字段比较多的话，可以用一个对象state管全表单，配合 `e.target.name` 一次搞定所有字段：
```js 
const [form, setForm] = useState({ name: '', city: 'bj' });

<input name="name" value={form.name} onChange={update} />
<select name="city" value={form.city} onChange={update}>…</select>

function update(e) {
  setForm({
    ...form,                    // 记住第 5 课契约：setX 是整体替换 → 先摊开旧字段
    [e.target.name]: e.target.value   // 计算属性名：中括号里是变量，作键名
  });
}
```


**使用受控组件的好处** ：
- 即时输入验证： 你可以在 onChange 函数中实时检查用户输入（例如：密码是否达到长度要求，或者是否包含非法字符），并阻止无效状态的更新。
- 条件禁用/启用： 根据表单中其他字段的状态，动态禁用或启用提交按钮。
- 强制格式化： 可以强制把用户的输入转换为大写，或者自动添加电话号码的破折号格式。

## ⁠2 ⁠执行副作用

副作用是指那些**与渲染无关**的操作，比如：

- 数据请求（fetch / axios）
- 订阅事件（WebSocket、事件监听）
- 操作 DOM
- 设置定时器
- 修改 document.title
- 等等

在 class 组件里这些事情通常写在 componentDidMount、componentDidUpdate、componentWillUnmount 里。useEffect 把它们统一到一个地方了。

### ⁠2.1 ⁠useEffect()

```js 
useEffect(() => {
  // 这里写副作用逻辑

  return () => {
    // 可选：清理函数（组件卸载或依赖变化时执行）
  };
}, [依赖项]); // 依赖数组
```


#### ⁠2.1.1 ⁠基本使用

**1、空依赖数组 [] —— 只执行一次**
```js 
useEffect(() => {
  console.log('组件挂载后执行一次');
  // 例如：请求数据、添加事件监听
}, []);
```

**2、有依赖项 —— 依赖变化时重新执行**
```js 
useEffect(() => {
  console.log('count 变化了，当前值是：', count);
}, [count]); // 只有 count 变化时才重新执行
```

3、**没有依赖数组 —— 每次渲染都执行（几乎不用，性能差）**

```js 
useEffect(() => {
  console.log('每次渲染都会执行');
});
```


4、常见使用场景：请求网络数据

```js 
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const res = await fetch('/api/user');
    const data = await res.json();
    if (!cancelled) {
      setUser(data);
    }
  }

  fetchData();

  return () => {
    cancelled = true; // 防止组件卸载后还更新 state
  };
}, []);
```

#### ⁠2.1.2 ⁠清理函数

useEffect 的回调函数可以返回一个函数，这个返回的函数就叫清理函数。
清理函数会在以下两个时机执行：
- 组件卸载时（最常见） 
- 下一次 effect 重新执行之前（依赖发生变化时） 
> 可以理解为：React 在执行新的 effect 之前，会先帮你把上一次 effect 留下的“尾巴”清干净。


|场景|不清理会发生什么|清理做什么|
|---|---|---|
|定时器 `setInterval` / `setTimeout`|定时器一直跑，内存泄漏，甚至报错|`clearInterval` / `clearTimeout`|
|事件监听 `addEventListener`|监听器重复添加，回调执行多次|`removeEventListener`|
|订阅（WebSocket、Redux、EventEmitter）|继续收到消息并尝试更新已卸载组件|取消订阅|
|异步请求|组件已卸载还在 `setState`，产生警告|取消请求或加标志位|


常见使用清理函数的例子：

1）定时器
```js 
useEffect(() => {
  const timer = setInterval(() => {
    console.log('每秒打印一次');
  }, 1000);

  // 清理函数：清除定时器
  return () => {
    clearInterval(timer);
    console.log('定时器已清除');
  };
}, []);
```

- 组件挂载 → 启动定时器 
- 组件卸载 → 清除定时器（防止内存泄漏）

2）依赖项发生变化时，重新设置，防止旧的异步结果更新状态 

 ```js 
 useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const res = await fetch(`/api/user/${id}`);
    const data = await res.json();

    if (!cancelled) {          // 只有没被取消才更新
      setUser(data);
    }
  }

  fetchData();

  return () => {
    cancelled = true;          // id 变化时标记为取消
  };
}, [id]);
 ```

防止用户快速切换 id（比如 1 → 2 → 3），旧的请求后返回，把新的数据覆盖掉了
## ⁠3 ⁠useRef()
用来保存跨渲染周期的可变数据，且数据的更新不会触发组件重新渲染。调用 useRef(initialValue) 会返回一个普通的 JavaScript 对象，它只有一个属性：{ current: initialValue }。你可以随时读取或修改这个 current 属性。

`useRef` 主要有两个最经典的应用场景：

**1、访问和操作真实的 DOM 元素** 
```js 
import { useRef } from 'react';

function TextInputWithFocusButton() {
  // 1. 初始化一个 ref，默认值为 null
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // 3. 通过 .current 直接调用底层 DOM API
    inputEl.current.focus();
  };

  return (
    <>
      {/* 2. 将 ref 对象绑定到 DOM 标签上 */}
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>点击聚焦输入框</button>
    </>
  );
}
```


**2、保存不参与渲染的可变数据**
如果你有一个变量频繁更新，但它并不需要在页面上展示（比如定时器的 ID、网络请求的标识、或者保存上一轮渲染的旧值），此时用 useState 会导致组件不必要的重复渲染，造成性能浪费。这时候就该用 useRef。

```js 
import { useState, useRef } from 'react';

function Stopwatch() {
  const [count, setCount] = useState(0);
  
  // 使用 useRef 保存定时器 ID，赋值时不会触发重新渲染
  const timerId = useRef(null);

  const start = () => {
    // 防止重复开启定时器
    if (timerId.current !== null) return; 
    timerId.current = setInterval(() => setCount(c => c + 1), 1000);
  };

  const stop = () => {
    clearInterval(timerId.current);
    timerId.current = null; // 清除内部状态，但不触发渲染
  };

  return (
    <div>
      <p>计时: {count} 秒</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}
```



核心对比：useRef vs useState

理解 `useRef` 的最好方式就是把它和 `useState` 放在一起比较：

| **特性**    | **useRef**                                                                                               | **useState**                             |
| --------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **触发渲染**  | 修改 `ref.current` **不会**触发组件重新渲染。                                                                         | 调用 `setState` **会**触发组件重新渲染。             |
| **数据可变性** | 可变（Mutable）。你可以随时使用 `=` 直接给 `current` 赋新值。                                                               | 不可变（Immutable）。必须通过专门的 setState 函数来触发更新。 |
| **读取时机**  | **不要在渲染过程中**（也就是 return 的 JSX 里或函数体顶级逻辑）读取或写入 `ref.current`，因为这可能导致数据和 UI 脱节。一般在事件处理函数或 `useEffect` 中使用。 | 渲染过程中可以随时读取，保证 UI 永远与当前 State 状态同步。      |


## ⁠4 ⁠自定义Hook

如果说 React 组件是用来复用 UI的，那么自定义 Hook 就是用来复用 状态逻辑的。

  
其实就是单独写个函数，来把多个组件中公用的逻辑抽出来，如果这些逻辑来涉及到状态的管理吧，**由于在普通的函数中不能直接调用React中提供的hook，所以就提供了所谓的自定义Hooke机制**，**让函数的名字以use开头**：
- 这样 React 引擎和 linter 才能识别出它是一个 Hook，并帮你检查语法规则。
- 内部可以调用其他 Hooks：普通的 JS 函数不能调用 useState 或 useEffect，但自定义 Hook 可以
- 如果两个组件调用了同一个自定义 Hook，它们各自会生成完全独立的状态，互不影响。

为什么要自定义Hook？
- **告别“面条代码”**：你的组件里不再有一堆杂乱的 `useEffect` 和数据处理逻辑，组件只负责单纯的“渲染 UI”，逻辑都被隐藏在 Hook 里，代码清爽好读。
- **黑盒化调用**：比如你写了一个 `useFetch(url)`，其他同事直接传个网址进去，就能拿到 `data`、`loading` 和 `error` 状态。他根本不需要知道你底层是用 `fetch` 还是 `axios` 实现的。
  

案例场景：平时我们用 useState 存一个数据（比如用户在输入框打了一半的草稿，或者选择的“暗黑模式”），一旦刷新页面，状态就清空了。 为了让数据在刷新后还在，我们需要用到浏览器的 localStorage。如果不使用自定义 Hook，你的组件代码会充斥着 JSON.parse、getItem 和 setItem，不仅看起来很乱，而且每次遇到需要缓存的数据都要重写一遍。

1、编写自定义 Hook：useLocalStorage，内部处理所有和浏览器 API 打交道的脏活累活。

```js
import { useState } from 'react';

// 接收两个参数：存储的键名 key，以及默认值 initialValue
export function useLocalStorage(key, initialValue) {
  
  // 1. 状态初始化：惰性计算，只在组件首次渲染时执行一次
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 先去 localStorage 里找找看有没有存过这个 key
      const item = window.localStorage.getItem(key);
      // 如果存过，就解析出来用；如果没存过，就用传入的默认值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("读取 localStorage 失败:", error);
      return initialValue;
    }
  });

  // 2. 包装 set 方法：在更新 React 状态的同时，顺手把数据存进本地
  const setValue = (value) => {
    try {
      // 更新 React 的状态，触发 UI 重新渲染
      setStoredValue(value);
      // 同步把最新值存入浏览器的 localStorage 
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("写入 localStorage 失败:", error);
    }
  };

  // 3. 返回值格式和普通的 useState 保持完全一致
  return [storedValue, setValue];
}
```


2、在其它组件中使用 

```js 
import { useLocalStorage } from './useLocalStorage';

function UserProfile() {
  // 就像普通的 useState，只是把名字换了，并多传了一个字符串 key ("username")
  const [name, setName] = useLocalStorage('username', '匿名访客');

  return (
    <div>
      <h2>你好, {name}!</h2>
      {/* 每次你输入时，不仅触发了视图更新，还默默存进了硬盘 */}
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="输入你的名字"
      />
    </div>
  );
}
```

  






