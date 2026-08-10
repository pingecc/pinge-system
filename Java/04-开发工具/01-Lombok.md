通过注解在**编译期自动生成样板代码**（如 getter/setter、toString、构造函数等,Lombok 在编译期工作，不影响运行时性能（不是反射）
# 引入依赖


```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.34</version> <!-- 推荐使用最新版 -->
    <scope>provided</scope> <!-- 只在编译期生效，不打入最终 jar -->
</dependency>
```


## IDEA 下载插件

安装 lombok插件，为例更好的开发支持，本身不下载也不影响正常编译运行。


## 应用程序使用

| 注解                         | 作用范围     | 功能说明                                                                                                   | 生成的代码示例                                                                                   |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `@Getter`                  | 类 / 字段   | 自动生成所有字段（或指定字段）的 getter 方法                                                                             | `public String getName() { return name; }`                                                |
| `@Setter`                  | 类 / 字段   | 自动生成所有字段（或指定字段）的 setter 方法                                                                             | `public void setName(String name) { this.name = name; }`                                  |
| `@ToString`                | 类        | 自动生成 `toString()` 方法，默认包含所有字段                                                                          | `public String toString() { return "User(name=..., age=...)"; }`  <br>支持 `exclude` 排除敏感字段 |
| `@EqualsAndHashCode`       | 类        | 自动生成 `equals()` 和 `hashCode()` 方法                                                                      | 基于所有非静态、非 transient 字段比较                                                                  |
| `@Data`                    | 类        | 组合注解：  <br>相当于 `@Getter` + `@Setter` + `@ToString` + `@EqualsAndHashCode` + `@RequiredArgsConstructor` | 一键生成 POJO 所需全部样板代码                                                                        |
| `@NoArgsConstructor`       | 类        | 生成无参构造函数                                                                                               | `public User() {}`                                                                        |
| `@AllArgsConstructor`      | 类        | 生成包含所有字段的构造函数                                                                                          | `public User(String name, int age) { ... }`                                               |
| `@RequiredArgsConstructor` | 类        | 为 `final` 字段和标记了 `@NonNull` 的字段生成构造函数                                                                  | `public User(String name) { this.name = name; }`                                          |
| `@Builder`                 | 类 / 构造函数 | 提供建造者模式（Builder Pattern）支持                                                                             | `User user = User.builder().name("Alice").age(30).build();`                               |
| `@Slf4j`                   | 类        | 自动注入 SLF4J 日志对象 `log`                                                                                  | `private static final Logger log = LoggerFactory.getLogger(User.class);`                  |
| `@Log`                     | 类        | 使用 `java.util.logging` 日志                                                                              | `private static final Logger log = Logger.getLogger(User.class.getName());`               |
| `@Log4j2`                  | 类        | 自动注入 Log4j2 的 `Logger`                                                                                 | `private static final Logger log = LogManager.getLogger(User.class);`                     |
| `@NonNull`                 | 参数 / 字段  | 自动生成空值检查（抛出 `NullPointerException`）                                                                    | `if (name == null) throw new NullPointerException("name is marked non-null");`            |
| `@Cleanup`                 | 局部变量     | 自动调用 `close()` 方法（类似 try-with-resources）                                                               | `try (InputStream is = ...) { ... }`                                                      |
| `@SneakyThrows`            | 方法       | 隐式抛出受检异常（无需声明 throws）                                                                                  | 绕过编译器检查，慎用                                                                                |
| `@Value`                   | 类        | 生成不可变类（所有字段 private final + getter + 全参构造等）                                                            | 类似 `@Data`，但字段默认 `final`，无 setter                                                         |




```TypeScript
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserService {
    public void save() {
        log.info("Saving user..."); // 无需手动写 LoggerFactory.getLogger()
    }
}
```


```java
public void setName(@NonNull String name) {
    // Lombok 会自动插入：if (name == null) throw new NullPointerException("name is marked non-null");
    this.name = name;
}
```