`pathlib` 是 Python 3.4 起引入的标准库，用**面向对象**的方式处理文件系统路径，目标是替代传统的 `os.path` 模块。它的核心优势是：**路径即对象**，操作直观、跨平台、可读性高。最常用的是 `Path` 这个类。

```python
from pathlib import Path
```



# 获取路径对象



1. 传入路径，直接返回对应的路径对象。

```python
p = Path('/usr/local/bin')      # Linux/Mac 绝对路径
p = Path('data/report.txt')     # 相对路径
```



2. 用 / 拼接路径，要求至少有一个是Path对象

```python
p = Path('home') / 'user' / 'documents' / 'file.txt'
print(p)  # home/user/documents/file.txt  (Linux/macOS)
          # home\user\documents\file.txt  (Windows，显示时会自动适配)
```

# 目录操作

1. `iterdir()` 方法：当 Path 对象指向一个目录时，iterdir() 会返回一个迭代器（generator），依次产出该目录下所有直接子项（文件和子目录）的 Path 对象

- 不包含特殊目录 . 和 ..

- 顺序是任意的（不保证按名字排序）

- 只遍历**当前这一层**，不递归进入子目录

```python
 # 遍历当前目录
for file in Path('.').iterdir():     
    print(file)


```



2. `glob()` 和 `rglob()` ：，根据给定的相对模式（pattern）进行匹配，返回一个迭代器，依次产出所有匹配的 Path 对象。rglob会递

```python
# 当前目录下所有 .py 文件
for py_file in Path('src').glob('*.py'):   
    print(py_file)

# 当前目录及所有子目录中的 .py 文件
for py_file in Path('src').rglob('*.py'):  
    print(py_file)
```



# resolve()

把路径变成绝对路径，并解析掉符号链接（symlink）以及 . 和 .

| 场景                     | 为什么需要 `resolve()`                                   | 示例                                               |
| ------------------------ | -------------------------------------------------------- | -------------------------------------------------- |
| **获取真实绝对路径**     | 相对路径、当前工作目录变化时，需要确定文件的真实位置     | `Path(__file__).resolve().parent` 获取脚本所在目录 |
| **处理符号链接**         | 想拿到链接指向的真实文件，而不是链接本身                 | `/tmp/link` → `/home/user/real_file.txt`           |
| **消除 `..` 和 `.`**     | 路径拼接后出现冗余，需要干净的路径                       | `Path('a/b/../c').resolve()` → `.../a/c`           |
| **比较两个路径是否相同** | 不同写法可能指向同一个文件（相对路径、符号链接、大小写） | `path1.resolve() == path2.resolve()`               |
| **规范化配置文件路径**   | 配置里写的是相对路径或带 `..` 的路径，需要统一成绝对路径 | 加载配置后统一 `config_path = Path(cfg).resolve()` |
| **跨平台路径处理**       | 不同操作系统路径写法不同，统一成规范形式                 | Windows 盘符、大小写规范化                         |



```python
from pathlib import Path

# 1. 获取当前脚本所在的绝对目录（最常用）
script_dir = Path(__file__).resolve().parent
print(script_dir)

# 2. 处理带 .. 的路径
messy = Path('project/data/../config/settings.yaml')
clean = messy.resolve()
print(clean)   # 干净的绝对路径

# 3. 判断两个路径是否指向同一个文件
p1 = Path('link_to_file')
p2 = Path('/real/path/to/file')
if p1.resolve() == p2.resolve():
    print("是同一个文件")

# 4. 严格模式：确保路径真实存在
try:
    real_path = Path('important.txt').resolve(strict=True)
except FileNotFoundError:
    print("文件不存在")
```



# 常用属性

```python
p = Path('/home/user/docs/report.txt')

p.name          # 'report.txt'      文件名（含后缀）
p.stem          # 'report'          文件名（不含后缀）
p.suffix        # '.txt'            后缀
p.suffixes      # ['.txt']          所有后缀（如 .tar.gz）
p.parent        # Path('/home/user/docs')  父目录
p.parents       # 所有祖先目录的序列
p.parts         # ('/', 'home', 'user', 'docs', 'report.txt')  路径各部分
p.anchor        # '/'               盘符或根目录

# 4. 路径信息查询
p.exists()      # 是否存在
p.is_file()     # 是否是文件
p.is_dir()      # 是否是目录
p.is_symlink()  # 是否是符号链接
p.stat()        # 获取文件状态（大小、修改时间等）
```



# 文件读写



```python

# 直接文件读写（无需 open()）
p.write_text('Hello, pathlib!', encoding='utf-8')
content = p.read_text(encoding='utf-8')
bytes_data = p.read_bytes()
p.write_bytes(b'binary data')
```



