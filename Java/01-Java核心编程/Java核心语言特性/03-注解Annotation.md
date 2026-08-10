这是一个非常好的学习主题。

如果让我评价 **Java 最重要的三个语言特性**，我会认为是：

1. **面向对象（OOP）**
2. **泛型（Generics）**
3. **注解（Annotation）**

很多Java程序员工作几年以后，对注解的理解仍然停留在：

@Override、@Autowired、@Transactional、@RequestMapping……

知道怎么用，但是不知道为什么能这样用。

实际上，**注解几乎贯穿整个现代Java生态**。

Spring、SpringBoot、MyBatis、Dubbo、RocketMQ、JUnit、Lombok……  
几乎所有框架都是围绕注解构建的。

所以，我们这次不只是讲”注解是什么”，而是从 **Java语言设计者的角度** 去理解：

**为什么Java会发明Annotation？Annotation到底解决了什么问题？Spring为什么如此依赖Annotation？**


先记住这几个最核心的思想。
 **1. Annotation出现的原因**
以前只能依赖：
- 注释
- 命名规范
- XML
Annotation解决了代码和配置分离的问题。
---

 **2. Annotation本质**
它本质就是：
**一个继承了** **`Annotation`** **的特殊接口。**

---
 **3. Annotation作用**

不是执行业务，而是：**描述程序。** 也就是：Metadata（元数据）。

---
 **4. Annotation不会自己生效**

真正工作的永远都是：
- 编译器（如 `@Override`）
- JVM（部分运行时注解）
- 框架（如Spring、MyBatis等）
- 或者你自己编写的代码（通过反射读取注解）


```java
@注解(...)
```

理解成：**在声明一个注解配置对象，并给它的各个属性赋值。**

# Chapter01：为什么需要Annotation




很多东西，都要先问一句：**没有Annotation之前怎么办？** Java最早（JDK1.0）是没有Annotation的。那时候如果**想给某些代码添加额外的信息，用于在程序运行期间识别做特定的操作**，例如EJB时代，通过名字约定：

```text
UserServiceBean

UserServiceHome

UserServiceRemote

setXXX()

getXXX()
```
因为只能靠名字，但是名字容易写错，没有类型检查。
后来Java开始大量使用XML，例如Spring最早：

```xml
<bean id="userService"
      class="xxx.UserService"/>
```
但是所有配置全部写XML变得非常繁琐，如果代码做了修改，对应的xml文件需要做同步。


Java社区一直在想：

**有没有办法把配置直接写在代码里面？成为程序的一部分，在运行期间可以直接获取到并参与程序的逻辑**






# Chapter02：Annotation的本质

有了Annotation，就可以给程序添加**元数据**。Annotation的本质就是：**一个接口（Interface）， 一个类。

例如：

```java
public @interface Service {
}
```

编译以后其实就是：

```java
public interface Service
        extends Annotation {
}
```

Annotation接口：

```java
java.lang.annotation.Annotation
```

所以注解其实也是Java对象。通过`@Annotation`的方式只是Java提供的一种特殊语法糖，用于在语义上区分普通的接口。通过注解可以快速的给程序添加一个标记，描述一些信息，但是这个标记自己什么也不会做，只有另外一段程序去扫描Class获取到对应注解信息之后添加逻辑，这个时候注解才发挥作用。

Annotation就像**快递标签。** 一个个的箱子📦就是Class，可以给这些箱子贴任何的标签，代表着不同的用途，箱子本身不会发生变化，在于其人人看到这个箱子的标签之后如何去处理它。






---

# Chapter03：Annotation 的完整语法

学完这一章，你应该能够回答下面这些问题：

- `@interface` 到底是什么？
- 一个注解为什么可以写参数？
- 为什么注解的方法不能有参数？
- 为什么注解不能 `new`？
- 为什么 `value()` 可以省略？
- 注解为什么不能继承？
- 注解为什么不能有普通成员变量？
- 注解编译后到底变成了什么？


