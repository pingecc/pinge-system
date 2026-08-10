Java虚拟机不知道Java编程语言，只知道特定的二进制格式，即 class 文件格式， class 文件 包含Java虚拟机指令（或字节码）和符号表，以及其他辅助信息。


![[Pasted image 20260319191001.png]]

我们编写的`.java` 源文件被 `javac编译器`编译成 `.class`文件交给 JVM 去解释执行，主要是了解：
- JVM对这个`.class` 文件的各种折腾（内部结构、执行方式、垃圾回收、本地调用等）
- JVM 有关问题的排查和优化：内存溢出问题、GC问题




# 关于类加载

### 类加载的基本过程
理解`.class` 文件被JVM加载进内存时做了哪些事情。
那什么时候触发类加载？以下情况会触发 初始化（从而触发加载+链接）：简单来说只要用到了对应类就会触发加载： new 创建对象；访问 static 字段或方法（除了 static final 常量） 反射调用`（Class.forName("...")）`;启动类（main 方法所在类）

1. 加载
类加载指的是JVM把`.class`文件加载到内存进行解析，然后会把类的结构信息**在方法区里形成对应的内存结构对象**（如 HotSpot的 `InstanceKlass`、`Method`、`ConstantPool` 等 C++ 对象），同时会在**Java堆中创建 `java.lang.Class`对象**，这个加载过程由 类加载器完成的。

后续步骤包含：链接、初始化

2. 链接：各种安全验证；为静态变量分配内存，设置初始值；将静态方法的符号引用转为直接引用（可以理解为在类加载这一步，静态方法已经绑定到了方法区中具体方法的指针，也即地址已经绑定了）

3. 初始化：执行 `static {}`



### 了解类加载器

类加载器（ClassLoader)就是用来加载 `.class`的。然后采用了 双亲委派模型（Parent Delegation Model），那什么是所谓的双亲委派模型呢？其实就是JVM内部有三个类加载，每个类加载器会加载指定路径的类，并且这三个类加载器之间存在继承关系，然后在加载一个类时会先交给自己的父类加载，如果父加载器无法完成时，自己才尝试加载。

| 类加载器                    | 加载路径                  | 加载内容                              | 父加载器      |
| ----------------------- | --------------------- | --------------------------------- | --------- |
| Bootstrap ClassLoader   | `<JAVA_HOME>/lib`     | 核心类（`java.lang.*`, `java.util.*`） | 无（C++ 实现） |
| Extension ClassLoader   | `<JAVA_HOME>/lib/ext` | 扩展类（如加密、国际化）                      | Bootstrap |
| Application ClassLoader | `-classpath` 或 `-cp`  | 应用代码（你写的类）                        | Extension |

1. **为什么类加载设计成双亲委派？**

主要是为了安全性，防止Java源码库中的类被外部用户同名的类重新加载覆盖。
```Java
// 你写了一个 java.lang.String 类
package java.lang;
public class String { ... }
```
当你运行程序，Application ClassLoader 想加载 java.lang.String，它先问父加载器（Extension），再问 Bootstrap，Bootstrap 发现 rt.jar 里已有 String，直接加载，你写的 String 根本不会被加载！

2. 自定义 ClassLoader（了解即可）
用于热部署、插件系统、加密 class 文件等场景；继承 java.lang.ClassLoader，重写 findClass()；仍建议遵守双亲委派，除非有特殊需求（如 OSGi）


### 关于 java.lang.Class 对象

<div class="highlight-block highlight-tip"> 在加载类时，为什么需要分别在方法区存放对应类的结构信息，然后在Java堆中创建对应的java.lang.class 对象呢？</div>
1. 方法区（Metaspace）：存放“类的结构信息”信息是静态的、只读的、结构化的，属于类的元数据（Metadata）。**之所以单独在方法区里存一份，是避免每次创建对象都要重复存储完整的字段/方法/字节码** 。
以 HotSpot 为例，每个类在 Metaspace 中对应一个 InstanceKlass（C++ 对象）

