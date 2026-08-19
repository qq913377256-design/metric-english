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
DriftWorks两个“收入”分别是820万和870万。财务按会计月确认收入、扣贷项并用UTC；产品按签约时合同额、未扣贷项并用本地时间。分析师用差异桥解释服务期、贷项、汇率和月界，随后改名并建立月度发布前核对。
## Vocabulary
- **recognized revenue** — 已确认收入；revenue assigned under accounting rules.
- **booked value** — 签约金额；contract value recorded at booking.
- **credit** — 贷项；an amount reducing billed revenue.
- **material difference** — 重大差异；a gap large enough to affect decisions.
## Grammar Analysis
- “net of credits”是财务表达，意为扣除贷项后。
- “Differences **above a threshold**”用介词短语限定差异。
## Data Analyst Extension
核对顺序：name/purpose、grain、formula、status、time boundary、currency、latency，再做record samples和bridge。
## Reading Questions
1. Why were both totals valid? 2. What explained the gap? 3. Why were metrics renamed?
### Workplace Application
Two dashboards disagree by 6%. Write a 40–80 word reconciliation plan covering definitions, boundaries, bridge, and publication control.
### Answer Key
Compare purpose and rules before records; quantify each difference and block unexplained material gaps.
