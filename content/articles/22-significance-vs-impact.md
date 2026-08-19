## English Original

### Statistical Significance Is Not Business Impact

Fictional marketplace MorrowMart tested a new search ranking on two million sessions. Purchase conversion increased from 4.00% to 4.05%, and the result was statistically significant. The experiment dashboard turned green, so the team prepared a global launch. Finance then estimated that the extra margin would be smaller than the yearly infrastructure cost of the ranking system.

Statistical significance addresses whether an observed difference is reasonably inconsistent with a no-effect model under stated assumptions. It does not say that the difference is large, valuable, or worth its cost. With a very large sample, a tiny effect can be measured precisely. With a small sample, a commercially important effect may remain uncertain. Analysts therefore need both uncertainty and magnitude.

The experiment report added an absolute lift of 0.05 percentage points, a relative lift of 1.25%, and a confidence interval. It translated the estimate into annual orders, gross margin, computing expense, and maintenance effort. The interval included outcomes from a small loss to a modest gain after costs. Search latency also increased by 80 milliseconds, close to the guardrail limit.

Product proposed a lower-cost version for high-intent queries rather than shipping everywhere. A follow-up test focused on that segment and measured net margin as well as conversion. The new version produced a larger effect with lower infrastructure use.

A useful conclusion separates evidence from decision. “The conversion difference is statistically detectable” is an evidence statement. “We should launch” is a decision that also requires effect size, uncertainty, cost, risk, and strategic fit. MorrowMart changed its experiment template so every result included absolute and relative change, confidence interval, expected value, guardrails, and recommendation. Green did not mean automatic approval; it meant the team had evidence to evaluate.

This approach also improved prioritization: teams compared experiments on expected net value rather than ranking them by p-value alone. Small effects remained useful when delivery cost was tiny, while expensive features needed stronger evidence and larger benefits.

## Chinese Translation

MorrowMart两百万次会话中，转化从4.00%升到4.05%，统计显著，但新增毛利小于系统成本。显著性只说明差异与“无效果”模型不一致，不说明效果足够大或值得投入。

报告补充绝对提升、相对提升、置信区间、年度订单、毛利、成本和延迟护栏，并改为测试低成本的高意向场景。证据陈述与发布决策必须分开。

## Vocabulary

- **effect size** — 效果大小；magnitude of a measured difference.
- **absolute lift** — 绝对提升；difference in percentage points or units.
- **relative lift** — 相对提升；change divided by the baseline.
- **confidence interval** — 置信区间；a range reflecting estimate uncertainty.
- **strategic fit** — 战略匹配；alignment with company priorities.

## Grammar Analysis

- “whether an observed difference **is...inconsistent**”是whether引导的宾语从句。
- “rather than **shipping everywhere**”表达被放弃的方案。

## Data Analyst Extension

实验结论统一展示baseline、absolute lift、relative lift、interval、unit economics、guardrails和recommendation，禁止用p值单独决定发布。

## Reading Questions

1. Why was the significant result not enough?
2. What did the report add?
3. How did the team change the rollout idea?

### Workplace Application

A test is significant but adds only $8,000 annual margin against $30,000 annual cost. Write a 40–80 word recommendation that distinguishes evidence from business impact.

### Answer Key

1. The expected value was smaller than the operating cost.
2. The report added effect magnitude, confidence interval, economics, and guardrails.
3. The team tested a cheaper version for a targeted segment.

### Application Model Response

The result provides evidence of a real difference, but the estimated $8,000 annual margin does not justify a $30,000 annual cost. I do not recommend a full launch. We should review the confidence interval and guardrails, then test a lower-cost version or a higher-value segment where the same effect could produce positive net impact.
