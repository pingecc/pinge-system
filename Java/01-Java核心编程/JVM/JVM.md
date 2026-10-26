![[Pasted image 20261019203125.png]]

![[Pasted image 20261019205622.png]]

[[01-Java源码到类加载过程]] · [[02-Class对象应用]] · [[从进程布局推导JVM内存区域]]

---

# L1 · JVM 全景图

## ⁠1 ⁠全景:一行代码到 CPU

- 流水线:`HelloJVM.java` --javac--> `HelloJVM.class`(字节码,平台无关)-- 各平台 JVM --> 本地机器码。
- **跨平台的准确表述:一次编译、到处运行,前提是那边装了 JVM。** 载体是字节码 + 各平台 JVM 实现,不是源码。
- 三层套娃:**JDK ⊃ JRE ⊃ JVM**。JVM 只认字节码;JRE = JVM + 核心类库;JDK = JRE + javac/jcmd/jstack 等工具。JDK 9 起不再单独发行 JRE。
- **规范 vs 实现(面试隐形分水岭)**:JVM 是规范(JVMS),HotSpot 是主流实现(Temurin/Oracle/OpenJDK 用的都是它)。方法区/虚拟机栈等名字是规范概念;Metaspace、Region、CDS 这些是 HotSpot 实现层的东西。

## ⁠2 ⁠JVM 结构图(三大件)

**类加载子系统**(加载→链接→初始化)+ **运行时数据区** + **执行引擎**(解释器 / JIT / GC),向下经 JNI 落到操作系统。

运行时数据区五块:

| 区域                | 归属  | 职责                         | 出事信号                   |
| ----------------- | --- | -------------------------- | ---------------------- |
| 堆 Heap            | 共享  | 对象实例的家,GC 主战场              | `OOM: Java heap space` |
| 方法区(实现:Metaspace) | 共享  | 类元信息、运行时常量池                | `OOM: Metaspace`       |
| 虚拟机栈              | 私有  | 方法调用账本,一次调用一帧              | `StackOverflowError`   |
| 本地方法栈             | 私有  | native 方法(HotSpot 与虚拟机栈合一) | 同上                     |
| 程序计数器             | 私有  | 记录字节码执行位置,恢复线程现场           | 唯一不会 OOM               |

**一行代码的一生**(编号对应结构图 ①–⑨):①javac 产出字节码 → ②类加载子系统加载/链接/初始化 → ③类元信息进 Metaspace、main 线程启动 → ④main 栈帧入虚拟机栈、⑤PC 指向首条字节码 → ⑥解释器执行(println 经 JNI 出去)→ ⑦`new` 的对象在堆年轻代分配(TLAB)→ ⑧循环成热点被 JIT 编机器码 → ⑨失引用对象被 GC 回收。

**易错点:栈帧里放的是"指向对象的引用",对象本体在堆。** `byte[] keep` 变量在栈帧,256KB 数组本体在堆。

## ⁠3 ⁠JDK 21 出厂设置(vs 老笔记的修正)

| 主题 | 老笔记里的 JDK 8 说法 | JDK 21 现状(面试按这个说) |
|---|---|---|
| 方法区 | 永久代 | Metaspace(JDK 8 起,本地内存) |
| 类加载器 | Bootstrap / **Extension** / Application | Bootstrap / **Platform** / Application(JDK 9 模块化;`lib/ext`、rt.jar 取消,拆成模块) |
| 默认 GC | Parallel(JDK 8) | **G1**(JDK 9 起) |
| CMS | `-XX:+UseConcMarkSweepGC` | JDK 9 废弃、**14 移除**,写了直接启动失败 |
| GC 日志 | `-XX:+PrintGCDetails` 等 | 统一日志 **`-Xlog:gc`**(JDK 9 起) |
| ZGC | 实验特性 | JDK 21 分代转正(JEP 439),生产可用 |

其他:JDK 10 起 G1 Full GC 并行化;MaxMetaspaceSize 默认不限(实测 = 2^64-1)。

## ⁠4 ⁠命令清单(带参数拆解)

```bash
java -version                       # JVM 版本;认准 21 / Temurin / Server VM
javac -g -d out HelloJVM.java       # -g 全部调试信息; -d out 输出目录(自动建包结构)
javap -c -p -classpath out HelloJVM # -c 反编译字节码; -p 含私有成员; -classpath 类路径
java -Xms64m -Xmx64m -Xlog:gc -cp out HelloJVM   # 见下表
jps -l                              # 列 JVM 进程,-l 完整主类名(先拿 PID)
jcmd <pid> VM.flags                 # 查该进程生效标志;help 看全部子命令
java -XX:+PrintFlagsFinal -version | grep -iE "UseG1GC|MaxHeapSize"
```

关键参数:

| 参数 | 含义 |
|---|---|
| `-Xms64m` / `-Xmx64m` | 初始/最大堆(= InitialHeapSize / MaxHeapSize 简写);调优常设相等避免伸缩抖动 |
| `-Xlog:gc` | 统一日志输出 GC 事件(标签=级别:输出) |
| `-cp out` | 类路径,找 .class 的地方 |
| `-XX:+PrintFlagsFinal` | 打印所有标志最终值;行尾 `{ergonomic}`=按机器自适应,`{default}`=出厂写死 |

**出厂默认(本机实测)**:MaxHeapSize = 物理内存 1/4(6GB)、InitialHeapSize 默认 1/64(384MB)、UseG1GC=true {ergonomic}、ReservedCodeCacheSize≈240MB(JIT 机器码仓库)、UseCompressedOops=true。

## ⁠5 ⁠GC 日志逐字段(以后读日志的通用语法)

```
[0.017s][info][gc] GC(1) Pause Young (Normal) (G1 Evacuation Pause) 38M->1M(64M) 0.150ms
```

启动后秒数 / 级别+标签 / 本进程第几次 GC / **Pause=STW** 的年轻代回收 / 成因(Eden 存活对象迁移)/ **回收前→回收后(总堆)** / 停顿时长。第一行 `Using G1` 标明收集器。

## ⁠6 ⁠实验结论(L1 全部真机验证过)

1. `javap -c` 能对上源码:19: ldc 262144 = 256*1024(编译期算好)、21: newarray byte = new byte[]、36: goto 12 = for 循环;左侧偏移量即 PC 存的地址类型。
2. 64MB 堆 + 200×256KB 分配 → 2 次 Young GC;**堆改 256MB → 1 次**(作业结论:堆大→年轻代大→对象在回收前死透→次数减少)。
3. `jps`/`jcmd` 对 jshell 的活进程可查 VM.flags;`{ergonomic}` 解释了"为什么没配置却用了 G1"。
4. IDEA 的 VM options 填同样参数输出一致——参数和工具与 IDE 无关,都是同一套 HotSpot。

---
