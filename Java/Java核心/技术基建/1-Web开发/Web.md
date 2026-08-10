
# 同源策略
CORS（Cross-Origin Resource Sharing）：跨域资源共享。
浏览器在发起网络请求时，为了保护用户的安全，遵循 同源策略（Same-Origin Policy）。协议 + 域名 + 端口 都相同才算同源。
<div class="highlight-block highlight-tip"> 举个真实例子：没有同源策略会怎样？  </div>
 假设场景：银行系统 + 恶意网站
1. 你在浏览器中登录了网银：
    1. 地址：`https://bank.com`
    2. 登录后，服务器通过 `Set-Cookie` 下发了身份凭证（如 `JSESSIONID=abc123`）
2. 然后你打开了一个恶意网站：
    1. 地址：`http://evil-site.com`
3. 这个网站有一段 JavaScript：
```JavaScript
fetch('https://bank.com/api/transfer', {
  method: 'POST',
  credentials: 'include',  // 自动带上你在 bank.com 的 cookie
  body: JSON.stringify({
    to: 'hacker',
    amount: 10000
  })
})
```

👉 如果没有同源策略：浏览器允许这个请求发出；请求自动携带你在 bank.com 的登录 Cookie；银行服务器认为是你本人操作；✅ 钱就被转走了！这就是典型的 CSRF（跨站请求伪造）攻击
>有了同源策略后：evil-site.com 的 JS 不能直接发起对 bank.com 的 AJAX 请求浏览器会先检查：当前页面源 ≠ 请求目标源 → 跨域必须目标服务器明确说：“我允许 evil-site.com 访问”（通过 CORS 头）而银行当然不会允许！

<div class="highlight-block highlight-tip">  跨域请求发生的时，浏览器的整个流程</div>

```Bash
[前端 JavaScript]
       ↓
1. 发起跨域请求（fetch / axios）
       ↓
2. 浏览器检测：是否跨域？ → 是
       ↓
3. 判断是否为“简单请求”？
      ↙                     ↘
   是（无需预检）           否（需预检）
     ↓                        ↓
4. 直接发送真实请求     4. 先发送 OPTIONS 预检请求
                             ↓
                      5. 服务器返回 CORS 头
                             ↓
                      6. 浏览器检查头是否合规？
                            ↙     ↘
                         是         否
                         ↓          ↓
                 发送真实请求    拒绝请求（控制台报错）
                         ↓
5. 接收响应 → 返回给 JS 或 拦截
```

✅ 什么是“简单请求”？
  必须同时满足以下所有条件：

|   |   |
|---|---|
|1. 方法|GET、POST、HEAD之一|
|2. 头部|只能包含：<br><br>- `Accept`<br>    <br>- `Accept-Language`<br>    <br>- `Content-Language`<br>    <br>- `Content-Type`（仅限 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`） \| 3. 请求中不能使用 `ReadableStream` \| —— \||

**第四步：浏览器发送 OPTIONS 预检请求（Preflight Request）**
```JavaScript
OPTIONS /data HTTP/1.1
Host: api.example.com
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

**关键头部说明：**
  👉 目的：问服务器：“我要用这些方法和头发起请求，你同不同意？”

|   |   |
|---|---|
|Origin|当前页面来自哪个源|
|Access-Control-Request-Method|真实请求要用的方法|
|Access-Control-Request-Headers|真实请求要带的自定义|

**第五步：服务器响应预检请求**
服务器收到 OPTIONS 请求后，必须返回正确的 CORS 头：
  ✅ 如果服务器没返回这些头，或者不允许，浏览器就会拒绝后续请求。

```JavaScript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
Vary: Origin, Access-Control-Request-Method, Access-Control-Request-Headers
```

**响应头详解：**

|                              |                           |
| ---------------------------- | ------------------------- |
| Access-Control-Allow-Origin  | 允许哪个源访问（不能是*如果带凭证）        |
| Access-Control-Allow-Methods | 允许哪些 HTTP 方法              |
| Access-Control-Allow-Headers | 允许哪些请求头                   |
| Access-Control-Max-Age       | 预检结果缓存时间（秒），避免重复发 OPTIONS |
| Vary                         | 提示代理服务器按这些头做缓存区分          |

