**Git 首先是一个内容寻址（Content Addressable）的对象数据库，其次才是一个版本控制系统。**

# Chapter01：认识Git
版本控制系统用于记录历史、管理变化、支持协作，而不是保存多个文件副本。Git 与集中式版本控制最大的区别在于：**每个开发者本地都是完整仓库**，包含：
- 全部 Commit
- 全部 Branch
- 全部 Tag
- 全部历史
服务器中的远程仓库只是共享与同步中心。







Git 之所以快：绝大多数操作都在本地完成，不需要访问网络。
例如：
- 查看历史
- 创建分支
- 切换分支
- 比较版本
- 查看提交
- 回退历史
只有 `push`、`fetch` 等同步操作才需要访问远程仓库。

Git 的本质是一个基于哈希的对象数据库，版本控制只是建立在对象模型之上的能力。


## Chapter02：Git中的四种对象

每个对象都有唯一标识：`SHA(Hash)` Git 不是按照文件名寻找数据，而是按照**内容对应的 SHA**寻找对象，因此它属于：
> **Content Addressable Storage（内容寻址存储）**

1. Blob：保存文件内容，同一个内容只会保存一份
2. Tree：
	1. 保存文件对应的 Blob
	2. 子目录对应的 Tree
3. Commit：**一次完整项目快照（Snapshot）**
4. Tage：给某个 Commit 起一个稳定、易读的名字
```java
Commit
    │
Root Tree
├── README.md -> Blob
├── pom.xml -> Blob
└── src -> Tree
        ├── Main.java -> Blob
        └── User.java -> Blob
```

所以每次修改提交的commit都不用完中的去复制整个项目，因为不同的内容只会有一个blob对象，相同的内容直接引用就行了。



## 6. Git 为什么这么快？

Git 的速度来自于：

**绝大多数操作都在本地完成，不需要访问网络。**

例如：

- 查看历史
    
- 创建分支
    
- 切换分支
    
- 比较版本
    
- 查看提交
    
- 回退历史
    

只有 `push`、`fetch` 等同步操作才需要访问远程仓库。



其实你问到了 **Git 最核心的知识点**。

**如果没有真正理解 Git 的三个区域，那么** **`add`****、****`commit`****、****`reset`****、****`checkout`****、****`restore`****、****`revert`** **几乎都会觉得是在”背命令”。**

实际上，Git 所有命令都是围绕这三个区域在工作。

今天我们先不讲命令，而是彻底理解 Git 的三个区域。

---

## **一、Git 其实不是两个区域，而是三个区域**

很多人认为：

```text
电脑文件
        ↓
Git仓库
```

其实这是错误的。

Git 真正的结构是：

```text
                Git
──────────────────────────────────

Working Tree（工作区）
        │
        │ git add
        ▼
Index（暂存区）
        │
        │ git commit
        ▼
Repository（本地仓库）
```

这三个区域分别负责不同的事情。

---

## **二、什么是 Working Tree（工作区）**

工作区就是：

**你电脑上真实存在的文件。**

例如：

```
project/

    pom.xml

    src/

        UserService.java

        OrderService.java

        application.yml
```

这些文件：

- IDEA 能打开
- VSCode 能修改
- Windows 能看到
- Mac Finder 能看到

这些就是：

工作区（Working Tree）。

例如：

打开：

```java
public class UserService {

}
```

然后写：

```java
public class UserService {

    public void save(){

    }

}
```

这一刻：

Git 根本不知道。

因为：

你只是改了：

```
Working Tree
```

还没有告诉 Git。

---

## **三、什么是 Index（暂存区）**

很多人不知道：

Git 并不是：

```
修改文件
↓

commit
```

中间还有一步：

```
修改文件

↓

git add

↓

commit
```

为什么？

因为：

Git 允许你：

**决定哪些修改进入下一次提交。**

例如：

今天：

修改了：

```
UserService.java
```

又修改了：

```
OrderService.java
```

但是：

今天只想提交：

```
UserService.java
```

于是：

```
git add UserService.java
```

那么：

暂存区：

```
Index

UserService.java（新版）
```

而：

```
OrderService.java
```

仍然：

停留在：

```
Working Tree
```

没有进入：

Index。

所以：

