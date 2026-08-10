**HTML它只关注内容的语义**。比如`<h1>`表明这是一个大标题，`<p>`表 明这是一个段落， `<img>`表明这儿有一个图片， `<a>`表示此处有链接。
CSS（Cascading Style Sheets，**层叠样式**表）是用于描述 HTML元素的**外观**和**布局**的样式语言，如果没有提供CSS的话，则会基于浏览器的默认样式进行渲染，在将CSS应用于HTML时，**通过CSS的选择器与对应的HTML元素进行关联。**

教程资源：
1. 尚硅谷HTML 与CSS详细教程：：[www.bilibili.com](https://www.bilibili.com/video/BV1p84y1P7Z5/?spm_id_from=333.337.search-card.all.click&vd_source=3e784b1581f5210cdc9dae3d66453059)
2. MDN：https://developer.mozilla.org/zh-CN/docs/Web/CSS
# 最佳实践

1. 每种元素都有各自特有的CSS样式，了解即可，有需要直接问AI即可。
2. 元素在页面中的布局，需要理解。
3. 最好按照最佳实践规则去添加CSS属性，减少没必要、奇怪的现象

<div class="highlight-block highlight-tip"> 样式编写规范 </div>

1. 每个布局板块在编写样式时都写上注释，在.css文件中都标注下当前这些样式应用于哪个板块
2. 对于嵌套层里的元素设置样式时，最好使用后代选择器，避免元素的class名重复
3. css文件里，外层的写在上面，嵌套里层的写在里面
<div class="highlight-block highlight-tip"> 布局 </div>
4. 从上至下，**一个布局板块就写一个div，****里面的****版心再套个div**，版心里的**内容区域再分别套div.**.....布局区域>版心>内容块
    
    1. 布局div：定上高度和背景颜色
    2. 如果内容区域和版型边框有距离，则给版心设置padding，注意设置完padding之后，需要调整下版心的width和height
    3. 版心和内容区域：定上高度和宽度，根据需要设置其它的
    
    ```CSS
    <!-- 顶部导航条 -->
    <div class="topbar">
        <!-- 版心 -->
        <div class="container clearfix">
            <!-- 左侧的欢迎区 -->
            <div class="welcome leftfix">
               
            </div>
            <!-- 右侧的导航区 -->
            <div class="topbar-nav rightfix">
               
            </div>
        </div>
    </div>
    ```
    
5. 一堆东西纵向排列，一堆东西横向排列，一般直接用列表 `ul`
    
6. 2个行内元素如何垂直排列？第一个行内元素使用div包裹
    
<div class="highlight-block highlight-tip"> 行内元素 </div>

1. 对于页面上的普通文字，直接用`span`包裹，便于调样式
    
2. 行内元素之间的间隔使用 `margin-left` `margin-right` 控制
3. **基本语法：**
    
CSS 规则由 选择器（Selector） + 声明块（Declaration Block） 组成：

```CSS
selector {
  property: value;
  property: value;
}
```

> - 属性和值之间用英文冒号 `:` 连接
>     
> - 每条声明以分号 `;` 结尾
>     
> - 整个声明块用大括号 `{}` 包裹
>     

2. **引入方式：**
    

- 内联样式（Inline Styles）：直接写在 HTML 标签的 `style` 属性里。
    

> ✅ 优点：优先级高，立即生效
> 
> ❌ 缺点：难以维护，不能复用，不推荐大量使用

```CSS
<p style="color: red; font-size: 18px;">这是一段红色文字。</p>
```

- 内部样式表（Internal Style Sheet）：在 HTML 的 `<head>` 中使用 `<style>` 标签编写 CSS。
    

> ✅ 适合单页面样式
> 
> ❌ 不适合多页面项目（无法复用）

- 外部样式表（External Style Sheet）✅【推荐方式】：**将 CSS 写在一个** **`.css`** **文件中，然后在 HTML 中通过** **`<link>`** **引入。**
    

```HTML
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>欢迎来到我的网站</h1>
</body>
</html>
```

 
 
 
 
## CSS引入方式
 按照 CSS 样式书写的位置（或者引入的方式），CSS 样式表可以分为三大类： 
 1. 行内样式表（行内式） 
 2. 内部样式表（嵌入式） 
 3. 外部样式表（链接式）
### 内部样式
内部样式表（内嵌样式表）是写到html页面内部. 是将所有的 CSS 代码抽取出来，单独放到一个`<style>` 标签中
```css
<style>
	 div {
	 color: red;
	 font-size: 12px;
 }
</style>
```

`<style> `标签理论上可以放在 HTML 文档的任何地方，但一般会放在文档的`<head>`标签中，通过此种方式，可以方便控制当前整个页面中的元素样式设置

### 行内样式
行内样式表（内联样式表）是在元素标签内部的 style 属性中设定 CSS 样式。适合于修改简单样式.
```html
<div style="color: red; font-size: 12px；">青春不常在，抓紧谈恋爱</div>
```
style 其实就是标签的属性，可以控制当前的标签设置样式。

### 外部样式
适合于样式比较多的情况. 核心是:样式单独写到CSS 文件中，之后把CSS文件引入 到 HTML 页面中使用.
引入外部样式表分为两步： 
- 新建一个后缀名为 .css 的样式文件，把所有 CSS 代码都放入此文件中。 
- 在 HTML 页面中，使用 `<link>`标签引入这个文件。
```css
<link rel="stylesheet" href="css文件路径"＞
```

![[Pasted image 20260610213145.png]]

## CSS的三大特性

CSS 有三个非常重要的三个特性：层叠性、继承性、优先级。


### 层叠性
相同选择器给设置相同的样式，此时一个样式就会覆盖（层叠）另一个冲突的样式。层叠性主要解决样式冲突 的问题 
层叠性原则： 
- 样式冲突，遵循的原则是就近原则，哪个样式离结构近，就执行哪个样式 
- 样式不冲突，不会层叠

### 继承性

CSS中的继承: 子标签会继承父标签的某些样式，如文本颜色和字号。简单的理解就是：子承父业。

- 恰当地使用继承可以简化代码，降低 CSS 样式的复杂性 
- 子元素可以继承父元素的样式（text-，font-，line-这些元素开头的可以继承，以及color属性）

### 优先级

当同一个元素指定多个选择器，就会有优先级的产生。  选择器相同，则执行层叠性  选择器不同，则根据选择器权重执行
## 选择器

![[Pasted image 20260602210107.png]]

选择器用来选择页面多个元素，后面是声明部分，**CSS 选择器**是 [CSS 规则](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Syntax/Introduction#css_%E8%A7%84%E5%88%99%E9%9B%86)中定位并选取特定元素以应用样式的模式。

### 基本选择器

| 基本选择器    | 特点                                | 用法                    |
| -------- | --------------------------------- | --------------------- |
| **类选择器** | 选中所有特定类名（ class 值）的元素 —— 使用频 率很高。 | `.say {color:red}`    |
| 元素选择器    | 选中所有同种标签，但是不能差异化选择。               | `h1 {color:red}`      |
| ID 选择器   | 选中特定 id 值的那个元素（唯一的）。              | `#earthy {color:red}` |
| 通配选择器    | 选中所有标签，一般用于清除样式。                  | `*{color:red}`        |

**一个元素的 class 属性，能写多个值**，要用空格隔开 `<h1 class="speak big">你好啊</h1>` 给该元素同时配置 speak 和 big类，从而达到更多的选择目的

```CSS

p {
  color: blue;
}
.highlight {
  background-color: yellow;
}
#header {
  font-size: 24px;
}
* {
  margin: 0;
  padding: 0;
}
```

### 复合选择器

1. 复合选择器建立在基本选择器之上，由多个基础选择器，通过不同的方式组合而成。
2. 复合选择器用于在复杂结构中，快速而准确的选中元素。
3. 常用的复合选择器包括：后代选择器、子选择器、并集选择器、伪类选择器等等


#### 后代选择器

选择指定元素中，符合要求的所有后代元素。
```css
元素1 元素2 元素3 ...... 元素n {}
```
- 先写祖先，再写后代，最终选择的是元素n
- 可以是任意基础选择器

案例：

```css
 /* 选中ul中的所有li */
ul li {
color: red;
}
/* 选中ul中所有li中的a */
ul li a {
color: orange;
}
/* 选中类名为subject元素中的所有li */
.subject li {
color: blue;
}
/* 选中类名为subject元素中的所有类名为front-end的li */
.subject li .front-end {
color: blue;
}
```




#### 子选择器


选中指定元素中，所有符合要求的**直接子元素**

```css
元素1>元素2>元素3>...元素n{样式声明}
```
- 中间用`>`隔开
- 后面的元素是前面元素的后代里第一个符合条件的子级，不包过嵌套更深的子级，也即直接自己子元素。[[后代选择器与子选择器的区别]]

#### 并集选择器

同时选择多个符合条件的选择器，为它们定义相同的样式。

```css
元素1,元素2...,元素n{样式声明}
```
- 中间通过 `,`隔开

```css
ul,div{样式声明}
```

#### 伪类选择器

根据元素状态或特定位置应用样式。

结构性伪类（Structural Pseudoclasses）**根据元素在文档中的位置选择元素** ，常用类型包括：
- `:first-child`：选择父元素的第一个子元素
- `:last-child`：选择父元素的最后一个子元素
- `:nth-child(n)`：选择父元素的第n个子元素（n可以是数字、even/odd或表达式）
- `:nth-of-type(n)`：选择父元素中第n个指定类型的子元素
- `:only-child`：选择父元素中唯一的子元素
- `:empty`：选择没有子元素或文本内容的空元素
- `:not()`：排除匹配指定条件的元素（如 `:not(.active)`）


这些伪类在列表、表格等需要按位置应用样式的场景中非常有用。例如为表格隔行添加背景色：

```CSS
tr:nth-child(odd) {
  background-color: #f8f9fa;
}
```

状态伪类（State Pseudoclasses）**根据元素的状态选择元素** ，常用类型包括：

- `:hover`：鼠标悬停在元素上时
- `:active`：元素被激活（如点击）时
- `:focus`：元素获得焦点（如输入框被选中）时
- `:visited`：链接已被访问过时
- `:target`：元素被锚点链接指向时
- `:nth-child(odd)`：奇数子元素
    

状态伪类常用于实现交互效果。例如为按钮添加悬停状态：

```CSS
按钮:hover {
  background-color: #007bff;
  color: #fff;
}
```

## 元素的显示模式

元素显示模式就是元素（标签）以什么方式进行显示，默认情况下，比如 `<div>`自己占一行，比如一行可以放多个`<span>`。HTML 元素一般分为块元素和行内元素两种类型。

![[Pasted image 20260624205132.png]]

可以通过给元素设置 `display`属性值，修改默认的显示模式，比如给行内元素设置`display:block`，它就会表现得和块级元素一样，设置宽度和高度。

下面是常见的display 值及其作用：


| **display 值**        | **说明**                  |
| -------------------- | ----------------------- |
| block                | 转为块级元素（独占一行，可设宽高）       |
| inline               | 转为行内元素（不换行，宽高由内容决定）     |
| inline-block         | 行内块元素（不换行，但可设宽高）        |
| flex                 | 启用弹性盒布局（子元素按 flex 规则排列） |
| grid                 | 启用网格布局                  |
| none                 | 隐藏元素（不占据空间）             |
| table / table-cell 等 | 模拟表格布局                  |
| contents             | 移除自身盒子，只保留子元素（现代用法）     |


### 块元素
常见的块元素有 `<h1> ~ <h6>`、`<p>`、`<div>`、`<ul>`、`<ol>`、`<li>` 等，**其中`<div>`标签是最典型的块元素。**

特点：
- ① 比较霸道，自己独占一行。
- ② 高度，宽度、外边距以及内边距都可以控制。 
- ③ 宽度默认是容器（父级宽度）的100%。 
- ④ 是一个容器及盒子，里面可以放行内或者块级元素。 

注意： 文字类的元素内不能使用块级元素 ，比如`<p> <h1> ~ <h6>` 都不能放其它块级元素。

### 行内元素
常见的行内元素有 `<a>`、`<strong>`、`<b>`、`<em>`、`<i>`、`<del>`、`<s>`、`<ins>`、`<u>`、`<span>`等，**其中`<span>`是最典型的行内元素**，有的地方也将行内元素称为内联元素。

特点：
- ① 相邻行内元素在一行上，一行可以显示多个。 
- ② 高、宽直接设置是无效的。 
- ③ 默认宽度就是它本身内容的宽度。 
- ④ 行内元素只能容纳文本或其他行内元素。

>`<a>`标签在HTML5中可以放块级元素 [[a标签可以放块级元素]]

### 行内块元素

在行内元素中有几个特殊的标签 `<img />`、`<input />`、`<td>`，它同时具有块元素和行内元素的特点。 有些资料称它们为行内块元素。

行内块元素的特点： 
- ① 和相邻行内元素（行内块）在一行上，但是他们之间会有空白缝隙。一行可以显示多个（行内元素特点）。 
- ② 默认宽度就是它本身内容的宽度（行内元素特点）。 
- ③ 高度，行高、外边距以及内边距都可以控制（块级元素特点）。

## 字体属性

CSS Fonts (字体)属性用于定义字体系列、大小、粗细、和文字样式（如斜体）

![[Pasted image 20260610210745.png]]

### 字体系列

```css
p ｛ font-family："微软雅黑"；｝
div {font-family:Arial，"Microsoft Yahei"，"微软雅黑"；｝
```

- 各种字体之间必须使用英文状态下的逗号隔开 ，当指定里多个字体时，浏览器会按照顺序依次尝试使用指定的字体，如果都不支持，则会使用浏览器自己默认的字体
- 般情况下,如果有空格隔开的多个单词组成的字体,加引号. 
- **尽量使用系统默认自带字体，保证在任何用户的浏览器中都能正确显示** 
- 最常见的几个字体：body {font-family: 'Microsoft YaHei',tahoma,arial,'Hiragino Sans GB'; }


### 字体大小
CSS 使用 font-size 属性定义字体大小。
```css
p {
font-size: 20px;
}
```

- px（像素）大小是我们网页的最常用的单位 
- 谷歌浏览器默认的文字大小为16px 
- 不同浏览器可能默认显示的字号大小不一致，我们尽量给一个明确值大小，不要默认大小 
- 可以给 body 指定整个页面文字的大小

### 字体粗细
CSS 使用 font-weight 属性设置文本字体的粗细

```css
p {
	font-weight: bold;
}
```

![[Pasted image 20260610210402.png]]

- 学会让加粗标签（比如 h 和 strong 等) 不加粗，或者其他标签加粗 
- 实际开发时，我们更喜欢用数字表示粗细
### 文字样式
CSS 使用 font-style 属性设置文本的风格。
```css
p {
  font-style: normal;
}
```

![[Pasted image 20260610210530.png]]

注意： 平时我们很少给文字加斜体，反而要给斜体标签（em，i）改为不倾斜字体。


### 字体复合属性
字体属性可以把以上文字样式综合来写, 这样可以更节约代码:

```css
body {
/* 规则顺序*/
font: font-style font-weight font-size/line-height font-family;
/* 样例  */
font: italic 700 16px 'Microsoft yahei';
}
```

- 使用 font 属性时，必须按上面语法格式中的顺序书写，不能更换顺序，并且各个属性间以空格隔开 
- 不需要设置的属性可以省略（取默认值），但必须保留 font-size 和 font-family 属性，否则 font 属性将不起作用
>还是不使用复合属性算鸟

## 元素背景

背景属性可以设置背景颜色、背景图片、背景平铺、背景图片位置、背景图像固定等。
![[Pasted image 20260624211903.png]]

### 背景颜色

```css
background-color:颜色值;
```


### 背景图片

background-image 属性描述了元素的背景图像。实际开发常见于 logo 或者一些装饰性的小图片或者是超 大的背景图片, 优点是非常便于控制位置

```css
background-image: none | url
```


### 背景平铺

```css
background-repeat: repeat | no-repeat | repeat-x | repeat-y
```

![[Pasted image 20260624211554.png]]

### 背景图片位置

```css
background-position: x y;
```

参数代表的意思是：x 坐标和 y 坐标。 可以使用 方位名词 或者 精确单位

![[Pasted image 20260624211749.png]]

### 背景图像固定
background-attachment 属性设置背景图像是否固定或者随着页面的其余部分滚动。

```css
background-attachment : scroll | fixed
```

### 复合写法

background: 背景颜色 背景图片地址 背景平铺 背景图像滚动 背景图片位置;

```css
background: transparent url(image.jpg) repeat-y fixed top ;
```


### 背景色半透明

```css
background: rgba(0, 0, 0, 0.3);
```

- 最后一个参数是 alpha 透明度，取值范围在 0~1之间 
- 我们习惯把 0.3 的 0 省略掉，写为 background: rgba(0, 0, 0, .3); 
- 注意：背景半透明是指盒子背景半透明，盒子里面的内容不受影响

## 文本属性
CSS Text（文本）属性可定义文本的外观，比如文本的颜色、对齐文本、装饰文本、文本缩进、行间距等。
![[Pasted image 20260610212336.png]]
### 文本颜色
color 属性用于定义文本的颜色。
```css
div { color: red; }
```

![[Pasted image 20260610211510.png]]

开发中最常用的是十六进制.

### 对齐文本
text-align 属性用于设置元素内文本内容的水平对齐方式
```css
div { text-align: center; }
```

![[Pasted image 20260610211608.png]]


### 装饰文本
text-decoration 属性规定添加到文本的修饰。可以给文本添加下划线、删除线、上划线等。
```css
div { text-decoration：underline； }
```

![[Pasted image 20260610211715.png]]

重点记住如何添加下划线 ? 如何删除下划线 ? 其余了解即可

### 文本缩进
text-indent 属性用来指定文本的第一行的缩进，通常是将段落的首行缩进。
```css
div { text-indent: 10px; }
```

通过设置该属性，所有元素的第一行都可以缩进一个给定的长度，甚至该长度可以是负值。
```css
p { text-indent: 2em; }
```

em 是一个相对单位，就是当前元素（font-size) 1 个文字的大小, 如果当前元素没有设置大小，则会按照父元 素的 1 个文字大小

