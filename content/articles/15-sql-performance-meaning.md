## English Original

### Faster SQL Without Losing Business Meaning

At fictional marketplace CedarCart, the weekly customer report took 24 minutes to run. An engineer suggested removing two joins and filtering to completed orders earlier. Runtime fell to four minutes, but active-customer counts also fell by 9%. The query was faster because it no longer included customers whose orders were refunded after completion. Performance improved while the business definition silently changed.

SQL optimization should begin with a contract for the result. The team wrote down the expected grain, metric formulas, time zone, included statuses, and trusted control totals. Only then did it inspect the execution plan. One large event table was being scanned three times, so the analyst created a filtered common table expression that read the required dates and columns once. A dimension join used a function on the join key, preventing efficient lookup; the team standardized the key upstream instead.

The optimized query also replaced a correlated subquery with a grouped summary, but kept the refund logic. Partition filters reduced the scan to eight weeks. Intermediate results were aggregated only after the team confirmed that later calculations did not need item-level detail. Clear names and comments explained business rules rather than obvious SQL syntax.

Every change passed two kinds of tests. Technical tests measured runtime and scanned data. Semantic tests compared customer counts, revenue, refunds, null rates, and five known accounts against the original approved result. The final query ran in six minutes and matched all controls. CedarCart saved compute time without changing the decision represented by the report.

A fast wrong answer is still wrong. Optimization is safest when analysts separate the question “Can the database do less work?” from “Does the result mean the same thing?” Filter early, select only necessary columns, reuse calculations, and inspect join cardinality—but keep a fixed validation set. Readability also matters because future analysts must recognize business rules before changing them. Performance work is complete only when speed, meaning, and maintainability all improve together.

## Chinese Translation

CedarCart把周报从24分钟优化到4分钟，但活跃客户少了9%，因为退款订单被错误排除。团队先写清结果粒度、公式、时区、状态和核对总量，再检查执行计划。

他们减少重复扫描、标准化连接键、改写相关子查询并使用分区过滤，同时保留退款逻辑。每次修改既测运行时间，也比较客户数、收入、退款、空值和已知账户。最终查询6分钟完成且业务口径不变。

## Vocabulary

- **execution plan** — 执行计划；how a database will run a query.
- **correlated subquery** — 相关子查询；a subquery evaluated using outer-row values.
- **partition filter** — 分区过滤；limits scanning to relevant data blocks.
- **semantic test** — 语义测试；checks that business meaning is unchanged.
- **control total** — 控制总量；a trusted comparison value.
- **maintainability** — 可维护性；ease of understanding and changing code safely.

## Grammar Analysis

- “Only then **did it inspect**”是only then前置引起的部分倒装。
- “customers **whose orders were refunded**”用whose说明客户与订单的所属关系。

## Data Analyst Extension

优化前冻结一组语义验收指标；优化后同时报告runtime、scanned bytes和结果差异。任何无法解释的差异都应阻止发布，而不是用“查询更快”掩盖。

## Reading Questions

1. Why did the first optimization change the count?
2. What are semantic tests?
3. Which three qualities define complete performance work?

### Workplace Application

A query is 70% faster but revenue is 2.3% lower. Write a 40–80 word update explaining why release is paused and which semantic checks you will perform.

### Answer Key

1. It removed refunded orders and changed the definition. 2. Checks that business meaning remains the same. 3. Speed, meaning, and maintainability. The update should pause release, compare filters/grain/joins and control totals, and avoid accepting unexplained variance.
