
多层代理

# 静态代理

基本不用。

```java
public class UserServiceProxy implements UserService {

    private UserService target;

    public UserServiceProxy(UserService target) {
        this.target = target;
    }

    @Override
    public void save() {

        System.out.println("日志");

        target.save();

        System.out.println("结束");

    }

}
```


```java
UserService service =
        new UserServiceProxy(
                new UserServiceImpl());

service.save();
```