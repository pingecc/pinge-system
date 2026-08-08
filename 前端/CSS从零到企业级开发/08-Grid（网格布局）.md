

> **本章目标**
>
> 学完本章后，你应该能够回答下面几个问题：
>
> -   Flex 和 Grid 到底有什么区别？
> -   什么是二维布局？
> -   Grid Container 和 Grid Item 是什么？
> -   `grid-template-columns` 到底在做什么？
> -   `fr` 单位为什么比百分比更好？
> -   `repeat()`、`minmax()`、`auto-fit`、`auto-fill` 如何使用？
> -   企业开发什么时候应该使用 Grid，而不是 Flex？

------------------------------------------------------------------------

# 为什么已经有了 Flex，还要发明 Grid？

Flex ：解决的是一维布局（One-dimensional Layout），适用于**只有一个排列方向的场景**，**先有元素，再设计元素在一个排列方向上的布局**，例如：
-   顶部导航栏
-   左侧菜单
-   工具栏
-   按钮组
-   表单一行布局
Grid：解决的是二维布局（Two-dimensional Layout），**先设计好网格，再放置元素**。默认情况下元素从左到右依次入座，满了一行换下一行（可通过 `grid-auto-flow: column` 改为从上到下）。

其实可以把它理解成：**Grid 就是浏览器内置的 Excel。** 你不是告诉浏览器：这个 div 在左边，那个 div 在右边。而是告诉浏览器： **这里有一个二维坐标系（网格），元素放到第几行、第几列即可。**

# Grid 的两个角色

开启：

``` css
display: grid;
```

后：设计网格
-   Grid Container（网格容器）
-   Grid Item（网格项目）

只有**直接子元素**才是 Grid Item。

# 网格设计


## 定义列 grid-template-columns

定义三列，每列宽度：100px
```css
.container{
    display:grid;
    grid-template-columns:100px 100px 100px;
}

```

```text
// 假设现在有四个元素A B C D 会依次放入下面的三个格子
// 第四个元素自动进入第二行，浏览器会自动创建新的行
+-----+-----+-----+
|     |     |     |
+-----+-----+-----+
```




## 定义行 grid-template-rows

``` css
grid-template-rows: 100px 300px;
```

表示：
-   第一行 100px
-   第二行 300px

------------------------------------------------------------------------

## 常用属性

| 特性                   | 语法示例                                                           | 作用              | 适用场景/优点                            |
| :------------------- | :------------------------------------------------------------- | :-------------- | :--------------------------------- |
| fr 单位                | `grid-template-columns: 1fr 1fr;`                              | 按比例分配剩余空间       | 不需要手动计算百分比；更适合响应式布局                |
| repeat()             | `grid-template-columns: repeat(3, 1fr);`                       | 减少重复代码，快速构建网格   | 子元素自动从左到右、从上到下依次放入                 |
| minmax()             | `minmax(250px, 1fr)`                                           | 限制网格大小范围（最小/最大） | 商品卡片、Dashboard、响应式布局               |
| auto-fit 与 auto-fill | `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));` | 根据窗口宽度自动调整列数    | 宽屏4列 → 中屏3列 → 小屏2列 → 手机1列；无需手动计算列数 |
| Gap                  | `gap: 20px;`                                                   | 管理元素间距          | 更整洁；不需要处理最后一个元素的间距；Flex 与 Grid 统一  |

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 划分为 3 列 */
  /* 子元素会自动从第一行起，从左到右、从上到下依次放入 */
}

grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```


# 为元素跨行跨列跳跃位置

```css
.item-1 {
  /* 从第 1 条列线到第 3 条列线，相当于独占前两列 */
  grid-column: 1 / 3; 
}

.item-2 {
  /* 直接定死在第 3 列、第 2 行，哪怕前面的位置还空着 */
  grid-column: 3;
  grid-row: 2;
}
```

Grid 记录的是网格线（Grid Lines），而不是单元格。

```text
|  A  |  B  |  C  |
1     2     3     4
```

因此：`grid-column:1 / 3;` 表示 从线1 到 线3

# Grid 与 Flex 配合使用

企业项目中几乎都会混合使用：

整体 Dashboard：

``` css
display:grid;
```

Card 内部：

``` css
display:flex;
```

职责分工：

-   Grid：负责整体网格布局
-   Flex：负责每个卡片内部布局


