# Reporting a Revenue Anomaly

## Workplace Context

虚构零售平台 Northstar 的实时收入看板突然比昨天同一时间低22%。销售团队正准备给管理层解释情况，但你还没有确认这是业务变化还是数据问题。

## Data Brief

- 看板收入同比昨日同一时点低22%
- 订单数只下降3%
- 平均订单金额在原始订单表中保持稳定
- 支付渠道 PayWave 的部分记录没有进入汇总表
- 受影响时间从上午08:10开始
- 数据工程师预计11:30完成回填

## Model Email

**Subject: Revenue dashboard anomaly under investigation**

Hi team,

The revenue dashboard is currently 22% below yesterday at the same time, while order volume is down only 3%. The mismatch suggests a reporting issue rather than a confirmed business decline.

Initial checks show that some PayWave records have not reached the summary table since 08:10. The raw order values remain stable. Data Engineering is restoring the missing records and expects the backfill to finish by 11:30.

Please avoid using today's revenue total until I confirm the refresh.

Best,  
Lin

## Structure Breakdown

1. 用标题标明 anomaly 或 under investigation
2. 先写观察到的现象和影响
3. 把初步证据写成初步证据，不宣布根因
4. 给出临时使用建议和下一次更新时间

## Language Toolkit

- **is currently X below...**：描述当前异常
- **suggests a reporting issue rather than...**：谨慎解释证据
- **Initial checks show...**：说明结论仍在调查阶段
- **Please avoid using... until...**：给出清楚的临时行动

## Model Task

写60–90词异常通知：

- 活跃用户看板突然上涨35%
- 登录事件只上涨2%
- 一个批处理任务重复载入昨天的数据
- 工程团队正在删除重复记录
- 预计14:00刷新

## Model Reference

**Subject: Active user dashboard anomaly**

Hi team,

The active user dashboard is showing a 35% increase today, while login events are up only 2%. This difference indicates that the dashboard total is not reliable.

Initial checks found that yesterday's records were loaded twice during a batch run. Data Engineering is removing the duplicates, and the corrected dashboard should be available by 14:00. Please do not use the current active user figure in reports.

Best,  
Lin

## Guided Task

把下面过度确定的消息改写成90–130词：

> Revenue crashed because PayWave failed. Engineering will fix it soon.

必须加入22%、订单只下降3%、影响开始时间、当前证据、11:30回填和临时使用建议。

## Guided Reference

**Subject: Temporary issue with today's revenue total**

Hi team,

Today's revenue dashboard is 22% below yesterday at the same time. Order volume is down only 3%, and average order value in the raw table remains stable, so we have not confirmed a comparable business decline.

Some PayWave records have been missing from the summary table since 08:10. This is the leading explanation, although the investigation is still open. Data Engineering is backfilling the affected records and expects the corrected total by 11:30.

Until then, please use yesterday's dashboard for historical comparisons and avoid sharing today's revenue total externally. I will confirm when validation is complete.

Best,  
Lin

## Independent Task

客服看板的未解决工单从1,200降到420，但客服系统中的原始记录仍为1,180。昨晚发布了新的状态映射，closed_pending状态可能被错误计为已关闭。影响今天早上所有团队看板，预计16:00完成验证。

写120–160词异常报告，包含现象、影响、当前证据、临时建议和下一次更新时间。

## Independent Reference

**Subject: Support backlog metric is temporarily unreliable**

Hi team,

The dashboard shows that the unresolved support backlog fell from 1,200 to 420 this morning. The source system still contains 1,180 unresolved tickets, so the dashboard change does not represent a confirmed operational improvement.

The issue appeared after last night's status-mapping release. Our initial review suggests that tickets marked closed_pending may be excluded from the backlog even though agents still need to act on them. The mapping affects all team views refreshed this morning.

Please use the source-system count for staffing decisions until validation is complete. I am checking each ticket status with the Support Operations team and will provide a corrected dashboard or a revised update by 16:00.

Best,  
Lin

## Oral Retell

用1分钟汇报异常：看到什么、影响什么、目前知道什么、暂时怎么做、何时更新。
