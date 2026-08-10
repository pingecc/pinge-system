审批流程工具：
- 节点
	- 审批节点：待审批人进行审批
	- 人工节点：待处理人在页面上可以编辑指定字段
- 条件：节点和节点之间可以定义条件和顺序
- 提交和撤销：
	- 提交：进入到下一个节点。
	- 撤销：回到上一个节点或者直接全部撤销回到开始节点。


流程定义（流程图） + 引擎执行

步骤：
1. 通过一些工具绘制符合BPMN格式的流程图，导出来一个xml文件，放在`src/main/resources/processes/` 自动被 Flowable 部署




业务单据（工作流ID）------工作流实例

# 核心服务

1、RepositoryService

作用于**流程定义**（BPMN 文件），提供部署、查询、删除

为什么基于流程定义来创建一个流程实例之前需要所谓的部署？

部署流程定义其实是把静态的流程文件加载到内存形成对象（ProcessDefinition），然后存入数据库，后续创建流程实例时就会从数据库中查询出来


2、RuntimeService

作用于**流程实例**，启动、查询


3、TaskService

流程定义中的节点

## 应用

```Java
                ProcessEngine（流程引擎）
                         │
     ┌───────────────────┼───────────────────┐
     ↓                   ↓                   ↓
RepositoryService   RuntimeService     TaskService
（流程定义）         （流程运行）         （任务管理）

     ↓                   ↓                   ↓
Deployment         ProcessInstance      Task
```

ProcessEngine 是“总入口 / 容器”，其它所有 Service 都是它提供的“功能模块”，和其它核心Service的关系是：

```java
ProcessEngine engine = ProcessEngineConfiguration
    .createStandaloneProcessEngineConfiguration()
    .buildProcessEngine();

processEngine.getRepositoryService()
processEngine.getRuntimeService()
processEngine.getTaskService()
```

在SpringBoot应用中使用Flowable时，Spring Boot 会自动：

✔ 创建 ProcessEngine

✔ 创建所有 Service

✔ 注入到 Spring 容器

然后在实际开发中直接注入各个核心Service使用即可，而在src/resources/processes目录下的流程定义文件在应用启动时会自动部署，FlowableAutoConfiguration会默认扫描下面的路径
```bash
classpath*:/processes/**/*.bpmn20.xml
classpath*:/processes/**/*.bpmn
```

但是目前在实际开发中并不会在后端部署，而是在前端页面绘制流程，然后提交给后端调用deploy部署
### 流程定义

流程定义中的每个节点在Flowable中称为task；条件称为网关（路由的意思），可以写简单的表达式