**第六步：浏览器检查** **CORS** **响应头**
浏览器收到响应后，检查：
- 是否允许当前 Origin？
- 是否允许 POST 方法？
- 是否允许 Authorization 头？
- ✅ 全部通过 → 缓存这次预检结果（根据 max-age）
❌ 任一不通过 → 控制台报错，阻止真实请求

```JavaScript
CORS header ‘Access-Control-Allow-Origin’ missing
Request header field authorization is not allowed by Access-Control-Allow-Headers
```

**第七步：发送真实请求（如果预检通过）**
预检成功后，浏览器才真正发送你写的那个请求：
```JavaScript
POST /data HTTP/1.1
Host: api.example.com
Origin: http://localhost:3000
Content-Type: application/json
Authorization: Bearer xyz
...（其他头）
{"name": "张三"}
```
服务器处理并返回：
```JavaScript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Content-Type: application/json
{"id": 1, "name": "张三"}
```
浏览器再次检查：
- `Access-Control-Allow-Origin` 是否匹配？

> ⚠️ 注意：服务器即使返回 200，但如果缺少 CORS 头，浏览器仍会拦截！
- 如果请求设置了 `credentials: 'include'`，是否返回了 `Allow-Credentials: true`？
✅ 通过 → 将响应数据交给 JavaScript
❌ 不通过 → 报错，JS 拿不到响应内容（即使服务器返回了 200）

## 浏览器
### 控制台

查看页面元素计算完之后的属性值
![[Pasted image 20260107210619.png]]
### 本地存储
![[Pasted image 20260107210145.png]]


`localStorage` 和 `sessionStorage` 是浏览器提供的 Web Storage API 的两个核心接口，**用于在客户端存储键值对数据。**

核心 API（两者完全一致）

|   |   |
|---|---|
|方法|说明|
|setItem(key, value)|存储数据（自动转为字符串）|
|getItem(key)|读取数据（返回字符串，或 null）|
|removeItem(key)|删除指定键|
|clear()|清空所有数据|
|key(index)|获取第 index 个键名（不常用）|
|length|返回存储项数量|

> 注意只能存字符串，如果希望存对象的话，则需要用 JSON.stringify / JSON.parse

`localStorage` vs `sessionStorage` —— 核心区别

|      |                           |                       |
| ---- | ------------------------- | --------------------- |
| 特性   | localStorage              | sessionStorage        |
| 生命周期 | 永久存储  <br>（除非用户手动清除或代码删除） | 仅当前会话  <br>（关闭标签页即清除） |
| 作用域  | 同源下所有标签页共享                | 同源下仅当前标签页独享           |
| 典型用途 | 用**户偏好设置、离线数据缓存**         | **临时表单草稿、单页应用状态**     |

>核心：如果希望用户关闭标签页或者刷新，数据就清除，则使用sessionStroage，否则使用localStroage

### 像素
“像素”（**px**）是CSS中最基本、最常用的长度单位，但要**真正理解它**，需要区分三个概念：**物理像素**、**CSS像素**和**设备独立像素**。

1. **物理像素** **(Device** **Pixel** **/ Physical Pixel)**
    

- **定义:** 它是显示器屏幕上**最小的**、**不可再分的**物理发光点。一块屏幕的分辨率（如 $1920 \times 1080$）就是指它在横向和纵向上分别有多少个物理像素点。
    
- **特性:** 它是**固定不变**的，由硬件制造时决定。
    
- **比喻:** 就像一块画板上的一个个小方格，数量是固定的。
    

