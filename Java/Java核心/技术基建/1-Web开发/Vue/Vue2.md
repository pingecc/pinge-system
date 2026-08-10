来源：尚硅谷Vue2学习。禹神
https://v2.cn.vuejs.org/

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。核心提供2大功能：
1. 组件化编程：
2. 声明式UI：

> Vue框架包含很多个组件，应用于各种场景，没有完全绑定在一起，“渐进式”指的是你可以在实际项目当中按照实际需求引入，而不需要全部，就和Java中的Spring框架一样。



# 介绍

1.  MVVM在Vue中的设计体现
2. 理解Vue实例与组件实例
3. 模板与模板语法
4. Vue使用的2个基本原理：
	1. 数据代理
	2. 响应基本原理

<div class="highlight-block highlight-tip">入门使用</div>
https://v2.cn.vuejs.org/v2/guide/installation.html

1. 从官网 下载 `vue.js` 文件
2. 给自己的浏览器下载vue开发者插件 `Vue.js devtools`
3. 页面中引入 vue.js文件，那么在当前全局就有了一个 `Vue` 对象
最简用法：你可以只引入 Vue 的核心库，在一个 HTML 页面中通过 `<script>` 标签使用，仅用于数据绑定和简单的组件。

```HTML
<div id="app">{{ message }}</div>
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
  const { createApp } = Vue;
  createApp({ data() { return { message: 'Hello Vue!' } } }).mount('#app');
</script>
```
上述代码描述：通过 `Vue`中的 `createAPP` 来创建一个 `Vue实例对象`，然后通过 `mount`函数来挂载到页面的指定 DOM元素。
<div class="highlight-block highlight-tip">MVVM</div>

![[Pasted image 20260111201120.png]]
1. 当Model改变时，任何view中使用到model的地方都会自动更新，无需手动更新DOM。单向数据流
2. View的输入 ------> 也会自动更新Model----->更新View 。双向数据绑

| **MVVM 元素**   | **对应 Vue 概念**                           |
| ------------- | --------------------------------------- |
| **Model**     | 应用的数据（`data()`、`ref()`、`reactive()` 等）  |
| **View**      | 模板（`template` / 单文件组件的 `<template>` 部分） |
| **ViewModel** | Vue 实例（或组件实例）本身，包含响应式系统、计算属性、方法等        |
>1. 单向数据流 + 局部双向绑定 Vue **推荐组件间使用单向数据流**（props down, events up），仅在表单等场景使用 `v-model` 实现局部双向绑定，避免复杂状态难以追踪。
>2. Composition API 更偏向函数式组织 在 Vue 3 的 Composition API 中，逻辑以函数形式组织（如 `setup()`），弱化了“ViewModel”作为一个对象容器的概念，但底层仍基于响应式 Model 和模板 View 的绑定机制。


<div class="highlight-block highlight-tip">Vue实例</div>
一个 Vue 实例通常与一个 DOM 元素（称为“挂载点”或“容器”）建立一对一的绑定关系。在创建 Vue 实例时，通过配置对象中的 `el`属性指定该挂载点。

关于Vue中的**模板**：用于描述组件的 UI 结构，可以使用Vue提供的模板语法来实现声明式UI，来源有三种：
- 在创建Vue实例时通过配置对象中的  `template` 属性，不常用。
- 由挂载元素本身的 innerHTML提供。
- 单文件组件（SFC）中的 `<template>` 标签提供

在模板中，开发者使用 Vue 的**模板语法**（如插值表达式 {{ message }}、指令 v-if、v-for、事件绑定 @click 等）来声明式地描述 UI 与底层数据之间的关系。

<div class="highlight-block highlight-tip">组件实例</div>
一个Vue组件就是一个 `.vue` 文件，它将 模板（template）、逻辑（script）和样式（style） 封装在一个文件中，实现高内聚、低耦合的组件开发。

```vue
<template>
  <!-- HTML 模板 -->
</template>

<script>
// JavaScript 逻辑（选项式 API 或组合式 API）
</script>

<style scoped>
/* CSS 样式 */
</style>
```

<div class="highlight-block highlight-tip">模板语法</div>
Vue 框架自身提供的一套 DS（领域特定语言），可以运用在模板中，Vue会进行编译解析，通过Vue提供的模板语法，可以**实现声明式UI**：
- 快速往页面元素中插入数据
- 快速给元素绑定事件
- 让开发者聚焦于“UI 应该是什么样子”，减少直接操作DOM


<div class="highlight-block highlight-tip">为什么配置对象data中添加的属性都变到vue/组件实例上了？</div>
因为Vue对配置对象中的属性进行了数据代理。目的就是让访问更佳方便。背后是通过`Object.defineProperty`来实现：
1. 实现数据代理：用一个对象代理对另外一个对象属性的访问和修改
    1. 代理对象添加目标对象相同的属性
    2. 在这个添加的属性中的get()和set()中直接调用目标对象
        


<div class="highlight-block highlight-tip">Vue的响应基本原理</div>
响应：
- 修改data中配置的数据，**Vue可以监测到**，然后同步更新模板
- 模板中获取用户输入，同步更新配置对象中绑定的属性

监测基本原理：
1. 在创建Vue实例时， 遍历 Data 中的所有属性：
    1. 如果属性是普通对象，利用 `Object.defineProperty`给它们加上 `getter` 和 `setter`。当数据变动时，`setter` 会通知视图更新。
    2. 如果属性是数组，则直接代理数组中所有更新的方法，当调用这些方法时，Vue则先调用原生数组对应的方法，然后再更新视图。
2. 限制：
	1. 对已经配置好的对象动态的进行属性的“添加”或“删除”，Vue默认不做响应式处理（因为定义时还没那个属性）,如需给后添加的属性做响应式，请使用如下API：
	 `Vue.set(target，propertyName/index，value)` 或`vm.$set(target，propertyName/index，value)`
	2. 在Vue**修改数组中的某个元素一定要用如下方法**\I:push()、pop()、shift()、unshift()、splice()、sort()、reverse()  或者 Vue.set() 或 vm.$set()
> 特别注意：Vue.set() 和 vm.$set() 不能给vm 或 vm的根数据对象 添加属性

下面模拟一个简单的数据监测
```JavaScript
let data = {
    name:'尚硅谷',
    address:'北京',
}

//创建一个监视的实例对象，用于监视data中属性的变化
const obs = new Observer(data)      
console.log(obs)    

//准备一个vm实例对象
let vm = {}
// 这里之所以吧把obs直接赋值给data，这样修改data时同样触发
vm._data = data = obs

function Observer(obj){
    //汇总对象中所有的属性形成一个数组
    const keys = Object.keys(obj)
    //遍历
    keys.forEach((k)=>{
        Object.defineProperty(this,k,{
            get(){

                return obj[k]
            },
            set(val){
                console.log(`${k}被改了，我要去解析模板，生成虚拟DOM.....我要开始忙了`)
                obj[k] = val
            }
        })
    })
}
```

![[Pasted image 20260111211356.png]]

## 声明式UI
在模板中使用模板语法来描述UI中的数据和事件，在配置对象中完成数据、函数的配置，Vue实例完成之间模板和配置对象中的响应。
1. 模板语法：可以写的属性都均直接来自Vue实例本身或者当前组件实例本身上。
2. 配置对象中要想使用Vue实例或者当前组件实例身上的属性，需要使用 `this.xxx`


### 模板语法
1. 单向数据绑定语法：数据------->页面。 当数据发生变化，页面中也同步更新。
	1. 插值语法
	2. 属性绑定

2. 双向数据绑定语法：
	1. `v-model`
3. 事件响应：
#### 插值语法
向页面标签内插入数据 `{{}}`  写属性名/函数名/简单的表达式。
```HTML
<div id="app">
  <p>Hello, {{ name }}!</p>
  <p>计算结果：{{ count + 1 }}</p>
  <p>调用方法：{{ getFullName() }}</p>
</div>

<script>
new Vue({
  el: '#app',
  data: {
    name: 'Alice',
    count: 5
  },
  methods: {
    getFullName() {
      return this.name + ' (Admin)';
    }
  }
});
</script>
```
#### 属性绑定
语法：`v-bind:xxx 或简写` `:`xxx  实现动态的给属性赋值，其中 `xxx`来自配置对象data中的属性值
1. 给标签属性赋值
```HTML
<img v-bind:src="imageUrl" />
<!-- 简写 -->
<img :src="imageUrl" />

<a :href="linkUrl">点击跳转</a>
```
2. 绑定class属性或者style属性实现动态样式`:class=""` 或者 `:style=""` 实现，字符串内部写data中的属性
	1. class样式 `:class="xxx"` xxx可以是字符串、对象、数组。
	    1. 字符串写法适用于：类名不确定，要动态获取。
	    2. 对象写法适用于：要绑定多个样式，个数不确定，名字也不确定。对应属性名的值返回true时，vue就会把这个属性名作为class类名进行应用。
	    3. 数组写法适用于：要绑定多个样式，个数确定，名字也确定，但不确定用不用。   
	2. style样式
	    1. `:style="{fontSize: xxx}"`其中xxx是动态值。
	    2. `:style="[a,b]"`其中a、b是样式对象。