### 行间距
line-height 属性用于设置行间的距离（行高）。可以控制文字行与行之间的距离.
```css
p { line-height: 26px; }
```

行间距 = 上间距 + 文本高度 + 下间距

![[Pasted image 20260610212233.png]]
## 基本属性
    

### 长度单位
    

在CSS中，设置长度（Length）主要可以分为两大类：**绝对长度单位**和**相对长度单位**。

绝对长度单位

|   |   |   |
|---|---|---|
|单位|描述|示例|
|px|像素 (Pixel)。在屏幕上，它通常等于一个设备像素点。这是Web开发中最常用的单位。|width: 100px;|
|cm|厘米 (Centimeters)。|font-size: 0.5cm;|
|mm|毫米 (Millimeters)。|margin: 5mm;|
|in|英寸 (Inches)。$1\text{in} = 2.54\text{cm} = 96\text{px}$|padding: 0.25in;|
|pt|点 (Points)。$1\text{pt} = 1/72\text{in}$|font-size: 12pt;|
|pc|派卡 (Picas)。$1\text{pc} = 12\text{pt}$|line-height: 1pc;|

相对长度单位

相对长度单位是**可伸缩的**，它们依赖于其他元素的长度、视口（Viewport）的大小或根元素（`<html>`）的字体大小。这使得它们非常适合创建**响应式**和**可访问**的布局。

