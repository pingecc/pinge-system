# CSS Flexbox: flex-grow 与 flex-shrink 详解

> 整理时间：2026-07-21
> 适用场景：可直接复制粘贴到 Obsidian 中使用

---

## 一、flex-grow 详解

### 1.1 基本定义

`flex-grow` 定义了 flex 项目在**主轴方向**上，当容器有**剩余空间**时，该项目可以**放大**的比例。

```css
.item {
  flex-grow: <number>;  /* 默认值：0（不放大） */
}
```

- **取值**：非负数（整数或小数）
- **默认值**：`0` — 即使有剩余空间，项目也不会放大
- **适用范围**：flex 项目（flex item）

### 1.2 核心工作原理

#### 什么是"剩余空间"？

```
剩余空间 = 容器宽度 - Σ(各项目的基础尺寸)
```

> 基础尺寸即 `flex-basis`，未设置时取 `width` 或内容宽度。

#### 分配公式

当 `flex-grow` 总和 > 0 时：

```
某项目获得的额外空间 = (该项目的 flex-grow / 所有项目的 flex-grow 总和) × 剩余空间
项目最终尺寸 = 基础尺寸 + 获得的额外空间
```

### 1.3 关键示例

#### 示例 1：等分剩余空间

```html
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
</div>
```

```css
.container {
  display: flex;
  width: 600px;
}

.item {
  flex-grow: 1;  /* 三个项目都设置 */
}
```

**结果**：假设每个项目基础宽度为 0，剩余空间 600px 被三等分，每个项目最终宽度 ≈ 200px。

#### 示例 2：按比例分配

```css
.item:nth-child(1) { flex-grow: 1; }  /* 占比 1/6 */
.item:nth-child(2) { flex-grow: 2; }  /* 占比 2/6 */
.item:nth-child(3) { flex-grow: 3; }  /* 占比 3/6 */
```

**分配比例**：`1 : 2 : 3`

如果剩余空间是 600px：
- 项目1 获得：1/6 × 600 = **100px**
- 项目2 获得：2/6 × 600 = **200px**
- 项目3 获得：3/6 × 600 = **300px**

### 1.4 常见误区

| 误区 | 说明 |
|------|------|
| `flex-grow: 0` | 项目保持自身基础尺寸，**不参与剩余空间分配** |
| 与 `width` 的关系 | `width` 相当于基础尺寸，剩余空间分配是在基础尺寸之上**额外增加**的 |
| 总和为 0 | 如果所有项目的 `flex-grow` 都是 0，剩余空间不会被分配 |

### 1.5 实际应用场景

#### 场景 1：自适应布局（左侧固定，右侧自适应）

```css
.container { display: flex; }

.sidebar {
  width: 200px;
  flex-grow: 0;  /* 固定宽度，不放大 */
}

.main {
  flex-grow: 1;  /* 占据所有剩余空间 */
}
```

#### 场景 2：导航栏等分

```css
.nav { display: flex; }
.nav-item {
  flex-grow: 1;  /* 所有导航项等宽 */
  text-align: center;
}
```

#### 场景 3：优先级布局

```css
.important {
  flex-grow: 3;  /* 重要内容占更多空间 */
}

.secondary {
  flex-grow: 1;  /* 次要内容占较少空间 */
}
```

---

## 二、flex-shrink 详解

### 2.1 基本定义

`flex-shrink` 控制当**容器空间不足**时，项目如何**缩小**。

```css
.item {
  flex-shrink: <number>;  /* 默认值：1（允许缩小） */
}
```

- **取值**：非负数（整数或小数）
- **默认值**：`1` — 当空间不足时，项目会按比例缩小
- **适用范围**：flex 项目

### 2.2 与 flex-grow 的关键区别

| | `flex-grow` | `flex-shrink` |
|---|---|---|
| **触发条件** | 容器有**剩余空间** | 容器空间**不足** |
| **默认值** | `0`（不放大） | `1`（允许缩小） |
| **作用** | 分配**多余**空间 | 压缩**溢出**空间 |
| **计算复杂度** | 简单按比例 | 需考虑**基础宽度权重** |

### 2.3 计算原理（重点）

`flex-shrink` 的计算比 `flex-grow` 复杂，采用**加权比例**：

```
溢出空间 = Σ(项目基础宽度) - 容器宽度

每个项目的缩小量 = (项目基础宽度 × flex-shrink) / Σ(所有项目基础宽度 × flex-shrink) × 溢出空间

项目最终宽度 = 基础宽度 - 缩小量
```

> **为什么需要加权？** 因为基础宽度大的项目应该承担更多缩小责任。如果等比例缩小，小项目可能缩没了，大项目还绰绰有余。

### 2.4 关键示例

#### 示例 1：默认行为（flex-shrink: 1）

