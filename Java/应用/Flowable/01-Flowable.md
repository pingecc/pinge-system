# 依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <modelVersion>4.0.0</modelVersion>  
  
    <groupId>org.pinge</groupId>  
    <artifactId>flowable</artifactId>  
    <version>1.0-SNAPSHOT</version>  
  
    <!-- Spring Boot 3.x 父工程 -->  
    <parent>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-parent</artifactId>  
        <version>3.2.5</version> <!-- 2026 年稳定版 -->  
        <relativePath/>  
    </parent>  
  
    <properties>  
        <maven.compiler.source>17</maven.compiler.source>  
        <maven.compiler.target>17</maven.compiler.target>  
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>  
        <flowable.version>8.0.0</flowable.version> <!-- 最新稳定版 -->  
    </properties>  
  
  
    <dependencies>  
        <!-- Web 支持 -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  
  
        <!-- Flowable 核心 Starter（自动配置引擎） -->  
        <dependency>  
            <groupId>org.flowable</groupId>  
            <artifactId>flowable-spring-boot-starter</artifactId>  
            <version>${flowable.version}</version>  
        </dependency>  
  
        <!-- MySQL 驱动 -->  
        <dependency>  
            <groupId>mysql</groupId>  
            <artifactId>mysql-connector-java</artifactId>  
            <version>8.0.33</version>  
            <scope>runtime</scope>  
        </dependency>  
  
        <!-- 测试 -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-test</artifactId>  
            <scope>test</scope>  
        </dependency>  
  
        <!-- MyBatis -->  
        <dependency>  
            <groupId>org.mybatis.spring.boot</groupId>  
            <artifactId>mybatis-spring-boot-starter</artifactId>  
            <version>3.0.3</version>  
        </dependency>  
  
        <!-- Lombok -->  
        <dependency>  
            <groupId>org.projectlombok</groupId>  
            <artifactId>lombok</artifactId>  
        </dependency>  
    </dependencies>  
  
    <build>  
        <plugins>  
            <plugin>  
                <groupId>org.springframework.boot</groupId>  
                <artifactId>spring-boot-maven-plugin</artifactId>  
            </plugin>  
        </plugins>  
    </build>  
</project>
```

## 配置

```yml
spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/flowable_demo?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai  
    username: root  
    password: root123456  
    driver-class-name: com.mysql.cj.jdbc.Driver  
  
# Flowable 专属配置  
flowable:  
  database-schema-update: true   # 启动时自动建表/更新表结构  
  async-executor-activate: true  # 启用异步执行器  
  history-level: audit           # 历史数据级别：none/activity/audit/full
```


首次启动后，Flowable 会自动创建 70+ 张表（如 ACT_RE_PROCDEF, ACT_RU_TASK）。
生产环境应将 database-schema-update 设为 false。



## 流程实例

ProcessInstance 是 BPMN 流程定义（Process Definition）的一次具体执行，代表一个正在运行或已结束的业务流程实例，每执行一次就创建一个ProcessInstance，**每一个ProcessInstance都会对应的一条业务单据进行绑定**