```html

<div id="root">
    <!-- 绑定class样式--字符串写法，适用于：样式的类名不确定，需要动态指定 -->
    <div class="basic" :class="mood" @click="changeMood">{{name}}</div> <br/><br/>

    <!-- 绑定class样式--数组写法，适用于：要绑定的样式个数不确定、名字也不确定 -->
    <div class="basic" :class="classArr">{{name}}</div> <br/><br/>

    <!-- 绑定class样式--对象写法，适用于：要绑定的样式个数确定、名字也确定，但要动态决定用不用 -->
    <div class="basic" :class="classObj">{{name}}</div> <br/><br/>

    <!-- 绑定style样式--对象写法 -->
    <div class="basic" :style="styleObj">{{name}}</div> <br/><br/>
    <!-- 绑定style样式--数组写法 -->
    <div class="basic" :style="styleArr">{{name}}</div>
</div>
</body>

<script type="text/javascript">
const vm = new Vue({
    el:'#root',
    data:{
        name:'尚硅谷',
        mood:'normal',
        classArr:['atguigu1','atguigu2','atguigu3'],
        classObj:{
            atguigu1:false,
            atguigu2:false,
        },
        styleObj:{
            fontSize: '40px',
            color:'red',
        },
        styleObj2:{
            backgroundColor:'orange'
        },
        styleArr:[
            {
                fontSize: '40px',
                color:'blue',
            },
            {
                backgroundColor:'gray'
            }
        ]
    },
    methods: {
        changeMood(){
            const arr = ['happy','sad','normal']
            const index = Math.floor(Math.random()*3)
            this.mood = arr[index]
        }
    },
})
</script>
```

#### v-model
收集表单用户输入的数据，实现和配置对象中属性的双向绑定。
语法：`v-model=""` 写data属性中定义的变量名
1. 若：`<input type="text"/>`，则v-model收集的是value值，用户输入的就是value值。
2. 若：`<input type="radio"/>`，则v-model收集的是value值，所以要给标签配置value值。
3. 若：`<input type="checkbox"/>`
    1. 没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    2. 配置input的value属性:
        1. v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）
        2. v-model的初始值是数组，那么收集的的就是value组成的数组
4. 备注：v-model的三个**修饰符**：
	1. lazy：失去焦点再收集数据
	2. number：输入字符串转为有效的数字
	3. trim：输入首尾空格过滤

```HTML
<div id="root">
<form @submit.prevent="demo">
    账号：<input type="text" v-model.trim="userInfo.account"> <br/><br/>
    密码：<input type="password" v-model="userInfo.password"> <br/><br/>
    年龄：<input type="number" v-model.number="userInfo.age"> <br/><br/>
    性别：
    男<input type="radio" name="sex" v-model="userInfo.sex" value="male">
    女<input type="radio" name="sex" v-model="userInfo.sex" value="female"> <br/><br/>
    爱好：
    学习<input type="checkbox" v-model="userInfo.hobby" value="study">
    打游戏<input type="checkbox" v-model="userInfo.hobby" value="game">
    吃饭<input type="checkbox" v-model="userInfo.hobby" value="eat">
    <br/><br/>
    所属校区
    <select v-model="userInfo.city">
        <option value="">请选择校区</option>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="shenzhen">深圳</option>
        <option value="wuhan">武汉</option>
    </select>
    <br/><br/>
    其他信息：
    <textarea v-model.lazy="userInfo.other"></textarea> <br/><br/>
    <input type="checkbox" v-model="userInfo.agree">阅读并接受<a href="http://www.atguigu.com">《用户协议》</a>
    <button>提交</button>
</form>
</div>
</body>

<script type="text/javascript">
Vue.config.productionTip = false

new Vue({
el:'#root',
data:{
    userInfo:{
        account:'',
        password:'',
        age:18,
        sex:'female',
        hobby:[],
        city:'beijing',
        other:'',
        agree:''
    }
},
methods: {
    demo(){
        console.log(JSON.stringify(this.userInfo))
    }
}
})
</script>
```

#### 条件渲染

动态控制DOM 元素显示/隐藏。

1. **v-if**：真正地添加/移除 DOM 元素（条件为 false 时，元素不存在），适用于：切换频率较低的场景。
    
    1. `v-if="表达式"`
        
    2. `v-else-if="表达式"`
        
    3. `v-else="表达式"`
        

> v-else 和 v-else-if 必须紧跟在 v-if 或另一个 v-else-if 后面
> 
> 它们之间不能有其他元素隔开

- **v-show**：`v-show="表达式"` 始终渲染 DOM，只是通过 CSS display: none 切换可见性。适用于：切换频率较高的场景。
    

```XML
<div id="app">
  <p v-if="isLoggedIn">欢迎回来，{{ username }}！</p>
  <p v-else-if="isGuest">您是游客</p>
  <p v-else>请先登录</p>
</div>
<script type="text/javascript">
new Vue({
  el: '#app',
  data: {
    isLoggedIn: true,
    isGuest: false,
    username: 'Alice'
  }
});
</script>
```

#### 列表渲染

根据一个数组/对象**动态生成多个** **DOM** **元素**，常用于展示表格、列表、卡片等重复结构。当数据发生变化，DOM 自动同步更新

1. v-for指令: `v-for="(item, index) in xxx" :key="yyy"` ：想要重复生成哪个DOM元素，就写在哪个DOM元素上。
    1. xxx可以是数组或者对象
        
    2. item是数组元素或者对象的属性值
        
    3. index是数组的索引或者对象的属性名
        
    4. :key 最好写，帮助 Vue 高效复用和排序 DOM 元素，对元素进行标识。
        
        1. 最好使用每条数据的唯一标识作为key, 比如id
            
        2. 如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。
            

```vue

<!-- 准备好一个容器-->
<div id="root">
<!-- 遍历数组 -->
<h2>人员列表（遍历数组）</h2>
<ul>
    <li v-for="(p,index) of persons" :key="index">
        {{p.name}}-{{p.age}}
    </li>
</ul>

<!-- 遍历对象 -->
<h2>汽车信息（遍历对象）</h2>
<ul> 
    <!-- value 属性值 k 属性值 -->
    <li v-for="(value,k) of car" :key="k">
        {{k}}-{{value}}
    </li>
</ul>


</div>

<script type="text/javascript">
Vue.config.productionTip = false

new Vue({
    el:'#root',
    data:{
        persons:[
            {id:'001',name:'张三',age:18},
            {id:'002',name:'李四',age:19},
            {id:'003',name:'王五',age:20}
        ],
        car:{
            name:'奥迪A8',
            price:'70万',
            color:'黑色'
        }
    }
})
</script>
```

实现列表过滤：
在实际开发中，列表数据在页面进行展示之后，一般还会提供一些查询框、按钮啥的对列表数据进行过滤或者排序啥的。

- 通过对input框、按钮绑定属性值，然后在computed 中监听这些属性值的变化，对数据进行处理
    

```vue
<!-- 准备好一个容器-->
<div id="root">
<h2>人员列表</h2>
<input type="text" placeholder="请输入名字" v-model="keyWord">
<button @click="sortType = 2">年龄升序</button>
<button @click="sortType = 1">年龄降序</button>
<button @click="sortType = 0">原顺序</button>
<ul>
    <li v-for="(p,index) of filPerons" :key="p.id">
        {{p.name}}-{{p.age}}-{{p.sex}}
        <input type="text">
    </li>
</ul>
</div>

<script type="text/javascript">
Vue.config.productionTip = false

new Vue({
    el:'#root',
    data:{
        keyWord:'',
        sortType:0, //0原顺序 1降序 2升序
        persons:[
            {id:'001',name:'马冬梅',age:30,sex:'女'},
            {id:'002',name:'周冬雨',age:31,sex:'女'},
            {id:'003',name:'周杰伦',age:18,sex:'男'},
            {id:'004',name:'温兆伦',age:19,sex:'男'}
        ]
    },
    computed:{
        filPerons(){
            const arr = this.persons.filter((p)=>{
                return p.name.indexOf(this.keyWord) !== -1
            })
            //判断一下是否需要排序
            if(this.sortType){
                arr.sort((p1,p2)=>{
                    return this.sortType === 1 ? p2.age-p1.age : p1.age-p2.age
                })
            }
            return arr
        }
    }
}) 

</script>
```

#### 事件绑定
1. 使用v-on:xxx 或 @xxx 为元素绑定事件，其中xxx是事件名；当事件发生时，调用vue实例中的函数。
    
2. 事件的回调函数需要配置在methods属性中，最终会在vm上；
    
3. 注意methods中配置的函数，不要用箭头函数！否则this就不是vm了；
    

```TypeScript
const vm = new Vue({
    el:'#root',
    data:{
        name:'尚硅谷',
    },
    methods:{
        // 当不需要额外传参时，这里的第一个参数就是vue实例
        // 传过来的事件对象 
        // @click="showInfo1"
        showInfo1(event){
            // console.log(event.target.innerText)
            // console.log(this) //此处的this是vm
            alert('同学你好！')
        },
        // 需要额外传参时
        //  @click="showInfo2($event, 666)" 
        showInfo2(event,number){
            console.log(event,number)
            // console.log(event.target.innerText)
            // console.log(this) //此处的this是vm
            alert('同学你好！！')
        }
    }
        })
```

