## English Original

### Why Sample Size Comes Before Launch

Fictional streaming service NovaPlay planned to test a new recommendation panel. The product manager wanted to run it for one week and stop when the dashboard showed a winner. The analyst asked four questions first: What is the current play rate? What is the smallest improvement worth shipping? How much uncertainty can the team accept? How many eligible users arrive each day?

The baseline play rate was 20%. Product considered an increase of one percentage point commercially meaningful. With the team's chosen significance level and 80% statistical power, the experiment required about 25,000 users in each group. Only 6,000 eligible users arrived per day, and weekday behavior differed from weekend behavior. A one-week test would be too small and would cover only one weekly cycle. The team planned a two-week minimum instead.

Sample-size planning protects two decisions. First, it reduces the chance of missing a real effect that matters. Second, it prevents teams from treating random noise as a reliable outcome. The minimum detectable effect should come from business value, not from whichever number produces a convenient duration. If only a very large change could justify engineering and support costs, the test can target that larger effect. If a small change matters at scale, more observations may be necessary.

The calculation is not a guarantee. Traffic allocation, repeated users, unequal variance, missing events, and network effects can change effective sample size. NovaPlay monitored enrollment, sample ratio, event quality, and guardrail metrics during the test, but did not evaluate the winner before the planned stopping point. It also recorded assumptions in the experiment brief.

Before launch, the team now agrees on baseline, primary metric, minimum detectable effect, power, significance threshold, population, duration, and stopping rule. This discussion sometimes shows that an experiment is impractical. That is useful information. A test should be designed to answer a decision, not merely launched because experimentation sounds rigorous.

## Chinese Translation

NovaPlay原计划实验一周，但基线20%、最小有价值提升1个百分点、80%把握度要求每组约25,000人。每日仅6,000名合格用户，且周末行为不同，因此至少需要两周。

样本量规划同时降低漏掉真实效果和把噪声当结果的风险。上线前应确定基线、主指标、最小可检测效果、把握度、显著性、总体、周期和停止规则，并在实验中监控分流与数据质量。

## Vocabulary

- **statistical power** — 统计把握度；chance of detecting a real target effect.
- **minimum detectable effect** — 最小可检测效果；smallest effect the design aims to detect.
- **eligible user** — 合格用户；a user who can enter the test.
- **stopping rule** — 停止规则；a predefined condition for ending a test.
- **sample ratio** — 样本比例；allocation between experiment groups.

## Grammar Analysis

- “whichever number **produces a convenient duration**”表示任何产生方便周期的数字。
- “This discussion sometimes shows **that an experiment is impractical**”中that从句作shows宾语。

## Data Analyst Extension

实验brief中固定保存假设与计算输入；若流量不足，优先延长周期、提高分流或重新评估最小有价值效果，不要边看结果边缩短标准。

## Reading Questions

1. Why was one week insufficient?
2. What should determine the MDE?
3. What was monitored during the test?

### Workplace Application

Your team wants a five-day test with 4,000 users per group and a one-point lift from a 20% baseline. Write a 40–80 word response requesting the inputs needed before launch.

### Answer Key

1. It lacked enough users and did not cover a full weekly cycle.
2. The minimum detectable effect should come from business value.
3. The team monitored enrollment, sample ratio, event quality, and guardrails.

### Application Model Response

Before launching a five-day test, we need the baseline rate, minimum business-worthy lift, significance level, statistical power, daily eligible traffic, and expected sample ratio. With only 4,000 users per group, the design may not detect a one-point lift reliably. I recommend calculating the required sample and agreeing on a minimum duration and stopping rule first.
