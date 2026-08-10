
学完本章后，你应该能够回答下面几个问题：
>
> -   为什么 `margin` 和 `padding` 经常用错？
> -   为什么 `margin-top` 有时候不起作用？
> -   为什么两个元素之间的间距不是两个 `margin` 相加？
> -   为什么 `margin: auto` 为什么可以水平居中？
> -   什么是 Margin Collapse（外边距折叠）？
> -   什么是 BFC（Block Formatting Context）？
> -   BFC 为什么能够解决很多布局问题？

------------------------------------------------------------------------

# 重新认识 Margin 和 Padding

企业开发中真正的难点不是会写 `margin` 和
`padding`，而是理解它们为什么会影响布局。
-   **Padding（内边距）**：调整内容与自身边框之间的距离。
-   **Margin（外边距）**：调整当前盒子与其它盒子之间的距离。
经验法则：

> **组件内部使用 Padding，组件之间使用 Margin。**

------------------------------------------------------------------------

## 为什么企业开发优先使用 Padding

按钮、输入框、卡片等组件通常通过 `padding` 扩大可点击区域，而不是使用
`margin`。

``` css
button {
    padding: 10px 20px;
}
```

Padding 会增大组件内部留白，使内容距离边框更远；Margin
不会改变组件大小，只会改变组件之间的距离。

------------------------------------------------------------------------

## 什么时候应该使用 Margin

Margin 的职责只有一个：

> **控制组件与组件之间的间距。**

例如：

``` css
.search {
    margin-bottom: 20px;
}
```

不要使用 `padding-bottom` 。来制造两个组件之间的空白，否则会把组件自身变高。

------------------------------------------------------------------------

## Margin Collapse（外边距折叠）

两个垂直方向相邻元素的 Margin 不会相加，而是取较大的那个值。
例如：

``` css
.a {
    margin-bottom: 50px;
}

.b {
    margin-top: 30px;
}
```

最终间距为 **50px**，而不是 **80px**。

发生折叠的典型场景：

-   相邻兄弟元素
-   父元素与第一个子元素（`margin-top`）
-   父元素与最后一个子元素（`margin-bottom`）

左右方向的 Margin 不会发生折叠。

------------------------------------------------------------------------

## 父元素为什么会被子元素「顶下来」

例如：

``` css
.parent {
    background: lightblue;
}

.child {
    margin-top: 50px;
}
```

由于父子 Margin Collapse，子元素的 `margin-top` 会影响父元素，看起来像整个父元素一起向下移动。

这不是浏览器 Bug，而是 CSS 标准行为。

[/Users/ping/pinge-system/code/web/demos/css/doc/CSS-父元素为什么会被-子元素顶下来（Margin%20Collapse深入理解）.md](file:///Users/ping/pinge-system/code/web/demos/css/doc/CSS-%E7%88%B6%E5%85%83%E7%B4%A0%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BC%9A%E8%A2%AB-%E5%AD%90%E5%85%83%E7%B4%A0%E9%A1%B6%E4%B8%8B%E6%9D%A5%EF%BC%88Margin%2520Collapse%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%EF%BC%89.md)

## 解决 Margin Collapse 的方法

### 方法一：给父元素增加 Padding（推荐）

``` css
.parent {
    padding-top: 1px;
}
```

### 方法二：增加 Border

``` css
.parent {
    border-top: 1px solid transparent;
}
```

### 方法三：创建 BFC（企业最常见）

``` css
.parent {
    overflow: hidden;
}
```

或者：

``` css
.parent {
    display: flex;
}
```

或者：

``` css
.parent {
    display: grid;
}
```

------------------------------------------------------------------------

## 什么是 BFC（Block Formatting Context）

一句话理解：

> **BFC 是浏览器创建的一个独立布局区域。**

可以把它理解成一个独立的房间，里面元素的布局不会轻易影响外部布局。

------------------------------------------------------------------------

## 如何创建 BFC

企业开发最常见方式：

``` css
overflow: hidden;
overflow: auto;
display: flex;
display: grid;
display: inline-block;
float: left;
```

现代项目最常见的是 `display: flex` 和 `display: grid`。



## BFC 能解决哪些问题

### 1. 阻止 Margin Collapse

创建 BFC 后，父子元素之间不会发生 Margin Collapse。

### 2. 解决浮动导致的高度塌陷

``` css
.parent {
    overflow: hidden;
}
```

可以包含浮动元素，使父元素重新计算高度。

### 3. 防止文字环绕浮动元素

创建 BFC 后，文字区域会成为独立布局区域，不再围绕浮动元素。

