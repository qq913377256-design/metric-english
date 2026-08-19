## English Original

### One North Star Needs Guardrails

Fictional learning app OrbitLearn chose weekly completed lessons as its North Star metric. The metric connected product activity to customer value: learners who completed lessons were more likely to renew. A product team then shortened every lesson and added repeated reminders. Completed lessons rose 22%, yet cancellation requests and notification opt-outs also increased. The team had optimized the chosen number without protecting the broader experience.

A North Star metric gives teams one shared direction, but it cannot describe every important outcome. It needs guardrail metrics that reveal unacceptable costs or side effects. OrbitLearn kept completed lessons as the value metric and added four guardrails: seven-day retention, cancellation rate, notification opt-out rate, and average learning assessment score. It also defined who counted as an active learner and required a minimum lesson length, preventing simple changes from inflating completion.

Guardrails should be selected before an experiment or feature launch. Each one needs a baseline, an acceptable change range, an owner, and a response rule. For example, the team could ship a reminder change only if completed lessons improved while opt-outs increased by less than 0.5 percentage points. If a guardrail crossed its limit, the owner would pause rollout and investigate the affected segment.

The team learned to read the metrics as a set. A 10% gain in lesson completion was not automatically a win if retention declined. Likewise, a small temporary increase in support questions might be acceptable if assessment results improved substantially. The decision depended on customer value, risk, and the size of each effect.

OrbitLearn's monthly review now begins with the North Star trend, followed immediately by guardrails and segment differences. This structure keeps attention focused without creating tunnel vision. One number can align a company, but one number should never be allowed to hide harm. Good metric design makes the desired behavior easy to recognize and the unacceptable trade-offs difficult to ignore.

## Chinese Translation

OrbitLearn把每周完成课程数设为北极星指标。团队缩短课程并频繁提醒后，完成数上涨22%，但取消和关闭通知也增加。北极星能统一方向，却不能覆盖所有结果。

团队增加七日留存、取消率、关闭通知率和测评分数作为护栏，并为每项设基线、容忍范围、负责人和响应规则。评审时必须把北极星、护栏和分群一起看，避免单一数字隐藏客户伤害。

## Vocabulary

- **North Star metric** — 北极星指标；a shared measure of delivered value.
- **guardrail** — 护栏指标；a measure that limits harmful trade-offs.
- **opt-out** — 选择退出；a user disables a feature or message.
- **acceptable range** — 可接受范围；a predefined tolerance.
- **rollout** — 灰度发布；gradual release to users.
- **tunnel vision** — 视野狭窄；focus on one signal while missing others.

## Grammar Analysis

- “learners **who completed lessons**”使用who引导定语从句。
- “only **if** completed lessons improved”中的if引导发布条件。

## Data Analyst Extension

指标卡应同时记录价值指标、护栏、口径、基线、阈值、负责人和超限动作。实验报告不要只写主指标赢输，要把护栏差异并列呈现。

## Reading Questions

1. Why was the 22% increase not a clear win?
2. What must each guardrail define?
3. How does the review prevent tunnel vision?

### Workplace Application

A new checkout flow raises conversion by 6% but increases refund requests from 3.0% to 4.1%. Write a 40–80 word recommendation using a North Star and guardrail perspective.

### Answer Key

1. Cancellation and notification opt-out metrics worsened.
2. Each guardrail needs a baseline, acceptable range, owner, and response rule.
3. The review presents the North Star, guardrails, and segment differences together.

### Application Model Response

Checkout conversion improved by 6%, but the refund rate rose from 3.0% to 4.1%, so this is not yet a clear win. I recommend pausing the full rollout and reviewing refunds by device, payment method, and customer segment. We can continue with a limited group only if refunds return within the agreed guardrail.
