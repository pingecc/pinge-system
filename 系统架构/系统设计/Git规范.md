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



## 需求开发流程

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





## 线上bug修复
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


# commit规范

```
feat: 新增订单导出功能

fix: 修复库存扣减异常

refactor: 重构订单查询逻辑

docs: 更新接口文档
```

以后Git Log会非常舒服。