2. **CSS** **像素** **(CSS** **Pixel** **/** **px****)**
    

- **定义:** 这是一个**抽象的**、**虚拟的**长度单位，专用于Web开发（CSS）。您在CSS中设置的 `width: 100px;` 中的 `px` 就是指这个CSS像素。
    
- **特性:**
    
    - 在**默认缩放**（100%缩放）的情况下，**1个****CSS****像素**通常等于**1个设备独立像素**（见下文）。
        
    - 当用户缩放页面时，**1个****CSS****像素**可能会覆盖**多个**或**少于1个**设备独立像素。
        
- **作用:** 它是一个**桥梁**，让开发者可以编写出在不同设备上看起来**大小近似**的界面。
    

3. **设备独立****像素** **(Device Independent** **Pixel** **/ DIP)**
    

- **定义:** 这是一个**虚拟的**、**中间层**的像素单位，**CSS****像素**就是映射到这个单位上的。它旨在解决高分辨率屏幕上内容显示过小的问题。
    
- **特性:** 它的目标是让元素在不同像素密度的屏幕上保持**相同的物理尺寸**（比如一个按钮在手机和电脑屏幕上看起来一样大）。
    
- **比喻:** 它就像一个“标准尺”，用于度量内容。
    

---

💡 核心概念：设备像素比 (Device Pixel Ratio, DPR)

DPR 是连接 CSS 像素和物理像素的关键，尤其是在高分辨率设备（如Retina屏）上。

$$\text{DPR} = \frac{\text{物理像素（Device Pixels）}}{\text{设备独立像素（DIPs/CSS Pixels）}}$$

|   |   |   |
|---|---|---|
|DPR 值|描述|含义（CSS像素 : 物理像素）|
|1|普通屏幕 (PC 或传统显示器)|$1\text{px}$ 的 CSS 像素 $= 1 \times 1$ 个物理像素|
|2|Retina 屏幕 (iPhone 6/7/8等)|$1\text{px}$ 的 CSS 像素 $= 2 \times 2 = 4$ 个物理像素|
|3|更高密度屏幕 (iPhone Plus系列)|$1\text{px}$ 的 CSS 像素 $= 3 \times 3 = 9$ 个物理像素|

**理解要点：**

1. **对于开发者:** 当你在 CSS 中写 `width: 100px;` 时，你设置的是 **100个CSS****像素**。
    
2. **对于浏览器:** 浏览器会将这100个 CSS 像素 转换为 **100个设备独立像素**。
    
3. **对于屏幕:** 如果设备的 **DPR****=2**，那么这100个设备独立像素将由 $100 \times 4 = 400$ 个**物理像素**来显示，以保持清晰度和物理尺寸不变。
    

简单来说，CSS中的 **`px`** 是一种**可变**的度量单位，它会根据设备的像素密度（DPR）来映射到底层硬件的物理像素，从而提供一个相对统一的视觉体验。


## Session 和 JWT
你的观察非常敏锐！从**表面流程**上看，Session 和 JWT（JSON Web Token）确实非常相似：

1. 用户登录。
2. 服务器返回一串字符（Session ID 或 JWT Token）。
3. 浏览器保存这串字符。
4. 下次请求时，浏览器把这串字符发给服务器。
5. 服务器识别用户。

**但是，它们的核心区别在于“服务器如何验证这串字符”以及“用户状态存在哪里”。**

这就好比：

- **Session** 像是去游乐园发的**手环号码**。工作人员（服务器）必须拿着这个号码去查后台的**登记簿**（数据库/内存），才能知道你是谁、票有没有过期。
- **JWT** 像是一张**加密的防伪门票**。门票上直接印着你的名字、有效期，并且盖了游乐园的**公章**（签名）。工作人员只要看一眼门票上的公章是不是真的，就能直接让你进去，**不需要查登记簿**。

以下是详细的深度对比：

#### 1. 核心机制区别：有状态 vs 无状态

|特性|Session (传统模式)|JWT (JSON Web Token)|
|:--|:--|:--|
|**存储位置**|**服务端**。数据存在服务器内存、文件或数据库中。|**客户端**。所有数据（用户信息、权限、过期时间）都编码在 Token 字符串里，存在浏览器 localStorage 或 Cookie 中。|
|**验证方式**|**查表**。服务器收到 ID，必须去查询存储介质（如 Redis），看这个 ID 是否存在、是否过期、对应什么用户。|**计算**。服务器收到 Token，利用本地持有的**密钥**进行数学运算（验签）。如果签名对得上且没过期，就直接信任，**无需查询数据库**。|
|**状态管理**|**有状态 (Stateful)**。服务器必须“记住”每个在线用户。|**无状态 (Stateless)**。服务器不保存任何用户会话信息，只负责发证和验票。|

