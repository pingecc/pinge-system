`position` 是 CSS 中最核心的布局属性之一，它决定了元素在页面中的**定位方式**以及**参考系**。下面结合上面的交互演示，为你系统拆解。

---

## 一、核心概念：定位上下文与偏移

在讲具体值之前，先理解两个关键概念：

| 概念 | 含义 |
|------|------|
| **文档流** | 元素默认按 HTML 书写顺序从上到下、从左到右排列的空间 |
| **定位上下文（Containing Block）** | 元素偏移时所"相对"的那个盒子。不同 `position` 值，参考对象完全不同 |
| **偏移属性** | `top` / `right` / `bottom` / `left` —— 只有在 `position` 不是 `static` 时才生效 |

---

## 二、五个取值详解

### 1. `static` — 默认值（正常文档流）

![[Pasted image 20260825205359.png]]


```css
.box-b { position: static; }
```

- **行为**：元素完全按照正常文档流排列，就像你从没写过 `position` 一样。
- **偏移无效**：`top` / `left` / `z-index` 等属性**完全不起作用**。
- **使用场景**：几乎不需要显式写，只是重置其他定位时用到。

---

### 2. `relative` — 相对定位

![[Pasted image 20260825205610.png]]

 📍 relative — 相对定位
元素**保留原来的文档流位置**（占位不消失），然后基于自身原位置进行偏移。常用于作为 absolute 子元素的定位参考，或做微调位移。

```css
.box-b {  
position: relative;  
top: 20px; /* 向下移 20px */  
left: 30px; /* 向右移 30px */  
}
```

- **是否脱离文档流**：**否**。元素原来的位置**仍然被保留**（占位不消失），视觉上偏移了，但其他元素仍当它还在原地。
- **参考系**：**自身原来的位置**。
- **常见用途**：
  1. **微调位置**：对某个元素做像素级偏移，同时不影响周围布局。
  2. **创建定位上下文**：给父元素加 `position: relative`，让内部的 `absolute` 子元素以它为参考。

> ⚠️ 注意：如果同时写 `top: 20px` 和 `bottom: 20px`，结果取决于书写模式和元素高度，通常只有一个生效。

---

### 3. `absolute` — 绝对定位

![[Pasted image 20260825205712.png]]
 📍 absolute — 绝对定位

元素**脱离文档流**（不再占位），相对于最近的 **已定位祖先元素**（position ≠ static）定位。如果没有已定位祖先，则相对于初始包含块（通常是视口或 html）。

```css
.parent { position: relative; }  
.box-b {  
position: absolute;  
top: 10px;  
right: 10px;  
}
```

- **是否脱离文档流**：**是**。元素不再占位，仿佛从文档流中"抽离"出来，后面的元素会补位。
- **参考系**：**最近的已定位祖先元素**（即 `position` 值为 `relative` / `absolute` / `fixed` / `sticky` 的祖先）。如果没有这样的祖先，则一路追溯到 `<html>` 根元素（在浏览器中实际表现为初始包含块）。
- **尺寸表现**：如果不设置 `width`/`height`，元素的尺寸会收缩到内容大小（shrink-to-fit）。
- **常见用途**：
  - 下拉菜单、弹窗、Tooltip、徽章（Badge）、轮播图控制按钮等**叠加层**。

> 💡 **最佳实践**：给 `absolute` 子元素的父级加 `position: relative`，形成稳定的局部定位系统，避免元素"乱跑"到页面其他位置。

---

### 4. `fixed` — 固定定位

![[Pasted image 20260825205909.png]]



 📍 fixed — 固定定位

元素**脱离文档流**，相对于**视口（viewport）**固定位置，滚动页面时位置不变。常用于固定导航栏、回到顶部按钮等。

```css
.box-b {  
position: fixed;  
top: 120px;  
right: 40px;  
}
```

- **是否脱离文档流**：**是**。
- **参考系**：**视口（Viewport）**，即浏览器可见区域。无论页面怎么滚动，它都钉死在屏幕的某个位置。
- **常见用途**：
  - 固定顶部导航栏
  - 右下角"回到顶部"按钮
  - 悬浮客服窗口

> ⚠️ **陷阱**：`fixed` 元素如果祖先有 `transform` / `perspective` / `filter` 等属性，在某些浏览器中参考系会变成该祖先而非视口，导致"固定失效"。

