普通文档流（Normal Flow）与 Display------浏览器默认是**如何摆放盒子**的？

本章目标：
学完本章后，你应该能够回答：
-   浏览器为什么不需要 CSS 也能显示网页？
-   什么是普通文档流（Normal Flow）？
-   为什么 `<div>` 会独占一行，而 `<span>` 不会？
-   `display` 到底改变了什么？
-   `block`、`inline`、`inline-block` 的本质区别是什么？
-   企业开发中什么时候使用这三种布局方式？
-   为什么 Flex 能够取代很多 `inline-block` 的使用场景？

------------------------------------------------------------------------

# 没有 CSS，网页还能显示吗？

浏览器内置了一套默认样式（User Agent Stylesheet），因此即使没有编写任何
CSS，HTML 仍然可以正常显示。

例如浏览器默认会认为：

``` css
div { display: block; }
p { display: block; }
h1 { display: block; }
span { display: inline; }
a { display: inline; }
button { display: inline-block; }
```

因此：

-   `div` 默认独占一行；
-   `span` 默认可以与其它内容处于同一行；
-   `button` 默认是 `inline-block`。

------------------------------------------------------------------------

# 什么是普通文档流（Normal Flow）

普通文档流就是浏览器默认排列元素的规则。

例如：

``` html
<div>A</div>
<div>B</div>
<div>C</div>
```

浏览器默认会按照从上到下的顺序排列：

``` text
A

B

C
```

这就是 Normal Flow。

------------------------------------------------------------------------

# 浏览器默认布局规则

## Block（块级元素）

特点：
-   独占一行
-   可以设置 width、height
-   默认宽度撑满父元素

常见元素：

-   div
-   p
-   h1\~h6
-   section
-   article
-   header
-   footer

------------------------------------------------------------------------

## Inline（行内元素）

特点：

-   不独占一行
-   宽度由内容决定
-   width、height 默认不生效

常见元素：

-   span
-   a
-   strong
-   em
-   label

------------------------------------------------------------------------

## Inline-block

特点：

-   可以与其它元素位于同一行
-   支持设置 width
-   支持设置 height

常见：

-   button
-   img（常见表现）
-   自定义按钮

------------------------------------------------------------------------

# Display 到底是什么？

Display 的本质：

> 决定元素如何参与布局，而不是决定元素长什么样。

例如：

``` css
div{
    display:inline;
}
```

多个 div 就会排列到同一行。

------------------------------------------------------------------------

# Block、Inline、Inline-block 对比
| 特性 | block | inline | inline-block |
| --- | --- | --- | --- |
| 独占一行 | ✅ | ❌ | ❌ |
| 可设置 width | ✅ | ❌ | ✅ |
| 可设置 height | ✅ | ❌ | ✅ |
| 默认宽度 | 撑满父元素 | 内容决定 | 内容决定（可指定） |
| 可设置 margin/padding | ✅ | 部分支持 | ✅ |



# display:none 与 visibility:hidden

## display:none

``` css
display:none;
```

特点：

-   不参与 Render Tree
-   不参与 Layout
-   不参与 Paint
-   页面中相当于不存在

## visibility:hidden

``` css
visibility:hidden;
```

特点：

-   参与 Render Tree
-   参与 Layout
-   占据空间
-   只是不可见

------------------------------------------------------------------------



# 企业开发经验

对于现代企业后台项目：

-   `display: block`、`inline`、`inline-block` 更多是理解默认行为；
-   真正大量使用的是：

``` css
display:flex;
```

Flex 已成为企业后台开发最重要的布局方式。


