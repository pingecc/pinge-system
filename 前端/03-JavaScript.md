

# 最佳实践
    

在现代 JavaScript（尤其是 ES6+）和前端工程化项目中，大量使用 `const` 来定义变量已成为主流实践，背后有明确的技术原因和工程规范。下面我们从多个角度来解释为什么：

---

✅ 一、核心原则：优先使用 `const`，必要时才用 `let`

这是现代 JS 开发的 黄金准则。

> 📜 ESLint / Airbnb 等主流规范明确规定： “Use `const` for all of your variables, unless you plan to reassign them — then use `let`.”


基本语法
1. JavaScript 语句以分号 `;` 结束，虽然可选，建议加上。

2. 注释
    

```JavaScript
// this is a single-line comment

/* This is a block comment
that can span multiple lines */
```

# 数据模型
    

JavaScript 具有原始数据类型

1. `null`
    
2. `undefined`
    
3. `boolean`
    
4. `number`
    
5. `string`
    
6. `symbol` – 来自 ES2015
    
7. `bigint` – 来自 ES2020
    

以及一个复杂数据类型 `object`。

> 和Java一样，JavaScript中，原始数据类型的变量赋值给另外一个变量时，会直接拷贝本身的值，修改不会影响，而对于复杂对象拷贝的是引用。

1. 要确定存储在变量中的值的当前类型，可以使用 `typeof` 运算符
    

```JavaScript
let counter = 120;
console.log(typeof(counter)); // "number"

counter = false; 
console.log(typeof(counter)); // "boolean"

counter = "Hi";
console.log(typeof(counter)); // "string"
```

2. `NaN` 代表 Not a Number（非数字）。它是一个特殊数字值，表示无效的数字。例如，字符串除以数字返回 `NaN`：
    

```JavaScript
console.log('a'/2); // NaN;
```

布尔类型

`boolean 类型有两个文字值：true 和 false（小写）`。要将其他类型的值转换为布尔值，可以使用 `Boolean()` 函数。下表显示了转换规则

  

|   |   |   |
|---|---|---|
|类型|TRUE|FALSE|
|string|非空字符串|空字符串|
|number|非零数字和 Infinity|0, NaN|
|对象|非空对象|null|
|undefined||undefined|

  

number

`JavaScript不区分整数和浮点数，统一用Number表示`

```JavaScript
123; // 整数123
0.456; // 浮点数0.456
1.2345e3; // 科学计数法表示1.2345x1000，等同于1234.5
-99; // 负数
NaN; // NaN表示Not a Number，当无法计算结果时用NaN表示
Infinity; // Infinity表示无限大，当数值超过了JavaScript的Number所能表示的最大值时，就表示为Infinity
```

bigInt

要精确表示比2(53)还大的整数，可以使用内置的BigInt类型，它的表示方法是在整数后加一个`n`。使用BigInt可以正常进行加减乘除等运算，结果仍然是一个BigInt，但不能把一个BigInt和一个Number放在一起运算：

```JavaScript
// 使用BigInt:
var bi1 = 9223372036854775807n;
var bi2 = BigInt(12345);
var bi3 = BigInt("0x7fffffffffffffff");

```

null和undefined

`null`表示一个“空”的值，它和`0`以及空字符串`''`不同，`0`是一个数值，`''`表示长度为0的字符串，而`null`表示“空”。在其他语言中，也有类似JavaScript的`null`的表示，例如Java也用`null`，Swift用`nil`，Python用`None`表示。但是，在JavaScript中，还有一个和`null`类似的`undefined`，它表示“未定义”。JavaScript的设计者希望用`null`表示一个空的值，而`undefined`表示值未定义。事实证明，这并没有什么卵用，区分两者的意义不大。大多数情况下，我们都应该用`null`。`undefined`仅仅在判断函数参数是否传递的情况下有用。

```JavaScript
// JavaScript 定义 null 等于 undefined
console.log(null == undefined); // true
let counter;
console.log(counter == null) // true
```

比较运算符：> >= < <= == ===

要特别注意相等运算符`==`。JavaScript在设计时，有两种比较运算符：第一种是`==`比较，它会自动转换数据类型再比较，很多时候，会得到非常诡异的结果；第二种是`===`比较，它不会自动转换数据类型，如果数据类型不一致，返回`false`，如果一致，再比较。由于JavaScript这个设计缺陷，_不要_使用`==`比较，**始终坚持使用****`===`****比较。**

