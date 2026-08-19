## English Original

### A Metric Definition Is a Contract

At fictional commerce platform AmberLane, “active seller” appeared in six dashboards. One counted any login, another required a published listing, and finance counted sellers with a completed order. All dashboards used the same label, so leaders assumed they described the same population. During planning, estimates differed by 27%, and no team could explain which number should guide staffing.

The analytics group treated the metric definition as a contract. The contract named the business purpose first: estimate sellers currently creating marketplace supply. It defined an active seller as a non-test account with at least one live listing during the previous 28 complete days. The document included the entity, qualifying event, time window, exclusions, time zone, refresh schedule, owner, source tables, and expected limitations.

The team also added examples at the boundaries. A seller who logged in but had no live listing did not qualify. A listing removed for policy reasons did not qualify. A seller with a listing live for one hour did qualify under the current rule, although the team recorded that limitation. Example SQL and a small validation dataset made the written language executable.

Changing the metric required a review by product, finance, and analytics. A proposal had to describe the reason, expected historical impact, migration date, and dashboards affected. Old and new versions ran together for two weeks. The data catalog displayed the current definition and linked to a change log, while deprecated dashboard fields showed a warning.

A metric contract does not prevent debate. It moves debate to the right place: before a definition silently spreads. AmberLane eventually kept separate measures for supply-active, transaction-active, and login-active sellers, because each answered a different question. Clear names reduced the temptation to force one number into every decision. Trust came not from declaring one dashboard official, but from making meaning, ownership, and change visible to everyone who used the metric.

## Chinese Translation

AmberLane有六个“活跃卖家”指标，分别按登录、上架和成交计算，规划数字相差27%。团队把指标定义当作契约：先写业务目的，再明确实体、事件、28天窗口、排除、时区、刷新、负责人、来源和限制。

边界案例、示例SQL和验证数据让定义可执行。变更需要说明原因、历史影响、迁移日期和受影响看板，并双跑两周。最终团队用不同名称保留三种活跃度，因为它们回答不同问题。

## Vocabulary

- **qualifying event** — 计入事件；an event that satisfies the definition.
- **boundary case** — 边界案例；a case near the rule limit.
- **deprecated** — 已弃用；kept temporarily but no longer recommended.
- **change log** — 变更记录；history of definition updates.
- **migration date** — 迁移日期；when consumers switch versions.
- **limitation** — 局限；a known weakness or excluded interpretation.

## Grammar Analysis

- “A seller **who logged in but had no live listing**”用who连接两个并列条件。
- “Trust came not from..., **but from...**”使用not from...but from...对比信任来源。

## Data Analyst Extension

建立指标模板：purpose、entity、formula、window、filters、timezone、refresh、owner、source、limitations、examples、change log。指标改名优先于用模糊名称承载多个含义。

## Reading Questions

1. Why did staffing estimates differ?
2. What made the contract executable?
3. How were changes released safely?

### Workplace Application

Sales and Product disagree on “activated account.” Write a 40–80 word proposal for resolving the definition, including purpose, rule, ownership, and rollout.

### Answer Key

1. Teams used different rules under one label.
2. Boundary examples, SQL, and validation data made the contract executable.
3. Review, impact analysis, and parallel versions supported a safe change.

### Application Model Response

Before choosing an “activated account” rule, we should agree on the decision it supports. I propose documenting the qualifying event, time window, exclusions, source, and owner with Sales and Product. We will test boundary cases, estimate historical impact, run old and new definitions in parallel, and publish the approved definition with a change date.