1. 字体相对单位 (Font-Relative Units)
    

|   |   |   |
|---|---|---|
|单位|描述|示例|
|em|当前元素的字体大小。如果当前元素没有设置字体大小，则继承父元素的。常用于设置padding、margin和line-height。|font-size: 1.5em;|
|rem|根元素 (<html>) 的字体大小。它只依赖于根元素，避免了级联带来的复杂性。常用于设置全局字体大小和响应式布局。|width: 10rem;|

2. 视口相对单位 (Viewport-Relative Units)
    

会随着浏览器视口的变化而变化。

|   |   |   |
|---|---|---|
|单位|描述|示例|
|vw|浏览器视口宽度的百分之多少|10vw 就是视口宽度的 10% 。|
|vh|视口高度的百分之多少|10vh 就是视口高度的 10% 。|

3. 百分比单位 (Percentage Unit)
    

|   |   |   |
|---|---|---|
|单位|描述|示例|
|%|百分比。它依赖于父元素的相应属性值。例如，width: 50%; 表示元素宽度是其父元素宽度的一半。|margin-left: 10%;|

### 颜色设置

|   |   |   |   |   |
|---|---|---|---|---|
|方法|格式|颜色空间|透明度支持|特点|
|关键词|red|-|transparent|最简单，颜色有限。|
|十六进制|#RRGGBB|RGB|#RRGGBBAA|最常用，精确，兼容性好。|
|RGB/A|rgb(r, g, b)|RGB|rgba(r, g, b, a)|数值精确，易于程序生成。|
|HSL/A|hsl(h, s, l)|HSL|hsla(h, s, l, a)|最符合人眼感知，方便调整色调/亮度。|

### 文本属性


定义**字体**类型、大小、粗细和样式。

|   |   |   |   |
|---|---|---|---|
|属性|作用|常用值举例|描述|
|font-family|字体族/类型。|Arial, sans-serif|指定文本的字体列表，浏览器会按顺序查找并使用第一个可用的字体。应以通用字体族（如 sans-serif）结尾作为备选。|
|font-size|字体大小。|16px, 1.2em, 100%, small|设置字体的高度。推荐使用相对单位（em, rem）以适应性更强。|
|font-weight|字体粗细。|bold, normal, 700, lighter|设置字符的粗细程度。400 等同于 normal，700 等同于 bold。|
|font-style|字体样式。|normal, italic, oblique|设置文本是否为斜体。italic 使用字体的斜体版本，oblique 倾斜正常的版本。|
|font|字体简写。|italic bold 12px/1.5 Arial, sans-serif|统一设置 font-style, font-weight, font-size, line-height, font-family。必须包含 font-size 和 font-family。|

CSS3新增@font-face属性，**自定义网页字体，**可以加载服务器上的任何字体文件，并在您的网页中使用它们，而不用依赖用户计算机上是否安装了该字体。

1. 基本语法：
    

```CSS
@font-face {
  font-family: 'YourCustomFontName';
  src: url('path/to/font.woff2') format('woff2'),
       url('path/to/font.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
```

> font-family: 定义你给这个字体起的名字，之后可以在 CSS 中像使用其他字体一样引用这个名字。
> 
> src: 定义字体文件的路径和格式。可以指定多个源，浏览器会根据支持的格式选择第一个匹配的文件。通常推荐从 WOFF2 开始，因为它提供了更好的压缩率。
> 
> font-weight: 设置字体的粗细。默认值为 normal，也可以设置为如 bold 或者具体的数字（100, 200, ..., 900）。
> 
> font-style: 设置字体样式，如 normal, italic 或 oblique。

2. 使用
    

一旦定义了 @font-face，就可以在你的 CSS 中像这样使用它：

```CSS
body {
  font-family: 'YourCustomFontName', sans-serif;
}
```

> 这里，如果用户的浏览器无法加载 YourCustomFontName，则会回退到系统默认的无衬线字体。

控制文本的**颜色和添加装饰**效果

|   |   |   |   |
|---|---|---|---|
|属性|作用|常用值举例|描述|
|color|文本颜色。|red, #ff0000, rgba(0, 0, 0, 0.8)|设置文本的前景颜色。|
|text-decoration|文本装饰线。|none, underline, overline, line-through|设置文本的装饰线类型。|
|text-decoration-color|装饰线的颜色。|blue, currentColor|设置 text-decoration 的颜色。|
|text-decoration-style|装饰线的样式。|solid, double, wavy|设置装饰线的样式（如波浪线）。|
|text-shadow|文本阴影。|2px 2px 5px #000|为文本添加阴影效果。格式：h-shadow v-shadow blur-radius color。|

