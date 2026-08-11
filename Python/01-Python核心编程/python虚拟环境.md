Python 虚拟环境是一种隔离的 Python 运行环境，可以为**每个项目单独管理依赖包和 Python 解释器版本**，避免不同项目之间的包冲突。

> 简单来说在一个项目创建了虚拟环境，那么这个项目下载的所有依赖都会在当前项目下对应的虚拟环境文件夹下。

### 为什么需要虚拟环境？

- 不同项目可能依赖同一库的不同版本（例如项目 A 需要 `requests==2.25`，项目 B 需要 `requests==2.31`）。
- 全局安装会污染系统 Python，容易导致版本冲突或权限问题。
- 方便复现环境（通过 `requirements.txt` 或 `pyproject.toml`）。
- 团队协作时保证依赖一致。

### 标准工具：`venv`（Python 3.3+ 自带）

#### 1. 创建虚拟环境

```bash
# 1. 先创一个项目目录，进入到这个项目目录下
# 2. 创建名为 myenv 的虚拟环境 当前Python使用的是什么版本，对应的虚拟环境就使用什么版本的解释器
python -m venv myenv

# 或指定 Python 版本
python3.11 -m venv myenv
```

创建后会生成一个目录（`myenv/`），里面包含独立的 Python 解释器和 `pip`。

>一般会使用 .venv 这个名字，Pycharm就是

#### 2. 激活虚拟环境

| 系统                     | 激活命令                     |
| ------------------------ | ---------------------------- |
| **Linux / macOS**        | `source myenv/bin/activate`  |
| **Windows (CMD)**        | `myenv\Scripts\activate.bat` |
| **Windows (PowerShell)** | `myenv\Scripts\Activate.ps1` |

激活成功后，命令行前面通常会显示 `(myenv)`。

#### 3. 安装包

```bash
# 虚拟环境激活成功之后，在当前项目目录下下在的依赖会安装到myenv中
pip install requests pandas
# 或从文件安装
pip install -r requirements.txt
```

#### 4. 导出依赖

```bash
pip freeze > requirements.txt
```

#### 5. 退出虚拟环境

```bash
deactivate
```

#### 6. 删除虚拟环境

直接删除整个目录即可：

```bash
rm -rf myenv          # Linux/macOS
# Windows 直接删除文件夹
```

## 最佳实践

1. **每个项目一个虚拟环境**，不要在全局 `pip install`。
2. 把虚拟环境目录加入 `.gitignore`（不要提交到 Git）。
3. 使用 `requirements.txt` 或更好的 `pyproject.toml`（配合 Poetry / Hatch / uv）记录依赖。
4. 推荐目录结构：
   ```
   project/
   ├── .venv/                 # 虚拟环境（不提交）
   ├── src/
   ├── requirements.txt
   └── README.md
   ```
5. 一般直接在在PyCharm中直接选择虚拟环境解释器更方便



# 为什么Python需要虚拟环境而Java不需要



1、为什么Python需要？

- 使用 `pip install xxx`   默认可以不用声明版本，且下载后**site-packages 中同名的包只存在一个版本**，所以后来下载的如果和前面已经存在的版本不一样，那么会直接覆盖
- 代码里 `import requests`  时，会直接从 site-packages 里找，也**没有地方去声明版本**



2、Java为什么不需要

- Java通过Maven来管理时，不管是下载依赖还是声明使用依赖，都必须指定版本
- 本地仓库 ~/.m2/repository 里，依赖也是按坐标+版本完整路径存储的

