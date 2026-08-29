IIFE（立即执行函数表达式），在一些老的纯前端项目中会见到，在当时还不支持js的ES模块化时常使用这种写法。



```js
'use strict';

const Auth = (() => {
  // localStorage 键名
  const USER_KEY = 'vanilla-admin:user';
  const REMEMBER_KEY = 'vanilla-admin:remember';

  // 演示账号（硬编码仅用于学习，真实项目应存后端数据库）
  const DEMO_USERNAME = 'admin';
  const DEMO_PASSWORD = '123456';

  /** 读取当前登录用户，未登录返回 null */
  function getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('读取登录态失败：', err);
      return null;
    }
  }

  /** 是否已登录 */
  function isLoggedIn() {
    return getUser() !== null;
  }

  /** 校验账号密码；成功则写入登录态并返回 true */
  function login(username, password) {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      const user = {
        username: username,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  /** 退出登录：清除登录态 */
  function logout() {
    localStorage.removeItem(USER_KEY);
  }

  /** 页面鉴权：未登录直接跳转到登录页 */
  function requireLogin() {
    if (!isLoggedIn()) {
      location.href = 'login.html';
    }
  }

  /** 读取「记住账号」的用户名 */
  function getRememberedUsername() {
    return localStorage.getItem(REMEMBER_KEY) || '';
  }

  /** 保存 / 清除「记住账号」 */
  function rememberUsername(username) {
    if (username) {
      localStorage.setItem(REMEMBER_KEY, username);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  return {
    USER_KEY,
    REMEMBER_KEY,
    getUser,
    isLoggedIn,
    login,
    logout,
    requireLogin,
    getRememberedUsername,
    rememberUsername
  };
})();
```




这是一个**IIFE（立即执行函数表达式）**，用箭头函数写的版本。

### 关键代码

```js
const Auth = (() => {
  // 内部私有变量和函数
  // ...
  return {
    // 暴露出去的公共 API
  };
})();
```

### 为什么必须用括号包起来？

箭头函数本身是一个**表达式**，但当你想**马上执行**它时，必须先让整个箭头函数变成一个可以被调用的“完整表达式”。

#### 1. 没有外层括号会怎样？

如果写成：

```js
const Auth = () => {
  // ...
}();   // ❌ 语法错误
```

JavaScript 解析器会把它理解成：

```js
const Auth = () => { ... }   // 先定义箭头函数
();                          // 然后单独写一个空的调用，这是非法的
```

结果直接报错：`Uncaught SyntaxError: Unexpected token ')'`

#### 2. 加上括号后发生了什么？

```js
const Auth = (() => { ... })();
```

外层括号的作用是：

1. **强制把箭头函数变成一个分组表达式**（Primary Expression）
2. 分组表达式后面紧跟 `()`，就表示**立即调用**这个函数
3. 调用的返回值（这里是 `return` 出来的那个对象）再赋给 `Auth`

可以拆成两步理解：

```js
// 第一步：定义并立即执行
const temp = (() => {
  // 内部代码
  return { getUser, login, logout, ... };
})();

// 第二步：把返回的对象赋给 Auth
const Auth = temp;
```

### 对比普通函数的 IIFE

以前用普通函数写也是同样的道理：

```js
const Auth = (function () {
  // ...
  return { ... };
})();
```

箭头函数只是把 `function ()` 换成了 `() =>`，**外层括号依然不能少**。

### 总结

| 写法 | 是否合法 | 原因 |
|------|----------|------|
| `() => {}()` | ❌ | 解析器无法正确把后面的 `()` 当成调用 |
| `(() => {})()` | ✅ | 外层括号先把箭头函数变成完整表达式，再调用 |

所以这里的括号不是“装饰”，而是**语法上必须**的，否则就会报语法错误。