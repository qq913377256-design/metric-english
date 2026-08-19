## English Original

### Choose the Right Grain Before You Join

Mira, an analyst at the fictional retailer Northwind Market, was asked to calculate revenue by customer segment. She joined an order table to an order-item table and then joined the result to a customer table. The query ran successfully, but reported revenue was 18% higher than the finance total. Nothing looked obviously broken. Every order had a customer, and every item had an order. The problem was not the join syntax. It was the grain of the tables.

Grain describes what one row represents. In the order table, one row represented one order. In the item table, one row represented one product within an order. An order with four products therefore appeared four times after the join. Mira summed `order_revenue`, which was stored at order grain, after expanding the data to item grain. The same order revenue was counted four times. She had mixed a measure from one grain with rows from another grain.

Before joining, Mira wrote one sentence for each source: “one row per order,” “one row per item,” and “one row per customer.” She decided that the final report needed one row per customer segment per month. She first aggregated item discounts to order level, then joined that result to the order table. She also tested three controls: total order count, total revenue, and the number of unmatched customer IDs. The new result matched finance within the expected rounding difference.

The lesson is practical: define the target grain before writing SQL. Then decide which measures can be summed at that grain and which tables must be aggregated first. A many-to-one join may be safe, but a one-to-many join can multiply rows. Always compare totals before and after a join, inspect several known records, and report unmatched keys. Correct SQL is not only code that runs. It is code whose row meaning remains consistent from source to result.

## Chinese Translation

Mira 连接订单、订单明细和客户表后，收入比财务口径高18%。问题不在语法，而在粒度：订单表每行是一笔订单，明细表每行是一件商品。连接后，一笔含四件商品的订单出现四次，订单级收入也被重复求和。

她先写清每张表“一行代表什么”，再确定结果需要“每月每客户分群一行”。她先把折扣汇总到订单级，再连接订单表，并核对订单数、总收入和未匹配客户。结论是：写SQL前先定义目标粒度；连接前后要核对总量，确保行的业务含义没有改变。

## Vocabulary

- **grain** — 数据粒度；what one row represents.
- **aggregate** — 汇总；combine detailed rows into a higher level.
- **multiply rows** — 放大行数；create repeated business records after a join.
- **unmatched key** — 未匹配键；an ID with no corresponding record.
- **rounding difference** — 舍入差异；a small gap caused by numeric precision.
- **consistent** — 一致的；keeping the same meaning across steps.

## Grammar Analysis

- “An order **with four products** appeared four times”中的介词短语补充限定订单。
- “It is code **whose row meaning remains consistent**”使用whose引导定语从句，说明code的行含义。

## Data Analyst Extension

连接前写下源表粒度、目标粒度、连接基数和可加总指标。连接后至少比较行数、唯一键数、核心指标总量和未匹配率，并保存一组已知记录作为回归检查。

## Reading Questions

1. Why was revenue overstated?
2. What target grain did Mira choose?
3. Which controls did she compare?

### Workplace Application

Your order total rises from $2.40 million to $2.88 million after a join to item data. Write a 40–80 word message explaining the likely grain problem and the checks you will run. Use fictional names only.

### Answer Key

1. Order-level revenue was repeated at item grain.
2. One row per customer segment per month.
3. Order count, revenue, and unmatched customer IDs.

### Application Model Response

The $480,000 increase may come from repeating order-level revenue after the join expands each order to item grain. I will confirm the grain and join cardinality, compare unique order counts and revenue before and after the join, and inspect multi-item orders. I will also report unmatched keys before confirming the root cause.
