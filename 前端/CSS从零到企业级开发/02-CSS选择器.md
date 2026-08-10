
浏览器处理 CSS 的第一步不是修改颜色，而是**找到符合选择器条件的 DOM 元素**。

流程如下：

```text
CSS Rule  
    ↓  
找到符合条件的 DOM 节点  
    ↓  
应用样式  
    ↓  
进入 Render Tree
```

**CSS 的核心其实不是属性，而是"匹配（Matching）"。**


# 一条 CSS 规则的组成

```css

h1 {  
    color: blue;  
    font-size: 32px;  
}
```

组成如下：

- **Selector（选择器）**：`h1`
- **Declaration（声明）**
- **Property（属性）**：`color`
- **Value（值）**：`blue`


CSS 文件本质上就是一系列 Rule（规则）的集合。





# 基本选择器

| 基本选择器    | 特点                                                      | 用法                    |
| -------- | ------------------------------------------------------- | --------------------- |
| **类选择器** | 选中所有特定类名（ class 值）的元素 —— 使用频率很高。                        | `.say {color:red}`    |
| 元素选择器    | 选中所有同种标签，但是不能差异化选择。                                     | `h1 {color:red}`      |
| ID 选择器   | 选中特定 id 值的那个元素（唯一的）。一般仅用于 JavaScript 获取元素，而不是作为主要样式选择器。 | `#earthy {color:red}` |
| 通配选择器    | 选中所有标签，一般用于清除样式。                                        | `*{color:red}`        |

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

# 复合选择器

1. 复合选择器建立在基本选择器之上，由多个基础选择器，通过不同的方式组合而成。
2. 复合选择器用于在复杂结构中，快速而准确的选中元素。
3. 常用的复合选择器包括：后代选择器、子选择器、并集选择器、伪类选择器等等


## 后代选择器

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




## 子选择器


选中指定元素中，所有符合要求的**直接子元素**

```css
元素1>元素2>元素3>...元素n{样式声明}
```
- 中间用`>`隔开
- 后面的元素是前面元素的后代里第一个符合条件的子级，不包过嵌套更深的子级，也即直接自己子元素。[[后代选择器与子选择器的区别]]

## 并集选择器

同时选择多个符合条件的选择器，为它们定义相同的样式。

```css
元素1,元素2...,元素n{样式声明}
```
- 中间通过 `,`隔开

```css
ul,div{样式声明}
```

## 伪类选择器

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

