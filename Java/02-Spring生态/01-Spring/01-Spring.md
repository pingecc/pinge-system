
# Chapter01：Spring IOC 容器

目标：能够使用 **`AnnotationConfigApplicationContext`** 启动 Spring，注册Bean和获取Bean。


概念梳理：
- Spring容器其实就是一个专门管理Java对象的容器
- 关于Bean的叫法，在Java里有一定的历史渊源，自行百度查看，在这里只要被Spring管理的对象我们都统一称为Bean，Bean == Java Object
- `ApplicationContext`：Spring应用上下文，也就是 IOC容器，下面是简化的继承关系：
```java
ApplicationContext
        ▲
        │
ConfigurableApplicationContext
        ▲
        │
AbstractApplicationContext
        ▲
        │
GenericApplicationContext
        ▲
        │
AnnotationConfigApplicationContext
```

在开发中会直接使用 `AnnotationConfigApplicationContext` 来构建，它支持通过Java配置类的方式。

## 创建ApplicationContext对象

1、创建配置类
```java
package com.demo.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

}
```

2、创建 AnnotationConfigApplicationContext对象，传入配置类


```java
package org.pinge;  
  
import org.pinge.config.AppConfig;  
import org.springframework.context.annotation.AnnotationConfigApplicationContext;  
  
public class App {  
    public static void main(String[] args) {  
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);  
        System.out.println(context);  
    }  
}
```

运行。**Spring容器创建成功**。但是里面没有任何的Bean，接下来我们开始学习如何往容器里注册Bean。

## 注册Bean

1、先定义一个UserService

```java
service
    └── UserService.java
```


```java
  
public class UserService {  
    public UserService() {  
        System.out.println("UserService 创建");  
    }  
}
```


2、在AppConfig类中注册UserService为Bean

```java
@Configuration  
public class AppConfig {  
      
      
    @Bean  
    public UserService userService() {  
        return new UserService();  
    }  
}
```

`@Ban`注解表示将对应方法返回的对象注册到Spring容器中。

3、从Spring容器中获取Bean

```java
public class App {  
    public static void main(String[] args) {  
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);  
        UserService userService = context.getBean(UserService.class);  
        System.out.println(userService);  
    }  
}
```

运行成功。注意，UserService的创建在我们调用getBean()之前就已经被创建好了，也即在启动Spring容器时就被创建了。


关于Bean的进一步研究：

1.  为什么 `@Bean` 方法名默认就是 Bean 的名字？
2.  一个配置类里可以注册多个 Bean 吗？
3.  `@Bean(name = "...")` 有什么作用？
4.  `context.getBean()` 有几种获取方式？
5.  如果容器中存在多个相同类型的 Bean，会发生什么？
6.  `@Bean` 方法之间互相调用，为什么不会创建多个对象？（这是理解 `@Configuration` 和后续源码的关键。）




