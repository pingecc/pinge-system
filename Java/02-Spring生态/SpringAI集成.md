基于SpringBoot集成Spring AI

# 环境配置

### pom依赖

```XML
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>SpringAIQuickStart</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringAIQuickStart</name>
    <description>SpringAIQuickStart</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <!-- 导入 Spring AI BOM，用于统一管理 Spring AI 依赖的版本，
    引用每个 Spring AI 模块时不用再写 <version>，只要依赖什么模块 Mavens 自动使用 BOM 推荐的版本 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>1.0.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-deepseek</artifactId>
        </dependency>
    </dependencies>


    <!-- 声明仓库， 用于获取 Spring AI 以及相关预发布版本-->
    <repositories>
        <repository>
            <id>spring-snapshots</id>
            <name>Spring Snapshots</name>
            <url>https://repo.spring.io/snapshot</url>
            <releases>
                <enabled>false</enabled>
            </releases>
        </repository>
        <repository>
            <name>Central Portal Snapshots</name>
            <id>central-portal-snapshots</id>
            <url>https://central.sonatype.com/repository/maven-snapshots/</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>

</project>
```


### 配置大模型服务地址

配置resources/application.properties

```XML
spring.application.name=SpringAIQuickStart

server.port=8080

#配置 Deepseek的基础URL、密钥和使用模型
spring.ai.deepseek.base-url=https://api.deepseek.com
spring.ai.deepseek.api-key=sk-你的DeepSeekKey
spring.ai.deepseek.chat.options.model=deepseek-chat

# 介于0和2之间，0表示随机性最小，2表示随机性最大。
spring.ai.deepseek.chat.options.temperature=0.8
```

### 测试

创建ChatController 进行测试


```java
import org.springframework.ai.deepseek.DeepSeekChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class ChatController {
    @Autowired
    private DeepSeekChatModel chatModel;

    @GetMapping("/generate")
    public String generate(@RequestParam(value = "message", defaultValue = "给我讲个笑话") String message) {
        System.out.println("收到消息："+message);
        String result = chatModel.call(message);
        //模型返回的内容
        System.out.println(result);
        return result;
    }

}
```


![[Pasted image 20260408211626.png]]