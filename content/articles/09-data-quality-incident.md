# When the Numbers Suddenly Change

## English Original

On Tuesday morning, the executive dashboard shows a 37% drop in daily active users. No major product release occurred, and customer support has not reported an outage. The leadership team needs to know whether the business changed overnight or the data is wrong.

The analyst on duty, Marcus, first confirms the definition and the time zone. He then compares several independent signals. Website sessions are stable, completed orders are normal, and server traffic has not fallen. These checks suggest that customer activity continues even though the active-user metric has dropped.

Marcus traces the metric through the data pipeline. A mobile event table stopped updating at 02:10 because an expired credential blocked one processing job. The dashboard query still ran successfully, so it returned a lower but believable number instead of an obvious error.

Marcus posts an incident update with four facts: the affected metric, the start time, the likely cause, and the current business impact. He labels the dashboard as incomplete and pauses an automated alert that would otherwise contact regional managers. After the engineer restores the job, Marcus backfills the missing events and checks that totals match the source.

The team later adds freshness checks and row-count alerts before the dashboard layer. The incident shows why a successful query is not proof of complete data. Reliable reporting requires monitoring the path from source event to final metric.

## Chinese Translation

周二早上，高管仪表盘显示日活跃用户下降37%。当天没有重大产品发布，客服也没有报告服务中断。管理团队需要知道，业务是否在一夜之间发生变化，还是数据出了问题

值班分析师Marcus先确认指标定义和时区，随后比较几个独立信号。网站会话数稳定，已完成订单数正常，服务器流量也没有下降。这些检查表明，虽然活跃用户指标下降了，客户活动仍在继续

Marcus沿着数据管道追踪指标。一张移动端事件表在02:10停止更新，原因是过期凭证阻断了一个处理任务。仪表盘查询仍然成功运行，因此它返回了一个较低但看起来可信的数字，而不是明显报错

Marcus发布故障更新，说明四项事实：受影响指标、开始时间、可能原因和当前业务影响。他把仪表盘标记为数据不完整，并暂停一条原本会联系各地区经理的自动警报。工程师恢复任务后，Marcus补回缺失事件，并检查总量是否和源系统一致

团队随后在仪表盘上游增加数据新鲜度检查和行数警报。这次故障说明，查询成功不等于数据完整。可靠报表需要监控从源事件到最终指标的整条路径

## Vocabulary

- **outage** /ˈaʊtɪdʒ/：服务中断
- **on duty**：值班
- **independent signal**：不依赖同一数据来源的独立信号
- **trace** /treɪs/：沿路径追踪
- **pipeline** /ˈpaɪplaɪn/：数据从源头到使用端的处理链路
- **credential** /krəˈdenʃəl/：系统访问凭证
- **backfill** /ˈbækfɪl/：补算、补回历史缺失数据
- **freshness check**：检查数据是否按预期时间更新

## Grammar Analysis

### 1. whether...or...

`The team needs to know whether the business changed overnight or the data is wrong.`

`whether A or B`列出两个需要判断的可能解释，比直接断言原因更严谨

### 2. even though表示让步

`Customer activity continues even though the active-user metric has dropped.`

`even though`连接看似冲突的事实，语气比`although`更强

### 3. would otherwise

`He pauses an alert that would otherwise contact regional managers.`

`otherwise`表示如果不暂停，警报就会联系经理。`would`描述这个未发生的结果

## Data Analyst Extension

指标异常排查顺序：

1. 确认口径、时区、筛选条件和近期代码变更
2. 使用独立业务信号判断真实行为是否同步变化
3. 从报表查询向上游追踪表、任务和源事件
4. 说明影响范围，不在证据不足时猜测业务原因
5. 修复后补数、对账，并增加能更早发现问题的监控

故障更新模板：`Daily active users are incomplete from 02:10 UTC because the mobile event table stopped updating. Web activity and orders remain normal. We are restoring the pipeline and will backfill the affected period.`

## Reading Questions

1. Which signals suggest that customer activity is normal?
2. Why does the dashboard show a believable number instead of an error?
3. What information does Marcus include in the incident update?
4. Which preventive checks does the team add?

### Answer Key

1. Website sessions, completed orders, and server traffic remain normal
2. The dashboard query succeeds, but it reads an incomplete table
3. The affected metric, start time, likely cause, and business impact
4. Data freshness checks and row-count alerts before the dashboard layer
