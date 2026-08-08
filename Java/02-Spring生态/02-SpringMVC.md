
# Java Web开发历程
## 早期Web通用实现

>总结：早期的web，由于浏览器能力有限，几乎只是一个显示器，有后端把网页内容拼好发给浏览器，而后端的实现分为2个部分：
>	web服务器：负责和客户端交互，解析请求，将请求转发给对应的外部程序，外部程序处理返回内容，web服务器再把内容返回给客户端。
>	 外部程序：各个后端语言单独定义规范，然后由开发者根据业务编写实现。



在早期，Web应用是生成式网页，完全靠服务端返回完整的HTML，因为当时浏览器的能力很弱，只擅长渲染 HTML + CSS，而JavaScript 功能有限，性能差，DOM 操作慢，动态更新页面几乎不可行，且兼容性混乱（IE vs Netscape 大战），没有 Ajax（直到 2005 年才被正式提出概念），浏览器几乎只是一个显示器，服务器不仅要生成数据，还要负责把页面“拼好”再发给浏览器。这个时期，**所有的后端语言都要自己去设计实现如何动态返回完整的HTML给浏览器，主要是通过一个名为CGI（Common Gateway Interface，通用网关接口） 的通用标准。**

CGI，全称Common Gateway Interface（通用网关接口），可以看作是Web早期动态网页技术的“基石”或“共同语言”。

- 核心思想：它是一套标准协议，定义了Web服务器如何与外部程序交互。当用户请求一个动态页面时，**Web服务器不再返回静态HTML文件，而是启动一个外部程序**，并将用户的请求数据（如表单内容）传递给这个程序。程序执行后，将其生成的HTML内容返回给服务器，再由服务器发送给浏览器
    
- 技术实现：几乎任何编程语言都可以编写CGI程序，只要它能做到两件事：
    1. 通过环境变量或标准输入（`STDIN`）读取服务器传递的请求数据
    2. 将生成的HTML内容输出到标准输出（`STDOUT`），服务器会捕获这些输出并返回给浏览器。

## Java的Tomcat 与Servlet
Java这边的实现是：**Servlet+JSP**。
>关于servlet这个名字：“Servlet” = “Server” （服务器）+ “Applet（小的程序组件）”，表示运行在服务端的小程序（组件）

运行在服务器端的 Java 程序，用于动态生成 Web 内容。 Servlet 的核心思想：
- 开发者实现指定的接口编写业务逻辑
- 请求进来后，由**服务器**调用 service() 方法处理；
- 返回 HTML 或其他格式给浏览器。
```Java
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
        throws IOException {
        resp.getWriter().println("<h1>Hello from Java!</h1>");
    }
}
```

Servlet容器：

Servlet 只是Java中的一个接口和规范，开发者通过实现这些接口来编写请求的处理和返回逻辑，当客户端的请求发给服务端这边时，那谁来接收 HTTP 请求？谁来创建 Servlet 实例？谁来调度请求到对应的 Servlet？谁来管理生命周期（初始化、销毁）？

所以还需要有一个单独的服务端程序来负责处理请求和调用指定的Servlet——**Servlet 容器**（Servlet Container）：一个运行时环境，负责管理和执行所有的 Servlet。它的职责包括

|   |   |
|---|---|
|📥 接收 HTTP 请求|监听网络端口，解析 HTTP 协议|
|🧱 创建和初始化 Servlet|第一次请求时调用init()|
|🔄 分发请求|根据 URL 找到对应 Servlet，调用service()→doGet/doPost|
|👥 多线程支持|每个请求在一个独立线程中处理|
|🧹 生命周期管理|销毁时调用destroy()|
|🛡️ 安全与配置|支持 web.xml 配置、权限控制等|

Tomcat ：Java中有名的Servlet容器实现
> Apache Tomcat 是一个开源的 Servlet 容器实现，由 Apache 基金会维护

