# Sharing an A/B Test Result

## Workplace Context

虚构学习产品 SkillSpring 测试新的付费页面。产品经理看到转化率上涨，准备立即全量上线。你需要说明结果强度、护栏指标和合理的发布建议。

## Data Brief

| Metric | Control | Treatment |
| --- | ---: | ---: |
| Purchase conversion | 7.8% | 8.5% |
| Relative lift | — | +9.0% |
| 95% confidence interval | — | +1.5% to +16.2% |
| Refund rate | 2.1% | 2.4% |
| Page load time | 1.8s | 2.3s |

样本共48,000人，实验运行14天。退款率差异尚不显著，但页面速度明显变慢。

## Model Email

**Subject: Payment page test improved conversion with a speed trade-off**

Hi team,

The new payment page increased purchase conversion from 7.8% to 8.5%, a 9.0% relative lift. The 95% confidence interval ranges from 1.5% to 16.2%, so the evidence supports a positive effect, although the exact size remains uncertain.

Refund rate changed from 2.1% to 2.4% without a clear statistical difference. Page load time increased by 0.5 seconds.

I recommend a 50% rollout while Engineering addresses page speed, with conversion, refunds, and load time monitored daily.

Best,  
Lin

## Structure Breakdown

1. 同时报告绝对变化和相对提升
2. 用置信区间说明效果范围
3. 单独报告护栏指标
4. 上线建议必须包含范围和监控条件

## Language Toolkit

- **increased from X to Y, a Z relative lift**：避免只报相对百分比
- **supports a positive effect, although...**：说明证据与不确定性
- **without a clear statistical difference**：不把不显著变化写成确定风险
- **a 50% rollout while...**：用分阶段上线控制风险

## Model Task

写60–90词实验结果：

- 搜索结果点击率从18.0%升至19.2%
- 相对提升6.7%
- 95%置信区间为1.0%至12.5%
- 无结果搜索率不变
- API响应时间增加80毫秒
- 建议先上线30%

## Model Reference

Search result click-through rate increased from 18.0% to 19.2%, a 6.7% relative lift. The 95% confidence interval ranges from 1.0% to 12.5%, supporting a positive effect while leaving uncertainty about its exact size.

The no-result rate was unchanged, but API response time increased by 80 milliseconds. I recommend a 30% rollout with daily monitoring of clicks, no-result searches, and response time.

## Guided Task

改写下面的结论，补齐必要语境：

> The test won by 9%. We should launch it to everyone today. Refunds are fine.

写90–130词，使用Data Brief中的绝对转化率、置信区间、退款和速度数据，提出分阶段上线建议。

## Guided Reference

**Subject: Recommended rollout for the payment page test**

Hi team,

Across 48,000 users, purchase conversion increased from 7.8% in control to 8.5% in treatment. This is a 9.0% relative lift, with a 95% confidence interval of 1.5% to 16.2%. The test therefore supports an improvement, but the final effect may be smaller than the point estimate.

Refund rate moved from 2.1% to 2.4% without a clear statistical difference. The stronger concern is page load time, which increased from 1.8 to 2.3 seconds.

I recommend launching to 50% of users while improving speed, then reviewing all three metrics before full rollout.

Best,  
Lin

## Independent Task

虚构招聘平台 HireFlow 测试简化申请表：

- 完成率从42%升至46%
- 相对提升9.5%，95%置信区间3.2%至15.8%
- 合格申请率从31%降至30%，差异不显著
- 招聘方查看申请的时间缩短4%
- 移动端提升明显，桌面端基本不变

写120–160词结果邮件，说明效果、不确定性、分群差异、护栏和上线建议。

## Independent Reference

**Subject: Simplified application test supports a mobile-first rollout**

Hi team,

The simplified form increased application completion from 42% to 46%, a 9.5% relative lift. The 95% confidence interval is 3.2% to 15.8%, so the evidence supports a positive result. The improvement is concentrated on mobile, while desktop performance is broadly unchanged.

Qualified application rate moved from 31% to 30%, but the difference is not statistically clear. Recruiter review time improved by 4%, giving no current sign of additional processing cost.

I recommend rolling out the form to mobile users first and keeping 10% of traffic as a holdout for two more weeks. We should monitor completion, qualified application rate, and recruiter review time before extending the change to desktop.

Best,  
Lin

## Oral Retell

用1分钟说出实验对象、绝对变化、置信区间、一个护栏指标和上线建议。