控制文本布局和对齐属性

|   |   |   |   |
|---|---|---|---|
|属性|作用|常用值举例|描述|
|text-align|文本对齐。|left, right, center, justify|控制行元素在块级元素中内容的水平对齐方式。|
|text-transform|文本大小写。|none, uppercase, lowercase, capitalize|控制文本的字母大小写转换。|
|white-space|空白处理。|normal, nowrap, pre, pre-wrap|控制如何处理元素内的空白符和换行符。nowrap 可以防止文本换行。|
|text-indent|首行缩进。|2em, 20px|设置块级元素首行的缩进量。|
|line-height|行高。|1.5, 20px, 150%|设置行盒子高度|

文本换行和溢出

|   |   |   |   |
|---|---|---|---|
|属性名称|所属类别|主要作用|核心关联|
|white-space|换行控制|决定浏览器如何处理元素内的空白符（空格、Tab、换行符）以及是否自动换行。|text-overflow（单行省略的前提）|
|word-break|单词断行|控制当文本行尾没有空格时，长单词或连续字符序列是否允许在单词内部断开换行。|文本排版（特别是非拉丁语系）|
|overflow|容器可见性|当内容超出元素的边界时，控制容器的可见性和交互方式。|text-overflow（单行省略的关键）|
|text-overflow|文本溢出装饰|配合 white-space: nowrap 和 overflow: hidden 使用，定义被裁剪的文本末尾如何显示。|white-space 和 overflow（必须同时设置）|

最常用的 **单行文本溢出显示省略号** 的效果设置

```CSS
.single-line-ellipsis {
    /* 1. 确保文本不换行 */
    white-space: nowrap; 

    /* 2. 隐藏所有溢出内容 */
    overflow: hidden;    
    
    /* 3. 将被隐藏的文本替换为省略号 */
    text-overflow: ellipsis; 

    /* 4. 必须给容器设置一个宽度或 max-width */
    width: 250px; 
}
```

控制文本间距

|   |   |   |   |
|---|---|---|---|
|属性|作用|常用值举例|描述|
|letter-spacing|字符间距。|2px, -1px|调整字符之间的水平间距。可接受负值以收缩间距。|
|word-spacing|单词间距。|5px, normal|调整单词之间的水平间距。|

### 背景属性
    

控制元素的**背景颜色**和**背景图像**及其相关的展示方式。

背景颜色

- `background-color` ：设置背景颜色
    

背景图片

|   |   |   |
|---|---|---|
|属性名称|作用|备注/重要性|
|background-image|加载图片或渐变。|必须设置，否则没有背景图片。支持多重背景。|
|background-repeat|控制平铺重复。|默认为 repeat，单次显示需设为 no-repeat。|
|background-position|控制图片定位。|决定图片在容器中的起始位置。|
|background-size|控制图片尺寸。|CSS3 新增，用于图片自适应，非常常用。|
|background-attachment|控制滚动方式。|fixed 常用于创建视差效果（Parallax）。|
|background-color|设置背景色。|当图片加载失败或透明时，显示背景色。|

设置背景颜色渐变

|   |   |   |
|---|---|---|
|渐变类型|CSS 函数|变化形式|
|线性渐变|linear-gradient()|颜色沿着一条直线平滑过渡。|
|径向渐变|radial-gradient()|颜色从一个中心点向外辐射式过渡。|
|重复线性渐变|repeating-linear-gradient()|线性渐变会无限重复，常用于创建条纹。|
|重复径向渐变|repeating-radial-gradient()|径向渐变会无限重复，常用于创建同心圆。|

```CSS
/* 从左到右 */
background: linear-gradient(to right, red, yellow);

/* 对角线（左上到右下） */
background: linear-gradient(to bottom right, blue, purple);

/* 指定角度（0deg = 向上，90deg = 向右） */
background: linear-gradient(45deg, #ff9a9e, #fad0c4);

/* 多色渐变 + 位置控制 */
background: linear-gradient(to right, red 0%, orange 30%, yellow 70%, green 100%);
```

### 样式继承
    

有些样式会继承，元素如果本身设置了某个样式，就使用本身设置的样式；但如果本身没有设置某个样式，会从父元素开始一级一级继承（优先继承离得近的祖先元素）。

1. 会继承的属性：字体属性、文本属性（除了vertical-align）、文字颜色等。
    
2. 不会继承的属性：边框、背景、内边距、外边距、宽高、溢出方式 等。
    

总结：能继承的属性，都是不影响布局的

## 元素盒子模型
    

### 元素的显示模式
    

通过 CSS 中的 display 属性可以修改元素的默认显示模式，常用值如下：

1. none 元素会被隐藏。
    
2. block 元素将作为块级元素显示。
    
3. inline 元素将作为内联元素显示。
    
4. inline-block 元素将作为行内块元素显示
    

块元素 block

1. 在页面中独占一行，不会与任何元素共用一行，是从上到下排列的。
    
2. 默认宽度：撑满父元素。
    
3. 默认高度：由内容撑开。
    
4. 可以通过 CSS 设置宽高。
    

```HTML
1. 主体结构标签： <html> 、 <body>
2. 排版标签： <h1> ~ <h6> 、 <hr> 、 <p> 、 <pre> 、 <div>
3. 4. 列表标签： <ul> 、 <ol> 、 <li> 、 <dl> 、 <dt> 、 <dd>
表格相关标签： <table> 、 <tbody> 、 <thead> 、 <tfoot> 、 <tr> 、
<caption>
4. <form> 与 <option>
```

行内元素 inline

1. 在页面中不独占一行，一行中不能容纳下的行内元素，会在下一行继续从左到右排列。
    
2. 默认宽度：由内容撑开。
    
3. 默认高度：由内容撑开。
    
4. 无法通过 CSS 设置宽高。
    

```XML
1. 文本标签： <br> 、 <em> 、 <strong> 、 <sup> 、 <sub> 、 <del> 、 <ins>
2. <a> 与 <label>
```

行内块元素 inline-block

1. 在页面中**不独占一行**，一行中不能容纳下的行内元素，会在下一行继续从左到右排列。
    
2. 默认宽度：由内容撑开。
    
3. 默认高度：由内容撑开。
    
4. **可以通过 CSS 设置宽高。**
    

```XML
1. 图片： <img>
2. 单元格： <td> 、 <th>
3. 表单控件： <input> 、 <textarea> 、 <select> 、 <button>
4. 框架标签： <iframe>
```

### 盒子模型的组成
    

CSS 会把**所有的 HTML 元素都看成一个盒子，所有的样式也都是基于这个盒子**。

1. margin（外边距）： 盒子与外界的距离。
    
2. border（边框）： 盒子的边框。
    
3. padding（内边距）： 紧贴内容的补白区域。
    
4. content（内容）：元素中的文本或后代元素都是它的内容。
    

盒子的大小 = content + 左右 padding + 左右 border 。

> 注意：外边距 margin 不会影响盒子的大小，但会影响盒子的位置。

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MDk2YWY5MTU2NGMxMzUzMjZiZThlOTk1MDhiYTg5NTdfR212YzN4cHF1TDdHcGc0UlhZRlBzcWEwNG9JUE5wOWtfVG9rZW46SXFoRmJUVE1vb3dZZ3l4MlNSeGNZV2J5blpnXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

父子元素的盒子模型：

1. 子元素盒子的所有部分都位于父元素的content区域，依次从左往右，从上往下依次延伸。
    
2. 当子元素的盒子的尺寸大于父亲的content区域时，超出的部分延伸出父元素的 content 区域。可以设置父亲的overflow属性来处理，当设置为hidden属性时，会隐藏任何超出父元素 padding边缘的内容，如果设置auto，同样也是超出父元素pading区域则会显示滚动条，但是注意，在垂直方向，浏览器通常会提前在内容超出 content 区域时就触发滚动条，同时滚动条会占用 content 的空间，使得父元素的content +pading区域变小，从而间接触发水平方向的滚动条。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MWFiNDZlMzA4MDdmYTNhZDYzN2RmMThhZWZiYjVkMDRfNklTTWNZTDBZbzJTbGNzWDFvMzBqWXBXbWFlWndWNk5fVG9rZW46Wnh0Y2Judk81b0Y4aWF4eDgwRGNhVENObnFnXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