最简单的自定义注解，通过 `@interface`关键字进行声明。
```java
public @interface MyAnnotation {

}
```

然后就是在程序中需要什么配置项，就往这个注解里去添加对应的属性，在后续使用这个注解时就是去声明对应的属性值是什么。

## 注解里面可以写什么

Annotation 本质上不是一个普通对象，它更像一份**声明式配置**，在它里面可以写属性，使用时通过**Key-Value 配置项**的形式去声明。

```java
public @interface MyAnnotation {

    String name();

    int age();

}
```

很多人误以为 `String name() int age()` 是抽象方法，其实它表示的是 **一个Annotation 属性**

```java
@MyAnnotation(
    name = "Tom",
    age = 20
)
```

这里的 `name` 对应 `String name()` ， `age`  对应 `int age()`，所以**Annotation 的每一个属性，都是通过一个无参数方法来定义的，方法名就是属性名。**


疑问🤔：既然在注解里写的所有无参方法其实都是属性，那属性的声明要用无参方法，不直接用成员变量的方式？不是更清晰直白么？

1）Annotation本质是接口，而接口不能有实例字段，非要写字段只能是`public static final String NAME="Tome"` 这种，但是这样的语义是所有对象共享一份数据，而Annotation要求每个地方都有自己的值。
2）Annotation 没有真正的实例对象，它只是接口，如果定义字段，没地方放

综上，只能通过无参方法的形式去表示属性，且反射API更统一。

```java
RequestMapping mapping =
method.getAnnotation(RequestMapping.class);

mapping.value()
mapping.path()
mapping.method()
```


## 属性支持哪些类型

- 基本数据类型
- String类型
- Class类型
- 枚举类型
- 注解类型
- 以上对应类型数组

```java
int age();
String name();
// Class
Class<?> type();
// 枚举
enum Level{
    HIGH,
    LOW
}
// Annotation Annotation可以嵌套Annotation

// 以上支持的类型对应的数组
String[] value();
```

使用：
```java
@Bean(UserService.class)
@MyAnnotation(Level.HIGH)
@Roles({
    "ADMIN",
    "USER"
})
```

下面额外详细介绍下几种不容易理解的属性类型。

### 数组类型属性

>数组属性主要是为了一个属性可以配置多个值

```java
public @interface MyAnnotation {

    String[] names();

}
```

1）标准的写法：
```java
@MyAnnotation(
    names = {"Tom", "Jack", "Lucy"}
)
public class UserService {
}
```

和Java 数组初始化非常像

```java
String[] arr = {"Tom", "Jack", "Lucy"};
```

2）只有一个元素时可以省略{}

```java
@MyAnnotation(
    names = "Tom"
)
```

### Annotation类型属性

为什么允许 Annotation 嵌套 Annotation：因为Annotation 的本质，它其实就是：配置。像XML也可以嵌套：
```xml
<bean>
    <property>
    </property>
</bean>
```


先定义一个 Annotation

```java
public @interface Author {

    String name();

}
```

再定义一个 Annotation：

```java
public @interface Book {

    Author author();

}
```

使用：

```java
@Book(
    author = @Author(
        name = "张三"
    )
)
public class JavaBook {
}
```

Annotation 属性也可以是 Annotation 数组

```java
public @interface Book {

    Author[] authors();

}
```


```java
@Book(
    authors = {
        @Author(name = "Tom"),
        @Author(name = "Jack"),
        @Author(name = "Lucy")
    }
)
public class JavaBook {
}
```


## 属性可以有默认值

```java
public @interface MyAnnotation {

    String name() default "Tom";

    int age() default 18;

}
```

在使用注解时，没有声明对应属性的值，那么就使用默认的值。


## value名 属性

如果注解只有一个属性，且属性名为 **`value`****，那么使用时可以省略 **`value =`**。

```java 
public @interface Target {

    ElementType[] value();

}
```

