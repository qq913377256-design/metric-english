## English Original

### Peeking Can Create a False Winner

Fictional news app BeaconDaily launched an A/B test on Monday. Every afternoon, the product manager checked the p-value. On Wednesday the treatment looked worse. On Friday it looked equal. The following Tuesday it crossed the team's significance threshold, so the manager stopped the test and announced a winner. A later repeat showed no improvement.

Random data naturally moves during an experiment. A fixed-sample test assumes that the team will evaluate the result after a planned amount of information has been collected. If people check repeatedly and stop at the first favorable result, they create many opportunities for noise to cross the threshold. The actual false-positive risk becomes higher than the number printed on the dashboard.

BeaconDaily introduced a written stopping rule. Standard tests would run for at least two complete weeks and until the planned sample was reached. Analysts could monitor operational signals—allocation failures, missing events, severe guardrail harm, or outages—without declaring a business winner. If the company needed valid early decisions, it would use a sequential method designed for repeated looks rather than apply a fixed-sample rule incorrectly.

The team also defined exceptions. A major safety or customer-harm signal could stop a test immediately, but the report would say it stopped for risk, not for proven performance. Unexpected traffic loss could pause enrollment and extend the end date. Every interim review was logged.

Discipline can feel slow when a chart is exciting. Yet waiting protects future decisions from a selection process that favors lucky results. BeaconDaily's final reports now state the planned sample, minimum duration, actual duration, number of formal looks, and reason for stopping. The question is not whether teams may observe an experiment. They must observe it for quality and safety. The question is whether their statistical method matches how they intend to make decisions.

## Chinese Translation

BeaconDaily每天查看p值，在第一次显著时停止，复现实验却没有效果。固定样本检验假设到计划终点再评估；反复查看并择机停止会增加噪声越过阈值的机会。

团队规定至少运行两个完整周并达到计划样本，只实时监控分流、缺失事件、严重护栏和故障。若确需提前决策，应使用为多次查看设计的序贯方法，并记录每次正式检查与停止原因。

## Vocabulary

- **peeking** — 频繁偷看；repeatedly testing interim results.
- **false positive** — 假阳性；declaring an effect that is not real.
- **sequential method** — 序贯方法；a design allowing valid repeated evaluation.
- **interim review** — 中期检查；a review before final completion.
- **enrollment** — 入组；adding eligible users to a test.

## Grammar Analysis

- “If people check repeatedly and stop...”使用if描述导致风险增加的条件。
- “a method **designed for repeated looks**”中过去分词短语修饰method。

## Data Analyst Extension

实验系统同时记录planned sample、minimum duration、stopping rule、formal looks和stop reason。运营监控与效果判定必须在界面和流程上分开。

## Reading Questions

1. Why did false-positive risk rise? 2. What could teams monitor early? 3. When should a sequential method be used?

### Workplace Application

An experiment becomes significant on day four, but the plan requires fourteen days. Write a 40–80 word response to a manager who wants to stop now.

### Answer Key

1. Repeated opportunities favored lucky noise. 2. Quality, allocation, outages, and severe harm. 3. When repeated valid decisions are required. Recommend following the plan unless a predefined safety rule applies.
