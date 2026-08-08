SQL本质（不是语法，是思维）重点不是会写，而是理解：
- SELECT 本质是“集合运算”
- JOIN 本质是“笛卡尔积 + 过滤”
- WHERE / GROUP BY / HAVING 执行顺序

**SQL 是声明式语言，不是过程式语言**
# SELECT

1. 所有运算符或列值遇到null值，运算的结果都为null
2. 需要保证表中的字段、表名等没有和保留字、数据库系统或常用方法冲突。如果真的相同，请在SQL语句中使用一对``（着重号）引起来。


case表达式
1. 基于某列简单值相等判断
2. 在`when` 中写搜索

```SQL
    --简单CASE表达式
    CASE sex
      WHEN '1' THEN ’男’
      WHEN '2' THEN ’女’
    ELSE sex END

    --搜索CASE表达式
    CASE WHEN sex ='1'THEN’男’
        WHEN sex ='2'THEN’女’
    ELSE sex END
```
>CASE表达式在执行时会被判定为一个固定值，因此它可以写在聚合函数内部；也正因为它是表达式，所以还可以写在SELECE子句、GROUP BY子句、WHERE子句、ORDER BY子句里。简单点说，在能写列名和常量的地方，通常都可以写CASE表达式


<div class="highlight-block highlight-tip"> 理解SELECT 语句执行过程</div>
```SQL
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT 的字段 -> DISTINCT -> ORDER BY -> LIMIT
```

```SQL
#其中：
#（1）from：从哪些表中筛选
#（2）on：关联多表查询时，去除笛卡尔积
#（3）where：从表中筛选的条件
#（4）group by：分组依据
#（5）having：在统计结果中再次筛选
#（6）order by：排序
#（7）limit：分页
```

# 函数

对于函数这块，大部分的数据库之间的差异很大，很多数据库都有自己特定的函数，函数可以分为单行函数和多行函数：
![[Pasted image 20260325143900.png]]


# 分页

MySQL中使用 LIMIT 实现分页：
`LIMIT [位置偏移量,] 行数`
```SQL
--前10条记录：
SELECT * FROM 表名 LIMIT 0,10;
或者
SELECT * FROM 表名 LIMIT 10;
--第11至20条记录：
SELECT * FROM 表名 LIMIT 10,10;
--第21至30条记录：
SELECT * FROM 表名 LIMIT 20,10;
```
在应用层基于LIMIT实现分页的逻辑为：`（当前页数-1）*每页条数，每页条数`
```SQL
SELECT * FROM table
LIMIT(PageNo - 1)*PageSize,PageSize;
```

# 查询专题
## 多表查询

**多表join查询本质是集合运算**，每个表就是一个集合，按照条件进行组合运算。假设我有两个集合 X 和 Y，那么 X 和 Y 的笛卡尔积就是 X 和 Y 的所有可能组合，个数即为两个集合中元素个数的乘积数
```SQL
举例说明：集合A:{1, 2, 3} 集合B:{2, 3, 4}

内连接：A inner join B = {2, 3}

左外连接：A left join B = {1, 2, 3}

右外连接：A right join B = {2, 3, 4}

```

- 左外连接：无条件保留左表A，然后再按照ON条件去匹配右表B。
- 右外连接：无条件保留右表B，再按照On条件去匹配左表A。
- 内连接：只要有一方不满足ON条件，直接滚蛋，必须全部满足。可以简单理解为以集合A为基础，拿着集合A的每条数据按照ON条件依次去匹配集合B，匹配到了才保留。
> 左外连接和右外连接存在意义就是为了处理/显示“缺失”的情况。

## 分组

将结果集按照一个或多个列的值进行分组，然后对每个组应用聚合函数（如 COUNT, SUM, AVG, MAX, MIN 等），最终返回每个组的一行汇总数据。
`SELECT`中所有未应用聚合函数的列都应该出现在 `Group By`列中。


![[数据库_2026-03-25 14.53.15.excalidraw]]

## 子查询



