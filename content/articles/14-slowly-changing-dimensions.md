## English Original

### Tracking Changes with Slowly Changing Dimensions

Fictional software company BrightDesk assigned every customer to a market segment. In January, Acorn Studio was classified as Small Business. In July, its employee count grew and the account moved to Mid-Market. When an analyst rebuilt the January report in August, Acorn Studio appeared as Mid-Market because the customer table stored only the latest segment. Historical small-business revenue fell even though no January transaction had changed.

This is a slowly changing dimension problem. Descriptive attributes such as segment, region, owner, or subscription tier can change more slowly than transactions, but those changes affect historical analysis. A Type 1 approach overwrites the old value. It is simple and useful when correcting an error, such as a misspelled city. However, it removes the previous state. A Type 2 approach adds a new dimension row with effective start and end dates. Transactions can then join to the version that was valid when the event occurred.

BrightDesk chose Type 2 for market segment and account region because leaders wanted an “as it was then” view. It kept Type 1 for formatting corrections. The warehouse created a stable customer business key plus a separate version key. Each version had `valid_from`, `valid_to`, and `is_current` fields. Analysts joined transaction dates between the effective dates instead of joining only on the customer ID.

The team also documented two valid questions. “How much January revenue came from customers classified as Small Business in January?” requires historical classification. “How much historical revenue belongs to customers that are Mid-Market today?” requires the current classification. Neither question is wrong, but mixing them is. After the change, BrightDesk labeled reports as “historical segment” or “current segment,” tested that effective dates did not overlap, and reconciled total revenue across both views. Preserving history was not merely a warehouse technique; it was a way to keep time-based business questions honest.

## Chinese Translation

BrightDesk客户Acorn Studio一月属于小企业，七月升为中型市场。客户表只保存最新分类，导致八月重跑一月报告时，历史收入被重新归类。Type 1直接覆盖旧值，适合纠错；Type 2新增带生效起止日期的版本，能按交易发生时的状态连接。

团队为市场分群和区域使用Type 2，为拼写纠错使用Type 1，并区分“当时的分群”和“当前分群”两种问题。两者都可成立，但不能混用。

## Vocabulary

- **overwrite** — 覆盖；replace an old value.
- **effective date** — 生效日期；when a version starts or ends.
- **historical classification** — 历史分类；the category valid at the event time.
- **stable key** — 稳定键；an identifier that survives attribute changes.
- **overlap** — 重叠；two versions being valid at the same time.
- **rebuild** — 重跑；produce a report again from stored data.

## Grammar Analysis

- “the version **that was valid when the event occurred**”包含定语从句和时间从句。
- “Neither question is wrong, **but mixing them is**”中is替代is wrong，避免重复。

## Data Analyst Extension

先列出需要保留历史的维度字段，再定义版本键、生效区间和当前标记。测试同一业务键的有效期不重叠，并在报表标题中标明使用当前还是历史属性。

## Reading Questions

1. Why did January revenue move segments?
2. When is Type 1 appropriate?
3. How does Type 2 preserve history?

### Workplace Application

A customer changes region in June, and old reports now show the new region. Write a 40–80 word recommendation explaining the historical question, modeling choice, and one quality test.

### Answer Key

1. The latest segment overwrote history. 2. For corrections where history is unnecessary. 3. It stores dated versions. The application should recommend Type 2, date-aware joins, and a no-overlapping-period test.
