## English Original

### Data Lineage Shortens Incident Response

Fictional bank AlderPay changed a source field used to classify card transactions. Fraud alerts dropped, a finance report shifted, and two dashboards disagreed. Without lineage, three teams separately traced SQL through dozens of tables. They spent hours discovering that all affected products depended on the same transformed field.

Data lineage records how data moves from source through transformations to downstream tables, metrics, reports, and models. Column-level lineage showed that the renamed source fed a merchant-category field, which fed both fraud rules and spending metrics. Asset ownership and refresh schedules added operational context. The incident lead could identify consumers, pause unsafe outputs, and contact owners quickly.

Lineage is useful before incidents too. During a proposed change, the producer can review downstream impact and notify affected teams. Analysts can see whether two metrics share a source or merely share a label. Auditors can trace a reported number back to its origin and transformation rules.

AlderPay began with critical assets rather than attempting a perfect map. Automated extraction captured table and column dependencies; owners added business meaning, criticality, and manual processes. A weekly check flagged missing owners and broken links. The map linked directly to runbooks and contracts.

Lineage does not prove data is correct. It reduces search time and makes dependency risk visible. After implementation, a similar schema change took 35 minutes to assess instead of four hours. The team knew which outputs to suspend, which remained safe, and which owners needed updates. In a connected data system, understanding impact is as important as finding the technical fault.

The incident report used the lineage map as evidence, but owners still verified actual records before restoring service. This distinction prevented the dependency graph from becoming another source of false confidence. Maps guide investigation; validation determines whether an output is safe.

## Chinese Translation
AlderPay源字段变化同时影响欺诈和财务。数据血缘记录源、转换、下游表、指标、报告和模型的关系，列级血缘让负责人迅速找到共同依赖、暂停不安全输出并通知所有者。团队先覆盖关键资产，用自动依赖加人工业务含义逐步完善。
## Vocabulary
- **lineage** — 数据血缘；the path from source to consumers.
- **downstream** — 下游；systems that depend on earlier data.
- **criticality** — 关键程度；importance to business operations.
- **runbook** — 操作手册；documented incident procedures.
## Grammar Analysis
- “which fed both...”中which指代上文分类字段。
- “rather than attempting”表达被放弃的全量方案。
## Data Analyst Extension
为核心指标保存table/column lineage、owner、criticality、contract和runbook链接；变更评审先跑impact analysis。
## Reading Questions
1. What common dependency was found? 2. What did owners add? 3. What can lineage not prove?
### Workplace Application
A source column will be removed. Write a 40–80 word impact-assessment request using lineage, owners, and safe publication controls.
### Answer Key
1. A transformed merchant category. 2. Meaning, criticality, manual steps. 3. Correctness. Identify all consumers before removal.