#### 内容区域（content）
    

|   |   |   |
|---|---|---|
|CSS 属性名|功能|属性值|
|width|设置内容区域宽度|长度|
|max-width|设置内容区域的最大宽度|长度|
|min-width|设置内容区域的最小宽度|长度|
|height|设置内容区域的高度|长度|
|max-height|设置内容区域的最大高度|长度|
|min-height|设置内容区域的最小高度|长度|

> 注意：
> 
> max-width 、 min-width 一般不与 width 一起使用。
> 
> max-height 、 min-height 一般不与 height 一起使用。

默认宽度，就是不设置 width 属性时，元素所呈现出来的宽度。

总宽度 = 父的 content — 自身的左右 margin 。

内容区的宽度 = 父的 content — 自身的左右 margin — 自身的左右 border — 自身的左右padding。

#### 内边距（padding）
    

|   |   |   |
|---|---|---|
|CSS 属性名|功能|属性值|
|padding-top|上内边距|长度|
|padding-right|右内边距|长度|
|padding-bottom|下内边距|长度|
|padding-left|左内边距|长度|
|padding|复合属性|长度，可以设置 $1 \sim 4$ 个值|

注意点：

1. padding 的值不能为负数。
    
2. 行内元素 的 左右内边距是没问题的，上下内边距不能完美的设置。
    
3. 块级元素、行内块元素，四个方向内边距都可以完美设置
    

#### 边框（border）
    

|   |   |   |
|---|---|---|
|CSS 属性名|功能|属性值|
|border-style|边框风格|none: 默认值  <br>solid: 实线  <br>dashed: 虚线  <br>dotted: 点线  <br>double: 双实线  <br>……|
|border-width|边框宽度|长度 px|
|border-color|边框颜色|颜色，默认黑色|
|border-radius|边框圆角||
|border|复合属性|2px solid red;|
|border-left  <br>border-left-style  <br>border-left-width  <br>border-left-color  <br>border-left-radius|设置左方向的边框|其它方向：  <br>border-right  <br>border-top  <br>border-bottom|

#### 外边距（margin）
    

5. 子元素的 margin ，是参考父元素的 content 计算的。（因为是父亲的 content 中承装着子元素）
    
6. **上 margin 、左 margin ：影响自己的位置；下 margin 、右 margin ：影响后面兄弟元素的位置**。
    
7. 块级元素、行内块元素，均可以完美地设置四个方向的 margin ；但行内元素，左右margin 可以完美设置，上下 margin 设置无效。
    
8. margin 的值也可以是 auto ，如果给一个块级元素设置左右 margin 都为 auto ，该块级元素会在父元素中水平居中。
    
9. margin 的值可以是负值。
    

|   |   |   |
|---|---|---|
|CSS 属性名|功能|属性值|
|margin-left|左外边距|CSS 中的长度值|
|margin-right|右外边距|CSS 中的长度值|
|margin-top|上外边距|CSS 中的长度值|
|margin-bottom|下外边距|CSS 中的长度值|
|margin|复合属性，可以写1-4 个值，规律同 padding (顺时针)|CSS 中的长度值|

1. 关于margin 塌陷
    

2. 垂直方向：
    
    1. 相邻元素之间的margin会取最大值那个作为这2元素的间隔
        
    2. 对于父元素的第一个子元素的margin-top，如果父元素没有开启BFC，则第一个子元素的margin-top会作用在父元素上，最后一个子元素的margin-botoom会作用在父元素上（父子元素的margin塌陷现象）
        
3. 水平方向：margin的值直接相加
    

第一个子元素的上 margin-top 会作用在父元素上，最后一个子元素的下 margin-bottom 会作用在父元素上。

如何解决 垂直margin 塌陷？

1. 给父元素设置不为 0 的 padding 或者 给父元素设置宽度不为 0 的 border 。
    
2. **给父元素设置 css 样式 overflow:hidden**
    

#### CSS3盒子模型新增属性
    

4. **`box-sizing`** 属性设置盒模型类型：
    

|   |   |
|---|---|
|可选值 (Value)|含义 (Meaning)|
|content-box|width 和 height 设置的是盒子内容区的大小。（默认值）|
|border-box|width 和 height 设置的是盒子总大小。（怪异盒模型）|

- content-box：width和height设置的是盒子内容区域的宽、高，当设置border、padding时盒子模型的总大小会变大，以保持内容区域宽高不变。
    
- border-box：设置的是盒子模型的总宽和高，不会发生变化，当设置border、padding时，内容区域宽高会变小，以保持盒子宽高不变。
    

2. 其它新增属性：
    

- `resize` 控制是否允许用户调节元素尺寸
    
- `box-shadow` 为盒子添加阴影
    
- `opacity` 添加透明度
    

### 处理内容溢出
    

子元素的content

|   |   |   |
|---|---|---|
|CSS 属性名|功能|属性值|
|overflow|溢出内容的处理方式|visible: 显示，默认值  <br>hidden: 隐藏  <br>scroll: 显示滚动条，不论内容是否溢出  <br>auto: 自动显示滚动条，内容不溢出不显示|
|overflow-x|水平方向溢出内容的处理方式|同 overflow|
|overflow-y|垂直方向溢出内容给的处理方式|同 overflow|

### 隐藏元素
    

方式一：visibility 属性

visibility 属性默认值是 show ，如果设置为 hidden ，元素会隐藏。

元素看不见了，还占有原来的位置（元素的大小依然保持）。

方式二： display 属性

设置 display:none ，就可以让元素隐藏。

彻底地隐藏，不但看不见，也不占用任何位置，没有大小宽高

  

## 布局
    

### 元素布局规则
    

在 CSS 中，元素首先分为两大类（简化版）：

|   |   |   |
|---|---|---|
|类型|典型元素|特点|
|块级元素（block-level）|<div>,<p>,<h1>,<section>|独占一行，垂直堆叠|
|行级元素（inline-level）|文本、<span>,<a>,<img>|在一行内水平排列，不换行|

> 注意：display 属性可以改变元素类型，比如 span { display: block } 就变成块级。

浏览器对这两类元素使用完全不同的布局规则。

**块级元素布局规则（Block Layout）**

垂直堆叠，从上到下

当你在一个容器里放多个块级元素，浏览器会在该容器的【内容区域】的左上边缘开始依次向下排列每个块级盒子，每个块级盒子：

- **默认宽度 = 容器宽度（width: auto）**
    
- **高度由内容或 height 决定**
    

**行级元素布局规则（Inline Layout）**

水平流动，按行排布，形成“行盒”。

首先理解**“行盒” (line box )** 和 **基线 (baseline)：**

1. **行盒 line box**：当有文本和行内元素时，浏览器会为这一行的元素创建一个“行盒子”，这个行盒子当然看不见，虚拟的，它是浏览器在为行内元素进行布局的重要参考指标。
    
    1. 行盒的高度：由该行内“最高的元素”决定，浏览器会创建一个足够高的行盒来容纳该行内的所有元素。
        
    2. 行盒的宽度：等于所在包含块（containing block）的宽度（通常是父级块元素的 content width），行内内容不会决定行盒宽度，当行内内容超过宽度时会自动换行或者溢出。
        
