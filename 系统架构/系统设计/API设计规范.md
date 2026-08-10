
# 请求方式规范

从技术实现角度来说，所有接口都可以使用 `POST` 完成，系统功能不会受到影响。但合理使用 HTTP 请求方式可以更准确地表达接口语义，并充分利用 RESTful 风格带来的优势。

例如：

```json
GET    /orders/1
PUT    /orders/1
DELETE /orders/1
```

三个接口使用相同的 URL，通过不同的 HTTP Method 区分不同操作，无需设计 `/getOrder`、`/updateOrder`、`/deleteOrder` 等不同路径，使接口更加统一、简洁，也降低了接口命名的复杂度。同时，遵循 HTTP 语义也有利于接口文档、日志分析、网关治理及客户端理解。

### GET

适用：简单查询

```json
GET /orders/10001


GET /orders?status=WAIT_SHIP&warehouseId=1
```

另外对于系统中的分页查询，如果是个简单的单据，可以直接设计成GET查询，如果是一个复杂的单据，考虑到后续会逐渐复杂，建议在一开始就设计成POST查询。

### POST

适用：
1. 复杂查询
2. 新增
3. 业务动作

```json
POST /orders/query
{
    "orderNo":"SO20250601001",
    "warehouseIds":[
        1,
        2,
        3
    ],
    "sellerIds":[
        11,
        15,
        20
    ],
    "statusList":[
        "WAIT_SHIP",
        "SHIPPED"
    ],
    "createTime":[
        "2025-01-01",
        "2025-06-01"
    ],
    "amount":{
        "min":100,
        "max":500
    },
    "keyword":"iphone",
    "sorts":[
        {
            "field":"createTime",
            "order":"desc"
        }
    ],
    "pageNo":1,
    "pageSize":20
}

审批订单
POST /orders/10001/approve
```

### PUT

适用：
1. 更新操作

```json
PUT /orders/10001
```

### DELETE

使用：
1. 删除

```json
DELETE /orders/10001
```

说明：其实本身全部使用POST也是没有任何问题的，只是这样的话增加接口命名的压力，使用不同的请求方式，URL路径可以同名，减少命名的压力。



## Controller参数设计规范

### Path 参数
适用于：通过ID来进行的
- 查询详情
- 修改指定资源
- 删除指定资源
- 业务动作

```java
GET /orders/10001
@GetMapping("/{id}")
public Result<OrderVO> detail(@PathVariable Long id) {

}

DELETE /orders/10001
@DeleteMapping("/{id}")
public Result<Void> delete(
        @PathVariable Long id) {

}

POST /orders/10001/approve
@PostMapping("/{id}/approve")
public Result<Void> approve(
        @PathVariable Long id) {

}
```

**资源唯一标识（ID）统一使用 Path 参数，不允许放到 RequestBody 或 Query 参数。**


### Query 参数

适用于：
1. 简单的查询
2. 批量ID作为参数的

`GET /orders?pageNo=1&pageSize=20`

```java
@GetMapping
public Result<PageResult<OrderVO>> page(
        @RequestParam Integer pageNo,
        @RequestParam Integer pageSize) {
}
```

或者更推荐：
```java
注：没有任何注解的复杂对象，默认就按照`@ModelAttribute`处理。
@GetMapping
public Result<PageResult<OrderVO>> page(
        OrderPageQuery query) {
}

public class OrderPageQuery {
    private Integer pageNo;
    private Integer pageSize;
    private Integer warehouseId;
    private Integer status;
}
```

Spring 会自动绑定，GET 查询推荐使用 Query Object 接收，不建议 Controller 出现大量`@RequestParam`

批量ID：

```java

DELETE /orders?ids=1,2,3
或者
DELETE /orders?ids=1&ids=2&ids=3

@DeleteMapping
public Result<Void> delete(
        @RequestParam List<Long> ids) {

}
```

注意：这里的` @RequestParam` 虽然可以省略，Spring MVC会默认默认按照 RequestParam去解析，但是还是建议加上，清晰。


### RequestBody

1. 新增
2. 复杂查询
3. 更新

```java
@PostMapping
public Result<Long> create(
        @RequestBody OrderCreateCmd cmd) {

}

@PostMapping("/query")
public Result<PageResult<OrderVO>> query(
        @RequestBody OrderQuery query) {

}
```

### 文件上传

首先一旦涉及文件，HTTP 请求就必须变成：
```http
Content-Type: multipart/form-data
```

这样浏览器会把整个请求拆分成多个 Part（部分）。
```text
Part1
name=name
value=iPhone16

Part2
name=price
value=8999

Part3
name=image
file=image.png
```

1、单个文件上传
```java
@PostMapping("/upload")
public Result<FileVO> upload(
        @RequestPart MultipartFile file) {

}
```

2、多个文件上传

```java
@PostMapping("/upload")
public Result<List<FileVO>> upload(
        @RequestPart List<MultipartFile> files) {

}
```

3、如果需要文件与普通字段一起上传，那么普通字段必须通过@RequestParam绑定

```text
multipart/form-data

name=iPhone16

price=8999

categoryId=1

image=image.png
```

把普通字段封装成一个对象，Spring会自动把普通字段绑定到对象里，把文件单独绑定到MultipartFile中
```java
@PostMapping
public Result<Long> create(
        ProductCreateCmd cmd,
        @RequestPart MultipartFile image) {

}

或者
@PostMapping
public Result<Long> create(

        @RequestParam String name,

        @RequestParam BigDecimal price,

        @RequestParam Long categoryId,

        @RequestPart MultipartFile image) {

}

如果多个文件
@PostMapping
public Result<Long> create(

        ProductCreateCmd cmd,

        @RequestPart List<MultipartFile> images) {

}
```

#### 文件上传接口单独设计

### 文件下载
文件下载和普通的返回json数据格式的不同点就在于，返回的响应header和body（二进制流）不同

```
HTTP/1.1 200 OK

Content-Type: application/pdf

Content-Disposition: attachment; filename="demo.pdf"

Content-Length: 102400

(binary...)
```


```java
@GetMapping("/{id}/download")
public void download(
        @PathVariable Long id,
        HttpServletResponse response) {

}

```


#### 下载

#### 在线预览

#### 实时导出