另一个例外是`NaN`这个特殊的Number与所有其他值都不相等，包括它自己：

```JavaScript
NaN === NaN; // false
// 唯一能判断NaN的方法是通过isNaN()函数：
isNaN(NaN); // true
```

## 变量
    

早期声明变量使用 var ，**从 ES6 开始，建议使用****`let`****关键字声明变量。**

```JavaScript
var message;
let message = "Hello";
message = 'Bye';
```

let声明的变量性质：

- 块级作用域，和Java一样。
    
- 声明时可以不初始化，默认值是_`undefined`_
    

`const` 声明变量（常量）和Java中的final一样

- 声明时必须初始化。
    
- 不可重新赋值。
    

JavaScript 是一种动态类型语言，声明变量时不用指定数据类型，也可以为变量分配不同类型的值。但不建议这样做。

  

## 字符串
    

在 JavaScript 中，字符串是零个或多个字符的序列。**字符串文字以单引号 (') 或双引号 (") 开始和结束**，JavaScript 字符串是不可变的，这意味着它们在创建后修改将返回新的对象。

1. 如果要在文字字符串中使用单引号或双引号，则需要使用反斜杠对其进行转义。例如
    

```JavaScript
let message = 'I\'m also a valid string'; // use \ to escape the single quote (')
```

2. `length` 属性返回字符串的长度
    
3. 基于数组访问字符
    

```JavaScript
let str = "Hello";
console.log(str[0]); // "H"
```

3. 使用+拼接字符串
    

```JavaScript
let name = 'John';
let str = 'Hello ' + name;

console.log(str); // "Hello John"
let className = 'btn';
className += ' btn-primary'
className += ' none';

console.log(className);
```

4. 转换为字符串
    

要将非字符串值转换为字符串，可以使用以下方法之一

- String(n);
    
- ” + n
    
- n.toString()
    

5. 比较字符串，使用`>`、`>=`、`<`、`<=` 和 `==` 运算符。
    

  

[模板字面量](https://tutorial.javascript.ac.cn/es6/javascript-template-literals/) 允许使用反引号 (`) 字符来定义字符串

1. 字符串插值（嵌入变量或表达式）
    

使用 `${表达式}` 在字符串中插入变量、计算结果或函数调用。

```JavaScript
const name = "小明";
const age = 18;

// 传统写法（繁琐）
console.log("我叫" + name + "，今年" + age + "岁。");

// 模板字面量（简洁清晰）
console.log(`我叫${name}，今年${age}岁。`);
// 输出：我叫小明，今年18岁。
```

✅ 支持任意表达式：

```JavaScript
console.log(`1 + 2 = ${1 + 2}`); // 1 + 2 = 3
console.log(`今天是 ${new Date().toLocaleDateString()}`);
console.log(`${name.toUpperCase()} 欢迎你！`); // 小明 欢迎你！
```

2. 多行字符串，模板字面量天然支持换行，无需使用 `\n` 或字符串拼接。
    

```JavaScript
const html = `
  <div>
    <h1>欢迎来到我的网站</h1>
    <p>这里是内容区域。</p>
  </div>
`;

console.log(html);
// 输出保留换行和缩进（实际使用时可通过 trim() 去除首尾空格）
```

## 数组
    

JavaScript的数组可以包括任意数据类型。例如：

```JavaScript
[1, 2, 3.14, 'Hello', null, true];
// 另一种创建数组的方法是通过Array()函数实现：
new Array(1, 2, 3); // 创建了数组[1, 2, 3]
// 数组的元素可以通过索引来访问。索引的起始值为0：
var arr = [1, 2, 3.14, 'Hello', null, true];
arr[0]; // 返回索引为0的元素，即1
arr[5]; // 返回索引为5的元素，即true
arr[6]; // 索引超出了范围，返回undefined
console.log(arr[0], arr[5], arr[6]);

```

1. 要取得`Array`的长度，直接访问`length`属性：
    

```JavaScript
// Array.length:
let arr = [1, 2, 3.14, 'Hello', null, true];
console.log(arr.length); // 6
```

直接给`Array`的`length`赋一个新的值会导致`Array`大小的变化：

```JavaScript
let arr = ['A', 'B', 'C'];
console.log(arr.length); // 3
// 调整数组大小:
arr.length = 6;
console.log(arr); // arr变为['A', 'B', 'C', undefined, undefined, undefined]
// 调整数组大小:
arr.length = 2;
console.log(arr); // arr变为['A', 'B']
```

2. 如果通过索引赋值时，索引超过了范围，同样会引起`Array`大小的变化：
    

```SQL
// 索引超出范围会导致数组大小自动调整:
let arr = ['A', 'B', 'C'];
arr[5] = 'x';
console.log(arr); // arr变为['A', 'B', 'C', undefined, undefined, 'x']
```

## Map和Set
    

JavaScript的默认对象表示方式`{}`可以视为其他语言中的`Map`或`Dictionary`的数据结构，即一组键值对。但是JavaScript的对象有个小问题，就是键必须是字符串。但实际上Number或者其他数据类型作为键也是非常合理的，为了解决这个问题，最新的ES6规范引入了新的数据类型`Map`

Map

1. 创建
    

```JavaScript
let m = new Map();
// 直接传入一个二维数组进行初始化创建Mao
let m = new Map([['Michael', 95], ['Bob', 75], ['Tracy', 85]]);
m.get('Michael'); // 95
```

2. 基本操作 `set` `get` `delete` `has`
    

```JavaScript
let m = new Map(); // 空Map
m.set('Adam', 67); // 添加新的key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined
```

Set

`Set`和`Map`类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在`Set`中，没有重复的key。

1. 创建
    

```JavaScript
let s1 = new Set(); // 空Set
// 传入一个一维数组进行初始化
let s2 = new Set([1, 2, 3]); // 含1, 2, 3
```

2. 基本操作 `add` `has`
    

```JavaScript
let s = new Set([1, 2, 3, 3, '3']);
s.add(4);
s.delete(3);
```

## iterable
    

遍历`Array`可以采用下标循环，遍历`Map`和`Set`就无法使用下标。为了统一集合类型，ES6标准引入了新的`iterable`类型，`Array`、`Map`和`Set`都属于`iterable`类型。具有`iterable`类型的集合可以通过新的`for ... of`循环来遍历。

```JavaScript
let a = ['A', 'B', 'C'];
let s = new Set(['A', 'B', 'C']);
let m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);
for (let x of a) { // 遍历Array
    console.log(x);
}
for (let x of s) { // 遍历Set
    console.log(x);
}
for (let x of m) { // 遍历Map
    console.log(x[0] + '=' + x[1]);
}
```

## 解构赋值
    

JavaScript提供的一种特殊语法，它使我们可以将**数组或对象“拆包”至一系列变量中**。

**数组解构**

```JavaScript
// 我们有一个存放了名字和姓氏的数组
let arr = ["John", "Smith"]

// 解构赋值// 设置 firstName = arr[0]// 以及 surname = arr[1]
let [firstName, surname] = arr;

alert(firstName); // John
alert(surname);  // Smith
```

实际上 等号 右边可以是任何迭代对象

```SQL
let [a, b, c] = "abc"; // ["a", "b", "c"]
let [one, two, three] = new Set([1, 2, 3]);
```

**对象解构**

```JavaScript
let options = {
  title: "Menu",
  width: 100,
  height: 200
};

let {title, width, height} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```

案例：例如在Vue中常常通过解构赋值获取Vue中的某些对象

```JavaScript
  const { createApp } = Vue;
  const { createApp, ref, reactive } = Vue;
```

# 函数
    

JavaScript中的**函数也是对象**，和Python一样。按照惯例，函数名称使用驼峰命名法，并以动词开头，例如 `getData()`、`fetchContents()` 和 `isValid()` 。通过 `return` 来返回值，如果没有指定，则默认返回`undefined` 。

> JavaScript 函数是一等公民。这意味着您可以将函数存储在变量中、将它们作为参数传递给其他函数，以及将它们作为值从其他函数中返回。

```JavaScript
function functionName(parameters) {
    // function body
    // ...
}
```

函数定义与调用：

```JavaScript
function abs(x) {
    if (x >= 0) {
        return x;
    } else {
        return -x;
    }
}
// 上面等效于
let abs = function (x) {
    if (x >= 0) {
        return x;
    } else {
        return -x;
    }
};
// 调用函数
abs(10)
```

## 参数
    

在JavaScript中调用函数参数的传递直接按照顺序传递即可，不像Python那样搞那么多花样。JavaScript和java一样，参数是按照值来传递，对于基本数据类型，就是值本身，对于引用对象，就是对象的引用值。

参数的一些灵活事项

但是JavaScript允许传入任意个参数而不影响调用：

1. 传入的参数比定义的参数多也没有问题，虽然函数内部并不需要这些参数
    

```JavaScript
abs(10, 'blablabla'); // 返回10
abs(-9, 'haha', 'hehe', null); // 返回9
```

2. 传入的参数比定义的少也没有问题：
    

```JavaScript
abs(); // 返回NaN 此时abs(x)函数的参数x将收到undefined，计算结果为NaN
```

默认参数值

```JavaScript
function say(message='Hi') {
    console.log(message);
}

say(); // 'Hi'
say('Hello') // 'Hello'
```

**arguments 参数**

JavaScript还有一个免费赠送的关键字`arguments`，它**只在函数内部起作用**，并且永远指向当前函数的调用者传入的所有参数。`arguments`类似`Array`但它不是一个`Array`：

```JavaScript
function foo(x) {
    console.log('x = ' + x); // 10
    for (let i=0; i<arguments.length; i++) {
        console.log('arg ' + i + ' = ' + arguments[i]); // 10, 20, 30
    }
}
foo(10, 20, 30);
```

**rest参数**

可以在函数定义时使用 `...rest` 参数来接收额外传入的参数，且rest参数只能写在最后

```JavaScript
function foo(a, b, ...rest) {
    console.log('a = ' + a);
    console.log('b = ' + b);
    console.log(rest);
}

foo(1, 2, 3, 4, 5);
// 结果:
// a = 1
// b = 2
// Array [ 3, 4, 5 ]

foo(1);
// 结果:
// a = 1
// b = undefined
// Array []
```

  

## 高阶函数
    

接受一个函数对象作为参数，这样就可以在函数内部去调用这个传进来的函数。

一个最简单的高阶函数：

```JavaScript
function add(x, y, f) {
    return f(x) + f(y);
}

let x = add(-5, 6, Math.abs);
console.log(x); // 11
```

**map( f(x) )**：[f(x1), f(x2), f(x3),...f(xn)] = Array.map(f(x)

```JavaScript
function pow(x) {
    return x * x;
}

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let results = arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
```

**reduce(f(x.y) , initValue)**：f (f(f(x1,f2),f3),x4) = Array.reduce(f(x,y))

```JavaScript
// 对数组求和
let arr = [1, 3, 5, 7, 9];
arr.reduce(function (x, y) {
    return x + y;
}); // 25

// 也可以再传入一个初始值
arr.reduce(function (x, y) {
    return x + y;
}, 10); // 35
```

**filter(f(x)):** 类似map(f(x)，但是根据f(x)是true或者false来决定是否保留该元素

```JavaScript
let arr = [1, 2, 4, 5, 6, 9, 10, 15];
let r = arr.filter(function (x) {
    return x % 2 !== 0;
});// [1, 5, 9, 15]

// filter()接收的回调函数，还可以接收另外两个参数，表示元素的位置和数组本身
let arr = ['A', 'B', 'C'];
let r = arr.filter(function (element, index, self) {
    console.log(element); // 依次打印'A', 'B', 'C'
    console.log(index); // 依次打印0, 1, 2
    console.log(self); // self就是变量arr
    return true;
});
```

**sort(f(x, y))**：对数组的元素进行排序，通过f(x, y) 来判断元素之间的大小比较

```JavaScript
// 给sort()传入的比较函数接受x和y两个参数，如果x<y，应返回负数，如果x>y，应返回正数，如果x=y，应返回0。
let arr = ['Google', 'apple', 'Microsoft'];
arr.sort(function (s1, s2) {
    x1 = s1.toUpperCase();
    x2 = s2.toUpperCase();
    if (x1 < x2) {
        return -1;
    }
    if (x1 > x2) {
        return 1;
    }
    return 0;
}); // ['apple', 'Google', 'Microsoft']
```

## 闭包
    

闭包的构成**：**内部函数 + 内部函数在创建时捕获的变量

当一个内部函数被创建后，只要这个内部函数一直存活，那么它就可以一直访问当初被创建时捕获到所有变量，而内部函数存活的方式有2种：

1. 在**外部函数执行结束后作为返回值返回。**
    
2. **作为属性添加到一个外部对象，**只要外部对象一直存活，这个内部函数就可以一直存活。
    
    1. 外部对象可以是开发者自己创建的对象
        
    2. 或者是系统环境，全局对象，典型案例：
        
        1. **定时器：** `setTimeout(() => { console.log(data); }, 1000);` —— 浏览器定时器模块持有这个箭头函数，即使外层函数跑完了，`data` 依然活着。
            
        2. **事件监听：** `window.addEventListener('click', () => { ... });` —— 只要页面没关，这个点击回调就活着，它捕获的变量也就活着。
            

注意事项：捕获的变量是变量本身，也即引用

```JavaScript
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const myFunc = outer(); // outer 执行完毕，但返回了 inner
myFunc(); // 输出 1
myFunc(); // 输出 2
```

应用场景

1. 数据封装 / 私有变量
    

```JavaScript
function createCounter() {
  let value = 0;
  return {
    increment: () => ++value,
    decrement: () => --value,
    getValue: () => value
  };
}

const counter = createCounter();
console.log(counter.getValue()); // 0
counter.increment();
console.log(counter.getValue()); // 1
// 外部无法直接访问 value，实现了封装
```

2. 回调函数中保持状态
    

```JavaScript
function setupButton(i) {
  document.getElementById('btn' + i).onclick = function() {
    alert('Button ' + i + ' clicked!');
  };
}
// 即使在循环中调用 setupButton，每个回调都“记住”了自己的 i
```

## 箭头函数
    

先来了解下JavaScript中的匿名函数：没有名称的函数：

```JavaScript
let show = function() {
    console.log('Anonymous function');
};

show();
```

而ES6标准新增了一种新的函数：箭头函数（Arrow Function），用于简化匿名函数的编写：

```JavaScript
// 箭头函数
x => x * x
// 上面的箭头函数相当于
function (x) {
    return x * x;
}

// 如果包含多条语句
x => {
    if (x > 0) {
        return x * x;
    }
    else {
        return - x * x;
    }
}
// 如果包含多个参数
// 两个参数:
(x, y) => x * x + y * y

// 无参数:
() => 3.14

// 可变参数:
(x, y, ...rest) => {
    let i, sum = x + y;
    for (i=0; i<rest.length; i++) {
        sum += rest[i];
    }
    return sum;
}

```

# 控制结构
    

## 条件
    

和Java一样，其中`else`语句是可选的。如果语句块只包含一条语句，那么可以省略`{}`：

```JavaScript
let age = 3;
if (age >= 18) {
    console.log('adult');
} else if (age >= 6) {
    console.log('teenager');
} else {
    console.log('kid');
}
```
## 循环
    

```JavaScript
let x = 0;
let i;
for (i=1; i<=10000; i++) {
    x = x + i;
}
// 使用break
let x = 0;
for (;;) { // 将无限循环下去
    if (x > 100) {
        break; // 通过if判断来退出循环
    }
    x ++;
}

```

使用 `for ....in`

```JavaScript
let o = {
    name: 'Jack',
    age: 20,
    city: 'Beijing'
};
for (let key in o) {
    // 要过滤掉对象继承的属性，用hasOwnProperty()来实现：
    if (o.hasOwnProperty(key)) {
        console.log(key); // 'name', 'age', 'city'
    }
}
```

使用 `while`

```JavaScript
let x = 0;
let n = 99;
while (n > 0) {
    x = x + n;
    n = n - 2;
}
x; // 2500

let n = 0;
do {
    n = n + 1;
} while (n < 100);
n; // 100
```

## 异常
    

异常捕获处理

```JavaScript
try {
  // code may cause exceptions
} catch (error) {
  // code to handle exceptions
} finally {
  // code to execute whether exceptions occur or not
}
```

异常抛出 throw

1. 直接破除错误信息
    

```JavaScript
function add(x, y) {
  if (typeof x !== 'number') {
    throw 'The first argument must be a number';
  }
  if (typeof y !== 'number') {
    throw 'The second argument must be a number';
  }

  return x + y;
}

try {
  const result = add('a', 10);
  console.log(result);
} catch (e) {
  console.log(e);
}
```

2. 抛出 Error对象
    

```JavaScript
function add(x, y) {
  if (typeof x !== 'number') {
    throw new Error('The first argument must be a number');
  }
  if (typeof y !== 'number') {
    throw new Error('The second argument must be a number');
  }

  return x + y;
}

try {
  const result = add('a', 10);
  console.log(result);
} catch (e) {
  console.log(e.name, ':', e.message);
}
```

3. 抛出自定义 Error
    

```JavaScript
// 自定义Error
class NumberError extends Error {
  constructor(value) {
    super(`"${value}" is not a valid number`);
    this.name = 'InvalidNumber';
  }
}


function add(x, y) {
  if (typeof x !== 'number') {
    throw new NumberError(x);
  }
  if (typeof y !== 'number') {
    throw new NumberError(y);
  }

  return x + y;
}

try {
  const result = add('a', 10);
  console.log(result);
} catch (e) {
  console.log(e.name, ':', e.message);
}
```

## 模块
    

ES Modules（ESM）。

模块是一个 JavaScript 文件，JavaScript通过 `export` 和 `import` 来完成模块的导入和导出。默认情况下，ES6 模块封装其代码，也即无法从模块外部访问，需要显示使用 `export` 关键字导出值（变量、函数、类等），这样可以在其他模块中 通过 `import` 使用它们。

export

1. 命名导出
    

```JavaScript
// 1. 导出变量
let count = 1;
export { count };
// 或者
export let count = 1;

// 2.导出函数
function increase() {
  // ..
}
export { increase };
// 或者
export function increase() {
  // ...
}
// 3.导出类
class Counter {
}
export { Counter };
// 或者
export class Counter {
}
```

2. 默认导出：一个模块可以有**一个默认导出**。要使用默认导出导出值，请使用 `default export` 关键字。例如：
    

```JavaScript
let message = 'Hi';
export { default as message };
// 等效于 export default let message = 'Hi';

export default function increase() {
   // ..
}

export default class Counter {
   // ...
}
```

对于默认导出的名字，**导入时可以不用放在花括号里 {}** ，而对于命名导出，导入时名字必须放在花括号里。

```JavaScript
import message from 'module.js';
```

3. 重命名导出
    

```JavaScript
class Counter {
  // ..
}

export { Counter as MyCounter };
```

import

1. 静态导入，在文件的顶层声明
    

命名导出允许你只导入需要的部分，而不是整个模块。花括号语法清晰地表达了“我只取其中几个变量”：

> 另外 {} 看起来像对象解构，但ESM 的导入语法并不是解构。不过这种相似性有助于开发者理解“从模块中取出特定名字”的语义。

```JavaScript
// 1. 对于命名导出的名字，导入时需放在花括号里
import { namedExport1, namedExport2} from 'module.js';

// 2. 对于默认导出的名字，导入时可以不用写在花括号里
import displayGreeting from './greeting.js';

// 3. 导入时也可以重命名
import { name as name1 } from "module1.js";
```

2. 动态导入，在运行时按需加载模块的方式 `import('模块路径')` ，它返回一个 Promise，解析后得到模块的命名空间对象。
    

```JavaScript
// 1. 使用 .then()
import('./math.js')
  .then(module => {
    console.log(module.add(2, 3));
  })
  .catch(err => {
    console.error('模块加载失败:', err);
  }); 
  
  
 // 2. 使用await
 async function loadMath() {
  try {
    const math = await import('./math.js');
    console.log(math.add(2, 3));
  } catch (err) {
    console.error('加载失败:', err);
  }
}
```

# 对象
    

在JavaScript中，除了原始类型，其它一些皆是对象，对象本质是 **属性****的集合**，对应的键是字符串类型，而值可以是任意数据类型，创建一个对象常用的是对象字面量。

```JavaScript
// 创建了一个对象并绑定到person上
let person = {
    firstName: 'John',
    lastName: 'Doe'
};

let empty = {};
```

函数既然也是对象，自然也可以自由添加属性，如下，直接给函数添加属性

```JavaScript
function test() {
    console.log("test")
}

test.name =  "hello";
test.hello = function () {
    console.log("hello world")
}

test()
console.log(test.name)
test.hello()。
```

> JavaScript比Python太灵活了。

## 属性
    

操作对象就是操作对象的属性，关于对象属性的操作包括以下：

1. 访问对象的属性获取值，使用 `obj.属性名` 或者 `obj['属性名']` 访问呢不存在的属性，则返回_`undefined`_
    
2. 修改属性的值 `obj.属性名 = new_value` 当属性名不存在时，会直接添加
    
3. 删除属性 delete obj.属性名
    
4. 检查属性是否存在 `属性名 in obj`
    

**方法：给对象的属性绑定函数**

既然函数是对象，可以赋值给一个变量，自然可以赋值给对象里的某个属性，当对象的某个属性值是函数时，这个属性我们称为方法。在方法里，可以使用`this` 关键字来获取当前调用的对象，从而访问对象的其它属性。当通过对象调用该方法时，这个this指向当前调用对象。如果直接全局调用，则该函数的`this`指向全局对象，也就是`window`

```JavaScript
let xiaoming = {
    name: '小明',
    birth: 1990,
    // 在对象里直接声明并绑定
    age: function () {
        let y = new Date().getFullYear();
        return y - this.birth;
    }
};

xiaoming.age(); // 今年调用是25,明年调用就变成26了
// 等同于
function getAge() {
    let y = new Date().getFullYear();
    return y - this.birth;
}

let xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25, 正常结果
getAge(); // NaN 此时this指向Windows


// ES6 为您提供了 简洁的方法语法，允许您为对象定义方法
let person = {
    firstName: 'John',
    lastName: 'Doe',
    greet() {
        console.log('Hello, World!');
    }
};

person.greet();
```

通过调用函数的`apply()` 或者 `call()` 来控制函数内部的this指向谁

```JavaScript
function getAge() {
    let y = new Date().getFullYear();
    return y - this.birth;
}

let xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25
getAge.apply(xiaoming, []); // 25, this指向xiaoming, 参数为空

Math.max.apply(null, [3, 5, 4]); // 5
Math.max.call(null, 3, 5, 4); // 5

```

## 对象属性配置
    

我们知道，对象可以存储属性。

到目前为止，属性对我们来说只是一个简单的“键值”对。但对象属性实际上是更灵活且更强大的东西。

在本章中，我们将学习其他配置选项

为了修改标志，我们可以使用 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。

语法是：

```JavaScript
Object.defineProperty(obj, propertyName, descriptor)
```

## 构造函数
    

如何快速创建结构相同的对象呢？例如，以下代码创建了一个 `person` 对象，它包含两个属性 `firstName` 和 `lastName`，如果在程序中需要创建许多结构类似Person的对象，该如何做？

```JavaScript
let person = {
    firstName: 'John',
    lastName: 'Doe'
};
```

为此，可以使用构造函数来定义自定义类型，并使用 `new` 运算符从该类型创建多个对象，从技术上讲，构造函数本身也是一个函数，只是当通过new 关键字进行调用时表示创建一个对象。构造函数的声明遵循以下约定

- 构造函数的名称以大写字母开头，例如 `Person`、`Document` 等。
    
- 构造函数只能使用 `new` 运算符调用。
    

```JavaScript
// 声明一个构造函数
function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;

    this.getFullName = function () {
        return this.firstName + " " + this.lastName;
    };
}
// 使用new关键字创建一个Person对象
let person = new Person('John','Doe');
```

`new` 运算符执行以下操作

- **创建一个新的空对象，并将其分配给** **`this`** **变量。**
    
- 将参数 `'John'` 和 `'Doe'` 分别分配给对象的 `firstName` 和 `lastName` 属性。
    
- 返回 `this` 值
    

> 通过构造函数去创建对象，每使用new关键字创建一个对象，该对象的所有属性都会重复创建一份，包括方法，所以内存使用效率并不高。

## 原型
    

每个 JavaScript 对象都默认有一个与之关联的原型对象，通过原型对象，可以实现属性的共享，从而减少内存占用。

1. 所有对象默认包含一个`[__proto__ ]`属性，这个[__proto__ ]属性指向创建该对象的构造函数的[`prototype`]属性对象，比如对于person对象，`person.` **`proto`** `=== Person.prototype`，而`Person.__proto__ === Function.prototype`
    
2. 对于构造函数，还额外包含一个[prototype]属性对象，这个[prototype]属性对象默认包含一个[constructor]属性，指向函数本身，既然是对象，自然也有一个个[__proto__ ]属性，它指向祖先构造函数Object的[prototype]属性对象，而Object.prototype的__proto__属性为nul
    

```JavaScript
// 实例
person
  └─ __proto__ → Person.prototype
                   ├─ constructor: Person
                   └─ __proto__ → Object.prototype
                                    ├─ toString, hasOwnProperty, ...
                                    └─ __proto__ → null

// 构造函数本身（也是对象）
Person
  └─ __proto__ → Function.prototype
                   ├─ call, apply, bind, ...
                   └─ __proto__ → Object.prototype → null
```

前面通过构造函数去创建对象时，发现个问题，即使是方法，每次使用new创建对象也会在每个实例对象中ch创该方法，有点浪费内存。当我们**希望某些属性是所有实例对象共享**，不需要每次new都重复创建，**可以把这些属性放到该构造函数的原型对象****`prototype`****上去**，由于实例对象的`__proto__` 指向构造函数的`prototype`这样实例对象去访问这些属性时，如果在自身的属性里没找到，则会去原型里去找。

```JavaScript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sex = "man";
Person.prototype.getAge = function () {
    console.log("getAge() 执行")
    return this.age;
}


person1 = new Person("jack", 18);
person2 = new Person("fuck", 28);
// man man true true
console.log(person1.sex, person2.sex, person1.sex === person2.sex, person2.getAge === person1.getAge)
// 18
console.log(person1.getAge())
```

构造函数/原型模式

构造函数/原型模式：通过构造函数定义对象的普通属性，然后通过原型绑定方法。而在ES6中，提供了class语法糖可以快速的使用这种模式：

```JavaScript
class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    getFullName() {
        return this.firstName + " " + this.lastName;
    }
}

let p1 = new Person('John', 'Doe');
let p2 = new Person('Jane', 'Doe');

console.log(p1.getFullName(), p2.getFullName());
console.log(p2.getFullName === p2.getFullName);
```

## Promise
    

Promise 是一个**对象**，它封装了**异步操作**的结果。

1. 通过`Promise()` 构造函数创建Promise对象，该对象接收一个执行器函数，在该执行器函数里执行异步操作。由JavaScript对象去调用这个执行器函数来执行我们的异步操作。
    
2. 该执行器接受两个回调函数，分别名为 `resolve` 和 `reject`。
    
    1. 如果异步操作成功完成，执行器将调用 `resolve()` 函数，将 Promise 的状态从等待中更改为已完成，并带有值。
        
    2. 如果发生错误，执行器将调用 `reject()` 函数，将 Promise 的状态从等待中更改为拒绝，并带有错误原因。
        

```JavaScript
const promise = new Promise((resolve, reject) => {
  // contain an operation
  // ...
   let success = true;
  // 如果成功 则把数据交给resolve()
  if (success) {
    resolve(value);
  } else {
   // 如果失败，把失败信息交给reject()
    reject(error);
  }
});
```

示例：`promise--->then()`

- 成功时调用 `then()`
    
- 失败时调用 `catch()`
    
- 无论成功还是失败都执行 `finally()`
    

```JavaScript
let success = true;

function getUsers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve([
          { username: 'john', email: '[email protected]' },
          { username: 'jane', email: '[email protected]' },
        ]);
      } else {
        reject('Failed to the user list');
      }
    }, 1000);
  });
}

function onFulfilled(users) {
  console.log(users);
}
function onRejected(error) {
  console.log(error);
}

const promise = getUsers();
// 成功时调用onFulfilled，失败时调用onRejected
promise.then(onFulfilled, onRejected);
// 或者
promise.then(onFulfilled)
    .catch(onRejected)
    .finally(()=>{
        console.log('111');
    })
```