<div class="highlight-block highlight-tip">点击事件 @click  </div>
1. 语法：`@click="表达式"` 当点击时执行字符串内的表达式，一般写函数名或者基本的表达式
```vue
<!-- 当点击时，调用VUe实例中 名为 handleClick 函数-->
<button v-on:click="handleClick">点我</button>
<!-- 简写 -->
<button @click="handleClick">点我</button>
```

2. 事件修饰符
给事件指令语法额外添加属性，可以直接配置一些行为
- prevent：阻止默认事件（常用）；
    
- stop：阻止事件冒泡（常用）；
    
- once：事件只触发一次（常用）；
    
- capture：使用事件的捕获模式；
    
- self：只有event.target是当前操作的元素时才触发事件；
    
- passive：事件的默认行为立即执行，无需等待事件回调执行完毕；
    

```HTML
<!-- 阻止默认事件（常用） -->
<a href="http://www.atguigu.com" @click.prevent="showInfo">点我提示信息</a>

<!-- 阻止事件冒泡（常用） -->
<div class="demo1" @click="showInfo">
<button @click.stop="showInfo">点我提示信息</button>
<!-- 修饰符可以连续写 -->
<!-- <a href="http://www.atguigu.com" @click.prevent.stop="showInfo">点我提示信息</a> -->
</div>

<!-- 事件只触发一次（常用） -->
<button @click.once="showInfo">点我提示信息</button>
```


<div class="highlight-block highlight-tip">键盘事件  </div>
下键盘上的某个按键，执行对应事件。对应指令：

- `@keyup` 按下键再松开触发事件
    
- `@keydown` 按下键触发事件
    

那如何绑定按下键盘上某个特定的按键就触发事件：

- 在对应事件函数中通过事件event.key 或者event.keyCode 拿到对应键的名称或编码进行判读
    
- vue提供了常见的按键别名，只要在指令后面添加对应修饰符即可。
    

