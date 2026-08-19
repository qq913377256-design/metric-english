## English Original

### Build an Executive Dashboard Around Decisions

Fictional logistics company RidgeRoute gave executives a dashboard with 47 charts. It included shipments by hour, vehicle type, depot, customer tier, route, and weather. The data was accurate, but leaders still asked analysts to explain what required attention. The dashboard described the business without supporting a clear management decision.

The analytics team interviewed users about recurring decisions. Each Monday, leaders needed to decide where to add capacity, which service failures required escalation, and whether quarterly margin remained on plan. The redesigned page began with three questions rather than chart categories. It showed margin versus target, on-time delivery versus service commitment, and capacity risk for the next two weeks.

Every headline metric had a target, prior-period comparison, short variance note, and owner. Exceptions were ranked by financial or customer impact. Leaders could move from a company result to region and depot details, but the first screen contained only information needed to identify a decision. Definitions and refresh times were visible, and stale data displayed a warning instead of an apparently current number.

The team removed decorative charts and added an action log. When on-time delivery fell below 94%, the dashboard showed affected shipments, known drivers, confidence, current owner, and next update time. A user could distinguish a measured driver from an unverified explanation. Accessibility tests ensured that color was not the only signal and that keyboard users could reach filters and details.

After launch, meeting time spent locating problems fell from 25 minutes to eight. The dashboard did not make decisions automatically. It created a shared, trustworthy starting point. Good executive design compresses complexity without hiding uncertainty. It answers: What changed? Why does it matter? Where is it concentrated? Who is acting? What decision is needed now? If a visual cannot help answer one of those questions, it probably belongs in an analyst workspace rather than the executive overview.

## Chinese Translation

RidgeRoute原看板有47张图，却不能告诉管理层该处理什么。团队先访谈固定决策：容量投放、服务故障升级和利润是否达标，再围绕三个问题重设计。

每个头部指标都有目标、环比、差异说明和负责人；异常按影响排序，并显示数据新鲜度、已知原因、信心和更新时间。会议定位问题时间从25分钟降到8分钟。管理层看板应压缩复杂性，但不能隐藏不确定性。

## Vocabulary

- **service commitment** — 服务承诺；a promised performance level.
- **escalation** — 升级处理；raising an issue for urgent attention.
- **exception** — 异常项；a result outside expected limits.
- **action log** — 行动记录；owners and next steps for open issues.
- **stale data** — 过期数据；data older than its expected refresh.

## Grammar Analysis

- “information **needed to identify a decision**”中过去分词短语修饰information。
- “If a visual cannot help...”用if给出图表保留标准。

## Data Analyst Extension

先列管理层每周要做的3–5个决定，再为每个决定设计signal、target、variance、impact、owner和drill-down。把探索型图表留在分析工作区。

## Reading Questions

1. Why did 47 charts fail? 2. What appeared with each headline metric? 3. What five questions should the overview answer?

### Workplace Application

An executive dashboard has 32 equal-weight KPIs. Write a 40–80 word redesign proposal centered on two recurring decisions and an exception workflow.

### Answer Key

1. It lacked decision focus. 2. Target, comparison, note, and owner. 3. Change, importance, concentration, action, and decision. The proposal should reduce first-screen metrics and retain drill-down.
