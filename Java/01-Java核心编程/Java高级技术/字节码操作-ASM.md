ASM其实就是直接读取磁盘上的.class文件，按照.class文件格式去解析以及修改.class文件里的内容，然后再扔给JVM。而反射它只不过是在运行期间通过JVM提供的API来操作对象对应在JVM堆中的Class对象，它只能去操作对象中本身存在的属性和方法，而ASM可以直接修改class文件的内容，甚至可以直接生成一个class文件。

[ASM与Reflection的本质区别](file:///Users/ping/Documents/GPT/Java语言/ASM与Reflection的本质区别.md)