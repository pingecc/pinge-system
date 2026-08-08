```java
// this : 当前对象
// this.getClass()：当前对象对应在Java堆中的Class结构对象
// Class结构对象保存了对应类加载器信息，通过getClassLoader() 拿到它
this.getClass().getClassLoader()
```