> Vue中常用的按键别名：(有些按键只能通过keydown或者keyup才能正常触发）
> 
> - 回车 => enter
>     
> - 删除 => delete (捕获“删除”和“退格”键)
>     
> - 退出 => esc
>     
> - 空格 => space
>     
> - 换行 => tab (特殊，必须配合keydown去使用)
>     
> - 上 => up
>     
> - 下 => down
>     
> - 左 => left
>     
> - 右 => right
>     

```HTML
<div id="app">
    <input type="text" @keyup="showInfo">
     <input type="text" @keyup.enter="showInfo">
</div>

<script type="text/javascript">
   const vm = new Vue({
        el: '#app', 
       methods:{
            showInfo(e) {
                // 对应按键编码
                if (e.keyCode === 13) {
                    alert('你按下了回车键');
                }
                return;
              
            }
       }
    })
</script>
```

#### 其它指令
- `v-text`
    
- `v-html`
    
- `v-cloak`
    
- `v-once`
    
- `v-pre`

### 配置对象
	配置对象配置的所有属性都会直接出现在Vue实例或者组件实例本身上。
📌 核心功能分类总结：

|类别|配置项|主要作用|
|---|---|---|
|**基础结构**|`el`, `template`|指定挂载点和 UI 模板|
|**响应式数据**|`data`, `props`, `computed`|管理状态与派生状态|
|**交互逻辑**|`methods`, `watch`|处理用户行为与数据变化|
|**生命周期**|`created`, `mounted`, `beforeDestroy` 等|控制组件各阶段行为|
|**组件系统**|`components`, `provide/inject`|构建可复用、可组合的 UI|
|**扩展能力**|`directives`, `filters`|封装 DOM 操作与文本处理|
```javaScript
// 创建一个 Vue 实例（也可用于组件定义）
new Vue({
  // 🔹 1. 挂载点：指定 Vue 管理的 DOM 容器
  el: '#app', // 应用场景：将 Vue 实例绑定到页面中 id="app" 的元素

  // 🔹 2. 响应式数据：返回一个对象，作为组件的状态
  data() {
    return {
      message: 'Hello Vue!',
      count: 0,
      user: { name: 'Alice', age: 25 }
    };
  },
  // 应用场景：存储组件的动态状态，如表单输入、列表数据、用户信息等

  // 🔹 3. 计算属性：基于响应式依赖缓存计算结果
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    },
    // 应用场景：格式化显示（如价格、日期）、过滤列表、组合多个 data 属性
  },

  // 🔹 4. 方法：定义可被模板或逻辑调用的函数
  methods: {
    increment() {
      this.count++;
    },
    greet() {
      alert(`Hello, ${this.user.name}!`);
    }
    // 应用场景：事件处理（点击、提交）、业务逻辑封装、API 调用
  },

  // 🔹 5. 监听器：响应特定数据的变化
  watch: {
    count(newVal, oldVal) {
      if (newVal > 10) console.log('Count is too high!');
    },
    'user.name'(newName) {
      console.log('Name changed to:', newName);
    }
    // 应用场景：异步操作（如搜索防抖）、深度数据联动、跨组件通信前的预处理
  },

  // 🔹 6. 生命周期钩子：在特定阶段执行逻辑
  created() {
    // 实例创建完成，data 已响应式，但 DOM 未挂载
    console.log('Instance created');
    // 应用场景：发起 API 请求获取初始数据
  },
  mounted() {
    // DOM 已挂载，可访问 $el
    console.log('DOM ready');
    // 应用场景：操作 DOM（如初始化第三方库：Chart.js、Swiper）
  },
  beforeDestroy() {
    // 实例销毁前清理资源
    // 应用场景：清除定时器、取消网络请求、解绑全局事件
  },

  // 🔹 7. 组件注册（局部）
  components: {
    'my-button': MyButtonComponent
    // 应用场景：在当前组件内使用自定义子组件
  },

  // 🔹 8. Props（仅用于组件，根实例不适用）
  // props: ['title', 'size'], // 简写
  props: {
    title: {
      type: String,
      required: true,
      default: 'Default Title'
    },
    maxCount: {
      type: Number,
      validator(value) {
        return value > 0;
      }
    }
    // 应用场景：接收父组件传递的数据，实现组件复用与配置
  },

  // 🔹 9. 自定义指令（局部）
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
    // 应用场景：封装 DOM 操作逻辑，如 v-focus、v-tooltip
  },

  // 🔹 10. 过滤器（Vue 2 特有，Vue 3 已移除）
  filters: {
    capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    // 应用场景：文本格式化（如货币、日期），在模板中 {{ text | capitalize }} 使用
  },

  // 🔹 11. 提供/注入（跨多层组件传值）
  provide() {
    return { theme: 'dark' };
  },
  inject: ['theme'],
  // 应用场景：避免“prop drilling”，如主题、语言包、全局配置透传

  // 🔹 12. 模板（可选，优先级高于 el 的 innerHTML）
  template: `
    <div>
      <h1>{{ title || message }}</h1>
      <p>{{ reversedMessage }}</p>
      <p>Count: {{ count }}</p>
      <button @click="increment">+1</button>
      <input v-model="user.name" placeholder="Edit name">
    </div>
  `,
  // 应用场景：完全控制渲染结构，避免依赖外部 HTML

  // 🔹 13. 其他实用选项
  name: 'App', // 用于调试工具和递归组件
  delimiters: ['${', '}'], // 自定义插值分隔符（避免与后端模板冲突）
});
```

#### 计算属性
`computed` ：应用场景：要显示的数据不存在，需要通过对其它的属性进行复杂的计算得到。
特点：
- 响应式：依赖的数据变了，计算属性自动更新
- 缓存性：只要依赖不变，多次访问不会重复计算
- 声明式：像读取普通属性一样使用，无需调用函数（对比 methods）
- 原理：底层其实借助了Objcet.defineproperty方法提供的getter和setter，实现，计算属性最终会出现在vm上，直接读取使用即可。
```HTML
<div id="app">
  {{ fullName }} <!-- 输出：John Doe -->
</div>
<script type="text/javascript">
new Vue({
  el: '#app',
  data: {
    firstName: 'John',
    lastName: 'Doe'
  },
  computed: {
    // 只读计算属性
    fullName() {
      console.log('计算 fullName...'); // 用于观察是否被缓存
      return this.firstName + ' ' + this.lastName;
    }
  }
});
</script>
```
默认计算属性是只读的。但你可以提供 get 和 set 来实现双向绑定。
```HTML
<input v-model="fullName" />
<!-- 当用户输入 "Alice Smith"，会自动拆分到 firstName 和 lastName -->
<script type="text/javascript">
computed: {
  fullName: {
    // getter：读取时调用
    get() {
      return this.firstName + ' ' + this.lastName;
    },
    // setter：赋值时调用（如 v-model 绑定）
    set(newValue) {
      const names = newValue.split(' ');
      this.firstName = names[0];
      this.lastName = names[names.length - 1];
    }
  }
}
</script>
```

#### 监视属性
`watch`：监听特定数据的变化，并在变化时执行相关操作。**一般应用于数据发生变化时，执行某个业务逻辑，而不是简单计算值显示在页面上**：如日志、发送请求、更新非响应式状态
💡 与 computed 的关键区别：
- computed：声明式派生数据（纯函数，无副作用，有缓存）
- watch：命令式响应变化（可执行任意逻辑，无缓存）
1. 监视的两种写法：
    
    1. `new Vue`时传入watch配置
        
    2. 通过`vm.$watch`监视 如果在创建Vue实例时不确定监听哪个属性，可以使用这个方式
        
2. 默认 watch 只在数据变化后触发，首次不执行。配置`immediate:true`可以在初始化的时候就执行一次。
    
3. 深度监视
    

```HTML
<script type="text/javascript">
const vm = new Vue({
    el:'#root',
    data:{
        isHot:true,
    },
    /* watch:{
        isHot:{
            immediate:true, //初始化时让handler调用一下
            //handler什么时候调用？当isHot发生改变时。
            handler(newValue,oldValue){
                console.log('isHot被修改了',newValue,oldValue)
            }
        }
    } */
})

vm.$watch('isHot',{
    immediate:true, //初始化时让handler调用一下
    //handler什么时候调用？当isHot发生改变时。
    handler(newValue,oldValue){
        console.log('isHot被修改了',newValue,oldValue)
    }
})
</script>
```

深度监视：

- Vue中的watch默认不监测对象内部值的改变（一层）。
    
- 配置deep:true可以监测对象内部值改变（多层）。
    

```vue
<script type="text/javascript">
    const vm = new Vue({
        el:'#root',
        data:{
            isHot:true,
            numbers:{
                a:1,
                b:1,
                c:{
                    d:{
                        e:100
                    }
                }
            }
        },
        methods: {
            changeWeather(){
                this.isHot = !this.isHot
            }
        },
        watch:{
            //监视多级结构中某个属性的变化
            /* 'numbers.a':{
                handler(){
                    console.log('a被改变了')
                }
            } */
            //监视多级结构中所有属性的变化
            numbers:{
                deep:true,
                handler(){
                    console.log('numbers改变了')
                }
            }
        }
    })

</script>
```

简写

```vue
<script type="text/javascript">
        const vm = new Vue({
            el:'#root',
            data:{
                isHot:true,
            },
            watch:{
                //正常写法
                /* isHot:{
                    // immediate:true, //初始化时让handler调用一下
                    // deep:true,//深度监视
                    handler(newValue,oldValue){
                        console.log('isHot被修改了',newValue,oldValue)
                    }
                }, */
                //简写
                /* isHot(newValue,oldValue){
                    console.log('isHot被修改了',newValue,oldValue,this)
                } */
            }
        })

        //正常写法
        /* vm.$watch('isHot',{
            immediate:true, //初始化时让handler调用一下
            deep:true,//深度监视
            handler(newValue,oldValue){
                console.log('isHot被修改了',newValue,oldValue)
            }
        }) */

        //简写
        /* vm.$watch('isHot',(newValue,oldValue)=>{
            console.log('isHot被修改了',newValue,oldValue,this)
        }) */
```

#### 过滤器
- 计算属性对已有的属性进行计算产生新的属性然后显示在页面上
    
- 监听属性对已有的属性的变化进行监听然后执行某个业务逻辑
    

而过滤器Vue提供的另外一种数据处理的方式，用于对要显示的数据进行特定格式化后再显示，也并没有改变原本的数据, 是产生新的对应的数据（了解即可，一般直接计算属性或者监听属性也都可以实现

```vue
<!-- 过滤器实现 -->
<h3>现在是：{{time | timeFormater}}</h3>
<!-- 过滤器实现（传参） -->
<h3>现在是：{{time | timeFormater('YYYY_MM_DD') | mySlice}}</h3>
<h3 :x="msg | mySlice">尚硅谷</h3>
    
    <script type="text/javascript">
    Vue.config.productionTip = false
    //全局过滤器
    Vue.filter('mySlice',function(value){
    return value.slice(0,4)
    })
    
    new Vue({
    el:'#root',
    data:{
        time:1621561377603, //时间戳
        msg:'你好，尚硅谷'
    },
    computed: {
        fmtTime(){
            return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')
        }
    },
    methods: {
        getFmtTime(){
            return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')
        }
    },
    //局部过滤器
    filters:{
        timeFormater(value,str='YYYY年MM月DD日 HH:mm:ss'){
            // console.log('@',value)
            return dayjs(value).format(str)
        }
    }
    })
    
    new Vue({
    el:'#root2',
    data:{
        msg:'hello,atguigu!'
    }
    })
    </script>
```

#### 生命周期

ue 的生命周期（Lifecycle）是每个 Vue 实例从创建到销毁过程中经历的一系列关键阶段。在这些阶段中，Vue 提供了多个生命周期**钩子函数**（Lifecycle Hooks），我们可以在创建vue实例时通过配置填写这些函数的逻辑，**Vue会在特定阶段调用这些函数**。

| 阶段   | 钩子函数              |             |
| ---- | ----------------- | ----------- |
| 创建阶段 | beforeCreate      | **created** |
| 挂载阶段 | beforeMount       | **mounted** |
| 更新阶段 | beforeUpdate      | updated     |
| 销毁阶段 | **beforeDestroy** | destroyed   |

> ✅ 重点掌握：created、mounted、beforeDestroy

1. beforeCreate
    

时机：实例初始化之后，data、props、methods 尚未初始化

能做什么：几乎不能做任何事（很少用）

2. **created**
    

时机：data、props、methods、computed、watch 都已可用，但 DOM 还未生成

典型用途：

- 发起后端 API 请求、初始化非 DOM 相关的数据
    

```JavaScript
created() {
  axios.get('/api/users').then(res => {
    this.users = res.data;
  });
}
```

3. beforeMount
    

时机：模板编译完成（生成 render function 或虚拟 DOM），但尚未挂载到页面

能访问：this.$el 还是 undefined

用途：调试用，一般不用

4. **mounted**
    

时机：Vue 实例已挂载到 DOM，this.$el 可用

典型用途：

- 操作 DOM（如初始化第三方库：ECharts、Swiper）
    
- 启动定时器（setInterval）
    
- 获取元素尺寸/位置
    

> ⚠️ 注意：子组件的 mounted 会在父组件之后触发（父子顺序：父 created → 子 created → 子 mounted → 父 mounted）

5. beforeUpdate
    

时机：数据变化后，DOM 重渲染前

用途：

在更新前访问现有 DOM（比如保存滚动位置）

性能优化（避免不必要的计算）

6. updated
    

时机：DOM 已根据新数据重新渲染完成

典型用途：

操作更新后的 DOM（如重新计算布局）

第三方库重绘（需谨慎！可能引发无限循环）

⚠️ 警告：不要在此钩子中修改 data，否则会触发新一轮更新！

7. **beforeDestroy**
    

时机：实例销毁前，此时实例仍然完全可用

典型用途（非常重要！）：

- 清理定时器（clearInterval）
    
- 取消网络请求（axios cancel token）
    
- 解绑全局事件监听（如 window.addEventListener）
    
- 销毁第三方实例（如 ECharts 的 dispose()）
    

8. destroyed
    

时机：Vue 实例已被销毁

状态：所有指令被解绑，所有事件监听器被移除，所有子实例被销毁

用途：极少使用，仅用于最终日志或埋点


## 组件化编程

🧱 组件的本质：可复用的 UI 单元：模板（HTML） + 逻辑 （JavaScript） + 样式 （CSS）。
在 Vue 中，组件是一个独立、可复用的代码单元，它封装了模板、逻辑、和样式，然后基于“自定义 HTML 标签”的方式在多个地方使用。在Vue中，一个组件通常是一个`.vue` 文件，推荐`.vue`文件名使用**PascalCase风格** ，且首字母大写。
> 核心原因：文件名 ≈ 组件构造器名 ≈ 类名，工具链更好支持、生态共识。

```vue
<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <img :src="user.avatar" />
    <h3>{{ user.name }}</h3>
    <button @click="handleEdit">编辑</button>
  </div>
</template>

<script>
// 导出组件配置对象
export default {
// 组件名，最好直接和文件名保持一致
  name: 'UserProfile',
  props: ['user'],
  methods: {
    handleEdit() {
      this.$emit('edit', this.user.id)
    }
  }
}
</script>

<style scoped>
.user-profile {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

下面是一个最小vue项目结构：

![](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=MjBkNjE0MjNkYjE2OTNhMTYzZTczN2M1MjkzN2RkOGJfN3ZDZENyTEVjTU9vbGR4RWRyMENsTEc0VzFxTzFNMGlfVG9rZW46WGxxVWIwaWxtb3JvWlR4ZmwyZ2NmNnl2bmZiXzE3NjgxMzg5ODA6MTc2ODE0MjU4MF9WNA)

1. App.vue 应用组件元，引入其它组件
    
2. index.html，应用首页，提供容器
    
3. main.js，引入App.vue组件，创建vue实例，挂载index.html中的容器
    

但是浏览器无法解析.vue文件，所以需要通过脚手架进行编译。

style中的scoped属性

如果不添加属性，Vue默认会把每个组件的样式合并成一个作为全局的，但是这样这样容易名字冲突，所以一般会在每个组件的style添加 scoped属性，这样就不会合并，每个组件的style就是独立的，但是在App.vue中一般不会使用这个属性，因为这里的App.vue里的style一般用于全局的。

1. 写法：```<style scoped>
 nextTick

1. 语法：```this.$nextTick(回调函数)```
2. 作用：在下一次 DOM 更新结束后执行其指定的回调。
3. 什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，要在nextTick所指定的回调函数中执行。

### 基本步骤
1. 定义组件：此时不需要和Vue实例对象关联
2. 注册组件：在Vue实例对象中注册组件，使组件和Vue实例对象关联起来
3. 使用组件(写组件标签)
下面通过非单文件的方式来演示：

<div class="highlight-block highlight-tip">1. 定义组件  </div>
1. 使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options几乎一样，
```JavaScript
const school = Vue.extend({
    template:`
        <div class="demo">
            <h2>学校名称：{{schoolName}}</h2>
            <h2>学校地址：{{address}}</h2>
            <button @click="showName">点我提示学校名</button>   
        </div>
    `,
    data(){
        return {
            schoolName:'尚硅谷',
            address:'北京昌平'
        }
    },
    methods: {
        showName(){
            alert(this.schoolName)
        }
    },
})
```

> const school = Vue.extend(options) 可简写为：const school = options
> 
> ```JavaScript
> // Vue 源码简化版
> Vue.component = function (name, definition) {
>   if (typeof definition === 'object') {
>     // 如果传入的是对象，自动 extend
>     definition = Vue.extend(definition)
>   }
>   // 注册 definition（此时已是构造器）
> }
> ```

2. el不用写， 最终所有的组件都要经过一个Vue实例的管理，由Vue实例中的el决定服务哪个容器。`Vue实例 ----> App.vue 组件，App.vue---->其它组件`
3. **data必须写成函数形式**，然后返回一个数据对象。 因为这个组件会在多个地方使用，如果直接写成对象的形式，则每个使用到这个组件的地方都持有这个数据对象的引用，当一个地方对这个数据对象进行修改时则会影响其它地方。所以写成函数，不同地方使用该组件时，都直接返回一个全新的数据对象，互不影响。
    

<div class="highlight-block highlight-tip">  注册组件</div>

1. 局部注册：靠new Vue的时候传入components选项
2. 全局注册：靠Vue.component('组件名',组件)
    

```Java
//全局注册组件
Vue.component('hello',hello)

//创建vm时通过 components配置项注册
new Vue({
    el:'#root',
    data:{
        msg:'你好啊！'
    },
    //注册组件（局部注册）
    components:{
        school,
        student
    }
})
```

<div class="highlight-block highlight-tip">  使用组件</div> 

注册好组件之后就可以在对应的容器中通过组件标签的方式去使用这个组件。

```XML
<!-- 准备好一个容器-->
<div id="root">
    <!-- 使用组件，编写组件标签 -->
    <school></school>
</div>
```

关于组件的标签名注意事项：组件的标签名就是我们在注册时传入的name，但是如果我们传入的name包含大写的话，由于HTML是大小写不敏感的，在解析时大写都会被转成小写，所以**Vue为了统一，内部会自动把 PascalCase 自动转为 kebab-case 作为组件的“正式标识名”**，所以在模板中必须使用模板中必须使用` <user-profile-card>` 才能匹配。

```JavaScript
// 你写的
components: {
  UserProfileCard: MyComponent
}

// Vue 内部实际注册的名称是：
'user-profile-card'

```

在纯 HTML 模板中（如直接写在 `index.html` 里），必须使用 `kebab-case`。

```XML
<!--  index.html 中 -->
<div id="app">
 <!-- ❌ 不工作！ -->
  <UserProfileCard></UserProfileCard> 
  <!-- ✅ 必须这样写 -->
  <user-profile-card></user-profile-card> 
</div>
```

但是在 **.vue 单文件组件**（SFC）中可以直接使用PascalCase，且推荐这么使用（更贴近 JS 变量命名，IDE 支持好），因为.vue文件由Vue自身去编译，不由浏览器直接编译，Vue会把`<UserProfileCard> `转成了正确的引用
```HTML
<!-- App.vue -->
<template>
  <UserProfileCard /> <!-- ✅ 可以！ -->
</template>

<script>
import UserProfileCard from './UserProfileCard.vue'
export default {
  components: { UserProfileCard }
}
</script>
```

组件实例

当通过Vue.extend(option)去定义一个组件时，会返回一个名为VueComponent的构造函数，在在其它地方通过组件标签的方式去使用这个组件，Vue在解析时会帮我们执行：new VueComponent(options)，创建对应的组件实例对象。

```JavaScript
// 简化版伪代码
Vue.extend = function (extendOptions) {
  // 通过内部函数的形式：
  // ← 外部每次调用每次都返回一个全新的函数（构造器）
  const Sub = function VueComponent(options) {
    this._init(options)
  }
  Sub.prototype = Object.create(this.prototype)
  Sub.prototype.constructor = Sub

  // 关键：把传入的 options “合并”到 Sub 的静态属性上
  Sub.options = mergeOptions(Vue.options, extendOptions)

  return Sub 
}
```

> Vue.extend() 每次返回一个全新的构造器，是为了确保每个组件实例拥有独立的选项配置（尤其是 data 函数）、生命周期钩子和响应式上下文，从而实现组件间的**完全隔离**，避免状态污染。

关于this指向：

1. 组件配置中：data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【VueComponent实例对象】。
    
2. new Vue(options)配置中：data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【Vue实例对象】。
    

组件实例和Vue实例之间的关系：Vue 实例对象（根实例）是整个应用的“容器”和“根节点”，**所有组件实例对象都是它的直接或间接子实例**，形成一棵以根实例为顶点的组件树。

```JavaScript
[ Vue 实例（根） ]          ← 通过 new Vue() 创建
        ↓
[ App.vue 组件实例 ]
        ↓
[ Layout.vue 组件实例 ]
      ↙     ↘
[Header]   [MainContent]    ← 每个都是独立的组件实例对象
```

通过`VueComponent.prototype.`**`proto`** `=== Vue.prototype`，让组件实例对象（vc）可以访问到 Vue原型上的属性、方法。

### 全局
在全局Vue实例身上常用的一些配置。

####  插件

Vue中的插件一般是给vue**全局添加**一些可以用的方法、指令，对象啥的，然后在组件中可以直接使用。
1. 定义插件
本质：包含install方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据。

```JavaScript
// plugins/myPlugin.js
export default {
  install(Vue, options) {
    // 1. 添加全局方法
    Vue.prototype.$greet = (name) => {
      alert(`Hello, ${name}!`)
    }

    // 2. 注册全局组件
    Vue.component('MyAlert', {
      template: '<div class="alert">⚠️ {{ message }}</div>',
      props: ['message']
    })

    // 3. 注册全局指令
    Vue.directive('focus', {
      inserted(el) {
        el.focus()
      }
    })

    // 4. 使用传入选项
    console.log('Plugin options:', options)
  }
}
```

2. 在main.js中使用插件
通过`Vue.use(plugin)`使用插件后，Vue会调用plugin的install方法

```JavaScript
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//引入插件
import plugins from './plugins'
//关闭Vue的生产提示
Vue.config.productionTip = false

//应用（使用）插件
Vue.use(plugins,1,2,3)
//创建vm
new Vue({
    el:'#app',
    render: h => h(App)
})
```


#### mixin(混入)

1. 功能：可以把多个组件共用的配置提取成一个混入对象

2. 使用方式：

    第一步定义混合：

    ```
    {
        data(){....},
        methods:{....}
        ....
    }
    ```

    第二步使用混入：

    ​	全局混入：```Vue.mixin(xxx)```
    ​	局部混入：```mixins:['xxx']	


#### 代理


通过代理在前端解决跨域问题，但是只是在开发中生效，直接通过后端解决才是实际常用的办法。

方法一

​	在vue.config.js中添加如下配置：

```js
devServer:{
  proxy:"http://localhost:5000"
}
```

说明：

1. 优点：配置简单，请求资源时直接发给前端（8080）即可。
2. 缺点：不能配置多个代理，不能灵活的控制请求是否走代理。
3. 工作方式：若按照上述配置代理，当请求了前端不存在的资源时，那么该请求会转发给服务器 （优先匹配前端资源）

---

方法二

​	编写vue.config.js配置具体代理规则：

```js
module.exports = {
	devServer: {
      proxy: {
      '/api1': {// 匹配所有以 '/api1'开头的请求路径
        target: 'http://localhost:5000',// 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: {'^/api1': ''}
      },
      '/api2': {// 匹配所有以 '/api2'开头的请求路径
        target: 'http://localhost:5001',// 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: {'^/api2': ''}
      }
    }
  }
}
/*
   changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
   changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8080
   changeOrigin默认值为true
*/
```

说明：

1. 优点：可以配置多个代理，且可以灵活的控制请求是否走代理。
2. 缺点：配置略微繁琐，请求资源时必须加前缀。


### 组件的通信
#### ref

1. 被用来给元素或子组件注册引用信息（id的替代者）
2. 应用在html标签上获取的是真实DOM元素，应用在组件标签上是组件实例对象（vc）
3. 使用方式：
    1. 打标识：```<h1 ref="xxx">.....</h1>``` 或 ```<School ref="xxx"></School>```
    2. 获取：```this.$refs.xxx```


#### props

1. 功能：让组件接收外部传过来的数据

2. 传递数据：```<Demo name="xxx"/>```

3. 接收数据：

    1. 第一种方式（只接收）：```props:['name'] ```

    2. 第二种方式（限制类型）：```props:{name:String}```

    3. 第三种方式（限制类型、限制必要性、指定默认值）：

        ```js
        props:{
        	name:{
        	type:String, //类型
        	required:true, //必要性
        	default:'老王' //默认值
        	}
        }
        ```

    > 备注：props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制props的内容到data中一份，然后去修改data中的数据。


#### 插槽

1. 作用：让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方式，适用于 <strong style="color:red">父组件 ===> 子组件</strong> 。

2. 分类：默认插槽、具名插槽、作用域插槽

3. 使用方式：

   4. 默认插槽：

      ```vue
      父组件中：
              <Category>
                 <div>html结构1</div>
              </Category>
      子组件中：
              <template>
                  <div>
                     <!-- 定义插槽 -->
                     <slot>插槽默认内容...</slot>
                  </div>
              </template>
      ```

   5. 具名插槽：

      ```vue
      父组件中：
              <Category>
                  <template slot="center">
                    <div>html结构1</div>
                  </template>
      
                  <template v-slot:footer>
                     <div>html结构2</div>
                  </template>
              </Category>
      子组件中：
              <template>
                  <div>
                     <!-- 定义插槽 -->
                     <slot name="center">插槽默认内容...</slot>
                     <slot name="footer">插槽默认内容...</slot>
                  </div>
              </template>
      ```

   6. 作用域插槽：

      1. 理解：<span style="color:red">数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。</span>（games数据在Category组件中，但使用数据所遍历出来的结构由App组件决定）

      2. 具体编码：
父组件：
```vue
<Category>
	<template scope="scopeData">
		<!-- 生成的是ul列表 -->
		<ul>
			<li v-for="g in scopeData.games" :key="g">{{g}}</li>
		</ul>
	</template>
</Category>

<Category>
	<template slot-scope="scopeData">
		<!-- 生成的是h4标题 -->
		<h4 v-for="g in scopeData.games" :key="g">{{g}}</h4>
	 {{scopeData.msg}}
	</template>
</Category>
```
子组件：         
```vue
<template>
 <div>
	 <slot :games="games", msg="hello"></slot>
 </div>
</template>


<script>
 export default {
	 name:'Category',
	 props:['title'],
	 //数据在子组件自身
	 data() {
		 return {
			 games:['红色警戒','穿越火线','劲舞团','超级玛丽']
		 }
	 },
 }
</script>
```
                 

   


#### pubsub
消息订阅与发布：一种组件间通信的方式，适用于<span style="color:red">任意组件间通信</span>。

使用步骤：
1. 安装pubsub：```npm i pubsub-js```
2. 引入: ```import pubsub from 'pubsub-js'```
3. 接收数据：A组件想接收数据，则在A组件中订阅消息，订阅的<span style="color:red">回调留在A组件自身。</span>

      ```js
      methods(){
        demo(data){......}
      }
      ......
      mounted() {
        this.pid = pubsub.subscribe('xxx',this.demo) //订阅消息
      }
      ```

   3. 提供数据：```pubsub.publish('xxx',数据)```

   4. 最好在beforeDestroy钩子中，用```PubSub.unsubscribe(pid)```去<span style="color:red">取消订阅。</span>


### Vuex
用于实现**集中式状态（数据）管理**的一个 Vue 插件，也是一种组件间通信的方式，如果一份数据需要在多个组件中共享使用，放在任何一个组件其实都不太方便。
> 在新版本Vue3中已经不推荐使用Vuex了，推荐使用Pinia
<div class="highlight-block highlight-tip"> 在项目中引入Vuex </div>

1. 在项目中下载Vuex，注意查看当前项目是Vue2项目还是Vue3项目，对应的Vuex默认版本不一致，需要的时候再查吧。
2. 在 `src/store/index.js`创建并暴露 `Store`对象，路径无所谓，官方写法。
```javaScript
//引入Vue核心库
   import Vue from 'vue'
   //引入Vuex
   import Vuex from 'vuex'
   //应用Vuex插件
   Vue.use(Vuex)
   
   //准备actions对象——响应组件中用户的动作
   const actions = {}
   //准备mutations对象——修改state中的数据
   const mutations = {}
   //准备state对象——保存具体的数据
   const state = {}
   
   //创建并暴露store
   export default new Vuex.Store({
   	actions,
   	mutations,
   	state
   })
```

3.  在```main.js```中创建vm时传入```store```配置项

   ```js
   ......
   //引入store
   import store from './store'
   ......
   
   //创建vm
   new Vue({
   	el:'#app',
   	render: h => h(App),
   	store
   })
   ```

	至此，Vuex 会自动将 `store` 挂载到 根实例及其所有子组件 的` $store` 属性上。那么任何组件中，都可以：`this.$store.xxx`去调用相关的方法，或者在模板中 `$store.xxx`


#### Store对象配置

<div class="highlight-block highlight-tip">基础配置：actions、mutation属性配置  </div>

1. 初始化数据、配置```actions```、配置```mutations```，等属性

   ```js
   //引入Vue核心库
   import Vue from 'vue'
   //引入Vuex
   import Vuex from 'vuex'
   //引用Vuex
   Vue.use(Vuex)
   
   const actions = {
       //响应组件中加的动作
   	jia(context,value){
   		// console.log('actions中的jia被调用了',miniStore,value)
   		context.commit('JIA',value)
   	},
   }
   
   const mutations = {
       //执行加
   	JIA(state,value){
   		// console.log('mutations中的JIA被调用了',state,value)
   		state.sum += value
   	}
   }
   
   //初始化数据
   const state = {
      sum:0
   }
   
   //创建并暴露store
   export default new Vuex.Store({
   	actions,
   	mutations,
   	state,
   })
   ```

2. 组件中读取vuex中的数据：```$store.state.sum```

3. 组件中修改vuex中的数据：```$store.dispatch('action中的方法名',数据)``` 或 ```$store.commit('mutations中的方法名',数据)```

   >  备注：若没有网络请求或其他业务逻辑，组件中也可以越过actions，即不写```dispatch```，直接编写```commit```
<div class="highlight-block highlight-tip"> getters 属性配置 </div>
> 通过给store对象再配置一个getters属性来获取数据。应用场景：当state中的数据需要经过加工且在多个组件都有同样的需求时，可以在getters中统一配置。

1. 在```store.js```中追加```getters```配置

   ```js
   ......
   
   const getters = {
   	bigSum(state){
   		return state.sum * 10
   	}
   }
   
   //创建并暴露store
   export default new Vuex.Store({
   	......
   	getters
   })
   ```

2. 组件中读取数据：```$store.getters.bigSum```



#### 其它辅助函数使用
    Vuex额外提供的辅助函数，用于简化对 `store`中数据的读取、方法的调用，让组件代码更简洁、可读性更强。

1. mapState方法：简化对 `state`中数据的读取，mapState()返回一个对象，对象中的key是我们传入的属性名，值是一个函数，函数的逻辑是 `$store.state.xxx`

   ```js
   computed: {
       //借助mapState生成计算属性：sum、school、subject（对象写法）
        ...mapState({sum:'sum',school:'school',subject:'subject'}),
            
       //借助mapState生成计算属性：sum、school、subject（数组写法）
       ...mapState(['sum','school','subject']),
   },
   ```

2. mapGetters方法：同 `mapState`，简化从 `getters`中读取属性

   ```js
   computed: {
       //借助mapGetters生成计算属性：bigSum（对象写法）
       ...mapGetters({bigSum:'bigSum'}),
   
       //借助mapGetters生成计算属性：bigSum（数组写法）
       ...mapGetters(['bigSum'])
   },
   ```

3. <strong>mapActions方法：</strong>用于帮助我们生成与```actions```对话的方法，即：包含```$store.dispatch(xxx)```的函数

   ```js
   methods:{
       //靠mapActions生成：incrementOdd、incrementWait（对象形式）
       ...mapActions({incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
   
       //靠mapActions生成：incrementOdd、incrementWait（数组形式）
       ...mapActions(['jiaOdd','jiaWait'])
   }
   ```

4. <strong>mapMutations方法：</strong>用于帮助我们生成与```mutations```对话的方法，即：包含```$store.commit(xxx)```的函数

   ```js
   methods:{
       //靠mapActions生成：increment、decrement（对象形式）
       ...mapMutations({increment:'JIA',decrement:'JIAN'}),
       
       //靠mapMutations生成：JIA、JIAN（对象形式）
       ...mapMutations(['JIA','JIAN']),
   }
   ```

> 备注：mapActions与mapMutations使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。



#### 模块化+命名空间

	目前我们的状态，只要有共享的数据，都直接放在 `store`里，如果数据越来越多，会发现 `store`越来越大，不好维护和管理，于是有了模块化，对 `store`进行分类，方便维护。

```
src/store/
├── index.js  # 根 store               
├── count.js # count模块配置
├── person.js # person配置
├── modules/
│   ├── user.js             # 用户相关
│   ├── cart.js             # 购物车
│   ├── products.js         # 商品列表
│   └── notifications.js    # 消息通知

```

1. `count.js`配置自己的store属性

```JavaScript
//求和相关的配置
export default {
    namespaced:true,
    actions:{
        jiaOdd(context,value){
            console.log('actions中的jiaOdd被调用了')
            if(context.state.sum % 2){
                context.commit('JIA',value)
            }
        },
        jiaWait(context,value){
            console.log('actions中的jiaWait被调用了')
            setTimeout(()=>{
                context.commit('JIA',value)
            },500)
        }
    },
    mutations:{
        JIA(state,value){
            console.log('mutations中的JIA被调用了')
            state.sum += value
        },
        JIAN(state,value){
            console.log('mutations中的JIAN被调用了')
            state.sum -= value
        },
    },
    state:{
        sum:0, //当前的和
        school:'尚硅谷',
        subject:'前端',
    },
    getters:{
        bigSum(state){
            return state.sum*10
        }
    },
}
```

2. `person.js` 配置
```JavaScript
//人员管理相关的配置
import axios from 'axios'
import { nanoid } from 'nanoid'
export default {
    namespaced:true,
    actions:{
        addPersonWang(context,value){
            if(value.name.indexOf('王') === 0){
                context.commit('ADD_PERSON',value)
            }else{
                alert('添加的人必须姓王！')
            }
        },
        addPersonServer(context){
            axios.get('https://api.uixsj.cn/hitokoto/get?type=social').then(
                response => {
                    context.commit('ADD_PERSON',{id:nanoid(),name:response.data})
                },
                error => {
                    alert(error.message)
                }
            )
        }
    },
    mutations:{
        ADD_PERSON(state,value){
            console.log('mutations中的ADD_PERSON被调用了')
            state.personList.unshift(value)
        }
    },
    state:{
        personList:[
            {id:'001',name:'张三'}
        ]
    },
    getters:{
        firstPersonName(state){
            return state.personList[0].name
        }
    },
}
```

3.  `index.js`配置

```JavaScript
//该文件用于创建Vuex中最为核心的store
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
import countOptions from './count'
import personOptions from './person'
//应用Vuex插件
Vue.use(Vuex)

//创建并暴露store
export default new Vuex.Store({
    modules:{
        countAbout:countOptions,
        personAbout:personOptions
    }
})
```


4. 开启命名空间后，组件中读取state数据：

   ```js
   //方式一：自己直接读取
   this.$store.state.personAbout.list
   //方式二：借助mapState读取：
   ...mapState('countAbout',['sum','school','subject']),
   ```

5. 开启命名空间后，组件中读取getters数据：

   ```js
   //方式一：自己直接读取
   this.$store.getters['personAbout/firstPersonName']
   //方式二：借助mapGetters读取：
   ...mapGetters('countAbout',['bigSum'])
   ```

6. 开启命名空间后，组件中调用dispatch

   ```js
   //方式一：自己直接dispatch
   this.$store.dispatch('personAbout/addPersonWang',person)
   //方式二：借助mapActions：
   ...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
   ```

7. 开启命名空间后，组件中调用commit

   ```js
   //方式一：自己直接commit
   this.$store.commit('personAbout/ADD_PERSON',person)
   //方式二：借助mapMutations：
   ...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'}),
   ```


### 路由
 一个路由（route）就是一组映**射关系（key - value）**，多个路由通过路由器（router）进行管理。
路由分类
1. 后端路由：
	1. 理解：value 是 function, 用于处理客户端提交的请求。
	2. 工作过程：服务器接收到一个请求时, 根据请求路径找到匹配的函数来处理请求, 返回响应数据。
2. 前端路由：
	1. 理解：key是路径，value 是 component，用于展示页面内容。
	2. 工作过程：当浏览器的路径改变时, 对应的组件就会显示。
3. 下载Vue中的路由插件：vue-router，命令：```npm i vue-router```

```Bash
src/
├── views/          # 页面级组件（路由直接渲染的）
│   ├── Home.vue
│   ├── About.vue
│   └── User.vue
├── components/     # 普通组件（被 views 使用）
├── router/
│   └── index.js    # 路由配置
└── App.vue
```



#### 快速入门

应用使用路由步骤：
1. 创建路由对象配置路由项
2. 入口文件注册路由配置对象
3. `App.vue` 中使用路由：
	1. 导航区
	2. 内容展示区
----


1. 创建路由对象，传入路由配置项: 在`/router/index.js` 编写

   ```js
   //引入VueRouter
   import VueRouter from 'vue-router'
   //引入Luyou 组件
   import About from '../components/About'
   import Home from '../components/Home'
   
   //创建router实例对象，去管理一组一组的路由规则
   const router = new VueRouter({
   	routes:[
   		{
   			path:'/about',
   			component:About
   		},
   		{
   			path:'/home',
   			component:Home
   		}
   	]
   })
   
   //暴露router
   export default router
   ```
2. 在入口文件 `main.js` 使用路由插件，然后在Vue实例中注册路由对象

```JavaScript
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'

//关闭Vue的生产提示
Vue.config.productionTip = false
//应用插件
Vue.use(VueRouter)

//创建vm
new Vue({
    el:'#app',
    render: h => h(App),
    router:router
})
```

3. 应用
```vue
<!-- App.vue -->
<template>
  <div id="app">
    <!-- 导航菜单：点击导航区的导航项，内容展示区的组件自动切换 -->
    <nav>
      <router-link class="list-group-item" active-class="active" to="/about">About</router-link>

	 <router-link class="list-group-item" active-class="active" to="/home">Home</router-link>
    </nav>

    <!-- 内容展示区：匹配的组件会在这里渲染 -->
    <router-view />
  </div>
</template>
```






1. 路由组件通常存放在```pages```文件夹，一般组件通常存放在```components```文件夹。
2. 通过切换，“隐藏”了的路由组件，默认是被销毁掉的，需要的时候再去挂载。
3. 每个组件都有自己的```$route```属性，里面存储着自己的路由信息。
4. 整个应用只有一个router，可以通过组件的```$router```属性获取到。

#### 路由配置
一个系统的常见路由对象配置包含下面：
1. 基本路由的跳转
2. 多级路由
3. 路由跳转传参
4. 路由守卫（拦截）

```JavaScript
import { createRouter, createWebHistory } from 'vue-router' // Vue 3 写法
// import VueRouter from 'vue-router' // Vue 2 写法

// 懒加载组件（推荐用于生产环境）
const Login = () => import('@/views/auth/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const UserList = () => import('@/views/users/UserList.vue')
const UserProfile = () => import('@/views/users/UserProfile.vue')
const NotFound = () => import('@/views/errors/NotFound.vue')

const routes = [
  // ========== 1. 公共路由（无需登录）==========
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: '登录', 
      requiresAuth: false 
    }
  },

  // ========== 2. 主布局路由（嵌套路由）==========
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'), // 布局组件（含侧边栏、顶部导航）
    meta: { requiresAuth: true }, // 所有子路由都需登录
    children: [
      // 首页
      {
        path: '', // 空路径 → 匹配 /（根路径）
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '仪表盘' }
      },

      // 用户列表（带权限控制）
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: { 
          title: '用户管理',
          requiresAuth: true,
          roles: ['admin'] // 自定义元信息：仅 admin 可访问
        },
        beforeEnter: (to, from, next) => {
          // 路由独享守卫：检查角色
          const userRole = localStorage.getItem('role')
          if (to.meta.roles.includes(userRole)) {
            next()
          } else {
            next('/403') // 无权限跳转
          }
        }
      },

      // 用户详情（动态路由 + props 解耦）
      {
        path: 'user/:id(\\d+)', // 正则限制 id 为数字
        name: 'UserProfile',
        component: UserProfile,
        props: true, // 将 params.id 作为 prop 传给组件
        meta: { title: '用户详情' }
      }
    ]
  },

  // ========== 3. 重定向与别名 ==========
  {
    path: '/home', // 别名路径
    redirect: '/'   // 重定向到首页
  },

  // ========== 4. 通配符路由（404）==========
  {
    path: '/:pathMatch(.*)*', // Vue Router 4 写法（匹配任意路径）
    // path: '*',              // Vue Router 3 写法
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ========== 全局前置守卫（统一权限校验）==========
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要登录但未登录 → 跳转登录页，并记录原路径
    next({
      name: 'Login',
      query: { redirect: to.fullPath } // 用于登录后跳回
    })
  } else {
    next()
  }
})

