## English Original

### Find the Real Funnel Drop-off

Fictional travel site CloudTrip reported that only 18% of visitors completed a booking. Leaders asked the analytics team to fix the largest funnel drop-off. The first dashboard showed a sharp fall between “search” and “select room,” but the steps were built from page views. Mobile users could select a room inside the search page, so their valid progress was not recorded. The apparent drop-off partly came from tracking design.

The team first defined one business event for each step: eligible visit, search results viewed, room selected, traveler details submitted, payment attempted, and booking confirmed. It specified the order of events, the seven-day conversion window, and whether repeated attempts counted once or many times. Bot traffic, employees, and unsupported markets were excluded consistently.

After rebuilding the funnel, the team segmented results by device, market, new versus returning visitor, and payment method. Overall payment completion was 72%, but it was only 41% for new mobile users paying with one digital wallet. Session recordings and error logs showed an address-validation failure after the wallet returned users to the site. This was a narrow, actionable problem that the overall average had hidden.

Funnel analysis should not stop at the lowest percentage. A large drop may be expected, poorly measured, or outside the team's control. Analysts should estimate the number of affected users, business value, confidence in the cause, and effort required to improve the step. CloudTrip fixed the wallet error, monitored booking confirmation and refund guardrails, and ran a staged release. The affected segment's payment completion rose from 41% to 66%.

The useful question changed from “Where is the biggest bar-to-bar decline?” to “Which measurable customer obstacle can we remove?” A reliable answer required consistent event definitions, a stable population, meaningful segments, and evidence beyond the chart. A funnel is not merely a picture of decreasing counts. It is a model of a customer journey, and the model must match how the product actually works.

## Chinese Translation

CloudTrip漏斗显示搜索到选房流失严重，但移动端可在同页选房，事件没有被记录，部分流失来自埋点。团队统一每一步事件、顺序、七日窗口和排除规则，再按设备、市场、用户类型与支付方式分群。

他们发现新移动用户使用某钱包时，支付完成率只有41%，原因是地址校验失败。修复后升至66%。漏斗分析不能只找最低比例，而要找可测量、可行动、证据充分的客户障碍。

## Vocabulary

- **drop-off** — 流失；users who do not reach the next step.
- **conversion window** — 转化窗口；allowed time between start and completion.
- **eligible visit** — 符合条件的访问；a visit included in the funnel base.
- **staged release** — 分阶段发布；release to limited groups first.
- **actionable** — 可行动的；specific enough to guide an intervention.
- **tracking design** — 埋点设计；rules used to record product behavior.

## Grammar Analysis

- “This was a narrow problem **that the overall average had hidden**”使用过去完成时表示此前被隐藏。
- “The useful question changed **from...to...**”表达问题重心的转移。

## Data Analyst Extension

漏斗说明文档应包含事件名、顺序、窗口、去重键、基础人群和排除项。定位后把受影响人数、价值、原因信心与修复成本一起排序。

## Reading Questions

1. Why was the first drop-off misleading?
2. Which segment had the real payment issue?
3. What evidence supported the cause?

### Workplace Application

Desktop conversion is 54% and mobile conversion is 29%, but one mobile step is not tracked reliably. Write a 40–80 word update separating the measurement issue from the possible product issue.

### Answer Key

1. Mobile selection happened without the expected page event. 2. New mobile wallet users. 3. Error logs and session recordings. The application should pause causal claims, repair or validate tracking, then compare defined steps and segments.