#### 2. 分布式/集群环境下的表现

这是现代架构选择 JWT 的主要原因之一。

- **Session 的痛点**：
    
    - 如果你有两台服务器（A 和 B）。用户第一次连到 A，Session 存在 A 的内存里。
    - 第二次请求被负载均衡到了 B。B 的内存里没有这个 Session，用户就“掉线”了。
    - **解决麻烦**：必须引入共享存储（如 Redis），让 A 和 B 都去 Redis 里查 Session，或者配置复杂的 Session 复制同步。
- **JWT 的优势**：
    
    - 用户连到 A，A 生成一个签好名的 JWT 给用户。
    - 用户下次连到 B、C、D... 任何一台服务器。
    - 只要这些服务器拥有相同的**验签密钥**，它们都能独立验证这个 JWT 的真伪，**完全不需要互相通信，也不需要查 Redis**。
    - **结果**：极易横向扩展，加机器就行，没有会话粘滞问题。

#### 3. 安全性与注销（撤销）

这是 JWT 最大的短板，也是 Session 的优势。

- **注销用户（踢人下线）**：
    
    - **Session**：非常简单。服务器直接在数据库/内存里把这个 Session ID 删掉。用户下次再带这个 ID 来，服务器一查“查无此人”，立刻拒绝。
    - **JWT**：**非常困难**。因为数据在客户端，服务器没存记录。即使用户改了密码，只要他手里的 JWT 没过期，签名依然是合法的，服务器就会一直让他通过。
    - _补救措施_：为了实现 JWT 的注销，通常需要将未过期的 Token ID 加入“黑名单”存入 Redis，这又变相回到了“有状态”的模式，抵消了部分无状态的优势。
- **数据敏感性**：
    
    - **Session**：敏感数据（如密码哈希、详细权限）存在服务器，客户端只有一个随机 ID。即使 ID 被截获，黑客也拿不到具体数据（除非能模拟请求）。
    - **JWT**：Payload（负载）部分只是经过 Base64 编码（**不是加密**），任何人都可以解码看到里面的内容（如 `user_id`, `role`）。**绝对不能**把密码等敏感信息放进 JWT。如果密钥泄露，黑客可以伪造任意用户的 Token。

#### 4. 网络传输量

- **Session**：客户端只传一个短小的 ID（如 `JSESSIONID=xyz123`），流量极小。
- **JWT**：Token 包含了很多信息（头部、负载、签名），字符串通常比较长（几百字节甚至更多）。每次请求都要在 Header 里带上，增加了网络带宽消耗。

#### 总结：什么时候用哪个？

##### 选择 **Session** 的场景：

1. **需要频繁强制注销用户**（如后台管理系统，管理员可以随时踢人）。
2. **对安全性要求极高**，且不想让客户端持有过多用户信息。
3. **单体应用**，或者已经做好了基于 Redis 的集中式 Session 管理。
4. 传统的后端渲染页面（SSR）应用。

##### 选择 **JWT** 的场景：

1. **前后端分离**架构（Vue/React + API）。
2. **微服务/分布式系统**，希望服务之间无依赖地验证用户身份。
3. **移动端 App** 或 **第三方授权**（如 OAuth2.0），需要跨域传递身份信息。
4. 用户量大，希望减少服务器内存/数据库的查询压力（读多写少）。

#### 一句话概括

- **Session** 是"**服务器记账，客户持号**"，安全易控，但扩展麻烦。
- **JWT** 是"**服务器盖章，客户持证**”，扩展极强，但难以撤销且体积较大。

在现代开发中，很多团队会**混合使用**：例如用 JWT 做微服务间的内部认证，而在网关层或核心业务层依然结合 Redis 做一层状态控制，以兼顾两者的优点。