// ========== 全局后置钩子（设置页面标题）==========
router.afterEach((to) => {
  document.title = to.meta.title || 'My Admin System'
})

export default router
```

##### 命名路由

1. 作用：可以简化路由的跳转。不配置的话，在导航项里配置 `to`属性的值是需要写全路径，配置了路由的 名字后，可以在 `to`里配置对应路由的名字

2. 如何使用

   3. 给路由命名：

      ```js
      {
      	path:'/demo',
      	component:Demo,
      	children:[
      		{
      			path:'test',
      			component:Test,
      			children:[
      				{
                      name:'hello' //给路由命名
      					path:'welcome',
      					component:Hello,
      				}
      			]
      		}
      	]
      }
      ```

   4. 简化跳转：

      ```vue
      <!--简化前，需要写完整的路径 -->
      <router-link to="/demo/test/welcome">跳转</router-link>
      
      <!--简化后，直接通过名字跳转 -->
      <router-link :to="{name:'hello'}">跳转</router-link>
      
      <!--简化写法配合传递参数 -->
      <router-link 
      	:to="{
      		name:'hello',
      		query:{
      		   id:666,
                  title:'你好'
      		}
      	}"
      >跳转</router-link>
      ```




##### 多级路由



实现以下效果：
- `/home/news`  跳转到 `News`组件
- `home/message` 跳转到 `Message`组件


1. 配置路由规则，使用children配置项：


   ```js
   routes:[
   	{
   		path:'/about',
   		component:About,
   	},
   	{
   		path:'/home',
   		component:Home,
   		children:[ //通过children配置子级路由
   			{
   				path:'news', //此处一定不要写：/news
   				component:News
   			},
   			{
   				path:'message',//此处一定不要写：/message
   				component:Message
   			}
   		]
   	}
   ]
   ```

2. 跳转（要写完整路径）：

   ```vue
   <router-link to="/home/news">News</router-link>
   ```




##### 路由的传参
应用场景：点击导航项目时，可以携带参数数据到对应路由的组件，然后在对应的路由组件里使用参数数据。
1. 在 `to`属性额外添加参数信息
2. 在目标路由组件里通过 `$route.params.xxx` 或者 `this.$route.params.xxx使用

