## English Original

### Guardrail Metrics Protect the Customer

Fictional food-delivery service MapleDish tested a checkout prompt that encouraged customers to add more items. Average order value rose 7%, and the primary metric looked successful. However, delivery time rose by six minutes because larger orders took restaurants longer to prepare. Customer complaints about late delivery increased 18%. Revenue improved, but part of the cost was transferred to customers and operations.

Guardrail metrics define outcomes that should not deteriorate beyond an accepted limit while a team improves its primary metric. MapleDish selected cancellation rate, late-delivery rate, complaint rate, restaurant rejection rate, and checkout latency before launch. For each guardrail it documented the population, baseline, threshold, expected direction, and owner. The thresholds reflected customer promises and operating capacity, not arbitrary round numbers.

The team segmented guardrails by restaurant size and order value. Most harm came from small restaurants receiving unusually large baskets at dinner. Averages had hidden the concentration. Product changed the prompt so it did not appear for restaurants already near capacity, then ran a limited follow-up. Order value rose 4%, while delivery and complaint metrics stayed within their ranges.

Not every guardrail movement requires cancellation. Teams should consider uncertainty, severity, reversibility, and whether harm affects a vulnerable group. A tiny, uncertain latency increase may justify monitoring. A clear increase in failed payments may require immediate rollback even if revenue rises. Response rules should be agreed before results create pressure to reinterpret them.

MapleDish's report presented primary and guardrail outcomes in one table. The recommendation explained the trade-off and the affected segment. This prevented a green primary metric from hiding red customer signals. Experiments are decision tools, not scoreboards. A responsible winner improves the target outcome while keeping important customer, operational, financial, and technical risks inside boundaries the organization has deliberately chosen.

The final launch checklist required written approval for any guardrail exception. That small governance step made it harder to redefine success after seeing an attractive primary result and easier to explain the decision later.

## Chinese Translation

MapleDish加购提示使客单价升7%，但配送慢6分钟、延迟投诉增18%。护栏指标用预先约定的边界保护客户与运营。团队在上线前定义取消、延迟、投诉、商家拒单和结账延迟的口径、基线、阈值与负责人。

分群发现伤害集中在晚餐时段的小餐厅，于是限制提示范围。后续客单价升4%且护栏稳定。主指标与护栏必须在同一张结果表中共同决定发布。

## Vocabulary

- **deteriorate** — 恶化；become worse.
- **operating capacity** — 运营容量；work a system can handle.
- **rollback** — 回滚；return to the previous version.
- **reversibility** — 可逆性；ease of undoing a decision.
- **vulnerable group** — 易受影响群体；people with higher potential harm.

## Grammar Analysis

- “outcomes **that should not deteriorate**”用that限定护栏保护的结果。
- “even if revenue rises”表示即使主指标改善也不能忽略的让步条件。

## Data Analyst Extension

为护栏建立pre-launch清单和超限动作；报告总体与关键分群，写明severity、uncertainty、reversibility和owner，不能上线后再挑有利阈值。

## Reading Questions

1. What cost accompanied higher order value?
2. Where was harm concentrated?
3. Which factors guide a response?

### Workplace Application

A feature raises engagement 9% but failed payments rise from 1.1% to 1.8%, above a 1.4% guardrail. Write a 40–80 word launch recommendation.

### Answer Key

1. Higher order value came with slower delivery and more complaints.
2. Harm was concentrated among small restaurants at dinner.
3. Uncertainty, severity, reversibility, and affected groups guide the response.

### Application Model Response

Engagement improved by 9%, but failed payments reached 1.8%, above the 1.4% guardrail. I recommend pausing the rollout and identifying the affected payment methods, devices, and customer segments. Because payment failure is a severe customer outcome, expansion should resume only after a fix is validated and the guardrail returns within its agreed range.
