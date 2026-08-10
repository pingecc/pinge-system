
# 依赖

```xml
<dependencies>  
    <!-- 日志门面：SLF4J -->  
    <dependency>  
        <groupId>org.slf4j</groupId>  
        <artifactId>slf4j-api</artifactId>  
        <version>2.0.12</version>  
    </dependency>  
  
    <!-- 日志实现：Logback -->  
    <dependency>  
        <groupId>ch.qos.logback</groupId>  
        <artifactId>logback-classic</artifactId>  
        <version>1.4.14</version>  
    </dependency>  
  
  <!-- 通过lombok提供的注解来使用使用日志 -->  
    <dependency>  
        <groupId>org.projectlombok</groupId>  
        <artifactId>lombok</artifactId>  
        <version>1.18.34</version> 
        <scope>provided</scope> <!-- 只在编译期生效，不打入最终 jar -->    </dependency>  
  
  
</dependencies>
```



## 配置文件

在 src/main/resources目录下创建 logback.xml文件，logback会默认读取

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds">

    <!-- 定义日志输出格式 -->
    <property name="LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"/>

    <!-- 控制台输出（带颜色） -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %highlight(%-5level) %cyan(%logger{15}) - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 普通日志文件（按天滚动，保留30天） -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 每天生成新文件，压缩旧日志 -->
            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
            <maxHistory>30</maxHistory>
            <!-- 单个文件最大100MB，防止当天日志过大 -->
            <timeBasedFileNamingAndTriggeringPolicy
                class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- 错误日志单独输出 -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/error.log</file>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/error.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- 根日志级别，默认 INFO -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR_FILE"/>
    </root>

    <!-- 可选：为特定包设置 DEBUG 级别 -->
    <!--
    <logger name="com.yourcompany.mapper" level="DEBUG"/>
    -->

</configuration>
```

- 日志会自动创建 ./logs/ 目录（相对于 jar 启动路径）
- app.log：当前日志
- app.2026-04-12.0.log.gz：历史归档日志（压缩节省空间）

## 使用

1、手动使用

```TypeScript
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public void createUser(String name) {
        log.info("Creating user: {}", name); // 推荐使用占位符 {}

        try {
            // ... 业务逻辑
            log.debug("User ID generated: {}", userId);
        } catch (Exception e) {
            log.error("Failed to create user: {}", name, e); // 记录异常堆栈
        }
    }
}
```


2、使用lombok直接使用

```java
@Slf4j
public class UserService {
    public void method() {
        log.info("Hello");
    }
}
```