<div class="highlight-block highlight-tip"> query格式参数</div>

1. 传递参数

   ```vue
   <!-- 跳转并携带query参数，to的字符串写法 -->
   <router-link :to="/home/message/detail?id=666&title=你好">跳转</router-link>
   				
   <!-- 跳转并携带query参数，to的对象写法 -->
   <router-link 
   	:to="{
   		path:'/home/message/detail',
   		query:{
   		   id:666,
           title:'你好'
   		}
   	}"
   >跳转</router-link>
   ```

2. 接收参数：

   ```js
   $route.query.id
   $route.query.title
   ```

<div class="highlight-block highlight-tip"> param格式参数</div>

1. `query`相比配置多一个步骤，需要先在路由配置声明接收params参数

   ```js
   {
   	path:'/home',
   	component:Home,
   	children:[
   		{
   			path:'news',
   			component:News
   		},
   		{
   			component:Message,
   			children:[
   				{
   					name:'xiangqing',
   					path:'detail/:id/:title', //使用占位符声明接收params参数
   					component:Detail
   				}
   			]
   		}
   	]
   }
   ```

2. 传递参数

   ```vue
   <!-- 跳转并携带params参数，to的字符串写法 -->
   <router-link :to="/home/message/detail/666/你好">跳转</router-link>
   				
   <!-- 跳转并携带params参数，to的对象写法 -->
   <router-link 
   	:to="{
   		name:'xiangqing',
   		params:{
   		   id:666,
         title:'你好'
   		}
   	}"
   >跳转</router-link>
   ```

   > 特别注意：路由携带params参数时，若使用to的对象写法，则不能使用path配置项，必须使用name配置！