```html
<div class="container" style="display: flex; width: 300px;">
  <div class="item" style="width: 200px;">A</div>
  <div class="item" style="width: 200px;">B</div>
</div>
```

**分析**：
- 容器宽度：300px
- 项目总宽度：200 + 200 = 400px
- 溢出空间：400 - 300 = **100px**
- 两个项目 `flex-shrink` 都是 1（默认值）

**加权计算**：
```
A 的权重 = 200 × 1 = 200
B 的权重 = 200 × 1 = 200
总权重 = 400

A 缩小量 = (200/400) × 100 = 50px → 最终 150px
B 缩小量 = (200/400) × 100 = 50px → 最终 150px
```

**结果**：两个项目都变成 150px，刚好填满 300px 容器。

#### 示例 2：禁止缩小（flex-shrink: 0）

```css
.item-a { width: 200px; flex-shrink: 0; }  /* 不缩小 */
.item-b { width: 200px; flex-shrink: 1; }  /* 允许缩小 */
```

**加权计算**：
```
A 的权重 = 200 × 0 = 0（不参与缩小）
B 的权重 = 200 × 1 = 200

B 缩小量 = (200/200) × 100 = 100px → 最终 100px
A 保持 200px
```

**结果**：A 保持 200px，B 被压缩到 100px。

> ⚠️ 如果 A 的 `flex-shrink: 0` 且 A 本身就超过容器宽度，内容会**溢出容器**！

#### 示例 3：不同 shrink 值

```css
.item-a { width: 200px; flex-shrink: 1; }
.item-b { width: 200px; flex-shrink: 3; }
```

**加权计算**：
```
A 权重 = 200 × 1 = 200
B 权重 = 200 × 3 = 600
总权重 = 800

A 缩小量 = (200/800) × 100 = 25px → 最终 175px
B 缩小量 = (600/800) × 100 = 75px → 最终 125px
```

**结果**：B 缩小得更多（3倍权重），从 200px → 125px，A 从 200px → 175px。

### 2.5 常见应用场景

#### 场景 1：固定按钮 + 自适应输入框

```css
.container { display: flex; width: 100%; }

.input {
  flex-shrink: 1;     /* 输入框可以缩小 */
  min-width: 100px;  /* 但最小保留 100px */
}

.button {
  flex-shrink: 0;     /* 按钮固定宽度，绝不缩小 */
  width: 80px;
}
```

#### 场景 2：侧边栏固定 + 主内容自适应

```css
.sidebar {
  width: 240px;
  flex-shrink: 0;  /* 侧边栏固定 */
}

.main {
  flex-shrink: 1;  /* 主内容承担所有缩小 */
}
```

### 2.6 关键注意事项

1. **`flex-shrink: 0` 可能导致溢出**：如果项目总宽度超过容器且都不允许缩小，内容会溢出容器边界
2. **`min-width` 会限制缩小**：即使 `flex-shrink: 1`，项目也不会缩到 `min-width` 以下
3. **`flex-shrink` 只在主轴生效**：如果 `flex-direction: column`，则控制高度方向的缩小
4. **权重计算包含基础宽度**：两个项目 `flex-shrink` 相同，但基础宽度不同，缩小量也不同

---

## 三、flex-grow vs flex-shrink 对比总结

| 特性 | flex-grow | flex-shrink |
|------|-----------|-------------|
| **默认值** | 0 | 1 |
| **默认行为** | 不放大 | 允许缩小 |
| **触发条件** | 有剩余空间 | 空间不足 |
| **计算方式** | 简单比例 | 加权比例（基础宽度 × shrink） |
| **空间方向** | 分配多余空间 | 消化溢出空间 |
| **常见设置** | 设为 1 实现自适应 | 设为 0 防止被压缩 |
| **配合属性** | `flex-basis` 或 `width` | `min-width` 防止过度缩小 |

---

## 四、简写属性 flex

`flex-grow` 和 `flex-shrink` 通常与 `flex-basis` 一起使用简写：

```css
/* 完整写法 */
flex: <flex-grow> <flex-shrink> <flex-basis>;

/* 常用简写 */
flex: 1;           /* 等价于 flex: 1 1 0% */
flex: auto;        /* 等价于 flex: 1 1 auto */
flex: none;        /* 等价于 flex: 0 0 auto */
flex: 0 1 200px;   /* 不放大，可缩小，基础 200px */
```

**默认值**：`flex: 0 1 auto` 等价于：
- `flex-grow: 0`
- `flex-shrink: 1`
- `flex-basis: auto`

---

## 五、一句话总结

> **`flex-grow` 解决"有多余空间怎么办"，`flex-shrink` 解决"空间不够怎么办"。**

- 想让项目**自适应填充** → `flex-grow: 1`
- 想让项目**固定不被压缩** → `flex-shrink: 0`
- 想让项目**按权重承担压缩** → `flex-shrink: <number>`
