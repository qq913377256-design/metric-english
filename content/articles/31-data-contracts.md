## English Original

### Data Contracts Prevent Silent Breaks

Fictional retailer JuniperBay received product events from a checkout team. One Tuesday, that team renamed `customer_id` and changed price from dollars to cents. The pipeline still loaded rows, but customer joins failed and revenue became one hundred times larger. No technical job failed, so dashboards published incorrect numbers for six hours.

A data contract made the producer-consumer agreement explicit. It listed required fields, types, units, allowed nulls, uniqueness rules, delivery schedule, owner, and change process. Automated checks rejected incompatible records before publication. Compatible additions could proceed with notice; breaking changes required a new version, impact review, migration window, and consumer approval.

The contract also described meaning. “Order completed” required captured payment and excluded tests and cancellations. Freshness had a 07:00 deadline, while completeness required at least 99.5% of expected events. Owners and escalation routes appeared beside each rule. Consumers still tested their transformations, but they no longer had to discover upstream changes from a broken chart.

JuniperBay introduced contracts first for revenue and customer identity, where silent errors had high impact. It monitored violations rather than assuming documentation alone created quality. During a later checkout change, the producer announced a new currency field, ran both versions for two weeks, and shared reconciliation results. Migration finished without dashboard interruption.

A contract is not a large document or a tool purchase. It is an enforceable agreement about structure, meaning, service level, ownership, and change. It works when producers and consumers both participate and when failure blocks unsafe publication. Reliable data depends not only on detecting bad outputs, but also on controlling how critical inputs are allowed to change.

The team measured contract coverage, violation frequency, acknowledgment time, and unresolved consumer dependencies. These indicators showed whether the agreement was actually used. A contract that nobody tests, owns, or follows during change is only documentation and cannot prevent a silent break.

## Chinese Translation

JuniperBay上游改字段名并把美元改为美分，任务仍成功但看板错误。数据契约明确字段、类型、单位、空值、唯一性、时效、完整性、负责人和变更流程，并用自动检查阻止不兼容数据发布。破坏性变更需要版本、影响评审、迁移窗口和核对。

## Vocabulary
- **data contract** — 数据契约；an enforceable producer-consumer agreement.
- **breaking change** — 破坏性变更；a change incompatible with consumers.
- **service level** — 服务水平；an agreed quality or timing target.
- **escalation route** — 升级路径；who handles a serious violation.

## Grammar Analysis
- “where silent errors had high impact”中where说明优先应用的领域。
- “inputs **are allowed to change**”使用被动语态强调变更控制。

## Data Analyst Extension
优先为收入、客户ID等高影响数据建立契约；把schema、semantics、SLA、owner和version检查放入发布门禁。

## Reading Questions
1. Why did jobs not fail? 2. What required a new version? 3. How was migration verified?
### Workplace Application
An upstream team will change revenue from dollars to cents next Monday. Write a 40–80 word contract-based response with tests and migration steps.
### Answer Key
1. Rows remained technically loadable. 2. Breaking changes. 3. Parallel versions and reconciliation. Request versioning, unit checks, impact review, and a safe cutover.