---

### 5. `sticky` — 粘性定位

![[Pasted image 20260825210010.png]]

📍 sticky — 粘性定位

元素在**阈值前表现为 relative**（正常跟随滚动），当滚动到阈值（如 top: 10px）时**变为 fixed** 粘住。是 relative 和 fixed 的混合体，常用于表头吸顶、目录跟随。

```css
.box-b {  
position: sticky;  
top: 10px; /* 滚动到距顶部 10px 时粘住 */  
}
```

- **混合行为**：在**阈值未触及前**表现为 `relative`（正常跟随滚动）；当滚动到阈值位置时，**变为 `fixed`** 粘住不动。
- **参考系**：最近的**滚动祖先**（overflow 不为 visible 的祖先或视口）。
- **必须配合偏移值**：至少要写 `top` / `left` / `right` / `bottom` 中的一个，否则等同于 `relative`。
- **常见用途**：
  - 表格表头吸顶
  - 长页面侧边目录跟随
  - 聊天窗口日期分隔线

> ⚠️ **陷阱**：如果 `sticky` 元素的父容器高度和元素自身一样高（没有滚动空间），或者父容器没有设置 `overflow: visible` 以外的值但存在嵌套滚动上下文，可能导致粘不住。

---

## 三、z-index — 层叠顺序

当多个定位元素（`position` ≠ `static`）发生重叠时，用 `z-index` 控制谁在上、谁在下。

```css
.modal {
  position: fixed;
  z-index: 1000;
}
.overlay {
  position: fixed;
  z-index: 999;
}
```

- **只对定位元素有效**：`static` 元素设置 `z-index` 无效。
- **比较规则**：`z-index` 值大的在上。值相同时，后写的 HTML 元素覆盖先写的。
- **层叠上下文（Stacking Context）**：`z-index` 不是在全局比较，而是在各自的"层叠上下文"中比较。能创建新层叠上下文的情况包括：`position` 不为 `static` 且 `z-index` 不为 `auto`、`opacity` < 1、`transform`、`filter`、`isolation: isolate` 等。

> 💡 实际开发中，建议按模块规划 `z-index` 值（如：普通内容 1-10，弹窗 100-200，全局提示 1000+），而不是随意写 99999。

---

## 四、快速对比表

| 属性值 | 脱离文档流 | 参考对象 | 占位保留 | 滚动行为 |
|--------|-----------|---------|---------|---------|
| `static` | 否 | 无 | 是 | 正常滚动 |
| `relative` | 否 | 自身原位置 | 是 | 正常滚动 |
| `absolute` | **是** | 最近已定位祖先 | **否** | 随祖先滚动 |
| `fixed` | **是** | 视口 | **否** | **不随滚动** |
| `sticky` | 否（粘性前） | 滚动祖先 | 是 | 到达阈值后固定 |

---

## 五、实战组合模式

### 模式 1：局部绝对定位（最常用）
```css
.card { position: relative; }
.card .badge {
  position: absolute;
  top: -8px;
  right: -8px;
}
```
父级 `relative` 不偏移，只为子级 `absolute` 提供定位锚点。

### 模式 2：全屏遮罩 + 居中弹窗
```css
.overlay {
  position: fixed;
  inset: 0;           /* 等同于 top:0; right:0; bottom:0; left:0 */
  background: rgba(0,0,0,0.5);
}
.modal {
  position: absolute; /* 相对于 overlay */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 模式 3：Sticky 表头
```css
table thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
```

---

## 六、常见踩坑

1. **`absolute` 元素跑飞了** → 检查父级有没有 `position: relative/absolute/fixed/sticky`。
2. **`fixed` 不固定** → 检查祖先是否有 `transform`、`perspective`、`filter` 属性。
3. **`sticky` 粘不住** → 检查父容器高度是否足够、是否有嵌套滚动容器、是否写了偏移值。
4. **`z-index` 设了没效果** → 检查元素是否是 `static`，或是否被更高层级的层叠上下文"罩住"。

你可以在上面的交互演示中切换不同模式，直观感受 **B 盒子** 在各定位值下的行为差异，尤其是滚动页面时 `fixed` 和 `sticky` 的区别。