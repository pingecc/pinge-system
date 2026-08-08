
理解Spring框架中国各个核心机制大概的实现过程。


本节课的目的是通过手写流程将这些知识点串联起来。其实很多点，比如说扫描真正在它的源码会使用到ASM技术，**该技术能够解析字节码文件，从而获取类的相关信息**。为什么Spring框架要使用ASM技术而非反射机制来获取类信息，这个问题将在后续内容中进行解释。

像Spring 全家桶里其实有很多的项目，比如spring Boot Spring data Spring cloud。。。。这些其实都是基于Spring framwork来实现的，**它们都会用到Spring framework提供的核心机制**。

![[Pasted image 20260712213500.png]]

# ApplicationContext

思考：在创建Spring容器时，在它的内部需要做哪些事情？

```java
public AnnotationConfigApplicationContext(Class<?>... componentClasses) {  
    this();  
    this.register(componentClasses);  
    this.refresh();  
}
```



1. 解析配置类
	1. 获取配置信息：
		1. `@ComponentScan`：**获取Bean扫描路径**，拿到这个路径下的所有类，然后一个个的判断类上是否有`@Component`  注解，如果有就代表是一个Bean，然后创建BeanDefinition，然后创建非懒加载的单例Bean，存入Map

## 扫描Bean路径

思考：

1、扫描时要不要立即创建Bean？
单例Bean：在创建容器的时候就会构建，然后存入到一个map中，（懒加载多Bean，在获取时才创建存入map)
多例Bean：每次去获取时才会创建，所以没必要去存入Map


2、`getBean(name)`  如何设计

思考：传进来一个Bean name 我怎么知道它对应哪个Bean？ 对应的Bean是 单例还是多例？ 是懒加载还是非懒加载，又对应哪个 Class......这一系列的信息就不得不引出。**BeanDefinition** Bean的定义，包含Bean的各种信息。


所以在扫描Bean路径时，发现有 注解 `@Component` 所以是个Bean，**首先创建BeanDefinition**，先把Bean的各种信息设置进去。创建完存入beandefinitionMap中。
> 所以在扫描时，只要是Bean，不管是单例还是多例，都会有对应的BeanDefinition，Bean对象可能还没有创建。

所以 getBean(name)核心逻辑：
- 先判断是否存在 BeanDefinitionMap中，如果存在则是个Bean
- 然后看是单例Bean还是多例Bean，单例Bean，直接从单例BeanMap返回
- 懒加载的单例Bean或者多例Bean，则创建返回。





## createBean设计

下面就是**Bean的整个生命周期**，也即构建Bean的过程，任何一个节点报错就会创建Bean失败。

1. 实例化：创建Bean对象，比如通过构造方法创建
2. 依赖注入：给Bean对象的属性赋值
3. 初始化：Spring框架提供各种注解或者接口（回调函数机制），用户可以在自己的Bean里去使用这些注解或者实现这些接口，Sprin g框架会调用它。
	1. 例如：判断是否实现了 `InitializingBean` 接口，如果实现了调用对应接口的方法。
4. AOP：  BeanPostProcessor, 判断是否需要创建代理Bean，比如检查方法中是否使用 `@Transactional` ， 如果需要代理的话，则AOP返回代理对象，否则返回原Bean。可以使用 cglib来实现代理。可能会存在多个BeanPostProcessor实现类，循环依次调用
5. Aspect设计基本思路：其实就是先扫描项目中所有用户定义的Aspect，然后在AOP里调用用户自己定义的逻辑。

1、依赖注入如何实现：在实例化Bean时，给对应的属性赋值：
- 获取Bean的所有字段，判断是否有  `@Autowired`  注解，如果有，则根据类型以及根据name去获取对应的 Bean赋值上，

## BeanDefinition 的扫描





自己实现一个接口，那么框架就会使用我们声明到，否则使用框架提供默认的，这种实现原理：

在扫描Bean时，会主动的去扫描那些接口类型的Bean，检查是否存在，存在则构建，否则使用默认的。


# Spring中的核心组件


![[Pasted image 20260714211953.png]]