下一次：

```
git commit
```

只提交：

```
UserService.java
```

OrderService：

不会提交。

---

所以：

**Index 可以理解成：**

**“下一次 Commit 的候选名单。”**

---

## **四、什么是 Repository（本地仓库）**

commit 的时候：

```
git commit
```

Git 做了什么？

它把：

```
Index
```

里面所有文件：

制作成：

一个 Snapshot（快照）。

例如：

```
Commit A
```

里面：

```
UserService.java

OrderService.java

pom.xml

README.md
```

全部保存。

注意：

保存的是：

整个项目。

不是：

几个修改。

所以：

Repository：

其实就是：

很多：

```
Commit
```

组成：

```
Commit1

Commit2

Commit3

Commit4
```

每一个：

都是：

完整项目。

---

## **五、举一个完整例子**

假设：

项目：

```
User.java
```

内容：

```java
public class User{
}
```

现在：

修改：

```java
public class User{

    private String name;

}
```

这时候：

三个区域：

```
Working Tree

name
```

```
Index

没有
```

```
Repository

没有
```

Git Status：

```
modified
```

说明：

只有：

工作区：

变了。

---

然后：

```
git add User.java
```

三个区域：

```
Working Tree

name
```

```
Index

name
```

```
Repository

没有
```

说明：

已经准备提交。

---

然后：

```
git commit
```

三个区域：

```
Working Tree

name
```

```
Index

name
```

```
Repository

Commit1

name
```

现在：

三者：

完全一致。

所以：

```
git status
```

显示：

```
working tree clean
```

---

## **六、为什么 Git 要设计一个暂存区？**

这是 Git 最精妙的设计。

假设：

今天：

你改了：

```
10个文件
```

但是：

真正完成：

只有：

```
3个
```

另外：

```
7个
```

还没写完。

如果：

没有：

暂存区。

那么：

只能：

```
commit
```

全部提交。

或者：

全部不提交。

这是很糟糕的。

Git：

允许：

```
git add

A.java

B.java

C.java
```

于是：

Commit：

只有：

```
A

B

C
```

其它：

继续开发。

因此：

Git 的 Commit：

可以：

非常干净。

---

## **七、现在再来看 reset，就容易理解了**

假设：

```
Repository

Commit3
```

里面：

```
User.java

name
```

Index：

```
name
```

Working Tree：

```
name
```

完全一致。

---

现在：

执行：

```bash
git reset --soft HEAD~1
```

Git：

只改变：

```
Repository
```

变成：

```
Commit2
```

但是：

Index：

没动。

Working Tree：

没动。

于是：

```
Repository

没有name
```

```
Index

有name
```

```
Working Tree

有name
```

所以：

Git 会认为：

```
有修改等待提交
```

实际上：

就是：

Commit：

被撤销了。

但是：

代码：

还在。

---

如果：

```
git reset --mixed
```

Git：

还会：

恢复：

Index。

于是：

```
Repository

没有name
```

```
Index

没有name
```

```
Working Tree

有name
```

于是：

Git Status：

变成：

```
modified
```

因为：

代码：

仍然：

存在。

只是：

需要：

重新：

```
git add
```

---

如果：

```
git reset --hard
```

三个：

一起恢复。

```
Repository

没有name
```

```
Index

没有name
```

```
Working Tree

没有name
```

于是：

代码：

真的：

没了。

---

## **八、这是理解 Git 最重要的一张图**

以后看到任何 Git 命令，都先问自己：

**它到底是在操作哪一个区域？**

```text
                Git

┌────────────────────────────────────────────┐
│                                            │
│ Working Tree（工作区）                      │
│                                            │
│ 你正在编辑的真实文件                         │
│                                            │
└────────────────────────────────────────────┘
                    │
                    │ git add
                    ▼
┌────────────────────────────────────────────┐
│                                            │
│ Index（暂存区）                            │
│                                            │
│ 下一次 Commit 要提交的文件集合               │
│                                            │
└────────────────────────────────────────────┘
                    │
                    │ git commit
                    ▼
┌────────────────────────────────────────────┐
│                                            │
│ Repository（本地仓库）                      │
│                                            │
│ Commit1                                    │
│ Commit2                                    │
│ Commit3                                    │
│ ...                                        │
│                                            │
└────────────────────────────────────────────┘
```

