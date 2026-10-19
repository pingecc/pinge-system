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

## ⁠4 ⁠组件生命周期



# 状态管理











## ⁠1 ⁠组织设计State结构





如果你的 state 变量是一个对象时，请记住，你不能只更新其中的一个字段]而不显式复制其他字段。

## ⁠2 ⁠表单input

**界面显示的一切都来自 state**。那就让输入框里显示的内容，也来自 state——这就是**受控组件（controlled component）**


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
## ⁠3 ⁠上下文


## ⁠4 ⁠使用useRef

1、并不是所有的数据变化都需要更新 UI。如果你有一个变量（比如定时器的 ID），它在不断变化，但你不需要把这个变化显示在屏幕上，你就用 `ref` 把它存起来

2、React 负责将你的 JSX 渲染成 DOM，通常你不应该干涉。但有时候你必须直接“触摸” DOM 节点，比如：调用 `input.focus()`、滚动到特定位置、或者接入一个第三方的图表库（如 ECharts）。通过 `ref` 拿到真实的 DOM 元素节点，进行原生 JavaScript 操作。

### ⁠4.1 ⁠为什么需要useRef？

关于useRef，既然存在一些数据的变化不需要更新UI，干嘛还要交给React呢，还要专门使用React提供的useRef来存起来呢？

1、直接把变量写在函数内部行不行？

React 的函数组件本质上就是一个普通的 JavaScript 函数。当组件的 State 发生变化、导致 UI 需要重新渲染时，**这个函数会被从头到尾重新执行一遍**，从而导致变量会被重置。


```js 
function MyComponent() {
  // 普通局部变量
  let timerId = null; 
  const [count, setCount] = useState(0);

  const start = () => {
    timerId = setInterval(() => console.log('运行中'), 1000);
  };

  const stop = () => {
    clearInterval(timerId); // 这里的 timerId 可能已经变成 null 了！
  };
  
  // ...
}
```

2、直接把变量写在函数外部？

```js 
// 写在组件外部
let timerId = null; 

function MyComponent() {
  const start = () => {
    timerId = setInterval(() => console.log('运行中'), 1000);
  };
  // ...
}
```

这在只渲染一个 `<MyComponent/>` 时是没有问题的。由于它在函数外部，重新渲染不会重置它。
**但是，如果你的页面上有两个 `<MyComponent/>` 呢？** 这两个组件实例会**共享**同一个外部变量 `timerId`。组件 A 开启了定时器，组件 B 也开启了定时器，组件 B 的 ID 就会覆盖组件 A 的 ID。这导致组件 A 永远无法关闭自己的定时器，造成内存泄漏或 Bug。

面对以上两个问题，React 必须提供一种机制，满足两个苛刻的条件：
1. **跨渲染持久化**：在函数组件反复重渲染（反复执行）的过程中，它的值不能丢失。
2. **实例级隔离**：页面上渲染 10 个同样的组件，它们必须拥有 10 个独立的空间，互不干扰。
    

这就是 `useRef` 诞生的意义。

当你调用 `const myRef = useRef(initialValue)` 时，React 引擎在底层做了这样一件事： 它在这个组件的虚拟 DOM 节点（Fiber 节点）上，强行开辟了一块内存空间，存入了一个对象 `{ current: initialValue }`。 每次函数重新执行时，React 不会重新创建这个对象，而是直接把之前存在底层的那块内存地址交还给你。
## ⁠5 ⁠useEffect 与数据请求

到目前为止，组件中的数据都是我们自己定义的，如果我们的数据来自网络请求，该怎么办？直接放在组件里肯定不行，当状态发生变化时，React会重新调用组件函数，这样导致组件里的网络请求重复执行。


```js 
function MyComponent() { 

	useEffect(() => { 
	// 每次渲染后都会执行此处的代码 
	}); 
	return <div />; 
}
```



# 组件化编程

## ⁠1 ⁠什么是

## ⁠2 ⁠组件之间参数传递
### ⁠2.1 ⁠父组件向子组件传递数据

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
```


### ⁠2.2 ⁠组件之间共享状态

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