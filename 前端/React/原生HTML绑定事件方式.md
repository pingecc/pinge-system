
原生 HTML 本身不能真正处理复杂逻辑，绑定事件需要 JavaScript。常见有 3 种方式，推荐用 `addEventListener`。

## ⁠1 ⁠HTML 内联属性（简单但不推荐）
```html
<button onclick="alert('点击了')">点我</button>
```

也可以调用函数：
```html
<button onclick="handleClick()">点我</button>

<script>
  function handleClick() {
    console.log('点击了');
  }
</script>
```

缺点：HTML 和 JS 混在一起，不好维护，同一事件只能绑定一个处理函数。

## ⁠2 ⁠DOM 属性绑定（DOM0 级）
```html
<button id="btn">点我</button>

<script>
  const btn = document.getElementById('btn');

  btn.onclick = function (event) {
    console.log('点击了', event.target);
  };
</script>
```

缺点：同一个事件只能绑定一个函数，后面会覆盖前面：
```js
btn.onclick = fn1;
btn.onclick = fn2; // fn1 被覆盖
```

## ⁠3 ⁠addEventListener（推荐）
```html
<button id="btn">点我</button>

<script>
  const btn = document.getElementById('btn');

  function handleClick(event) {
    console.log('按钮被点击了', event.target);
  }

  btn.addEventListener('click', handleClick);

  // 需要时移除
  // btn.removeEventListener('click', handleClick);
</script>
```

优点：
- 同一事件可以绑定多个函数
- 可以控制捕获/冒泡
- 可以移除
- 支持 `once`、`passive` 等选项

```js
btn.addEventListener('click', fn1);
btn.addEventListener('click', fn2); // 两个都会执行
```

## ⁠4 ⁠事件委托
如果元素是动态生成的，推荐把事件绑定到父元素上：

```html
<ul id="list">
  <li>项目 1</li>
  <li>项目 2</li>
</ul>

<script>
  const list = document.getElementById('list');

  list.addEventListener('click', function (event) {
    const li = event.target.closest('li');
    if (li) {
      console.log('点击了：', li.textContent);
    }
  });
</script>
```

## ⁠5 ⁠注意
脚本要放在元素后面，或者等 DOM 加载完成：

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btn');
    btn.addEventListener('click', function () {
      console.log('点击了');
    });
  });
</script>
```

## ⁠6 ⁠总结
最推荐写法：

```js
const el = document.querySelector('#btn');

el.addEventListener('click', function (e) {
  console.log('点击了', e);
});
```

常见事件名：`click`、`input`、`change`、`submit`、`keydown`、`mouseover` 等。