
# 微服务架构

 In short, the microservice architectural style 1 is an approach to developing a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API. These services are built around business capabilities and independently deployable by fully automated deployment machinery. There is a bare minimum of centralized management of these services, which may be written in different programming languages and use different data storage technologies.
> 简而言之，微服务架构风格1是一种将单个应用程序开发为一套小型服务的方法，每个服务都在自己的进程中运行，并与轻量级机制（通常是HTTP资源API）通信。这些服务围绕业务能力构建，并可通过全自动部署机制独立部署。这些服务的集中管理最低限度，这些服务可能用不同的编程语言编写，并使用不同的数据存储技术。


微服务架构将一套系统按照业务或者功能拆分成一个个微服务，**每个微服务单独部署，可以根据自身的特点自由的使用技术栈以及扩展（集群），然后服务之间通过网络进行通信。**

>吐槽一下：现在很多人它乱用微服务，本身系统并不是很复杂，但是为了追求技术的先进性，硬要拆分成微服务，而且每个微服务还部署在同一个服务器里，甚至用的还是一个数据库，这就有点脱裤子放屁了，这样做不仅没有提高整个系统的性能，反而降低了系统的性能。

<div class="highlight-block highlight-tip"> 微服务架构面临的问题</div>
1. 微服务之间的通信：保证高效可靠的通信；服务地址动态变化；
2. 分布式事务的一致性如何保证（跨多个数据库）
3. 服务治理和可观测性：调用链路复杂（A → B → C → D…），故障定位困难（“哪个服务慢了？”）
4. 安全与权限控制：服务间调用如何认证鉴权？API 如何防攻击？




<div class="highlight-block highlight-tip">Java生态 微服务架构技术栈</div>

在Java生态里，主要使用Spring Cloud技术栈构建微服务架构：
* SpringCloud Alibaba： Nacos 【服务注册与配置】
* SpringCloud：OpenFeign 【服务远程调用】
* SpringCloud Alibaba：Sentinel 【限流、降级、保护】
* SpringCloud：Gateway 【网关路由】
* 链路追踪：Sleuth + Zipkin  -  SkyWalking（主要是用这个）【服务链路监控】
![[08081e25a8b844bea6663bc1497b5009.png|685]]


注意：SpringCloud底层是依赖于SpringBoot的，并且有版本的兼容关系

## 服务远程调用

不使用任何的服务远程调用组件，在一个服务里想要去调用另外一个服务的接口，最直接的办法就是知道目标服务接口的地址URL，然后在这个服务里直接通过http进行调用。比如在Spring Boot应用里，直接基于RestTemplate去调用。


```java
String url = "http://localhost:8081/api/users/" + userId;
return restTemplate.getForObject(url, User.class);
```

如果服务提供者只有一个大话，这样做也没什么大问题，但是如果服务提供者部署了多个实例的话，又该如何得知服务提供者的IP地址和端口，该如何选择哪个实例，又如何知道某个实例还可用？ 这些问题需要利用一个注册中心组件来解决了。


## 注册中心

1、理解注册中心的基本流程、原理、作用

- 服务注册：服务启动的时候，将自己的信息（主要是IP地址和端口）注册到【注册中心】，注册中心会保存服务名称和对应地址列表的映射关系。
- 服务发现：其它服务在去调用目标服务接口时，根据服务名称从注册中心获取地址列表，然后拼接成URL进行调用。

2、理解客户端负载均衡器在服务调用中发挥的价值

<div class="highlight-block highlight-tip">基本原理</div>

1、**当服务提供者有多个实例时**，服务发现者拉取目标服务所有可用实例列表，然后**由服务发现者通过负载均衡算法自主选择一个实例发起调用**（使用负债均衡组件）


2、某个服务实例是否可用是注册中心完成的，服务发现者在拉取服务时注册中心只返回可用的实例。
	至于注册中心如何完成一个服务是否可用最常见的方式就是客户端心跳模式：
		服务提供者在向注册中心完成注册之后，定期向注册中心发送“心跳”，表示还活着。

3、目前Java生态主流服务注册中心组件选择：
- Eureka（2012，Java）：SpringCloud原声注册中心组件，不支持配置中心，已不再维护。
- ZooKeeper（2006，Java）：
- **Nacos**（2018，Java）：阿里开源，支持注册中心和配置中心，提高WebUI
- Consul（2014，Go）：



<div class="highlight-block highlight-tip">负载均衡器 </div>

1、 Ribbon

Netflix （2012）开源的一个 客户端负载均衡器（Client-side Load Balancer），作为其微服务套件（Netflix OSS）的一部分，用于 Java 微服务架构中解决服务调用时如何在多个可用服务实例之间进行流量分发的问题，2017 年后基本停止维护。Spring Cloud 从 2020 年起（Spring Cloud 2020.0.0 / Ilford 版本）正式移除了对 Ribbon 的支持，官方推荐使用 Spring Cloud LoadBalancer 作为替代方案。


2、Spring Cloud LoadBalancer
Spring Cloud 官方自己实现的一个客户端负载均衡器：
- 原生集成Spring生态：与 RestTemplate、WebClient、Feign（通过 Spring Cloud OpenFeign）等无缝集成，只需添加注解（如 @LoadBalanced）即可启用负载均衡。
- 支持响应式编程：提供 ReactiveLoadBalancer 接口，原生支持 WebFlux 和响应式调用，这是 Ribbon 所不具备的。
- 支持各自负载均衡策略

1）给RestTempate配置负载均衡
```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```


2）那么在程序里使用restTemplate进行http调用时就会使用负债均衡，user-service 是注册在服务发现中的服务名，LoadBalancer 会自动解析其可用实例并选择一个进行调用。
```java
restTemplate.getForObject("http://user-service/api/users/1", User.class);
```

如果想基于服务名进行调用，那么注册中心是必须存在的，否则注册中心就失去了自身的价值，注册中心只负责存储“服务名”和实例列表（IP+端口+元数据）的映射，不参与客户端的服务调用，客户端负载均衡器来完成从注册中心拉取服务与对应IP的映射，多个实例的负载调用，以及对URL中服务名的解析。


注册中心的价值不仅限于配合客户端负载均衡，还包括：
1、服务治理的基础
- 服务注册/注销：实现自动上下线感知
- 元数据管理：版本、区域、标签等，用于灰度发布、金丝雀部署
- 健康检查：结合心跳机制判断实例是否存活
2、支持其他架构模式
- 服务端负载均衡：比如 API 网关（如 Spring Cloud Gateway、Kong）可以从注册中心获取实例列表，由网关做负载均衡，后端服务无需集成 LoadBalancer。
- Service Mesh：在 Istio 等方案中，Sidecar 代理（如 Envoy）会从控制面（如 Pilot）获取服务列表，此时应用代码完全不需要 LoadBalancer，但依然依赖注册中心（或服务网格的服务注册机制）。
- 运维监控：注册中心提供服务拓扑、依赖关系、在线实例数等信息，用于监控告警。
3、跨语言/异构系统集成
即使某个服务是 Python 写的，只要它能向注册中心注册，并提供健康接口，Java 服务就可以通过 LoadBalancer 调用它——注册中心是语言无关的协调者。