Tomcat 包含什么？

|   |   |
|---|---|
|HTTP Server|能接收 HTTP 请求（基于 NIO/Apr）|
|Servlet Container|核心模块，叫Catalina，负责运行 Servlet|
|JSP Engine|叫Jasper，把 JSP 编译成 Servlet|
|管理界面|提供 Manager App 管理部署|

Tomcat = Web 服务器 + Servlet 容器

Java Web 的发展脉络（时间线）

|   |   |   |
|---|---|---|
|1996|Sun 发布 Servlet API 0.9|Java 正式进入 Web 开发领域|
|1997|**Servlet** 1.0 正式发布|统一了服务器端编程模型|
|1999|JSP 1.0 发布|让页面开发更简单（HTML + Java）|
|2000|**Tomcat** 3.1 发布|成为最流行的轻量级容器|
|2003|**Spring** 框架出现|解决 Servlet 开发中代码冗余问题|
|2009|Servlet 3.0（Java EE 6）|支持注解、异步处理|
|2013|Servlet 3.1|支持非阻塞 I/O（NIO）|
|2014+|**Spring Boot** 兴起|内嵌 Tomcat，无需外部部署|
||Undertow / Netty|替代 Tomcat 的高性能容器；|
||Serverless / GraalVM|甚至不需要传统容器；|

🌟 总览：Java Web 五大发展阶段

|            |           |                                 |               |
| ---------- | --------- | ------------------------------- | ------------- |
| 1️⃣ 原始动态时代 | 1996–2000 | Servlet、JSP、CGI 替代者             | 手动编码、脚本式开发    |
| 2️⃣ 框架萌芽时代 | 2000–2004 | Struts、Hibernate、EJB            | MVC 分层、配置驱动   |
| 3️⃣ 轻量革命时代 | 2004–2010 | Spring Framework、Ajax           | 注解 + IoC/DI   |
| 4️⃣ 全栈整合时代 | 2010–2017 | Spring MVC、Maven、REST API       | 前后端分离、微服务雏形   |
| 5️⃣ 云原生时代  | 2017–至今   | Spring Boot、Spring Cloud、Docker | 内嵌容器、自动装配、微服务 |

## 传统Java web开发

## MVC 模式
	MVC （Model -View - Controller）一种软件架构模式，将系统区分为模型(Model)、视图(View) 和控制器(Controller)

|   |   |   |
|---|---|---|
|Model|模型|存储数据和业务逻辑（比如用户信息、订单）|
|View|视图|显示数据（通常是 HTML 页面）|
|Controller|控制器|接收请求、调用模型、选择视图|
# Spring MVC 设计
Spring Web MVC是建立在Servlet API上的原始Web框架，采用MVC设计模式，对Servlet进行了封装和增强，**底层还是基于Tomcat+Servlet 工作。**
> 传统的Servlet开发繁琐，大量重复代码，每个URL都需要手动配置，写一个HttpServlet，手动解析参数、手动跳转页面......

 1. 理解Spring MVC核心组件与请求基本流程
 2. 2种工作模式
<div class="highlight-block highlight-tip"> 理解Spring MVC核心组件与请求基本流程 </div>

```
HTTP 请求
    ↓
[DispatcherServlet] → Spring MVC 的“总指挥”
    ↓
[HandlerMapping] → 找哪个方法能处理这个请求（@RequestMapping）
    ↓
[Controller] → 调用具体的方法（如 getUser()）
    ↓
[ModelAndView] ← 方法返回数据和视图名
    ↓
[ViewResolver] → 把视图名变成真正的页面（如 JSP、Thymeleaf）
    ↓
生成 HTML → 返回给浏览器
```

✅ 1. `DispatcherServlet` —— 前端控制器（Front Controller）

统一接收 HTTP 请求，然后分发给合适的处理器（Controller）；协调整个流程。

✅ 2. `@Controller` 和 `@RequestMapping` —— 路由绑定

