浏览器是如何理解 CSS 的？HTML 与 CSS 的关系可以概括为：
- **HTML 决定页面有什么（What）**
- **CSS 决定页面长什么样（How）**
- **JavaScript 决定页面如何交互（Behavior）**


浏览器的渲染流程：

```text
HTML 文件
    │
    ▼
解析 HTML
    │
    ▼
生成 DOM Tree
    │
    ▼
解析 CSS
    │
    ▼
生成 CSSOM
    │
    ▼
DOM + CSSOM
    │
    ▼
Render Tree
    │
    ▼
Layout（布局）
    │
    ▼
Paint（绘制）
    │
    ▼
Composite（图层合成）
    │
    ▼
页面显示
```


学习CSS不需要记住一堆的样式属性，CSS最终也会被解析成一个对象，HTML会被解析构建DOM  Tree，**浏览器会使用 CSS 规则去匹配 DOM 元素**。


# 解析 HTML ------ 生成 DOM Tree


```html
<html>
<body>
    <h1>Hello</h1>
    <p>CSS 学习</p>
</body>
</html>
```

浏览器不会直接渲染 HTML，而是先构建 **DOM Tree**：

```text
Document
└── html
    └── body
        ├── h1
        │   └── "Hello"
        └── p
            └── "CSS 学习"
```

JavaScript 操作的对象也是 DOM，而不是 HTML 源文件。

# 解析 CSS ------ 生成 CSSOM


CSS：
```css
h1 {
    color: blue;
    font-size: 40px;
}

p {
    color: red;
}
```

浏览器会解析为 **CSSOM（CSS Object Model）**。CSSOM 保存的是所有 CSS 规则，例如：

```text
CSSOM
├── h1
│   ├── color = blue
│   └── font-size = 40px
└── p
    └── color = red
```


