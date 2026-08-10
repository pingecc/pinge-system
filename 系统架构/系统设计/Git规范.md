# 分支规范


```
长期分支
──────────────
main     生产环境（始终可发布）
dev      测试环境（集成开发）


临时分支
──────────────
feature/*   新需求开发（基于 dev）
bugfix/*    开发阶段 Bug 修复（基于 dev）
hotfix/*    线上紧急 Bug 修复（基于 main）


需求开发
──────────────
feature/* → Merge Request → dev → 测试 → main（或 release → main）


线上修复
──────────────
main → hotfix/* → 测试 → main → 同步到 dev


分支管理
──────────────
除 main、dev 外，其余分支均为一次性工作分支，
功能上线并确认无误后立即删除。
```


分支：
- dev：测试分支，用于测试环境
- main：生产分支，用于生产环境

**开发人员不允许直接在 dev或者mast(main)分支开发代码，`main` 永远保持可发布状态， `dev` 永远保持最新测试版本。**



### 需求开发流程

每个一个需求都要单独创建一个开发分支，开发完成之后merge 到 dev分支进行测试，测试发现问题，**请回到对应需求分支做修改，再merged到 dev分支**


```text
main
 │
 ├───────────────► dev
                      │
					  ├────► clp_feature_A
					  │
					  └────► clp_feature_B
                      │
                      └────────► merge 回 dev
```


1. 基于 dev 创建个人需求分支，例如：clp_feature_order
2. 在个人分支开发，开发完成后，提交 Merge Request 到 dev，在dev进行测试，发现问题需要修改，回到clp_feature_order分支进行修改，然后再merge 到 dev，不要直接在dev做修改。
3. dev分支测试没问题， **merge 到 main分支发布** 

关于dev分支测试没问题后，merge到main分支发布，**是该用dev分支merge 到main 还是对应的需求分支？**
1. 如果是单个需求或者所有并行开发的需求上线时间一样，**请将dev分支merge到main分支，简单清晰。**
2. 如果多个并行开发的需求上线时间不一样，请将对应的需求开发分支merge到main分支，不要直接将dev分支merge到main分支，因为dev分支可能存在没测试完的需求。**需要注意：确保该 Feature 已在 dev 完成集成测试、且不依赖其它未发布 Feature 可以直接从该 Feature 分支合并到 Main 发布。** 若存在跨 Feature 依赖，则必须整体发布或调整需求拆分，禁止发布存在未满足依赖的 Feature。





### 线上bug修复
```text
main
 │
 ▼
hotfix/login_bug
 │
 ├────────► main
 │
 └────────► dev
```


① 从 main 建立 Hotfix 分支，例如clp_hotfix_login
② 只改 Bug，不要开发新功能，改完合并到dev分支测试验证
③ 测试验证没问题，再从Hotfix 分支merge到main分支


## commit规范

```
feat: 新增订单导出功能

fix: 修复库存扣减异常

refactor: 重构订单查询逻辑

docs: 更新接口文档
```

以后Git Log会非常舒服。


## cherry-pick

Git 的 `cherry-pick` 可以理解为**"摘樱桃"**——从某条分支上挑选一个或几个特定的提交，把它们"摘"下来，应用到当前分支上。

> `cherry-pick` 让你**只复制指定的提交**，而不是合并整个分支。它会把指定提交的改动重新在当前分支上"重演"一遍，生成一个新的提交（哈希值不同，但内容相同）。

### 场景：只把dev上的某个提交应用到master

背景：dev上已经有多个需求提交，但是其中有个需求需要紧急上线到master，而其它的需求提交等测试完毕之后再上线。

目标：只把dev 分支上的提交A 合并到当前master分支上，我只需要先切换到master分支，然后选中dev分支上的提交A，执行 cherry-pick，那么就会把dev的这个提交A 合并到当前master分支，而不是所有提交

git checkout master          # 切换到目标分支  
git cherry-pick <commit-A>   # 只把 dev 上的提交 A 复制到 master

执行后，master 上只会多出**这一个提交**，dev 上的其他提交不会过来。✅

---

### 核心关键点

**1. 这不是"合并"，是"复制"**

cherry-pick 会在 master 上生成一个**全新的提交**（新的哈希值），内容跟 dev 上的提交 A 一样，但 Git 认为它是 master 上的独立提交。

**2. 注意依赖关系**

如果提交 A 依赖于 dev 分支上**之前的某个提交**（比如 A 修改了 dev 上某个新创建的文件），直接 cherry-pick 到 master 可能会报错或结果不完整。因为 master 上可能缺少那个"前置改动"。

**例子：**

- dev 上先提交了"新增文件 X"（提交 B）
    
- 然后提交 A 修改了文件 X
    
- 你只 cherry-pick 提交 A 到 master → 会失败，因为 master 上没有文件 X
    

**3. 如果提交 A 有多个**

如果 dev 上有一串相关的提交（A1 → A2 → A），你可能需要按顺序都 pick 过来：

git cherry-pick A1 A2 A

---

> **cherry-pick 就是精准地"挑"单个提交，不会影响其他提交。** 只要注意提交之间是否有依赖关系，就能安全使用。

### cherry-pick后，后续重新执行 dev merge 到master，会发生什么？

> **代码通常不会重复，但提交历史会"分叉"——同一个改动在两条线上各出现一次。**

cherry-pick 的本质是**复制**：它在 master 上创建了一个**全新的提交**（假设叫 `A'`），虽然内容和 dev 上的 `A` 一样，但**哈希值不同**，Git 认为它们是两个完全独立的提交。

当你后续把 dev merge 到 master 时，历史会变成这样：

master:  ... --- o --- A' --- o --- merge  
                  \                /  
dev:               o --- A --- o ---

- `A'` 是你 cherry-pick 到 master 的提交
    
- `A` 是 dev 上原来的提交
    
- merge 时，Git 会把 dev 上的 `A` 也纳入 master 的历史
    

1. **代码层面：通常不会重复**
    

因为 `A` 和 `A'` 的改动内容完全一样，merge 算法会发现"两边改了同一个地方，且改法相同"，所以**不会生成重复代码**，也**通常不会冲突**。

2. **历史层面：会出现"重复提交"**
    

用 `git log --oneline --graph` 看历史时，你会发现同一个功能出现了两次（`A` 和 `A'`），这会让历史图变得混乱，后续排查问题时容易困惑。

3. 潜在风险：如果 cherry-pick 时修过冲突
    

假设 cherry-pick `A` 到 master 时你手动解决过冲突，导致 `A'` 的内容和 dev 上的 `A` **不完全一样**。那么后续 merge 时，Git 会认为两边对同一块代码做了**不同的修改**，这就可能产生**冲突**，需要你再手动解决一次。