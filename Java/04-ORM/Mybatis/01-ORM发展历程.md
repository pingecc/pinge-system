1. 理解掌握使用原生JDBC来操作数据库需要做哪些繁琐的事情
2. Mybatis框架替我们封装了哪些事情
3. 使用Mybatis的基本步骤


# JDBC操作数据库

假设现在本地数据库我们有一张t_user表，下面演示直接基于JDBC操作数据库的基本流程：

1. 通过驱动获取一个数据库连接
2. 编写SQL语句，然后使用Statement执行
3. 对SQL的执行结果逐步获取每个字段值，然后封装到Java对象

```Java
// 注册 JDBC 驱动
Class.forName("com.mysql.cj.jdbc.Driver");

// 打开连接
conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mybatisdb?characterEncoding=utf-8&serverTimezone=UTC", "root", "123456");

// 执行查询
stmt = conn.createStatement();
String sql = "SELECT id,user_name,real_name,password,age,d_id from t_user where id = 1";
ResultSet rs = stmt.executeQuery(sql);

// 获取结果集
while (rs.next()) {
    Integer id = rs.getInt("id");
    String userName = rs.getString("user_name");
    String realName = rs.getString("real_name");
    String password = rs.getString("password");
    Integer did = rs.getInt("d_id");
    user.setId(id);
    user.setUserName(userName);
    user.setRealName(realName);
    user.setPassword(password);
    user.setDId(did);

    System.out.println(user);
}
```


以上可以看出来直接使用原生JDBC来操作数据库的话，需要做以下繁琐的事情：

1. 自己来维护数据库的资源和连接
2. 对于SQL的语句的占位符，需要自己逐步设置好参数
3. 对于结果集需要自己逐步完成和Java对象的映射



## Spring JDBC

Spring JDBC 在JDBC上做了轻量级的封装，通过提供了JdbcTemplate，里面封装了各种各样的 execute,query和update方法，应用层面只需要提供数据源、编写SQL语句、提取结果集就可以了，使用过程接近JDBC操作。

1、配置JdbcTemplate

```Java
@Configuration
@ComponentScan
public class SpringConfig {

    @Bean
    public DataSource dataSource(){
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("123456");
        dataSource.setUrl("jdbc:mysql://localhost:3306/mybatisdb?characterEncoding=utf-8&serverTimezone=UTC");
        return  dataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource){
        JdbcTemplate template = new JdbcTemplate();
        template.setDataSource(dataSource);
        return template;
    }
}
```

2、CRUD操作

```Java
@Repository
public class UserDao {

    @Autowired
    private JdbcTemplate template;

    public void addUser(){
        int count = template.update("insert into t_user(user_name,real_name)values(?,?)","bobo","波波老师");
        System.out.println("count = " + count);
    }


    public void query1(){
        String sql = "select * from t_user";
        List<User> list = template.query(sql, new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUserName(rs.getString("user_name"));
                user.setRealName(rs.getString("real_name"));
                return user;
            }
        });
        for (User user : list) {
            System.out.println(user);
        }
    }

    public void query2(){
        String sql = "select * from t_user";
        List<User> list = template.query(sql, new BeanPropertyRowMapper<>(User.class));
        for (User user : list) {
            System.out.println(user);
        }
    }

}
```

## Mybatis

对JDBC的更进一步封装，提供以下服务：
- 数据库资源的管理：不需要我们自己建立数据库连接，释放
- 自动完成SQL结果集和Java对象的映射
- SQL与Java对象分离，提供XML或者注解的方式来编写SQL