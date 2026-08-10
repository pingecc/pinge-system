在 Java 中，并不存在像 C/C++ 的函数指针或 JavaScript 那样的函数作为一等公民，因此 Java 中在设计 Callback（回调）其核心思想可以概括为：

> 框架在未来某个合适的时机，调用用户提供的方法。

普通调用：
```java
User  
 │  
 ▼  
Printer.print()

```
回调调用：

```java
User  
 │  
 ▼  
Framework  
 │  
 ▼  
Framework 调用 User 提供的方法
```

因此 Callback 的本质就是：
- 调用权发生了反转（Inversion of Control）
- 框架控制流程
- 用户提供**扩展逻辑**


**核心在于CallBack对象交给框架的方式不同，最终框架都会执行：**

```java
callback.doSomething();
```

区别仅仅是：

> callback 是如何交给框架的？


Callback经典设计：
```java
public interface Callback<C, R> {

    R execute(C context);

}
```

**Callback 的实现由用户提供；Callback 的调用时机由框架决定；Callback 的参数通常由框架根据当前执行环境提供；Callback 的返回值再交还给框架继续处理。**

# callback如何交给框架？

## 发现式 Callback（Discovery Callback）

这是 Spring 生命周期中最常见的一种。

框架主动扫描对象。

如果对象实现了某个接口，就自动调用。

例如：

```java
public interface InitializingBean {  
​  
    void afterPropertiesSet() throws Exception;  
​  
}
```

用户：
```java

@Component  
public class UserService implements InitializingBean {  
​  
    @Override  
    public void afterPropertiesSet() {  
        System.out.println("初始化");  
    }  
​  
}
```

Spring 内部思想：

```java
if(bean instanceof InitializingBean){  
​  
    ((InitializingBean)bean).afterPropertiesSet();  
​  
}
```

流程：
```java


Spring 创建 Bean  
​  
↓  
​  
依赖注入  
​  
↓  
​  
判断是否实现 InitializingBean  
​  
↓  
​  
调用 afterPropertiesSet()
```

特点：
- 用户不用主动注册，**自己选择是否实现接口来扩展自己的逻辑。**
- Spring 自动发现
- 生命周期固定

Spring 中典型案例：
- InitializingBean
- DisposableBean
- BeanPostProcessor
- BeanFactoryPostProcessor
- ApplicationRunner
- CommandLineRunner

还有一种形式，不通过接口的方式，而是通过注解的方式，框架提供注解，用户自定义方法去使用这个注解，然后Spring会扫描用户对象的所有方法是否使用了这个注解，如果使用了则调用目标方法。


## 注册式 Callback（Registration Callback）


用户主动把 Callback 交给框架。用户调用框架提供的某个方法，但是这个方法的参数是一个函数接口，需要用户在调用时实现这个接口并传入，框架会在方法里调用用户提供的实现。


例如：

```java
transactionTemplate.execute(new TransactionCallback<String>(){  
​  
    @Override  
    public String doInTransaction(TransactionStatus status){  
​  
        return "Hello";  
​  
    }  
​  
});
```

Spring：

```java
public <T> T execute(TransactionCallback<T> callback){  
​  
    begin();  
​  
    callback.doInTransaction(...);  
​  
    commit();  
​  
}

```



特点：
- Callback 每次都可能不同
- 用户主动传入
- 适用于模板方法模式
    

# 关于回调函数中的参数

如果回调函数还有参数，那么回调函数的参数通常不是用户自己传入的，而是框架在调用回调函数时，**根据当前运行环境构造并传递给用户的上下文（Context）对象。把框架内部的运行状态暴露给用户，因为用户需要这个。

```java
jdbcTemplate.execute(new ConnectionCallback<String>() {

    @Override
    public String doInConnection(Connection connection) {
        // 使用 connection
        return "success";
    }

});
```

例如上面的 `connection` 对象就是Spring提供的，其内部流程：

```java
Connection connection = dataSource.getConnection();

callback.doInConnection(connection);

connection.close();
```


```java
void doInTransaction(TransactionStatus status)

void doInConnection(Connection connection)

void processRow(ResultSet rs)

void onApplicationEvent(ApplicationEvent event)

void filter(HttpServletRequest req,
            HttpServletResponse resp)

void intercept(Invocation invocation)
```

你会发现：参数都是：

>当前执行环境（Execution Context）。