2. **基线 baseline**：用来控制处于同一行的元素垂直方向上如何对齐，默认情况下行内的元素会和行盒的基线对齐：
    
    1. **什么是基线？**
        
    
      基线（baseline）是西文**字体**排印中的一个核心参考线，用于对齐字母。如下图所示：中间那条红线就是基线，所有的字母按照这个基线进行排版，这样视觉上文字都是正对齐的。行盒的基线的位置会按照字体大小进行计算，并且会预留一个ascender height 和 descender height
    
    - 像字母 x, a, e, o 这些没有上下延伸的部分，它们的底部就贴在基线上
        
    - 字母 g, y, p, q 有“下伸部”（descender），会穿过基线向下延伸。
        
    - 字母 b, d, h, k 有“上伸部”（ascender），从基线向上延伸。
        
    
    ![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjUzZjAxNjg5NmNjMDljODcwOWNkZGExNDU0OGRkNzVfZW13dEZnYWhFd2doWk5TbHA1cFZkUUk1WUw5QmE5aTVfVG9rZW46SkNJUWIxU052b2tzUm14ZW5JWGNQamlQblVjXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)
    
    4. **元素自身的基线：**
        
    
    |   |   |
    |---|---|
    |元素类型|它的“基线”位置|
    |普通文本（如 <span>text</span>）|字体本身的基线（如上图）|
    |可替换元素（如 <img>、<input>）|元素的底边（bottom edge） 被当作基线|
    |inline-block 元素（无文本内容）|其 margin box 的底边 被当作基线  <br>（注意：不是 content 或 padding 底边！）|
    |inline-block 元素（有文本内容）|使用内部最后一行文本的基线作为自己的基线|
    
    5. **行盒的基线：**等于当前行盒中文本的基线，位置根据字体计算，如果没有文本，浏览器也会创建一个“看不见”的文本，使用默认的字体大小进行计算，用来提供基线：
        

> vertical-align: baseline 的本质是：让元素自己的“基线”去对齐当前行盒的“基线”——而行盒的基线，永远来自（可见或不可见的）文本。

2. ## 块级元素基本布局
    

如何设置块元素在父元素容器中水平居中？

设置块元素的`margin-left` 和 `margn-right` 值为auto即可 简写 `margin: 0 auto;`

如何设置块元素在父元素容器中垂直居中？

1. 给子元素添加 `margin-top`，值等于(父元素 content －子元素盒子总高) / 2。
    

2. ## 行内元素基本布局
    

如何设置行内元素在父元素容器中水平居中？

直接在父元素中设置 `text-align: center`

如何设置行内元素在父元素容器中垂直居中？

1. 让父元素的 `height = line-height` 也即行盒的高度等于所在父容器的高度，这样行盒内的元素大概就是处于父容器的中间位置
    
2. 如果该子元素同时包含文本、图片等不同类型的行内元素，则给每个子元素设置 `vertical-align:middle` 让所有子元素在行盒内**大概居中**
    

同一行内元素之间空格现象

如下图，每个span在浏览器页面上会存在间隔，因为我们的代码在描述元素时进行了换行，这个换行会被浏览器解析为一个空白字符，于是造就了同一行内元素之间的空格。

```XML
<div>
  <span  class="s1">这是一行文字</span>
  <span class="s2">这是一行文字</span>
  <span class="s3">这是一行文字</span>
</div>
```

解决办法：

- 不换行，不推荐
    
- 给父级容器设置 font-szie:0 这样空白字符的大小就变成0，元素之间的间隔从视觉上也就没有了。
    
- 使用使用 Flexbox 或 Grid 布局
    

**行内元素底部与父级容器底部存在间隙现象**

图片元素在父级容器div内部，观察浏览器渲染时，发现图片底部与div的底部还存在一小段间隙，这是因为浏览器在创建一个行盒子时，会预留一个descender height

区域，然后图片底部默认与基线对齐

```HTML
<div>
  <img src="../../img/icons8-aang-50.png">
</div>
```

如何消除：

- 给图片设置 vertical-align: bottom; 或者middle、top均可。
    

`line-height` 属性

用于设置行高，也即“行盒”的高度，可以作用于块级元素和行内元素。

