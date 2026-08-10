

# 最佳实践

## BeanUtil


1. 使用hutool的BeanUtil工具来拷贝对象时，如果目标对象的是准备存入数据库的，也即实体对象，记得忽略id字段。