3. 接收参数：

   ```js
   $route.params.id
   $route.params.title
   ```

<div class="highlight-block highlight-tip"> 路由的props配置 </div>

​	作用：让路由组件更方便的收到参数

```js
{
	name:'xiangqing',
	path:'detail/:id',
	component:Detail,

	//第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件
	// props:{a:900}

	//第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件
	// props:true
	
	//第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
	props(route){
		return {
			id:route.query.id,
			title:route.query.title
		}
	}
}
```




##### 编程式路由导航

1. 作用：不借助```<router-link> ```实现路由跳转，让路由跳转更加灵活

2. 具体编码：

   ```js
   //$router的两个API
   this.$router.push({
   	name:'xiangqing',
   		params:{
   			id:xxx,
   			title:xxx
   		}
   })
   
   this.$router.replace({
   	name:'xiangqing',
   		params:{
   			id:xxx,
   			title:xxx
   		}
   })
   this.$router.forward() //前进
   this.$router.back() //后退
   this.$router.go() //可前进也可后退
   ```

##### 缓存路由组件

1. 作用：当切换路由组件时，让不展示的路由组件保持挂载，不被销毁。这样之前客户输入的数据可以缓存下来

2. 具体编码：在目标路由组件展示那里添加 `inclued`属性

   ```vue
   <keep-alive include="News"> 
       <router-view></router-view>
   </keep-alive>
   ```






