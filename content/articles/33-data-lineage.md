## English Original

### Data Lineage Shortens Incident Response

Fictional bank AlderPay changed a source field used to classify card transactions. Fraud alerts dropped, a finance report shifted, and two dashboards disagreed. Without lineage, three teams separately traced SQL through dozens of tables. They spent hours discovering that all affected products depended on the same transformed field.

Data lineage records how data moves from source through transformations to downstream tables, metrics, reports, and models. Column-level lineage showed that the renamed source fed a merchant-category field, which fed both fraud rules and spending metrics. Asset ownership and refresh schedules added operational context. The incident lead could identify consumers, pause unsafe outputs, and contact owners quickly.

Lineage is useful before incidents too. During a proposed change, the producer can review downstream impact and notify affected teams. Analysts can see whether two metrics share a source or merely share a label. Auditors can trace a reported number back to its origin and transformation rules.

AlderPay began with critical assets rather than attempting a perfect map. Automated extraction captured table and column dependencies; owners added business meaning, criticality, and manual processes. A weekly check flagged missing owners and broken links. The map linked directly to runbooks and contracts.

Lineage does not prove data is correct. It reduces search time and makes dependency risk visible. After implementation, a similar schema change took 35 minutes to assess instead of four hours. The team knew which outputs to suspend, which remained safe, and which owners needed updates. In a connected data system, understanding impact is as important as finding the technical fault.

The incident report used the lineage map as evidence, but owners still verified actual records before restoring service. This distinction prevented the dependency graph from becoming another source of false confidence. Maps guide investigation; validation determines whether an output is safe.

## Chinese Translation
虚构银行AlderPay修改了一个用于银行卡交易分类的源字段。随后，欺诈告警数量下降，一份财务报告发生变化，两张看板也出现了不一致。因为缺少数据血缘，三个团队分别沿着几十张表追查SQL，花了数小时才发现所有受影响的产品都依赖同一个转换字段。

数据血缘记录数据怎样从源系统出发，经过转换，流向下游表、指标、报告和模型。列级血缘显示，被重命名的源字段生成了商户类别字段，而该字段同时被欺诈规则和消费指标使用。资产负责人和刷新时间又补充了运营信息。事故负责人因此能迅速找到使用方、暂停不安全输出并联系相关所有者。

数据血缘在事故发生前同样有价值。生产方计划变更时，可以先查看下游影响并通知相关团队。分析师可以判断两个指标是真的共享数据源，还是只是名称相似。审计人员也可以把报告中的数字追溯到来源和转换规则。

AlderPay没有一开始就追求一张完美的全量地图，而是先覆盖关键资产。自动提取记录表级和列级依赖，负责人再补充业务含义、关键程度和人工流程。每周检查会标记缺失负责人和断开的依赖关系，血缘图还直接连接操作手册和数据契约。

数据血缘不能证明数据一定正确。它的价值是减少查找时间，并让依赖风险可见。系统上线后，一次类似的字段变更只用了35分钟完成影响评估，而此前需要四个小时。团队知道哪些输出必须暂停、哪些仍然安全，以及需要通知哪些负责人。在互相连接的数据系统中，理解影响范围与找到技术故障同样重要。

事故报告可以把血缘图作为证据，但负责人在恢复服务前仍需检查真实记录。这样能避免依赖关系图成为另一种虚假信心。血缘图负责指引调查，实际校验才决定输出是否安全。
## Vocabulary
- **lineage** — 数据血缘；the path from source to consumers.
- **downstream** — 下游；systems that depend on earlier data.
- **criticality** — 关键程度；importance to business operations.
- **runbook** — 操作手册；documented incident procedures.
- **column-level lineage** — 列级血缘；dependencies traced for an individual field.
- **dependency** — 依赖关系；a connection where one asset relies on another.
- **impact assessment** — 影响评估；identifying consumers affected by a change.
- **origin** — 数据源头；the source from which a reported value begins.
## Grammar Analysis
- “which fed both...”中which指代上文分类字段。
- “rather than attempting”表达被放弃的全量方案。
## Data Analyst Extension
为核心指标保存table/column lineage、owner、criticality、contract和runbook链接；变更评审先跑impact analysis。
## Reading Questions
1. What common dependency was found?
2. What did owners add?
3. What can lineage not prove?
### Workplace Application
A source column will be removed. Write a 40–80 word impact-assessment request using lineage, owners, and safe publication controls.
### Answer Key
1. A transformed merchant-category field was the shared dependency.
2. Owners added business meaning, criticality, and manual processes.
3. Lineage cannot prove that data is correct.

### Application Model Response

Before removing the source column, please run a lineage impact assessment covering downstream tables, metrics, dashboards, models, and manual extracts. We need each asset owner to confirm migration or approve a temporary pause. The old field should remain until replacement values reconcile and all critical consumers pass validation; unsafe outputs must be blocked during cutover.