使用：
```java
@Target(ElementType.TYPE)
```


# Chapter04：元注解

前面我们讲过一个概念“元数据”，其实就是用于描述数据的数据，而“元注解”就是用于描述注解本身的注解，

| **元注解**       | **作用**        |
| ------------- | ------------- |
| `@Target`     | 注解可以作用的位置     |
| `@Retention`  | 注解保留到什么时候     |
| `@Documented` | 是否生成到 JavaDoc |
| `@Inherited`  | 子类是否继承父类的注解   |
| `@Repeatable` | 是否允许同一个注解重复出现 |

## @Target

**决定注解可以写在哪里**，通过`ElementType` 枚举值来指定。
>可以指定多个值，如果不写则默认支持所有，但是一般会写，这样可以让编译器提示。

```java
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.ANNOTATION_TYPE)  
public @interface Target {  
    /**  
     * Returns an array of the kinds of elements an annotation interface     * can be applied to.     * @return an array of the kinds of elements an annotation interface  
     * can be applied to     */   
	ElementType[] value();  
}
```


用的比较多的：`TYPE 、FIELD、METHOD、PARAMETER` 
```java
public enum ElementType {
// 类型； 类、接口、枚举、Annotation。
    TYPE,
// 成员变量
    FIELD,
// 方法
    METHOD,
// 方法参数
    PARAMETER,
// 构造器
    CONSTRUCTOR,
// 局部变量：几乎不用
    LOCAL_VARIABLE,
// 用于Annotatio本身
    ANNOTATION_TYPE,
// 用于包，很少用
    PACKAGE,
// 泛型参数
    TYPE_PARAMETER,

    TYPE_USE,

    MODULE,

    RECORD_COMPONENT

}
```

## @Retention

决定 Annotation 的生命周期，能够存活多久，通过RetentionPolicy值指定。

```java
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.ANNOTATION_TYPE)  
public @interface Retention {  
    /**  
     * Returns the retention policy.     * @return the retention policy  
     */    RetentionPolicy value();  
}
```

Java 编译一个类，会经历下面几个阶段：

```text
.java 源文件
        │
        ▼
javac 编译
        │
        ▼
.class 字节码
        │
        ▼
JVM 加载
        │
        ▼
程序运行
```

这个注解就是用来告诉编译器对应的注解可以保留到什么阶段。
```java
public enum RetentionPolicy { 
// 仅存在于源码
    SOURCE,
// 保留到 .class文件中
    CLASS,
// 保留到程序运行时。常用。
    RUNTIME

}
```

1、`SOURCE`

仅存在于源码中，源码编译之后就消失，常常用于编译期间的检查。比如`@Override` 

2、`CLASS`
保留到 .class 文件中，也就是说：Annotation 会写入 `.class` 文件。这类注解主要是在一些字节码增强工具中。

```java
.java

↓

javac

↓

.class

↓

ASM

↓

ByteBuddy

↓

Javassist

↓

重新生成字节码
```

3、RUNTIME
保留到运行时，注解信息会写入字节码文件中(.class)，并保留到程序运行期间，在程序中可以直接获取到，框架中几乎所有的注解都是使用的这种。




## @Documented

比较简单，用于标注当通过 `javadoc`命令生成文档时，对应的注解是否也要出现在文档里，写了这个注解就是保留到文档里，没写就是不保留，几乎所有框架提供的注解都会写上这个注解。

```java
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.ANNOTATION_TYPE)  
public @interface Documented {  
}
```

## @Inherited

用于指定注解是否可以被继承。
```java
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.ANNOTATION_TYPE)  
public @interface Inherited {  
}
```


1、默认情况下注解是不会被继承的，也即一个父类上写了这个注解，它的子类是不会有的。只要注解上加了这个元注解，子类才会有。
>不过子类要通过  `getAnnotation()` 方法才能获取到。通过`getDeclaredAnnotation` 获取不到父类的注解。


2、很少用，在`JUnit` 中 或者一些权限 Annotation 会用到。


