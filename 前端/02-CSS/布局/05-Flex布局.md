**CSS Flexbox（弹性布局）** 是一种一维布局模型，用于高效排列、对齐和分配容器内项目的空间。它特别适合处理动态内容尺寸、响应式布局和复杂对齐需求，比传统的 float、inline-block 或 table 更简洁强大。

# 1. 核心概念

- **Flex 容器（Flex Container）**：设置了 `display: flex` 或 `display: inline-flex` 的元素。
- **Flex 项目（Flex Items）**：容器的直接子元素。
- **主轴（Main Axis）**：项目主要排列的方向（默认水平从左到右）。
- **交叉轴（Cross Axis）**：垂直于主轴的方向（默认垂直从上到下）。

主轴方向由 `flex-direction` 决定，交叉轴随之变化。

```css
.container {
  display: flex; /* 或 inline-flex */
}
```

- 容器控制“怎么排”（方向、换行、对齐、间距）
- 项目控制“怎么长”（放大、缩小、基准、自身对齐）
# 2. Flex 容器属性

这些属性作用在容器上，控制整体布局行为。

## 2.1 flex-direction（主轴方向）
决定主轴的方向和项目的排列顺序。

| 值              | 说明                     |
|-----------------|--------------------------|
| `row`（默认）   | 水平从左到右             |
| `row-reverse`   | 水平从右到左             |
| `column`        | 垂直从上到下             |
| `column-reverse`| 垂直从下到上             |

```css
.container {
  flex-direction: row; /* 默认 */
}
```

## 2.2 flex-wrap（换行）
控制项目是否换行。

| 值              | 说明                     |
|-----------------|--------------------------|
| `nowrap`（默认）| 不换行，可能溢出         |
| `wrap`          | 换行，新行在下方         |
| `wrap-reverse`  | 换行，新行在上方         |

```css
.container {
  flex-wrap: wrap;
}
```

## 2.3 flex-flow（简写）
`flex-direction` + `flex-wrap` 的简写。

```css
.container {
  flex-flow: row wrap; /* 方向 + 换行 */
}
```

## 2.4 justify-content（主轴对齐）
控制项目在**主轴**上的对齐和空间分配。

| 值                | 说明                           |
|-------------------|--------------------------------|
| `flex-start`（默认）| 从主轴起点对齐                 |
| `flex-end`        | 从主轴终点对齐                 |
| `center`          | 居中对齐                       |
| `space-between`   | 两端对齐，项目间等距           |
| `space-around`    | 项目两侧等距（边缘间距是中间的一半）|
| `space-evenly`    | 所有间距完全相等               |

```css
.container {
  justify-content: space-between;
}
```

## 2.5 align-items（交叉轴对齐）
控制项目在**交叉轴**上的对齐（单行时最常用）。

| 值                | 说明                           |
|-------------------|--------------------------------|
| `stretch`（默认） | 拉伸填满交叉轴                 |
| `flex-start`      | 从交叉轴起点对齐               |
| `flex-end`        | 从交叉轴终点对齐               |
| `center`          | 居中对齐                       |
| `baseline`        | 按文字基线对齐                 |

```css
.container {
  align-items: center;
}
```

## 2.6 align-content（多行交叉轴对齐）
当有多行时，控制**行与行之间**在交叉轴上的对齐。  
（只有 `flex-wrap: wrap` 且产生多行时才生效）

值与 `justify-content` 类似：`flex-start`、`flex-end`、`center`、`space-between`、`space-around`、`space-evenly`、`stretch`。

```css
.container {
  align-content: space-around;
}
```

## 2.7 gap（间距）
现代浏览器推荐使用 `gap` 来设置项目之间的间距（比 margin 更干净）。

```css
.container {
  gap: 20px;           /* 行列都是 20px */
  row-gap: 10px;       /* 仅行间距 */
  column-gap: 30px;    /* 仅列间距 */
}
```

# 3. Flex 项目属性

这些属性作用在子元素上，控制单个项目的行为。

## 3.1 order（排序）
改变项目的视觉顺序（不影响 DOM 顺序）。数值越小越靠前，默认是 `0`。

```css
.item {
  order: 2; /* 可以是负数 */
}
```

## 3.2 flex-grow（放大比例）
定义项目在**有剩余空间**时如何放大。默认 `0`（不放大）。

```css
.item {
  flex-grow: 1; /* 剩余空间按比例分配 */
}
```

多个项目都设置 `flex-grow: 1` 时，会平分剩余空间。

## 3.3 flex-shrink（缩小比例）
定义项目在**空间不足**时如何缩小。默认 `1`（可以缩小）。设为 `0` 则不缩小。

```css
.item {
  flex-shrink: 0; /* 不允许缩小 */
}
```

## 3.4 flex-basis（基准尺寸）
定义项目在分配剩余空间**之前**的初始大小。可以是长度值、百分比或 `auto`（默认，取 width/height）。

```css
.item {
  flex-basis: 200px;
  /* 或 flex-basis: 30%; */
}
```

## 3.5 flex（简写）
`flex-grow`、`flex-shrink`、`flex-basis` 的简写，推荐使用。

```css
.item {
  flex: 1;                /* 等价于 flex: 1 1 0% */
  flex: 0 0 200px;        /* 不放大不缩小，固定 200px */
  flex: 1 0 auto;         /* 可放大，不缩小，基准 auto */
  flex: none;             /* 等价于 0 0 auto */
  flex: auto;             /* 等价于 1 1 auto */
}
```

最常用写法：
- `flex: 1` → 等分剩余空间
- `flex: 0 0 auto` 或 `flex: none` → 固定尺寸

## 3.6 align-self（单个项目交叉轴对齐）
覆盖容器的 `align-items`，只影响当前项目。

值与 `align-items` 相同。

```css
.item {
  align-self: flex-end;
}
```


# 4. 关于容器的高度和宽度

**Flex 容器的高度和宽度**，主要由**普通 CSS 盒模型规则**决定，而不是由 `flex` 相关属性直接决定。Flex 属性主要影响的是**容器内部项目的排列方式**，而不是容器自身的尺寸。



```css
.container {
  display: flex;          /* 默认宽度 = 父元素宽度 */
  /* width: 800px; */     /* 显式指定后以这个为准 */
  /* width: 50%; */       /* 相对父元素 */
}
```



高度：

```css
.container {
  display: flex;
  /* height 没有设置时，高度 = 内部项目撑开的高度 */
  
  /* 容器高度等于浏览器窗口的高度 */
  min-height: 100vh; 
}
```


# 5. 完整示例

## 水平居中 + 垂直居中（经典）
```css
.container {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center;     /* 交叉轴居中 */
  height: 100vh;
}
```

## 等宽三栏 + 间距
```css
.container {
  display: flex;
  gap: 20px;
}
.item {
  flex: 1; /* 等分 */
}
```

## 左侧固定，右侧自适应
```css
.sidebar {
  flex: 0 0 250px; /* 固定 250px */
}
.main {
  flex: 1;         /* 占剩余空间 */
}
```

## 响应式换行
```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.item {
  flex: 1 1 300px; /* 最小 300px，可放大缩小 */
}
```
