
JVM 本质上就是一个运行在操作系统上的普通 C++ 进程，它内部对Java代运行时的内存布局设计实际上是OS 进程堆（Heap）和内存映射区（Memory Mapping）空间的再次精细化划分和抽象。


![[Pasted image 20261019203533.png]]