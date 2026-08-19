## English Original

### Why a Star Schema Makes Metrics Clearer

At fictional subscription company LumenBox, three teams calculated monthly revenue in three different ways. Marketing used a spreadsheet built from payment events. Finance used invoices. Product used a wide table that mixed customer, plan, and transaction fields. Their totals were close, but not equal, so every review meeting began with a debate about numbers rather than decisions.

The analytics team redesigned the reporting model as a star schema. At the center was a fact table with one row per invoice line. It contained measurable events: quantity, price, discount, and invoice date keys. Around it were dimension tables for customers, plans, products, and dates. Each dimension had one row per business entity and provided descriptive fields such as region or plan category. This separation made the grain visible and reduced repeated logic.

The team then defined revenue once in the fact layer: quantity multiplied by net unit price, excluding canceled invoices. Reports could group that measure by any approved dimension without rebuilding the calculation. A date dimension also gave everyone the same fiscal week and month definitions. When a plan changed names, the plan key stayed stable, so historical reports did not split unexpectedly.

A star schema does not solve every modeling problem. Analysts still need quality tests, clear ownership, and rules for late-arriving data. However, it creates a shared path from event to metric. Users can see which table holds measurements, which tables provide context, and at what grain a result is valid. LumenBox documented the model with a small diagram, example queries, and reconciliation totals. After launch, dashboard development became faster, and metric discussions moved from “Which number is correct?” to “What should we do about the result?” The value of the model was not its shape alone. It was the common business language that the shape made possible.

## Chinese Translation

LumenBox的市场、财务和产品团队各自计算月收入，会议总在争论数字。分析团队建立星型模型：中心事实表每行是一条发票明细，保存数量、价格和折扣；客户、套餐、产品、日期作为维度表提供描述信息。

收入只在事实层定义一次，各报表可按批准的维度汇总。日期维度统一财务周期，稳定的套餐键避免历史被名称变化切断。星型模型仍需要质量测试和负责人，但它让事件、指标、粒度与上下文形成共同语言。

## Vocabulary

- **fact table** — 事实表；stores measurable business events.
- **dimension table** — 维度表；stores descriptive business context.
- **invoice line** — 发票明细行；one billed product or service.
- **fiscal week** — 财务周；a week defined by company accounting rules.
- **reconciliation** — 核对；comparison against a trusted total.
- **late-arriving data** — 延迟到达数据；records received after the expected time.

## Grammar Analysis

- “**At the center was** a fact table”是地点状语前置引起的倒装。
- “the common business language **that the shape made possible**”中that引导定语从句。

## Data Analyst Extension

建模时为每张事实表声明粒度、主键、可加总指标和允许连接的维度。为核心指标提供唯一公式、日期口径、取消规则、核对基准与示例查询。

## Reading Questions

1. What did the fact table represent?
2. Why was the date dimension useful?
3. What did the star schema change in meetings?

### Workplace Application

Three dashboards calculate active subscriptions differently. Write a 40–80 word proposal for a shared fact-and-dimension model, including one validation step.

### Answer Key

1. One invoice line per row. 2. It standardized fiscal periods. 3. Teams discussed actions instead of competing totals. The application should identify a common grain, reusable dimensions, one metric definition, and reconciliation with a trusted source.
