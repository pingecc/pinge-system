
`requests` 是 Python 中最流行的 HTTP 请求库，口号是 **"HTTP for Humans"** —— 让发送网络请求变得简单直观。

# 安装

```bash
pip install requests
```

# GET 请求

```python
import requests

response = requests.get("https://httpbin.org/get")
print(response.status_code)   # 状态码，200 表示成功
print(response.text)          # 响应内容（字符串）
print(response.json())        # 如果是 JSON，直接转成 Python 字典
```

### 常用参数

## 查询参数

```python
params = {
    "key1": "value1",
    "key2": "value2"
}
r = requests.get("https://httpbin.org/get", params=params)
print(r.url)  # 自动拼成 https://httpbin.org/get?key1=value1&key2=value2
```

## 请求头

```python
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Authorization": "Bearer your_token_here"
}
r = requests.get("https://api.example.com/data", headers=headers)
```

# POST 请求

发送表单或者json

```python
# 发送表单数据（application/x-www-form-urlencoded）
data = {"username": "admin", "password": "123456"}
r = requests.post("https://httpbin.org/post", data=data)

# 发送 JSON（更常用）
json_data = {"name": "张三", "age": 25}
r = requests.post("https://httpbin.org/post", json=json_data)
# 等价于：
# headers = {"Content-Type": "application/json"}
# r = requests.post(..., data=json.dumps(json_data), headers=headers)
```

## 响应对象

| 属性/方法              | 说明                          |
|-----------------------|-----------------------------|
| `r.status_code`       | 状态码                        |
| `r.ok`                | 状态码 < 400 时为 True         |
| `r.text`              | 文本内容（自动解码）            |
| `r.content`           | 原始字节内容                   |
| `r.json()`            | 解析 JSON                     |
| `r.headers`           | 响应头（类似字典）              |
| `r.cookies`           | 响应的 Cookies                |
| `r.encoding`          | 编码（可手动修改）              |
| `r.raise_for_status()`| 状态码不是 2xx 时抛出异常       |

# 超时与异常处理

```python
try:
    r = requests.get("https://httpbin.org/delay/5", timeout=3)  # 3秒超时
    r.raise_for_status()   # 4xx/5xx 会抛出 HTTPError
except requests.exceptions.Timeout:
    print("请求超时")
except requests.exceptions.HTTPError as e:
    print(f"HTTP 错误: {e}")
except requests.exceptions.RequestException as e:
    print(f"请求异常: {e}")
```

常用异常：
- `Timeout`
- `ConnectionError`
- `HTTPError`
- `TooManyRedirects`
- `RequestException`（基类）

# Session

通过Session来服用网络连接，通常用于需要保持登录状态、Cookies 时

```python
session = requests.Session()

# 先登录
session.post("https://example.com/login", data={"user": "admin", "pass": "123"})

# 后续请求自动带上 Cookie
r = session.get("https://example.com/profile")
print(r.text)

session.close()  # 用完关闭
```

也可以用上下文管理器：

```python
with requests.Session() as s:
    s.get(...)
```


# 完整小例子

```python
import requests

def get_weather(city):
    url = "https://api.example.com/weather"
    params = {"city": city, "key": "你的API密钥"}
    headers = {"User-Agent": "MyWeatherApp/1.0"}
    
    try:
        r = requests.get(url, params=params, headers=headers, timeout=5)
        r.raise_for_status()
        data = r.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

print(get_weather("北京"))
```