## @Repeatable

让注解可以重复出现。
```java
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.ANNOTATION_TYPE)  
public @interface Repeatable {  
    /**  
     * Indicates the <em>containing annotation interface</em> for the  
     * repeatable annotation interface.     * @return the containing annotation interface  
     */    Class<? extends Annotation> value();  
}
```

1、默认情况下，一个注解在同一个位置只能出现一次，否则编译报错

```java
@Role("ADMIN")
@Role("USER")
public class UserService {

}
```
Duplicate annotation Role.

但是后来发现，有些场景天然需要多个值。例如：

一个 Controller 需要映射多个 URL：

```text
/login

/signin

/user/login
```

或者：一个类需要多个角色：

```text
ADMIN

USER

AUDITOR
```

于是 Java 8 引入了 `@Repeatable`。在 Java 8 以前，没有 `@Repeatable`。怎么办？只能使用数组。
```java
@Roles({
    @Role("ADMIN"),
    @Role("USER")
})
public class UserService {

}
```

2、@Repeatable使用

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(Roles.class)
public @interface Role {

    String value();

}
```

再定义一个Roles，和 Role属性完成对应，但是类型必须是数组
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Roles {

    Role[] value();

}
```

当我们使用

```java
@Role("ADMIN")
@Role("USER")
public class UserService {

}
```

编译器就会自动转化成
```java
@Roles({
    @Role("ADMIN"),
    @Role("USER")
})
public class UserService {

}
```

在反射的时候如何读取呢？

```java
// 直接读取 返回null，因为真正保存的是 Roles.class
UserService.class.getAnnotation(Role.class);
// 可以 返回对应转化后的Roles
UserService.class.getAnnotation(Roles.class);
// 或者通过 Java提供的新的API
Role[] roles =
UserService.class.getAnnotationsByType(Role.class);
```




后续内容：

1. `@interface` 编译后到底变成了什么？
2. Annotation 在 `.class` 文件中的真实存储结构。
3. `Class.getAnnotation()` 的底层执行流程。
4. JVM 为什么返回的是一个**动态代理对象**，而不是 Annotation 的真实实例。



# Chapter05：组合注解

我们自定义的注解，只要它的`@Target` 值是 `ElementType.TYPE` （或者`ElementType.ANNOTATION_TYPE`），那么语法上它就可以被当作元注解使用，也即直接写在另外一个注解上，但是起不起作用还得看程序本身支不支持，而Spring框架就支持，它会递归解析注解层次，只要存在Spring框架声明的那些注解，Spring就直接赋予这些注解对应的能力，最典型的例子：@Component。

作用：将多个常用注解封装成一个具有明确业务语义的新注解，提高代码可读性、减少重复标注，并保持所有原有功能。

演示：

```java
// 随便定义一个注解，直接使用@Bean
@Bean  
@Target({ElementType.TYPE, ElementType.METHOD})  
@Retention(RetentionPolicy.RUNTIME)  
public @interface MyBean {  
}

// 在程序中就可以直接把@MyBean当作@Bean使用
@Configuration  
public class AppConfig {  
  
  
    @MyBean  
    public UserService userService() {  
        return new UserService();  
    }  
}
```

# Chapter05：常用API

```java
// 获取指定类型的注解，支持 @Inherited
// 找到 则返回，否则返回null
 MyAnnotation annotation = User.class.getAnnotation(MyAnnotation.class);
 
 // 很多框架第一步都会调用它。是否存在这个注解 支持 @Inherited
 if (User.class.isAnnotationPresent(MyAnnotation.class)) {
}

// 获取所有可见注解 支持 @Inherited
Annotation[] annotations = User.class.getAnnotations();

// 根据类型获取对应的注解，Java8新增，用于支持 Repeatable Annotation（可重复注解）。
Tag[] tags = User.class.getAnnotationsByType(Tag.class);
```



# Chapter06：嵌套注解