---

### **我的建议**

按照你最近学习 Git 的深度，我**不建议继续直接学习各种 Git 命令**。真正的学习顺序应该是：

1. **理解 Git 内部对象模型**（Blob、Tree、Commit 分别是什么）。
2. **理解三个区域（Working Tree、Index、Repository）以及它们之间的关系**。
3. **理解 HEAD、Branch、本质上是什么（它们其实都是指针）**。
4. **最后再学习** **`reset`****、****`checkout`****、****`restore`****、****`revert`** **等命令。**

这样你会发现，这些命令几乎不需要死记硬背，因为它们本质上都是在移动指针或同步这三个区域。后面我可以带你从 Git 的底层对象模型开始，一步一步把整个 Git 的内部原理讲透。






## Git的三个区域

1. 工作区：电脑上真实存在的文件，可以直接进行操作，此时Git并不会追踪它们的状态
2. 暂存区：
3. 

```text
                Git
┌────────────────────────────────────────────┐
│                                            │
│ Working Tree（工作区）                      │
│                                            │
│ 你正在编辑的真实文件                         │
│                                            │
└────────────────────────────────────────────┘
                    │
                    │ git add
                    ▼
┌────────────────────────────────────────────┐
│                                            │
│ Index（暂存区）                            │
│                                            │
│ 下一次 Commit 要提交的文件集合               │
│                                            │
└────────────────────────────────────────────┘
                    │
                    │ git commit
                    ▼
┌────────────────────────────────────────────┐
│                                            │
│ Repository（本地仓库）                      │
│                                            │
│ Commit1                                    │
│ Commit2                                    │
│ Commit3                                    │
│ ...                                        │
│                                            │
└────────────────────────────────────────────┘


```










Git只是一个工具，只需呀理解掌握实际开发中常用的命令即可。

![[Pasted image 20260517202027.png]]




## 基本使用

### 创建版本库

版本库也叫仓库，通过git创建了版本库之后，对应目录下的所有文件的修改、删除都会被git追踪。

在本地选择一个目录，执行 `git init` 命令，则会在当前目录中初始化一个新的 Git 仓库，它会在该目录下创建一个隐藏的 `.git `子目录，这个 `.git`目录下存储了版本控制所需的元数据（如对象、引用、配置等）。
>如果目录中有已有文件，这些文件此时处于“未跟踪”（untracked）状态。你可以随后使用 git add 将它们纳入版本控制。


关于Git对文件的追踪，对于文本文件，可以追踪文件的哪行被修改了，但是对于二进制文件只能知道文件被修改的大小（其它版本控制系统也是一样的）。

### add 和 commit

有了仓库之后，后面对文件的修改就可以把它提交到仓库交给git进行管理，git会管理每次的提交。

![[Pasted image 20260517204336.png]]

像 SVN、Mercurial这些传统的版本控制系统没有暂存区的概念，每次文件的修改都是直接提交到仓库中，但是Git为了提供更加灵活的提交控制，就设计出了 暂存区，例如下面的场景就体现出暂存区的作用：
1）同时修改了多个文件，但是只想提交其中一部分，比如修复了一个bug，而其它未完成的新功能，通过 git add 把需要的改动先加入暂存区，再 选择性的git commit，就能只提交选定的更改。
2）对一个文件实现分段提交，即使在一个文件中，也可以只暂存部分修改（通过 git add -p），实现“一个文件多次提交”的效果。
3）工作区相当于你正在修改的文件，暂存区是下次准备提交的文件，通过这种分层让Git提交流程更清晰。

1）HEAD：指向当前分支最新提交（commit）的指针。代表你“当前所在的位置”。
2）暂存区（Staging Area / Index）：通过 git add 添加的文件修改会进入这里。是下一次提交的“快照草稿”。
3）工作区（Working Directory）：你实际编辑的文件所在的目录。所有未 add 的修改都只存在于这里。
4）每次 commit 会保存一个完整项目快照（不是差异！）。
5）分支（如 main、feature）本质上只是一个指向某个 commit 的指针。当你切换分支，Git 只是把工作区文件换成该 commit 对应的快照。