| 内容                            | 说明                                              |
| ----------------------------- | ----------------------------------------------- |
| 类基本信息                         | 全限定名、访问标志（public/final 等）、父类、接口列表               |
| 字段信息（Field Info）              | 字段名、类型、**偏移量（offset）**、访问标志                     |
| 方法信息（Method Info）             | 方法名、描述符、字节码、异常表、JIT 编译后的**本地代码地址**              |
| 运行时常量池（Runtime Constant Pool） | 字面量（如 `"hello"`）、符号引用（如 `com/MyClass.myMethod`） |
| **虚方法表**（vtable）              | 实例方法的指针数组，支持多态调用                                |
| **接口方法表**（itable）             | 接口方法到实现的映射                                      |
| 静态变量（static fields）           | 注意：值存在方法区（JDK8+ 在 Metaspace）                    |
| 类加载器引用                        | 指向加载该类的 `ClassLoader` 对象（堆中）                    |
1. 在Java堆中创建 `java.lang.Class`**对象它本身也是一个普通的Java对象**的，当通过 `Class<User> class = User.class`，拿到的就是当初在加载User类时创建的对应`Class<user>` 对象，和普通Java对象不同的地方在于**对象内部持有一个 native 字段（在 HotSpot 中称为 klass），该字段是一个指针，直接指向方法区（Metaspace）中对应类型的 InstanceKlass 元数据结构。**， 这样我就可以直接基于 `Class<User> userClass`对象本身去操作 `User` 这个类型，比如调用 User.class.getName()，会通过这个指针去 Metaspace 取对应的元信息，为反射、getClass()、instanceof 等操作提高支持。 让 Java 代码能以面向对象的方式操作“类型”本身（Type as Object），类型本身可以被程序操作、传递、查询。
```Java
[ Java 堆 ]                     [ 方法区 (Metaspace) ]
┌──────────────┐                ┌──────────────────────┐
│ Class<User>  │───(klass)───→  │ InstanceKlass        │
│              │                │ - fields             │
│              │                │ - methods            │
│              │                │ - vtable             │
└──────────────┘                │ - constant pool      │
                                └──────────────────────┘
```

<div class="highlight-block highlight-tip">普通Java对象和java.lang.Class 对象与方法区中的类元数据结构对象之间的关系</div>
首先，每个Java对象包括java.lang.Class对象都有一个Klass Pointer， 直接指向方法区（ Metaspace ）中自身对应类型的那个类结构对象（ InstanceKlass），而对于java.lang.Class 对象，它内部还有一个 kclas指针，指向对应类型在方法区中的类结构对象(InstanceKClass)，比如对于`Class<User>`， 它内部的kclass指向User类的InstanceKlass，当然它自己的 Klass Pointer 指向 `java.lang.Class` 的 `InstanceKlass`
```Java
┌───────────────────────┐
│   对象头（Object Header） │
│  ┌─────────────────┐  │
│  │ Mark Word       │  │ ← 锁、GC、hashcode
│  ├─────────────────┤  │
│  │ Klass Pointer   │──┼──→ 指向 Metaspace 的 InstanceKlass
│  └─────────────────┘  │
├───────────────────────┤
│   实例字段（name, age...）│ ← 按方法区计算的偏移量排列
└───────────────────────┘
```


### 理解为什么反射比对象本身之间操作慢

简单来说，通过对象本身直接操作字段或者方法，字段偏移量和方法在虚方法表（vtable）中的索引在类加载时就已确定；JVM 可直接通过对象地址 + 偏移量 / vtable 索引访问，JIT 编译器还能将其优化为一条 CPU 指令；而对于反射，它需要先去方法区里查找匹配对应的字段或者方法，然后还要做一些安全检查什么的，最后才去解释执行，相当于地址不知道，需要重新解释执行。

## 内存布局

JVM当它被加载到内存里时也是这样的布局，然后它这个基础上又构建了一个自己的内存模型，它怎么构建的呢？JVM 启动时，会通过系统调用（如 mmap ）向操作系统申请一大块连续的虚拟内存（比如 -Xmx4g 就申请 4GB）。**然后 JVM 在这块大内存内部，再划分自己的内存模型：Java 堆（Young Gen + Old Gen），方法区 / Metaspace（类元数据）**

```Java
┌───────────────────────┐
│      内核空间         │ ← OS 使用，用户程序不可访问
├───────────────────────┤
│      栈（Stack）      │ ← 主线程栈、其他线程栈（每个线程一个）
│                       │    包含：JVM 虚拟机栈 + 本地方法栈
├───────────────────────┤
│      内存映射区        │ ← JVM 用 mmap 申请的大块内存：
│                       │    - Java 堆（-Xmx 控制）
│                       │    - Metaspace（类元数据）
│                       │    - Code Cache（JIT 编译后的代码）
├───────────────────────┤
│      堆（Heap）       │ ← C 运行时用 malloc/free 管理的内存
│      (C Heap)         │    （JVM 内部 C++ 代码可能用到，但 Java 堆不在这！）
├───────────────────────┤
│      数据段（Data）   │ ← 全局变量、静态变量（JVM 可执行文件的数据）
├───────────────────────┤
│      代码段（Text）   │ ← JVM 可执行文件的机器指令（C++ 代码）
└───────────────────────┘
```

1、各个内存区域的作用
1. 程序计数器：记录当前线程正在执行的字节码指令地址。线程私有，唯一不会发生内存溢出
    
