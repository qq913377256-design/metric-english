## English Original

### Segments Can Reverse the Average

Fictional lender HarborCredit compared approval times before and after a workflow update. The overall average improved from 31 hours to 29 hours. However, the update appeared slower when analysts looked separately at simple and complex applications. Simple cases rose from 10 to 11 hours, while complex cases rose from 42 to 44 hours. How could both segments become slower while the total became faster?

The composition had changed. Before the update, only 35% of applications were simple. Afterward, a marketing campaign increased that share to 70%. Simple cases were much faster in both periods, so their larger weight pulled down the overall average. The aggregate trend reversed the within-segment trends. This pattern is often called Simpson's paradox.

The analyst decomposed the change into two effects. The within-segment effect measured how processing time changed while holding the segment mix constant. The mix effect measured how the share of simple and complex cases changed while holding their times constant. The favorable mix shift was larger than the unfavorable processing change, producing an apparently better total.

Segmentation must follow a plausible business mechanism. Analysts should not search hundreds of categories until they find a surprising reversal. HarborCredit used application complexity because it strongly affected processing time and its definition was stable before the workflow change. The team also checked channel, region, and missing classifications, then repeated the analysis with medians because a few extreme cases influenced averages.

The final message said: “Overall approval time fell by two hours because the application mix shifted toward simple cases. Processing became one hour slower for simple cases and two hours slower for complex cases, so the workflow itself did not improve speed.” Leaders kept the campaign but investigated the workflow. An average summarizes a population; it does not explain why the population changed. Whenever a total and its major segments tell different stories, report both and quantify the contribution of composition.

## Chinese Translation

HarborCredit总体审批时间从31小时降至29小时，但简单和复杂申请分别都变慢。原因是简单申请占比从35%升到70%，较快人群的权重增加拉低了总体平均，这属于辛普森悖论。

分析师把变化拆成分群内部效应和结构效应，并检查中位数与稳定分群。最终说明：总体改善来自申请结构，不是流程提速。总体与主要分群方向不同时，应同时报告并量化构成贡献。

## Vocabulary

- **composition** — 构成；the relative shares of groups.
- **aggregate trend** — 总体趋势；movement in the combined population.
- **within-segment effect** — 分群内效应；change inside fixed groups.
- **mix effect** — 结构效应；change caused by group proportions.
- **decompose** — 分解；separate a total change into contributors.
- **median** — 中位数；the middle value in an ordered set.

## Grammar Analysis

- “while **holding the segment mix constant**”是省略主语的状语结构。
- “Whenever a total and its segments tell different stories”用whenever引导普遍条件。

## Data Analyst Extension

发现反转时固定一套有业务机制的分群，计算组内变化与权重变化的贡献，并补充中位数、样本量和缺失分类，避免只展示有利的总体平均。

## Reading Questions

1. Why did the overall average improve?
2. What are the two decomposed effects?
3. Why was complexity a valid segment?

### Workplace Application

Overall support resolution improves, but every priority tier becomes slower. Write a 40–80 word explanation of the likely mix effect and the analysis needed before claiming improvement.

### Answer Key

1. More cases moved into the faster simple segment.
2. The analyst separated within-segment and mix effects.
3. Complexity affected processing time and had a stable definition.

### Application Model Response

The overall resolution time may have improved because the case mix shifted toward faster priority tiers, even though every tier became slower. I will compare tier shares across periods, calculate within-tier changes, and quantify the mix contribution. Until that decomposition is complete, we should not claim that the support process itself improved.
