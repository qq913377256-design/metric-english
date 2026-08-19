# Communicating a Data Quality Incident

## Workplace Context

虚构SaaS公司 ClearPath 的客户健康报表出现数据延迟。客户成功团队每天用它安排续约沟通，你需要说明哪些部分不可靠、哪些仍能用以及临时替代方案。

## Data Brief

- 产品使用事件延迟约18小时
- 账户、合同和续约日期数据正常
- 健康分数中的usage部分占40%
- 86个账户将在未来14天续约
- 原始应用日志可用于手工检查高优先级账户
- 预计今天18:00恢复事件管道

## Model Email

**Subject: Usage data delay in the customer health report**

Hi Customer Success team,

Product usage data in the health report is approximately 18 hours behind. Account details, contract values, and renewal dates are current, but the overall health score should not be used because usage contributes 40% of that score.

For the 86 accounts renewing within 14 days, Analytics can check the raw application logs for any urgent reviews. Data Engineering expects to restore the event pipeline by 18:00 today. I will validate the refreshed scores before confirming that the report is ready.

Best,  
Lin

## Structure Breakdown

1. 说明问题类型和时间范围
2. 分开写不可靠数据和仍可使用的数据
3. 说明业务影响和受影响对象数量
4. 提供临时方案、恢复时间和验证责任

## Language Toolkit

- **is approximately X hours behind**：说明延迟程度
- **remains current**：说明仍可使用的字段
- **should not be used because...**：给出限制和原因
- **before confirming that...**：强调恢复后还要验证

## Model Task

写60–90词数据质量通知：

- 广告成本数据缺少今天06:00后的记录
- 点击和转化数据正常
- ROI暂时不能使用
- 预算花费可在广告平台手工查询
- 预计13:00补齐

## Model Reference

**Subject: Delay in today's advertising cost data**

Hi Marketing team,

Advertising cost records after 06:00 are missing from the campaign dashboard. Click and conversion data are current, but ROI should not be used until the cost data is complete.

For urgent budget checks, please use the spend shown in the advertising platform. Data Engineering expects to backfill the missing records by 13:00. I will validate total spend and ROI before confirming the dashboard refresh.

Best,  
Lin

## Guided Task

将下面的技术通知改写成面向业务用户的90–130词邮件：

> The events table has a late partition. The DAG failed. Do not use anything.

加入产品使用事件延迟18小时、账户和续约字段正常、健康分数不可用、86个近期续约账户、临时检查方案和18:00恢复时间。

## Guided Reference

**Subject: Temporary limits on the customer health report**

Hi Customer Success team,

The product usage section of the customer health report is currently about 18 hours behind. Account names, contract values, and renewal dates remain current. However, please do not use the overall health score for outreach decisions because usage represents 40% of the score.

There are 86 accounts renewing in the next 14 days. If an urgent review is needed, send the account list to Analytics and we will check recent activity in the raw logs.

The event pipeline is expected to recover by 18:00. I will verify the refreshed scores and send a confirmation before the report returns to normal use.

Best,  
Lin

## Independent Task

库存报表缺少 West仓库昨晚22:00后的入库记录。出库和其他仓库数据正常。采购团队上午要决定补货，West仓库涉及320个SKU。可从仓库系统导出临时清单，正式报表预计15:00恢复。

写120–160词，明确受影响范围、仍可使用的内容、业务风险、临时方案和恢复后的验证。

## Independent Reference

**Subject: West warehouse receipts missing from the inventory report**

Hi Procurement team,

The inventory report is missing inbound receipts for the West warehouse after 22:00 last night. Outbound shipments and data for the other warehouses are current. The issue affects the available-stock calculation for 320 West warehouse SKUs, so those figures should not be used for this morning's replenishment decision.

Warehouse Operations can provide a direct export of the missing receipts. Analytics will combine that file with the current stock table for any high-priority SKU checks requested before noon.

Data Engineering expects the standard report to be restored by 15:00. Before reopening it for planning, I will reconcile the receipt count and total units against the warehouse system and confirm the result here.

Best,  
Lin

## Oral Retell

用1分钟说清哪些数据坏了、哪些还能用、影响谁、临时方案是什么、恢复后谁来验证。