2. 虚拟机栈：用于Java方法的调用，线程私有，大小可固定或动态：通过 -Xss 设置（如 -Xss1m）。异常：StackOverflowError：递归太深，栈帧太多。
    
3. 本地方法栈：用于Java本地方法的调用，线程私有，无需关注，异常也是StackOverflowError
    
4. Java堆：存放所有通过 new 创建的对象实例和数组。线程共享，当然这个Java堆这块内存区域又进一步划分什么新生代、老年代等等，这些无需关注，都是垃圾回收为了高效的实现内存管理进行的一些设计，
    
5. 方法区：存储每个类的结构信息，包括：类的字段、方法数据，常量池（Runtime Constant Pool），静态变量（static variables）等等

## 内存溢出问题


## GC 

1. JVM在进行垃圾回收时，会占用CPU影响性能甚至如果在进行大量的GC时可能会直接暂停Java程序的执行。
    
2. 最好直接使用JDK17以上的版本，可以解决90%以上的GC问题
## JVM调优

1. 开启 OOM 时自动生成快照的功能；企业生产必备配置
```
java -Xms2g -Xmx2g \
-XX:+HeapDumpOnOutOfMemoryError \
-XX:HeapDumpPath=/data/logs/jvm/heap.hprof \
-XX:+PrintGCDetails -XX:+PrintGCTimeStamps \
-jar demo.jar
```

参数说明：
```Bash
- `-XX:+HeapDumpOnOutOfMemoryError`：开启 OOM 时自动生成快照的功能；
- `-XX:HeapDumpPath`：指定快照文件的保存路径（需确保目录存在，且服务器有写入权限）；
- 额外配置的`-XX:+PrintGCDetails`和`-XX:+PrintGCTimeStamps`，用于打印 GC 日志，辅助分析内存问题的根源。
```


 常用参数
```Bash
# 堆大小
-Xms512m -Xmx512m

# 年轻代大小
-XX:NewRatio=2        # 新生代:老年代 = 1:2
-XX:SurvivorRatio=8   # Eden:Survivor = 8:1

# GC选择
-XX:+UseSerialGC      # 串行GC
-XX:+UseParallelGC    # 并行GC (JDK8默认)
-XX:+UseConcMarkSweepGC # CMS
-XX:+UseG1GC          # G1 (JDK9+默认)
-XX:+UseZGC           # ZGC (JDK11+)

# G1特有
-XX:MaxGCPauseMillis=200
-XX:G1HeapRegionSize=8m
```

-----------------------------------------
### 如何排查线上OOM问题？


 1. 首先保留现场（如果程序还在）
```Bash
jps -l                           # 找到进程PID
jmap -heap <PID>                 # 查看堆配置
jmap -histo <PID> | head -30     # 查看对象统计
```
 2. 导出堆转储
```Bash
jmap -dump:format=b,file=heap.hprof <PID>
```

3. 分析堆转储
jhat heap.hprof                  # HTTP服务查看
MAT heap.hprof                 # 使用Eclipse Memory Analyzer
 或者在windows系统visualvm查看 

4. 查看代码
```Bash
重点关注:
- 内存泄漏 (static集合持有引用)
- 大对象分配
- 线程创建过多
```

-----------------------------------------
### CPU 100%怎么排查？

1. 定位CPU占用最高的进程
```Bash
top -c
```

2. 定位CPU占用最高的线程
```Bash
top -H -p <PID>
```

3. 线程ID转16进制
```Bash
printf "%x\n" <线程ID>
```
 4. 查看线程堆栈
```Bash
jstack <PID> > threaddump.log
grep -A 20 "nid=0x<16进制>" threaddump.log
```

-----------------------------------------
### 频繁Full GC怎么排查？

1. 查看GC日志
```Bash
grep "Full GC" gc.log | head -20
```
 2. 分析GC原因
 - 老年代空间不足
 - 元空间不足
 - System.gc()调用
 - 分配担保失败

3. 内存分析
```Bash
jmap -heap <PID>
```

-----------------------------------------
### 线上服务响应变慢，如何快速定位？

1. 系统层面
```Bash
top                              # CPU/内存
iostat -x 1                     # IO
netstat -an | grep ESTABLISHED  # 网络连接
```

2. Java层面

```Bash
jstack <PID>                    # 线程堆栈
jstat -gcutil <PID> 1000        # GC统计
jmap -heap <PID>                # 内存状态
```

3. 数据库层面 (如果适用)
```Bash
show processlist               # MySQL
```



### JVM参数怎么调优？能举例说明吗？

1、吞吐量优先：(G1垃圾回收器)
   -Xms4g   -Xmx4g
   -XX: ParallelGCThreads =8
   
   
2、延迟优先： 触发的时机。

3、大堆，超低的延迟 ZGC



## 工具使用

