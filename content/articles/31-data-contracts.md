## English Original

### Data Contracts Prevent Silent Breaks

Fictional retailer JuniperBay received product events from a checkout team. One Tuesday, that team renamed `customer_id` and changed price from dollars to cents. The pipeline still loaded rows, but customer joins failed and revenue became one hundred times larger. No technical job failed, so dashboards published incorrect numbers for six hours.

A data contract made the producer-consumer agreement explicit. It listed required fields, types, units, allowed nulls, uniqueness rules, delivery schedule, owner, and change process. Automated checks rejected incompatible records before publication. Compatible additions could proceed with notice; breaking changes required a new version, impact review, migration window, and consumer approval.

The contract also described meaning. “Order completed” required captured payment and excluded tests and cancellations. Freshness had a 07:00 deadline, while completeness required at least 99.5% of expected events. Owners and escalation routes appeared beside each rule. Consumers still tested their transformations, but they no longer had to discover upstream changes from a broken chart.

JuniperBay introduced contracts first for revenue and customer identity, where silent errors had high impact. It monitored violations rather than assuming documentation alone created quality. During a later checkout change, the producer announced a new currency field, ran both versions for two weeks, and shared reconciliation results. Migration finished without dashboard interruption.

A contract is not a large document or a tool purchase. It is an enforceable agreement about structure, meaning, service level, ownership, and change. It works when producers and consumers both participate and when failure blocks unsafe publication. Reliable data depends not only on detecting bad outputs, but also on controlling how critical inputs are allowed to change.

The team measured contract coverage, violation frequency, acknowledgment time, and unresolved consumer dependencies. These indicators showed whether the agreement was actually used. A contract that nobody tests, owns, or follows during change is only documentation and cannot prevent a silent break.

## Chinese Translation

虚构零售商JuniperBay从结账团队接收商品事件。某个星期二，该团队重命名了`customer_id`字段，并把价格单位从美元改成美分。数据管道仍然成功载入记录，但客户连接失败，收入也被放大了一百倍。技术任务没有报错，因此错误数字在看板上持续发布了六个小时。

数据契约把数据生产者与使用者之间的约定明确写下来。契约列出必填字段、数据类型、单位、允许的空值、唯一性规则、交付时间、负责人和变更流程。自动检查会在发布前拒绝不兼容的记录。兼容性新增可以在通知后继续推进；破坏性变更则必须创建新版本，完成影响评审，提供迁移窗口，并获得使用方确认。

契约还需要描述业务含义。“订单已完成”必须表示付款已经成功扣取，同时排除测试订单和取消订单。及时性要求数据在07:00前到达，完整性要求至少收到99.5%的预期事件。每条规则旁边都写明负责人和升级路径。使用方仍需测试自己的转换，但不必再从一张异常图表中猜测上游发生了什么。

JuniperBay先在收入和客户身份数据上引入契约，因为这些数据发生静默错误时影响最大。团队持续监控违反契约的情况，而不是认为写完文档就等于获得了质量。后来结账系统再次变更时，生产方提前公布新币种字段，让两个版本并行两周，并共享核对结果。整个迁移过程没有中断看板。

数据契约不等于一份很长的文档，也不需要先购买工具。它是一份能够执行的约定，覆盖结构、含义、服务水平、所有权和变更方式。只有生产者与使用者都参与，并且校验失败能够阻止不安全发布时，契约才会生效。可靠数据不仅依赖发现错误结果，也依赖控制关键输入可以怎样改变。

团队还监控契约覆盖率、违规频率、确认时间和未解决的下游依赖。这些指标能说明契约是否真的在使用。没有测试、负责人和变更约束的契约，只是一份说明文档，无法防止静默故障。

## Vocabulary
- **data contract** — 数据契约；an enforceable producer-consumer agreement.
- **breaking change** — 破坏性变更；a change incompatible with consumers.
- **service level** — 服务水平；an agreed quality or timing target.
- **escalation route** — 升级路径；who handles a serious violation.
- **producer** — 数据生产者；the team or system that creates the data.
- **consumer** — 数据使用者；a team, report, or model that depends on the data.
- **compatible** — 兼容的；safe for existing consumers to accept.
- **violation** — 违规；a case that breaks an agreed contract rule.

## Grammar Analysis
- “where silent errors had high impact”中where说明优先应用的领域。
- “inputs **are allowed to change**”使用被动语态强调变更控制。

## Data Analyst Extension
优先为收入、客户ID等高影响数据建立契约；把schema、semantics、SLA、owner和version检查放入发布门禁。

## Reading Questions
1. Why did jobs not fail?
2. What required a new version?
3. How was migration verified?
### Workplace Application
An upstream team will change revenue from dollars to cents next Monday. Write a 40–80 word contract-based response with tests and migration steps.
### Answer Key
1. Records remained technically loadable, so the pipeline did not detect the semantic error.
2. Breaking changes required a new version.
3. The team used parallel versions and reconciliation.

### Application Model Response

Changing revenue from dollars to cents is a breaking contract change. Please publish a versioned field, document the unit, and run both versions through Monday. Before cutover, we will test types and value ranges, reconcile revenue totals, review downstream impact, and confirm that every dashboard owner has migrated. Unsafe records should be blocked from publication.