✅ 3. ModelAndView 或 Model —— 数据载体

Model 是一个 Map，存放你要传给页面的数据；比如 `model.addAttribute("name", "张三")`；页面（JSP/Thymeleaf）可以用 `${name}` 取出来。

✅ 4. ViewResolver —— 视图解析器

作用：把“逻辑视图名”变成“真实页面”。
```Java
@Controller  // 注意：不是 @RestController
public class PageController {

    @GetMapping("/home")
    public String home() {
        return "home"; // ← 这是一个逻辑视图名
    }
}
```

`return "home";`→ ViewResolver 查找规则 → 找到 /WEB-INF/views/home.jsp,然后返回HTML也没。对于页面常见实现：

- InternalResourceViewResolver（JSP）
    
- ThymeleafViewResolver
    
- FreeMarkerViewResolver
一次请求完整流程：
```
1. 浏览器 → GET /user/1

2. Tomcat（Servlet 容器）接收请求
   ↓
3. 查找哪个 Servlet 能处理 /user/1
   ↓
4. 找到 DispatcherServlet（它映射了所有路径）
   ↓
5. Tomcat 调用 dispatcherServlet.service(request, response)
          ↑ 这是标准 Servlet 的 service() 方法
   ↓
6. Spring MVC 开始工作：
   - HandlerMapping 查找 @RequestMapping("/user/{id}")
   - 参数解析（@PathVariable、@RequestParam）
   - 调用 UserController.getUser(id)
   - 返回 JSON 或 ModelAndView
   ↓
7. Response 写回给浏览器
```
从第3步是如何转接到Spring MVC的 DispatcherServlet的❓
```Java
public class DispatcherServlet extends FrameworkServlet {
    // ...
}
// 而 FrameworkServlet 又继承自：
 HttpServlet  ← FrameworkServlet ← DispatcherServlet
```
>所以DispatcherServlet本质上是一个标准的 HttpServlet，这个DispatcherServlet 会被注册到Servlet容器（如Tomcat）中，监听 / 或 /* 路径的所有 HTTP 请求。

<div class="highlight-block highlight-tip"> Spring MVC的2种工作模式 </div>
1. 传统模式（服务端渲染）：返回视图（如 JSP），适合小型项目或内部系统。
    
2. **现代模式（前后端分离）**：返回 JSON 数据，配合 Vue/React 使用。
```
                        开始
                          ↓
                  方法返回一个值
                          ↓
           是否有 @ResponseBody？
                ↙                 ↘
             是                    否
              ↓                     ↓
    使用消息转换器            是否是 String?
   （Jackson / Converter）         ↙   ↘
          ↓                     是     否
   直接写入响应体               ↓       ↓
                         视图为名   ModelAndView 等
                             ↓
                      ViewResolver 解析
                             ↓
                          渲染页面
```



# 工程搭建

```Bash
spring-mvc-api/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/
│       │       ├── config/          # 配置类
│       │       └── controller/      # 控制器
│       ├── resources/               # 属性文件
│       └── webapp/                  # Web 资源根目录
│           └── WEB-INF/
│               └── web.xml          # 可选：Servlet 注册（我们用 Java 替代）
├── pom.xml                          # Maven 依赖
```

1. 核心依赖
```XML
<dependencies>
    <!-- 1. Spring MVC 核心 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.31</version>
    </dependency>

    <!-- 2. Servlet API（Tomcat已提供，但编译时依赖） -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>

    <!-- 3. JSON 支持（关键！用于对象 ↔ JSON 转换） -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.15.2</version>
    </dependency>

    <!-- 4. 日志（可选但推荐） -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.7</version>
    </dependency>
</dependencies>

<!-- 打包为 WAR -->
<packaging>war</packaging>
```

📌 关键说明：

- spring-webmvc：提供控制器、请求映射、消息转换等能力；
    
- jackson-databind：让 Spring 能自动把 Java 对象转成 JSON；
    
- servlet-api：运行在 Tomcat 上所需；
没有 JSP / JSTL：因为不渲染页面。

2. 配置
✅ 1. 主配置类：启用 MVC 并扫描组件

```Java
// com.example.config.WebConfig.java
package com.example.config;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc // 启用 Spring MVC，自动注册 Jackson 消息转换器
@ComponentScan("com.example.controller")
public class WebConfig {
    // 后续可扩展：拦截器、异常处理器等
}
```

💡 @EnableWebMvc 是关键：
- 自动注册 RequestMappingHandlerMapping
- 自动注册 RequestMappingHandlerAdapter
- 自动检测 Jackson 并注册 MappingJackson2HttpMessageConverter
👉 这意味着返回的对象会自动转为 JSON

✅ 2. Servlet 初始化类（替代 web.xml）


```Java
// com.example.config.MyWebAppInitializer.java
package com.example.config;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

public class MyWebAppInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) {
        // 1. 创建 Spring 容器
        AnnotationConfigWebApplicationContext context =
            new AnnotationConfigWebApplicationContext();
        context.register(WebConfig.class); // 注册配置类

        // 2. 创建 DispatcherServlet
        DispatcherServlet dispatcher = new DispatcherServlet(context);

        // 3. 注册 Servlet 到容器
        ServletRegistration.Dynamic registration =
            servletContext.addServlet("dispatcher", dispatcher);
        registration.setLoadOnStartup(1);
        registration.addMapping("/"); // 拦截所有请求
    }
}
```

✅ 这个类会在 Tomcat 启动时自动执行，完成 Spring MVC 的初始化。🔁 替代了传统的 web.xml 和 dispatcher-servlet.xml

3. 打包部署
	1. 打包
	
	```Bash
	mvn clean package
	```
	
	2. 生成 target/spring-mvc-api.war
	    
	3. 将 WAR 包放入 Tomcat 的 webapps/ 目录
	    
	4. 启动 Tomcat：
	    
	
	```Bash
	./bin/startup.sh
	```
	
	1. 访问接口：
	    
	
	- `GET` `http://localhost:8080/spring-mvc-api/api/user?id=1`
	    
	- `POST` `http://localhost:8080/spring-mvc-api/api/user`（Body: `{ "name": "李四" }`）
	    
	
	✅ 返回 JSON，完美支持前后端分离！


# 核心注解

主要注解详解（现代 RESTful 开发必备）

|                         |                               |                                             |
| ----------------------- | ----------------------------- | ------------------------------------------- |
| @RestController         | 标记控制器，所有方法默认返回数据（JSON）        | @RestController public class UserController |
| @RequestMapping("/api") | 映射基础路径                        | @RequestMapping("/api/users")               |
| @GetMapping("/user")    | 处理 GET 请求                     | 查询用户                                        |
| @PostMapping("/user")   | 处理 POST 请求                    | 新增用户                                        |
| @PutMapping("/{id}")    | 处理 PUT 请求                     | 更新用户                                        |
| @DeleteMapping("/{id}") | 处理 DELETE 请求                  | 删除用户                                        |
| @PathVariable           | 获取 URL 路径参数                   | /user/{id}→@PathVariable Long id            |
| @RequestParam           | 获取查询参数                        | ?page=1&size=10→@RequestParam int page      |
| @RequestBody            | 将请求体反序列化为 Java 对象             | 接收前端传来的 JSON 数据                             |
| @ResponseBody           | 将返回值写入响应体（@RestController已包含） | 不用手动加                                       |

```Java
// com.example.controller.UserApiController.java
package com.example.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserApiController {

    // GET /api/user?id=1
    @GetMapping("/user")
    public Map<String, Object> getUser(@RequestParam(required = false) Long id) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", id != null ? id : 1);
        user.put("name", "张三");
        user.put("email", "zhangsan@example.com");
        return user;
    }

    // GET /api/user/1
    @GetMapping("/user/{id}")
    public Map<String, Object> getUserById(@PathVariable Long id) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", id);
        user.put("name", "用户" + id);
        return user;
    }

    // POST /api/user
    @PostMapping("/user")
    public Map<String, String> createUser(@RequestBody Map<String, Object> userData) {
        System.out.println("收到用户数据：" + userData);
        Map<String, String> result = new HashMap<>();
        result.put("message", "创建成功");
        result.put("status", "ok");
        return result;
    }
}
```

#  Filter 和 Interceptor
```Bash
HTTP 请求
    ↓
[Filter] → 可修改 request/response，如编码、CORS
    ↓
DispatcherServlet
    ↓
[Interceptor.preHandle()] → 可读取 Spring 上下文，做登录检查
    ↓
Controller Method (@GetMapping, etc.)
    ↓
[Interceptor.postHandle()] → 可操作 ModelAndView
    ↓
View Render（如果是页面）
    ↓
[Interceptor.afterCompletion()] → 最终清理
    ↓
[Filter] → 响应返回前最后处理
    ↓
HTTP 响应
```

<div class="highlight-block highlight-tip"> Filter </div>
Servlet规范定义的标准组件，作用于所有进入容器的请求，在请求到达 Servlet 前、响应返回客户端前进行拦截；可以链式执行（Filter Chain）；属于 Servlet 容器级别，不依赖 Spring。
```Java
public interface Filter {
    void init(FilterConfig config) throws ServletException;
    void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
        throws IOException, ServletException;
    void destroy();
}
```
典型应用场景

|             |              |
| ----------- | ------------ |
| 字符编码统一      | 防止中文乱码       |
| 请求日志记录      | 打印每个请求的耗时、IP |
| 权限校验        | 检查是否登录（简单场景） |
| XSS/CSRF 防护 | 过滤恶意输入       |
| 跨域支持（CORS）  | 添加响应头        |
配置
```Java
@Component  // 如果用 Spring 管理，可用 @Component + 配置注册
public class EncodingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // 设置编码
        req.setCharacterEncoding("UTF-8");
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json;charset=utf-8");

        System.out.println("👉 Filter: 请求进入 " + req.getRequestURI());

        // 放行请求
        chain.doFilter(request, response);

        System.out.println("👈 Filter: 响应完成");
    }
}
```

注册
```Java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public FilterRegistrationBean<EncodingFilter> encodingFilter() {
        FilterRegistrationBean<EncodingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new EncodingFilter());
        registrationBean.addUrlPatterns("/*"); // 拦截所有路径
        registrationBean.setOrder(1); // 执行顺序
        return registrationBean;
    }
}
```

<div class="highlight-block highlight-tip"> Interceptor </div>
Spring MVC提供的类似Filter的拦截器，只对被 DispatcherServlet 处理的请求有效；可以访问 Spring 的 Bean、注解、上下文等。
```Java
public interface HandlerInterceptor {
    default boolean preHandle(HttpServletRequest request,
                              HttpServletResponse response,
                              Object handler) throws Exception { ... }

    default void postHandle(HttpServletRequest request,
                            HttpServletResponse response,
                            Object handler,
                            ModelAndView modelAndView) throws Exception { ... }

    default void afterCompletion(HttpServletRequest request,
                                 HttpServletResponse response,
                                 Object handler,
                                 Exception ex) throws Exception { ... }
}
```

三个阶段详解：

|   |   |   |
|---|---|---|
|preHandle|控制器方法执行前|权限验证、日志、阻止请求|
|postHandle|控制器执行后，视图渲染前|修改 Model、记录耗时|
|afterCompletion|整个请求完成后（包括视图渲染）|清理资源、异常处理|

✅ 典型应用场景

|      |                    |
| ---- | ------------------ |
| 登录检查 | 检查 Session 或 Token |
| 接口权限 | RBAC 权限控制          |
| 性能监控 | 记录接口耗时             |
| 日志增强 | 记录用户行为             |
| 防重提交 | 使用 Token 机制        |


💡 示例：登录拦截器
1. 添加拦截器

```Java
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();

        // 放行登录页和静态资源
        if (uri.equals("/login") || uri.startsWith("/static/")) {
            return true;
        }

        HttpSession session = request.getSession();
        Object user = session.getAttribute("user");

        if (user != null) {
            return true; // 已登录，放行
        } else {
            // 未登录，跳转或返回 JSON
            response.sendRedirect("/login");
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) {
        System.out.println("✅ 控制器执行完毕");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        System.out.println("🔚 请求处理完成");
    }
}
```

2. 注册拦截器
```Java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/api/**")           // 拦截哪些路径
                .excludePathPatterns("/login", "/api/auth/login"); // 排除路径
    }
}
```


# 处理CORS

**Spring MVC** **处理** **CORS** **的四种方式**

|   |   |   |
|---|---|---|
|1.@CrossOrigin注解|单个控制器或方法|⭐⭐|
|2. 全局配置**WebMvcConfigurer**|项目级统一管理|⭐⭐⭐⭐⭐（推荐）|
|3. 使用 Filter 手动设置|需要底层控制|⭐⭐⭐|
|4.CorsConfigurationSourceBean|动态规则、集成 Security|⭐⭐⭐⭐|

✅ 方式1：使用 `@CrossOrigin` 注解（最简单）
直接在 Controller 或方法上加注解：

```Java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class UserController {

    @GetMapping("/user")
    public Map<String, Object> getUser() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("name", "张三");
        return user;
    }

    @PostMapping("/user")
    @CrossOrigin(
        origins = {"http://localhost:3000", "https://yourapp.com"},
        methods = {RequestMethod.POST},
        allowedHeaders = "Content-Type"
    )
    public String createUser(@RequestBody Map<String, Object> data) {
        System.out.println("创建用户：" + data);
        return "success";
    }
}
```

✅ 方式2：全局配置 —— 实现 `WebMvcConfigurer`（推荐！）

这是生产环境最推荐的方式，集中式管理所有 CORS 规则。

```Java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")           // 对哪些路径生效
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")  // 允许本地任意端口
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")             // 允许所有请求头
                .exposedHeaders("Authorization", "X-Total-Count") // 可选：暴露给前端读取的响应头
                .allowCredentials(true)          // 允许携带 Cookie/JWT
                .maxAge(3600);                   // 预检请求缓存 1 小时
    }
}
```

✅ 方式3：使用 Filter 手动设置 CORS 头（底层控制）

如果你不想依赖 Spring MVC 的 CORS 机制，可以用 Filter 自己控制。

```Java
@Component
public class SimpleCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // 设置 CORS 响应头
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // 如果是 OPTIONS 预检请求，直接返回 200，不继续执行
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 放行真实请求
        chain.doFilter(req, res);
    }
}
```

然后注册为 Bean（如果是非 Spring Boot 项目，需确保被扫描）：

```TypeScript
@Bean
public FilterRegistrationBean<SimpleCorsFilter> corsFilter() {
    FilterRegistrationBean<SimpleCorsFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new SimpleCorsFilter());
    registrationBean.addUrlPatterns("/api/*");
    registrationBean.setOrder(1); // 执行顺序
    return registrationBean;
}
```

✅ 方式4：使用 `CorsConfigurationSource`（高级用法）

适合复杂场景，比如动态允许某些域名。

```Java
@Configuration
public class AdvancedCorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 动态设置 origin（可从数据库或配置中心加载）
        config.setAllowedOriginPatterns(Arrays.asList("https://*.yourcompany.com", "http://localhost:*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "X-Request-ID"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config); // 注册路径映射
        return source;
    }
}
```