1. 作用于块级元素(常见）：`<p>` 、`<div>` 、`<h1>` ~ `<h6>` 、`<section>`, `<article>`, `<header>`
    
    1. 该块级元素内的每一行都会继承这个属性
        
    2. 快速控制该块级元素内的行高
        
2. 作用于行内元素：单独设置该元素的行高，会影响该元素所在行盒的整体高度。比如该行内某元素单独设置line-height 过高，则导致该元素所在行盒整体高度变大。
    

值说明：

|   |   |   |
|---|---|---|
|取值类型|示例|说明|
|normal|line-height: normal;|默认值，浏览器通常设为 1.2 左右（具体取决于字体）|
|无单位数字（推荐）|line-height: 1.5;|相对于当前元素的 font-size 的倍数，会继承这个比例|
|长度值|line-height: 24px; 或 line-height: 2em;|固定高度。注意：em 是相对于当前元素的 font-size，但不会被子元素继承为比例|
|百分比|line-height: 150%;|相对于当前元素的 font-size 计算，但在继承时会被计算成绝对值再传递，容易引发意外|

`vertical-align` 属性

作用在行内元素（inline）或表格单元格（table-cell），用于控制其垂直方向上的对齐方式。

常见取值说明：

|   |   |
|---|---|
|||
|||
|||
|||
|||
|||
|||

4. ## 传统盒子模型布局
    

传统布局是指：基于传统盒状模型，主要靠： display 属性 + position 属性 + float 属性

1. ### 浮动
    

CSS 中的浮动（Float）是一种用于控制元素布局的方式。

> 最初是为了实现文字环绕图片的效果而引入的。现代网页不再采用浮动技术进行布局。

```CSS
float: left;    /* 元素向左浮动 */
float: right;   /* 元素向右浮动 */
float: none;    /* 默认值，不浮动 */
float: inherit; /* 继承父元素的 float 值 */
```

当给元素设置浮动后：

- 元素会从普通文档流的当前位置中**“漂浮”出来**，脱离出来，**不占用原本文档流的位置**，但是**表现为占用原本文档流行盒子的位置，导致后边的文字或者其它元素围绕这个浮动元素形成环绕效果。**
    
- 无论之前是行内元素还是块级元素，都表现变成一个**“块级盒子”**，**不独占一行，默认宽度和高度由盒子中的内容撑开**，仍然可以设置盒子的相关属性（比如宽、高、margin等），此时会影响到后边的文本或者行内元素
    
- 该浮动元素会紧贴前面的浮动元素（从左至右，从上至下），而后面的非浮动元素仍然按照之前的文档流布局，但是这个浮动盒子会影响后边的文本或者行内元素，表现为这个**块级盒子把文本或者其它行内元素推开**，形成环绕效果：
    
    - 后方是文本或者行内元素：仍然按照行内元素布局：从左至右依次排列、自动换行，但是会自动避开这个浮动元素，最终形成环绕效果。
        
    - 后方是块级元素：仍然按照块级元素布局：垂直独占一行从上至下，但是该块级元素内部的文本或者行内元素会自动避开这个浮动元素。
        

  

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTZjMGMyZWQyMjNkZmQ3ZTMzZWJhYjE4ZjhhMjc0ZGNfemFaaHhlYjlXamdyVEZKamV6azRHa0dkSXNRaHl3RkJfVG9rZW46QWkwWWJlZWZmbzJMNkt4Q2M2ZWNKdDZMbmpoXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

  

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YThiZDQwZWQxMWEzN2NlMmJmYWZiZWI2NWJlNWU2NjhfWFU5ZG45VjJra1Nndll1T2l5SlhoMlRnUVVUUVhPUDhfVG9rZW46S2NYTGIwTUhXb1Y2eGt4a0JVRWNyNFkxbkhlXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

2. ### 定位
    

定位（Positioning） 是控制元素在页面中位置，可以作用于所有类型的元素。

`position` 的常用取值

|   |   |
|---|---|
|||
|||
|||
|||
|||
|||

1. 对元素开启绝对定位和固定定位之后，元素会变成`定位元素`：默认宽高被内容撑开，但仍然可以设置宽、高。
    
    1. 块宽想与包含块一致，可以给定位元素同时设置 left 和 right 为 0 。
        
    2. 高度想与包含块一致， top 和 bottom 设置为 0 。
        
    3. 让定位元素在包含块中居中：
        
        ```CSS
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        // 或者
        left: 50%;
        top: 50%;
        margin-left: 负的宽度一半;
        margin-top: 负的高度一半;
        ```
        
2. 而对元素开启相对定位后，元素还是之前的显示模式。
    

##### **relative 相对定位**

1. 对元素开启相对定位之后，仍然占据原始文档流的位置，且偏移之后不影响原始文档流，只是视觉上进行了偏移，如果偏离的位置上有元素，视觉上表现为盖在它身上。
    
2. top / right / bottom / left 的值表示：元素盒子的对应边，表示相对原始位置的这条边的偏离多少距离
    

**应用场景：**

- 对元素位置进行微调，并且希望不对元素文档流产生任何影响。
    

```CSS
.box {
  position: relative;  // 给元素开启相对位置
  top: 20px;  // 相对原始位置的上边这条边偏离20px，视觉上向下移动了20
  left: 30px;
}
```

##### **absolute 绝对定位**

1. 对元素开启绝对定位之后，脱离原始文档流，元素不再占据原来的位置空间，且偏离之后也不会对文档流的其它元素的位置影响，如果偏离的位置有元素，视觉上表现为盖在它身上。
    
2. 仍能是使用top / right / bottom / left进行位置偏离，但是参考点第一个 `position` 不是 `static` 的父级元素，直到html根元素
    
3. **一般情况下对于使用绝对定位的元素，都会让父级元素开启相对定位，这样好计算偏离。**
    

```CSS
.outer{
  width: 400px;
  height: 400px;
  background-color: gray;
  padding: 10px;
  // 父级元素开启相对定位
  position: relative;
}

.box2{
  background-color: red;
  position: absolute;
  right: 10px;
}
```

> 无论是什么元素（行内、行内块、块级）设置为绝对定位之后，都变成了定位元素。定位元素：—— 默认宽、高都被内容所撑开，且能自由设置宽高。

##### fixed 固定定位

1. 对元素开启固定定位之后，脱离原始文档流，元素不再占据原来的位置空间，且偏离之后也不会对文档流的其它元素的位置影响
    
2. 仍能是使用top / right / bottom / left进行位置偏离，但是参考点是**浏览器视口**，只要视口本身不变（如窗口大小未调整），即使页面滚动，元素位置在屏幕上也保持不变。”
    

```CSS
.box2{
  position: fixed;
  right: 10px;
}
```

##### sticky 粘性定位

1. sticky 是为滚动场景设计的，适用于页面滚动或任意可滚动容器；
    
2. top/bottom 等偏移值是相对于当前滚动容器的可视区域边缘；
    
3. 当元素在滚动中即将离开可视区域时，它会“粘”在指定偏移位置，直到父容器本身滚出视口。
    

> 常用top:0 页面滚动时让该元素固定在窗口顶边。

4. ### 定位层级
    

CSS 中的 定位层级（stacking context，层叠上下文） 是控制元素在 Z 轴（垂直于屏幕的方向）上谁显示在前、谁显示在后的核心机制。可以使用 z-index 调整，值越大显示层级越高，只有定位的元素设置 z-index 才有效。

|   |   |   |
|---|---|---|
|**容器设置**|   |   |
|属性|用途|默认值|
|`flex-direction`|主抽的方向|row：从左至右|
|`flex-wrap`|**主轴**方向的空间不够时是否换行|nowrap:不换行|
|`justify-content`|**主轴**方向项目对齐分布方式|flex-start：起点开始|
|`align-items`<br><br>`align-content`|**侧轴**方向项目对齐分布||
|**项目设置**|   |   |
|`flex-grow`|主轴方向空间剩余时项目拉伸的比例||
|`flex-shrink`|主轴方向空间不足时收缩的比例||
|`order`|定义项目的排列顺序。数值越小，排列越靠前，默认为 0||
|align-self|单独定义该项目在侧轴方向上的对齐||

5. ## 伸缩盒模型布局
    

Flexible Box （**伸缩**盒模型）。它可以轻松的控制在单行或者单列中：元素分布方式、元素对齐方式、元素视觉顺序 .......

1. 伸缩**容器**与伸缩**项目**
    

当给元素设置： `display:flex` ，该元素就变成了一个伸缩容器，其直接子元素变成伸缩项目，并且不管之前是什么元素（块、行内块、行内），一旦成为了伸缩项目，全都会“块状化”。

属性的设置：

- 容器：主轴、侧轴
    
- 项目：
    

```XML
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>

.container {
  display: flex; /* 启用 Flexbox */
}
```

2. 主轴和侧轴
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjFkMzQ4ODRhOWE3NmEzYzIwZjBhNjlkN2YzMjhhMThfcVNBZ05MSG1jY2R1UW4wcldCcTZ0ZVh2UVhobzJ3UHdfVG9rZW46WE9ZUWIxNUcxb1JzdkR4UmI5cGMwWjRVbjdkXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

伸缩项目会**沿着伸缩容器的主轴方向和侧轴方向进行排列分布。**

- 项目记得设置下高度，不然侧轴方向会默认自动拉伸。
    

1. ### 主轴设置
    

|   |   |   |
|---|---|---|
|属性|用途|默认值|
|`flex-direction`|主抽的方向|row：从左至右|
|`flex-wrap`|主轴方向的空间不够时是否换行|nowrap:不换行|
|`justify-content`|主轴方向项目对齐分布方式|flex-start：起点开始|

- 主轴：默认水平，从左到右，一般通过改变伸缩容器的主轴方向来控制伸缩项目在伸缩容器里的排列，使用 `flex-direction` 属性控制。
    
    - row ：主轴方向水平从左到右 —— 默认值
        
    - row-reverse ：主轴方向水平从右到左。
        
    - column ：主轴方向垂直从上到下。
        
    - column-reverse ：主轴方向垂直从下到上。
        
    
    ![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGYxMzQ2ZjdiZThhOWUxNmY0ZTg1NzBkMmE5Mzk0NmZfU3RCOHNZY08xMmZsZWkyNkpQRTZ3WlFjRndSNmR0SVhfVG9rZW46UTdjemI5T0xmb2VGSkp4dXBtaWNwaktBbnVnXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)
    
- 侧轴：垂直于主轴，默认从上到下，当主轴方向改变，则侧轴方向随之改变。
    

主轴换行

容器中项目默认沿着主轴方向排列，随着项目的增多，项目总宽度超过容器的总宽度时，项目会自动收缩自己的宽度来适应容器的宽度，保证不超过容器的宽度。通过 `flex-wrap` 属性可以控制住轴方向换行。

> flex-flow 是一个复合属性，复合了 flex-direction 和 flex-wrap 两个属性。 值没有顺序要求（了解）

- nowrap ：默认值，不换行。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MjI4YzUxNjliMGRjMzQ2MjMzYzg2YWQ0OTUzZGQzYzNfam5OUnRIckJUODl5ZVdVRkJTNXpEZUExdUJVUkc5bnBfVG9rZW46QXBzc2JYUDlzb3JSRFV4bG9jS2NaOVBHbndnXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- **wrap** ：自动换行，伸缩容器不够自动换行
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OGM1ZmU1YmIxODMwMGI1ODBhNjdkMzY3NWFkYzEzYWFfYzI1RXViblNOTG1vaG44aExpNEM2YXR6NHBjZnNlMDNfVG9rZW46VEs2WWJ1YXhhb0JscUR4cVBXQ2N2UDFKbmplXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- wrap-reverse ：反向换行。从容器的底部开始向上换行
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDVkMWFkOGYzNmNlOGYxMzI2YTQzZDFjNDc4MzU0NDFfMDQxcVZDQXR1TEVZeUNSY3JqaGFmSGpWU3Zkd09lT29fVG9rZW46TXF3bmJNbnRIb0dwZXR4WEJPS2NocGdxblZjXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

主轴对齐方式

使用 `justify-content` 属性控制伸缩项目在主轴方向上的分布

- flex-start ：默认值，从主轴起点开始排列分布
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YjZhNjExNzJhZjcwMzg0Mzg0ZDJjMDNiMzE1NWJhZGZfb2pzMWNPc0d0d3lWWjRqTEM4bFZaTWljZTd5amZsUjlfVG9rZW46S0FXc2JoNW4yb1BMcjd4SUN5WmN2dUxUbm1oXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- flex-end：从主轴终点开始排列分布
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGU0ZWMzMjdhOThkZTJkNzNmODM4ZTE5YzQ5YTZhMTdfS1RLd1BMNjdQY3dUQmFnSEZtUTNtMm9QM0FuWWJadmlfVG9rZW46WDcwcWI0Z1hSb3NoR054dGozU2M3MGJXbnFJXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- center：从主轴中点分别向左和右排列分布
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGEzZjQ3M2VhZWNjMzg1YzAxNTdhOTkwMzNjNGNjZTNfUWNlZ3NLVFpoSnlwbTAzYjdzaFFSNmJnYlQ1YlA1bUVfVG9rZW46WGp5OWJiZGxob0x6a0x4bDZ2MmN1TXU2bnNmXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- **space-between：**均匀的在主轴上排列分布，从两端开始
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MTExYWMyYWE0ZTBiODg5MzAxNzcyMjEyYzc5NmZiMGRfRHh2ZjZST2pEaHZaU29GOTd3STlUeEhmSzZEZTd5MWVfVG9rZW46TXpKR2JYaHJDb2hHRXF4Smg1MmNScU5WbjRlXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- space-around ：均匀的在主轴上排列分布，两端距离是中间距离的一半。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MTkzMzQ4NTJkNDRkNmY3YjEwZDI5ZmM3YzBmMDFkZDJfZDl3WkFaZGhPbUJQZEhSVkZQajBDaGtRMmZMRHluTUVfVG9rZW46T1BwMmJrbnFDb3B0Mkp4NENDTGNIYWVRbnBoXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- space-evenly ：均匀分布，两端距离与中间距离一致。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTdiODE0ZTRkODFhNjA0Mzc0YmY2ZmVlNzEyNjQ4YTNfYlk4RjFSYmNFQVA2VGJHWmxwZzM1OGhmSk8zZlpnN2ZfVG9rZW46SERPcWI5d2FEb2RYSVB4TEFWaWMwT2tqbmJlXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

  

2. ### 侧轴设置
    

控制侧轴方向对齐和分布：

- `align-items`
    
- `align-content`
    

设置侧轴对齐方式：用于控制伸缩项目在侧轴方向上的排列分布，默认情况下，伸缩项目在侧轴方向上均匀分布尽量占满整个侧轴。

`align-items`：一行的情况下

- flex-start ：侧轴的起点对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YTVjY2ZkNzFkY2MxZTQzMThlNzFjNTkzNGQwNzRmMmRfcXJPUXkxeTVTYjVBVnF4ZXRSQVZCZkZtNk5oblg4U2ZfVG9rZW46Rjdxa2JPMlFjb3N6SXF4S0V6V2Nwell4bkFnXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- flex-end：侧轴的终点对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YTI3YzFiODY3MWE2YjA0ZGNhODUyNDk1MTg0ZWZjM2NfRWYyMzRwRG14RXlFaVNRREg3SGV5eFJUVDNycW9DeTdfVG9rZW46T1pGVmJDYWF3bzJaRWd4bzhqV2NCODFxblNnXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- center ：侧轴的中点对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MDQ0M2YyYzkwNzAxYWNjNWFhNTNlOGIzMmU0MWM0NWVfQ1FwbEF2Sk5RRXdYaDM3bVhUZ0xlZnJ2SlZuYmZPUGRfVG9rZW46WkNHVGJDYURpb1A2YUR4d1JONWNSZVpnbk8yXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- baseline : 伸缩项目的第一行文字的基线对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NmE0YWYxYmZkMmUxNjcxYzBkNDdiMGU2OTc5MmYyZjJfbm01d01wOGNYSmxib2R2Q1pvMGxYWENNTU9vMUZwRzRfVG9rZW46QVJKQmJzWnJqb3ZzMW94RzhPU2N5U3Z0bnpjXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- stretch ：如果伸缩项目未设置高度，将占满整个容器的高度。—— （默认值）
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OGUxM2E3M2RmNmI3N2E1YTEwNTliNDkxMTcxMTZjODVfdlRCVU1CQlNhYnJmR2JKc0Zab1FweVZsVmxhNE1hdlZfVG9rZW46Umx1aGJmZktWb2kwSGN4ZGtnS2NuRHZoblBkXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

`align-content：`用于多行的情况

- flex-start ：与侧轴的起点对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=NGU4N2QzZjFlZmY2OTY4NGMwZWRhNmFmYWI1Mzk5YTRfUjJwdzhkME1jYmhmMmFUQzV1eHNpTG1HYUdGQzNiSURfVG9rZW46RTVTSWJ1Ym12b09oblB4Y1pHMWNWZTFEbjdiXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- flex-end ：与侧轴的终点对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OWRiOTg0NWE0NDgyMGVjNjQ4NDg1YmNiNTA2NGJiMTRfbGZ6c2dINWt6SFRnUHJwT2ZDenQzdlpUTkR6VWxDNUlfVG9rZW46V2pZbWJYdE9ybzllYUV4ZkpsSWNUT0Zybm9iXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- center ：与侧轴的中点对齐。
    

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=Zjk1NDllNWNlYTFjOGNlZDY5NTVjOGE2ZDEwZmNhZDhfRmpkWnZkOG9hNnlSSDROUkRwYnVSa0l4T3MxUk1YOWtfVG9rZW46WlBWMGJGZzJrbzd0VnR4OURDVWM2OUdxbnpmXzE3NzYwNDA5NzQ6MTc3NjA0NDU3NF9WNA)

