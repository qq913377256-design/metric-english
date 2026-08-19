## English Original

### Null Values and Join Types

Fictional delivery service ParcelSpring wanted to measure the first-week activity of newly registered couriers. An analyst started with 12,000 registrations and used an inner join to connect them to completed deliveries. The result contained only 7,400 couriers. The reported average was high because 4,600 people with no completed delivery had disappeared from the denominator.

An inner join keeps only keys found on both sides. That is useful when matched records are required, but dangerous when missing activity is itself meaningful. A left join keeps every row from the starting population and adds matching activity where available. After changing the query to a left join, the analyst represented missing delivery counts as zero only after checking what the null meant. Some nulls meant “no delivery”; others came from a two-hour pipeline delay and were not safe to convert.

Null is not a single business state. It may mean not applicable, not collected, not yet received, or unexpectedly missing. Replacing every null with zero can hide a data incident. Dropping every null can bias a population. The analyst therefore created a match-status field with three values: matched activity, confirmed no activity, and data pending. The weekly report showed both the activation rate and the pending-data rate.

Join choice should follow the analysis question. If the question is “What share of registered couriers completed a delivery?”, registrations must remain the base population. If the question is “What was the average distance among completed deliveries?”, unmatched registrations are not required. ParcelSpring added three standard checks: compare row counts before and after the join, calculate the unmatched-key rate, and inspect null patterns by registration date. The final activation rate was 61.7%, not the misleading rate implied by the inner-joined sample. More importantly, readers could distinguish customer behavior from data latency.

The analyst finally added match-rate trends to monitoring so future shifts would be visible before a business review.

## Chinese Translation

ParcelSpring用内连接分析新骑手首周活跃，12,000名注册者只剩7,400名，未完成配送的人被移出分母，平均值因此偏高。改用左连接后，所有注册者都被保留，但分析师没有立即把空值全部改成0。

空值可能表示无活动、不适用、未采集、延迟或异常缺失。团队建立“已匹配、确认无活动、数据待到达”状态，并同时报告激活率和待到达率。连接方式必须由分析问题决定，而不是由方便程度决定。

## Vocabulary

- **inner join** — 内连接；keeps keys present in both tables.
- **left join** — 左连接；keeps all rows from the left table.
- **denominator** — 分母；the base population of a rate.
- **bias** — 偏差；a systematic distortion in a result.
- **latency** — 延迟；time between an event and data availability.
- **not applicable** — 不适用；a value that should not exist for that case.

## Grammar Analysis

- “people **with no completed delivery**”用with短语说明人群特征。
- “only **after checking what the null meant**”强调转换空值前必须完成的条件。

## Data Analyst Extension

为每次连接明确基础人群，并输出matched、unmatched、pending三类比例。不要在没有业务定义时统一执行`COALESCE(value, 0)`。

## Reading Questions

1. Why did the inner join bias the result?
2. What can a null represent?
3. Which checks did the team add?

### Workplace Application

A campaign report loses 28% of recipients after an inner join to purchase data. Write a 40–80 word note explaining whether to use a left join and how you will treat null purchases.

### Answer Key

1. It removed couriers with no delivery from the denominator. 2. Several states, including no activity and delayed data. 3. Row count, unmatched rate, and null patterns. A strong note keeps the campaign population, separates zero purchase from pending data, and validates latency.
