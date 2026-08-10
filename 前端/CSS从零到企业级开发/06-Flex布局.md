Flex 布局------现代企业开发最重要的 CSS 布局方式

本章目标
>
> 学完本章后，你应该能够回答下面几个问题：
>
> -   为什么 Flex 能成为现代企业开发的主流布局方式？
> -   什么是 Flex Container（容器）？
> -   什么是 Flex Item（项目）？
> -   `display: flex` 到底做了什么？
> -   主轴（Main Axis）和交叉轴（Cross Axis）是什么？
> -   `justify-content` 和 `align-items` 到底有什么区别？
> -   如何用 Flex 完成企业后台中最常见的水平、垂直居中布局？

------------------------------------------------------------------------

# 为什么说 Flex 是企业开发中最重要的 CSS 技术？

如果你去打开任何一个 React 企业后台项目，例如：

-   Ant Design Pro
-   Arco Design Pro
-   Vue Element Admin
-   React Admin Dashboard

你会发现 CSS 中出现最多的一行代码就是：

``` css
display: flex;
```

不是：

``` css
float: left;
```

不是：

``` css
display: inline-block;
```

而是：

``` css
display: flex;
```

原因很简单：

> **Flex 是专门为布局而设计的。**

在 Flex 出现之前，开发者为了让两个元素水平排列，需要写很多代码。

``` css
.left {
    float: left;
}

.right {
    float: right;
}
```

或者：

``` css
.left,
.right {
    display: inline-block;
}
```

不仅代码复杂，而且容易出现：

-   高度塌陷
-   对齐困难
-   垂直居中困难
-   间距难控制

Flex 的出现，就是为了解决这些问题。

------------------------------------------------------------------------

# Flex 到底是什么？

更容易理解的说法是：

> **Flex 是浏览器提供的一种新的盒子排列规则，改变的是容器的布局规则，而不是单个元素**

以前浏览器默认使用普通文档流进行布局。当你写下：

``` css
.container {
    display: flex;
}
```

将改变父容器的布局规则，浏览器立即切换为 Flex Layout，**容器中所有直接子元素都会按照新的规则排列**。学习Flex主要学习2点：
- 如何控制容器内容元素的排练规则
- 如何控制容器内元素的宽度，也即控制对应元素在容器所占的宽度，默认宽度等于元素自身内容的宽度，可以通话flex提供的属性来进行控制。



# Flex 只有两个角色

Flex 世界里只有两个角色：

-   **Flex Container（容器）**
-   **Flex Item（项目）**

例如：

``` html
<div class="container">
    <div>A</div>
    <div>B</div>
    <div>C</div>
</div>
```

``` css
.container {
    display: flex;
}
```

此时：

-   `container` 是 Flex Container。
-   `A`、`B`、`C` 是 Flex Item。

**只有直接子元素才是 Flex Item。**

例如：

``` html
<div class="container">
    <div>
        <span>A</span>
    </div>
</div>
```

这里 Flex Item 只有外层 `div`，`span` 并不是 Flex Item。

------------------------------------------------------------------------

# 如何控制容器内项目的排练规则
主轴并不等于水平轴。真正的定义是：主轴就是 Flex 排列元素的方向。

默认：

``` css
display: flex;
```

等价于：

``` css
flex-direction: row;
```

因此默认主轴是水平的：

## 主轴 (Main Axis)
[[justify-content-guide]]

| 属性                | 作用               | 常见值                                                                                           | 记忆要点                    |
| :---------------- | :--------------- | :-------------------------------------------------------------------------------------------- | :---------------------- |
| `flex-direction`  | 决定主轴方向           | `row`（默认，水平）<br>`column`（垂直）<br>`row-reverse`<br>`column-reverse`                             | 主轴由 `flex-direction` 定义 |
| `justify-content` | 控制**主轴方向**上的排列方式 | `flex-start`<br>`center`<br>`flex-end`<br>`space-between`<br>`space-around`<br>`space-evenly` | **justify 看主轴**         |

## 交叉轴 (Cross Axis)

交叉轴始终与主轴垂直。默认：

``` text
Main →
Cross ↓
```

如果：

``` css
flex-direction: column;
```

那么：

``` text
Main ↓
Cross →
```


| 属性            | 作用                | 常见值                                                                   | 记忆要点               |
| :------------ | :---------------- | :-------------------------------------------------------------------- | :----------------- |
| —             | 始终与主轴**垂直**       | —                                                                     | 交叉轴 ⊥ 主轴，不要死记水平/垂直 |
| `align-items` | 控制**交叉轴方向**上的排列方式 | `stretch`（默认）<br>`flex-start`<br>`center`<br>`flex-end`<br>`baseline` | **align 看交叉轴**     |




# 如何控制容器内项目的对剩余空间的占比

在使用Flex设计布局时，**父容器往往就会设置固定宽度**，当容器内有多个项目时，**每个项目的宽度默认值由自身内容决定，当然可以通过`width` 属性固定设置**，当容器内项目的宽度总和没有超过父容器的宽度时，该如何决定剩余空间。


[[flex-grow-flex-shrink-guide]]





# 最经典的 Flex 居中

``` css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

这是企业开发中最经典的三行代码。
适用于：

-   登录页
-   Loading 页面
-   404 页面
-   弹窗
-   空状态页面

------------------------------------------------------------------------

# 企业后台中最常见的 Flex 布局

## 1. 左右布局

``` css
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

用于：

``` text
Logo                     用户
```

------------------------------------------------------------------------

## 2. 按钮组

推荐：

``` css
display: flex;
gap: 8px;
```

不要再使用：

``` css
margin-right: 8px;
```

现代浏览器已经很好地支持 `gap`。

------------------------------------------------------------------------

## 3. 表单布局

``` text
姓名：   [输入框]
```

通常采用 Flex。

------------------------------------------------------------------------

## 4. 搜索栏

``` text
输入框    查询    重置
```

也是 Flex。

------------------------------------------------------------------------

## 5. 卡片标题

``` text
订单统计                 更多
```

同样使用 Flex。

------------------------------------------------------------------------





# 企业开发经验

现代 React、Vue、Ant Design 等企业项目，几乎所有页面布局都建立在 Flex
之上。

以后看到页面时，不要先思考：

> 这是一个 div。

而应该思考：

> **这是一个 Flex Container，里面包含若干 Flex Item。**

这种布局思维，是现代企业前端开发最重要的基础。