##### 路由守卫

在路由跳转之前添加一些拦截器，添加一些逻辑判断：放行？重定向？取消？

 📊 二、三大类路由守卫总览

| 类型         | 作用范围 | 典型用途             | 注册方式                                                                               |
| ---------- | ---- | ---------------- | ---------------------------------------------------------------------------------- |
| **全局守卫**   | 所有路由 | 全局权限校验、加载动画、埋点统计 | `router.beforeEach()`  <br>`router.afterEach()`                                    |
| **路由独享守卫** | 单个路由 | 特定页面权限（如仅管理员可访问） | 在路由配置中写 `beforeEnter`                                                              |
| **组件内守卫**  | 单个组件 | 组件级数据获取、离开确认     | 在组件选项中定义：  <br>`beforeRouteEnter`  <br>`beforeRouteUpdate`  <br>`beforeRouteLeave` |

1. 作用：对路由进行权限控制

2. 分类：全局守卫、独享守卫、组件内守卫

<div class="highlight-block highlight-tip">全局守卫 </div>
在所有路由跳转前/后触发
```JavaScript
   // router/index.js
// 所有路由切换之前调用，常鉴权
router.beforeEach((to, from, next) => {
  // to: 即将进入的路由对象
  // from: 当前所在路由对象
  // next: 必须调用！控制导航行为

  if (to.meta.requiresAuth && !isAuthenticated()) {
    // 需要登录但未登录 → 重定向到登录页
    next('/login')
  } else {
    // 放行
    next()
  }
})
   
//全局后置守卫：初始化时执行、每次路由切换后执行
router.afterEach((to,from)=>{
  console.log('afterEach',to,from)
  if(to.meta.title){ 
     document.title = to.meta.title //修改网页的title
  }else{
     document.title = 'vue_test'
  }
```

<div class="highlight-block highlight-tip">独享守卫 </div>
对路由组件单独设置，在进入目标组件时，添加拦截。只有前置，没有后置
```JavaScript
// router/index.js
const routes = [
  {
    path: '/admin',
    component: AdminPanel,
    beforeEnter: (to, from, next) => {
      // 只有管理员才能进
      if (user.role !== 'admin') {
        next('/forbidden')
      } else {
        next()
      }
    }
  }
]
```


<div class="highlight-block highlight-tip">组件内守卫 </div>
写在组件内部，

```JavaScript
<script>
export default {
  // 进入组件前（此时组件实例还未创建）
  beforeRouteEnter(to, from, next) {
    // 无法访问 this！
    // 但可通过回调访问组件实例
    next(vm => {
      // vm 是组件实例
      vm.fetchData()
    })
  },

  // 当前路由改变，但组件被复用时（如 /user/1 → /user/2）
  beforeRouteUpdate(to, from, next) {
    // 可以访问 this
    this.id = to.params.id
    this.fetchData()
    next()
  },

  // 离开组件前（常用于确认保存）
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('有未保存的内容，确定离开？')
      if (answer) {
        next()
      } else {
        next(false) // 取消导航
      }
    } else {
      next()
    }
  }
}
</script>
```





##### 两个新的生命周期钩子

作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。
1. 具体名字：
   2. ```activated```路由组件被激活时触发。
   3. ```deactivated```路由组件失活时触发。

##### 路由器的两种工作模式

1. 对于一个url来说，什么是hash值？—— #及其后面的内容就是hash值。
2. hash值不会包含在 HTTP 请求中，即：hash值不会带给服务器。
3. hash模式：
   4. 地址中永远带着#号，不美观 。
   5. 若以后将地址通过第三方手机app分享，若app校验严格，则地址会被标记为不合法。
   6. 兼容性较好。
7. history模式：
   8. 地址干净，美观 。
   9. 兼容性和hash模式相比略差。
   10. 应用部署上线时需要后端人员支持，解决刷新页面服务端404的问题。



#####  replace属性

1. 作用：控制路由跳转时操作浏览器历史记录的模式
2. 浏览器的历史记录有两种写入方式：分别为```push```和`replace`，`push`是追加历史记录，```replace```是替换当前记录。路由跳转时候默认为`push`
3. 如何开启```replace```模式：`<router-link replace .......>News</router-link>






## UI 组件库
提供页面常用的布局、按钮、输入框、下拉框等等在网页UI中布局里面常用的元素，并且把这些元素封装成组件（Vue/React)的形式提供给我们，我们只需要用这些组件，然后对应的结构，样式、交互就都有了。UI组件库分为2类：
- 移动端
- PC端