MinIO 是Go语言开发的，一个高性能、开源的**对象存储系统**，100% 兼容 Amazon S3 API。它可以帮你轻松搭建一个类似阿里云OSS或AWS S3的私有云存储服务[](https://www.ctyun.cn/developer/article/420699024166981)[](https://developer.baidu.com/article/detail.html?id=3234345)。提供终多编程语言的客户端：


MinIO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.


# 核心概念

## Bucket

Bucket 是存储Object的逻辑空间，每个Bucket之间的数据是相互隔离的，对用户而言，相当于存放文件的顶层文件夹；


## Object

Object 是存储到MinIO的基本对象，对用户而言，相当于文件；

# Java MinioClient API 

- **API 文档**：[https://minio.github.io/minio-java/](https://minio.github.io/minio-java/)
- **示例代码库**：[https://github.com/minio/minio-java/tree/master/src/test/java/io/minio/examples](https://github.com/minio/minio-java/tree/master/src/test/java/io/minio/examples)

- **Maven 坐标**：
    
    ```xml
    <dependency>
        <groupId>io.minio</groupId>
        <artifactId>minio</artifactId>
        <version>8.5.11</version> <!-- 请检查最新版 -->
    </dependency>
    ```
    
	所有操作均通过 **Builder 模式参数对象** 调用，例如 `PutObjectArgs.builder()...build()`。

## 创建 MinioClient 实例


```java
MinioClient client = MinioClient.builder()
    .endpoint("http://localhost:9000")     // MinIO 服务地址
    .credentials("ACCESS_KEY", "SECRET_KEY") // 认证凭据
    .build();
```

支持的配置项：

|方法|说明|
|---|---|
|`.endpoint(String url)`|必填，MinIO/S3 服务地址（含协议和端口）|
|`.credentials(String accessKey, String secretKey)`|必填（除非使用 IAM 角色或临时凭证）|
|`.region(String region)`|可选，S3 区域（MinIO 通常忽略）|
|`.httpClient(OkHttpClient)`|可选，自定义 HTTP 客户端（如设置超时、代理）|

> 💡 提示：在 Spring Boot 中，建议将 `MinioClient` 配置为 `@Bean` 单例。

---



## **Bucket（桶）管理**

|操作|方法|示例|
|---|---|---|
|判断桶是否存在|`bucketExists()`|`client.bucketExists(BucketExistsArgs.builder().bucket("my-bucket").build())`|
|创建桶|`makeBucket()`|`client.makeBucket(MakeBucketArgs.builder().bucket("my-bucket").build())`|
|删除桶|`removeBucket()`|`client.removeBucket(RemoveBucketArgs.builder().bucket("my-bucket").build())`|
|列出所有桶|`listBuckets()`|`List<Bucket> buckets = client.listBuckets();`|

> ✅ 注意：删除桶前必须清空所有对象。

---

## **Object（对象）操作**
（1）上传对象

```java
// 方式1：从 InputStream 上传
client.putObject(PutObjectArgs.builder()
    .bucket("my-bucket")
    .object("path/to/file.txt")
    .stream(inputStream, size, -1) // -1 表示自动分片
    .contentType("text/plain")
    .build());

// 方式2：从本地文件上传（自动处理分片）
client.uploadObject(UploadObjectArgs.builder()
    .bucket("my-bucket")
    .object("backup.zip")
    .filename("/local/backup.zip")
    .build());
```

> 🔍 `putObject` 适合小文件或流；`uploadObject` 适合大文件（自动 multipart upload）。

 （2）下载对象

```java
// 获取 InputStream（需手动关闭）
InputStream stream = client.getObject(
    GetObjectArgs.builder()
        .bucket("my-bucket")
        .object("path/to/file.txt")
        .build()
);

// 下载到本地文件
client.downloadObject(DownloadObjectArgs.builder()
    .bucket("my-bucket")
    .object("data.csv")
    .filename("/tmp/data.csv")
    .build());
```

 （3）删除对象

```java
// 删除单个
client.removeObject(RemoveObjectArgs.builder()
    .bucket("my-bucket")
    .object("old-file.log")
    .build());

// 批量删除（最多 1000 个）
List<DeleteObject> objects = Arrays.asList(
    new DeleteObject("file1"),
    new DeleteObject("file2")
);
client.removeObjects(RemoveObjectsArgs.builder()
    .bucket("my-bucket")
    .objects(objects)
    .build());
```

 （4）列出对象

```java
Iterable<Result<Item>> results = client.listObjects(
    ListObjectsArgs.builder()
        .bucket("my-bucket")
        .prefix("logs/")      // 可选：前缀过滤
        .recursive(true)      // 是否递归子目录
        .build()
);

for (Result<Item> result : results) {
    Item item = result.get();
    System.out.println(item.objectName() + " (" + item.size() + " bytes)");
}
```

---

##  **预签名 URL（临时访问）**

用于生成 **临时可公开访问的 URL**（无需暴露密钥）：

```java
// 生成 GET 下载链接（1小时有效）
String url = client.getPresignedObjectUrl(
    GetPresignedObjectUrlArgs.builder()
        .method(Method.GET)
        .bucket("my-bucket")
        .object("secret.pdf")
        .expiry(1, TimeUnit.HOURS)
        .build()
);

// 生成 PUT 上传链接（前端直传）
String uploadUrl = client.getPresignedObjectUrl(
    GetPresignedObjectUrlArgs.builder()
        .method(Method.PUT)
        .bucket("my-bucket")
        .object("user/avatar.jpg")
        .expiry(30, TimeUnit.MINUTES)
        .build()
);
```

> ✅ 安全提示：不要长期公开敏感文件的预签名 URL。

---

##  **元数据与属性**
获取对象信息（不含数据）：

```java
StatObjectResponse stat = client.statObject(
    StatObjectArgs.builder()
        .bucket("my-bucket")
        .object("image.png")
        .build()
);
System.out.println("Size: " + stat.size());
System.out.println("ETag: " + stat.etag());
System.out.println("ContentType: " + stat.contentType());
```

---

##  **错误处理**

MinIO SDK 抛出 **受检异常（Checked Exceptions）**，需捕获：

```java
try {
    client.putObject(...);
} catch (ErrorResponseException e) {
    // MinIO/S3 返回的错误（如 403, 404）
    System.err.println("Error code: " + e.errorResponse().code());
} catch (InsufficientDataException | InternalException | 
         InvalidKeyException | InvalidResponseException |
         IOException | NoSuchAlgorithmException | 
         XmlParserException e) {
    // 其他底层异常
    e.printStackTrace();
}
```

> 💡 建议封装为自定义运行时异常（如 `MinioException`）以便业务层处理。

---

##  其它

|功能|说明|
|---|---|
|**版本控制**|通过 `versionId()` 参数操作特定版本对象|
|**对象锁定（Object Lock）**|合规保留/治理模式（需 Bucket 启用）|
|**事件通知**|不直接支持，需通过 MinIO 控制台配置 webhook/Kafka|
|**加密**|上传时指定 `sse()`（服务器端加密）|
|**复制**|使用 `copyObject()` 实现跨桶/跨站点复制|

---

## 最佳实践总结

1. **复用 MinioClient 实例**：它是线程安全的，应作为单例使用。
2. **大文件用 `uploadObject`**：自动分片，避免内存溢出。
3. **及时关闭 InputStream**：`getObject()` 返回的流必须 try-with-resources。
4. **不要硬编码密钥**：使用环境变量或配置中心。
5. **生产环境启用 HTTPS**：`.endpoint("https://...")`
6. **合理设置超时**：通过自定义 `OkHttpClient` 配置连接/读取超时。

---
