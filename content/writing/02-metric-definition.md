# Defining an Active User Metric

## Workplace Context

虚构协作软件公司 LoopWorks 正在制作月度经营报告。产品团队把 active user 理解为登录过的用户，客户成功团队则认为必须完成一次核心操作。你需要在报表上线前写邮件统一口径。

## Data Brief

| Definition | July users | Main risk |
| --- | ---: | --- |
| Logged in at least once | 84,200 | Includes users who did not use the product |
| Created or completed a task | 61,500 | Reflects the core workflow |
| Used the product on 3+ days | 38,900 | Too strict for monthly reach |

报告目标是观察有意义的产品使用，而不是仅统计触达。

## Model Email

**Subject: Proposed definition for monthly active users**

Hi team,

For the monthly operating report, I recommend defining an active user as someone who created or completed at least one task during the month.

This definition gives us 61,500 active users in July. The login-based definition produces 84,200, but it includes people who opened the product without using the core workflow. The three-day definition is useful for deeper engagement analysis, although it is too strict for measuring monthly reach.

Unless there are objections, I will use the task-based definition and document it in the dashboard.

Best,  
Lin

## Structure Breakdown

1. 第一段直接给出推荐口径
2. 第二段用数字说明其他口径为什么不适合当前目的
3. 最后一段写明默认行动和异议方式

## Language Toolkit

- **I recommend defining X as...**：提出指标定义
- **This definition gives us...**：说明口径对应的结果
- **It includes users who...**：指出口径的纳入风险
- **Unless there are objections, I will...**：让讨论有明确收口

## Model Task

为 weekly retained customer 提出口径，写60–90词：

- 口径A：本周有任意登录，12,400个客户
- 口径B：本周和上周都完成核心操作，8,100个客户
- 报告目标：观察持续使用
- 推荐口径B

## Model Reference

**Subject: Weekly retained customer definition**

Hi team,

I recommend defining a weekly retained customer as an account that completed a core action both this week and last week. This produces 8,100 retained customers.

The login-based definition gives 12,400, but it may include accounts that only opened the product once. Because this report is intended to track continued use, the core-action definition is more closely aligned with the decision.

Best,  
Lin

## Guided Task

改写下面的说明，使定义、分母和时间窗口都清楚：

> Our activation rate is 70%. Activated users are people who used the product. This looks good.

- 注册后7天内创建第一个项目的2,800名新用户
- 分母为完成注册的4,000名新用户
- 仍未排除内部测试账户

写90–130词，给出定义、计算方法、限制和下一步。

## Guided Reference

**Subject: Definition of the seven-day activation rate**

Hi team,

For this analysis, an activated user is a new user who creates a first project within seven days of registration. The rate is calculated as 2,800 activated users divided by 4,000 completed registrations, giving a seven-day activation rate of 70%.

This definition focuses on the first core action and uses completed registrations as the denominator. One limitation is that the current result may still include internal test accounts. I will remove those accounts before the metric is added to the dashboard and document the seven-day window beside the chart.

Best,  
Lin

## Independent Task

财务和销售对 lead conversion rate 有两个版本：

- 财务：已付款客户 ÷ 所有新线索，620 ÷ 10,000 = 6.2%
- 销售：进入正式商机的线索 ÷ 合格线索，1,450 ÷ 6,800 = 21.3%
- 管理层想衡量营销线索最终带来收入的效率
- 付款通常发生在线索创建后60天内

写120–160词邮件，推荐一个主指标，说明分子、分母、时间窗口，并建议如何保留另一个指标。

## Independent Reference

**Subject: Recommended lead conversion metric**

Hi team,

For the management report, I recommend defining lead conversion as the share of new marketing leads that become paying customers within 60 days. Using the current cohort, the result is 620 paying customers divided by 10,000 new leads, or 6.2%.

This definition is aligned with the report's goal of measuring how efficiently marketing leads generate revenue. The sales team's 21.3% measure answers a different question because it starts with qualified leads and ends when a formal opportunity is created.

I suggest keeping that measure as opportunity conversion in the sales funnel section. The dashboard should show both names, denominators, and time windows so that users do not compare the two percentages as if they were the same metric.

Best,  
Lin

## Oral Retell

用1分钟说明一个指标的目的、分子、分母、时间窗口和一个限制。
