
1. mybatis-config.xml配置文件：


# CRUD 操作

最基本的流程：获取到`sqlSession` 对象，然后调用 `select update delete insert` 方法，传入SQLID，还有参数，返回结果。

1. 对于增删改操作，只需要处理参数的传递
2. 对于查询操作，除了参数的处理，还有结果集的映射