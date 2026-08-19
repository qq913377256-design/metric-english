## English Original

### Reconcile Metrics Before the Meeting

Fictional SaaS company DriftWorks had two revenue dashboards. Finance showed $8.2 million for June; Product showed $8.7 million. Leaders questioned the entire analytics system. Both calculations were internally consistent, but they answered different questions with the same label.

The analyst reconciled the numbers from definition outward. Finance reported recognized revenue in the accounting month, net of credits, using UTC month-end rates. Product reported booked contract value at signature time, before credits, using local timestamps. Currency, timing, status, and adjustment rules explained most of the gap.

She built a bridge starting with Product's total. Removing future service periods, subtracting credits, adjusting foreign exchange, and moving late local-time bookings to July produced the Finance total. A small remainder came from delayed credit data and was assigned an owner and resolution date. Record-level samples confirmed each step.

The company renamed the measures “booked contract value” and “recognized revenue” and documented their purposes. A shared reconciliation check now runs before monthly review. Differences above a threshold block publication or display a warning. Dashboard metadata shows definition, owner, source, refresh, and time zone.

Reconciliation is not forcing all numbers to match. Different measures may be valid for different decisions. The goal is to explain every material difference and prevent one name from hiding several meanings. DriftWorks kept both metrics: Sales used bookings to manage pipeline outcomes, while Finance used recognized revenue for reporting. Trust improved because disagreement became traceable rather than mysterious.

The analyst scheduled the bridge to run automatically and stored unmatched records for review. Monthly sign-off required both metric owners. This turned reconciliation from an emergency exercise into a routine control and prevented the same definitional conflict from returning at every meeting.

Clear ownership mattered as much as matching arithmetic. Finance approved accounting treatment, Product owned operational booking logic, and Analytics maintained the bridge and alerts.

## Chinese Translation
虚构SaaS公司DriftWorks有两张收入看板。财务看板显示六月收入为820万美元，产品看板显示870万美元。管理层因此开始质疑整个分析系统。其实两个计算各自在内部是一致的，只是它们用同一个名称回答了不同问题。

分析师从定义向外逐层核对。财务报告的是会计月份中的已确认收入，扣除贷项，并使用UTC月末汇率；产品报告的是合同签署时的签约金额，没有扣除贷项，而且使用本地时间。币种、确认时间、订单状态和调整规则解释了大部分差异。

她从产品总额开始建立差异桥。依次移除未来服务期间的金额、扣除贷项、调整外汇，并把本地时间较晚的签约移动到七月后，结果与财务总额一致。剩余的小额差异来自延迟到达的贷项数据，团队为它指定了负责人和解决日期。对具体记录的抽样检查确认了每一步转换。

公司把两个指标分别改名为“签约合同金额”和“已确认收入”，并记录各自用途。现在，每月评审前都会运行统一的核对检查。超过阈值的差异会阻止发布或显示警告。看板元数据还会显示定义、负责人、来源、刷新时间和时区。

核对并不意味着强迫所有数字完全相同。不同指标可能服务于不同决策。目标是解释每一项重大差异，避免一个名称掩盖多种含义。DriftWorks保留了两个指标：销售团队用签约金额管理管道结果，财务团队用已确认收入进行报告。数字差异变得可以追踪，而不再神秘，信任也随之提高。

分析师把差异桥设置为自动运行，并保存未匹配记录供复查。每月签署确认需要两位指标负责人共同参与。这样，核对从临时救火变成日常控制，避免同一种口径冲突在每次会议上反复出现。明确所有权与算清差异同样重要：财务确认会计处理，产品负责运营口径，分析团队维护差异桥和告警。
## Vocabulary
- **recognized revenue** — 已确认收入；revenue assigned under accounting rules.
- **booked value** — 签约金额；contract value recorded at booking.
- **credit** — 贷项；an amount reducing billed revenue.
- **material difference** — 重大差异；a gap large enough to affect decisions.
- **reconciliation bridge** — 核对差异桥；a sequence that explains the gap between totals.
- **accounting period** — 会计期间；the time window used for financial recognition.
- **cutoff** — 截止边界；the rule deciding which period receives a record.
- **sign-off** — 签署确认；formal approval that a result is ready.
## Grammar Analysis
- “net of credits”是财务表达，意为扣除贷项后。
- “Differences **above a threshold**”用介词短语限定差异。
## Data Analyst Extension
核对顺序：name/purpose、grain、formula、status、time boundary、currency、latency，再做record samples和bridge。
## Reading Questions
1. Why were both totals valid?
2. What explained the gap?
3. Why were metrics renamed?
### Workplace Application
Two dashboards disagree by 6%. Write a 40–80 word reconciliation plan covering definitions, boundaries, bridge, and publication control.
### Answer Key
1. Both totals were valid because they measured different revenue concepts.
2. Service periods, credits, exchange rates, and time boundaries explained the gap.
3. Renaming made each metric's purpose visible.

### Application Model Response

I will first compare the dashboards' purpose, grain, formula, included statuses, time zone, currency, and refresh timing. Then I will build a bridge that quantifies each difference and verify the steps with record samples. Any unexplained material gap will block publication. The owners will approve distinct metric names and definitions before the meeting.