- space-between ：与侧轴两端对齐，中间平均分布。
    
- space-around ：伸缩项目间的距离相等，比距边缘大一倍。
    
- space-evenly : 在侧轴上完全平分。
    
- stretch ：占满整个侧轴。—— 默认值
    

3. ### 项目伸缩
    

项目的属性主要是设置项目在容器中如何进行伸缩。

1. 当容器还有剩余空间时，通过 `flex-grow` 属性让项目拉伸以占满剩余空间。
    
2. 当容器不够所有项目，通过 `flex-shrink` 属性让项目缩。
    

flex-grow

当**主轴方向还有剩余空间**时，通过flex-grow 定义伸缩项目的放大比例，默认为 0 ，即：纵使主轴存在剩余空间，也不拉伸。

- 若所有伸缩项目的 flex-grow 值都为 1 ，则：它们将等分剩余空间（如果有空间的话）。
    
- 若三个伸缩项目的 flex-grow 值分别为： 1 、 2 、 3 ，则：分别瓜分到： 1/6 、 2/6 、3/6 的空间。
    

flex-shrink

当主轴方向空间不足时，通过flex-shrink 定义了项目的压缩比例，默认为 1 ，即：如果空间不足，该项目将会缩小。

> 注意，如果需要让项目自适应收缩，不能给容器设置 `flex-wrap：wrap`

压缩计算过程：

三个收缩项目，宽度分别为： 200px 、 300px 、 200px ，它们的 flex-shrink 值分别为： 1 、 2 、 3。若想刚好容纳下三个项目，需要总宽度为 700px ，但目前容器只有 400px ，还差 300px，所以每个人都要收缩一下才可以放下，具体收缩的值，这样计算：

1. 计算分母： (200×1) + (300×2) + (200×3) = 1400
    
2. 计算比例：
    
    1. 项目一： (200×1) / 1400 = 比例值1
        
    2. 项目二： (300×2) / 1400 = 比例值2
        
    3. 项目三： (200×3) / 1400 = 比例值3
        
3. 计算最终收缩大小：
    
    1. 项目一需要收缩： 比例值1 × 300
        
    2. 项目二需要收缩： 比例值2 × 300
        
    3. 项目三需要收缩： 比例值3 × 300
        

4. ### 常见案例实现
    

5. 项目在容器中水平垂直居中
    

```CSS
.outer {
    width: 400px;
    height: 400px;
    background-color: #888;
    // 实现水平垂直居中
    display: flex;
    justify-content: center;
    align-items: center;
}
```

5. # 2D、3D、过渡、动画
    

略。