


当执行 
```java
UserService service = new UserService();
```

JVM 实际经历的是下面几个阶段：

```java
new UserService()

        │
        ▼
① 为对象分配内存（Heap）
        │
        ▼
② 对象已经存在
   this 已经指向该对象
        │
        ▼
③ 成员变量赋默认值
        │
        ▼
④ 执行实例变量初始化
   String name = "Tom";
        │
        ▼
⑤ 执行实例初始化块（如果有）
        │
        ▼
⑥ 调用父类构造方法
        │
        ▼
⑦ 执行当前类构造方法
        │
        ▼
⑧ 构造结束
        │
        ▼
⑨ 将引用赋给变量 service
```


核心点：在进入构造方法之前，对象已经创建了，this已经指向该对象，进入构造方法只是在做一些初始化工作。


[Java构造方法中传递this的原理与设计分析](file:///Users/ping/Documents/GPT/Java语言/Java构造方法中传递this的原理与设计分析.md)


[Java构造方法、本质职责与初始化时机](file:///Users/ping/Documents/GPT/Java语言/Java构造方法、本质职责与初始化时机.md)