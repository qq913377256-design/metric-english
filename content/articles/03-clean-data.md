# Why Clean Data Matters

## English Original

An online store receives 12,000 orders in one month. Before Sara reports the results, she checks the order table. At first, the table looks normal. Then she finds 214 rows with no customer ID, 36 orders that appear twice, and several delivery dates that are earlier than the order dates.

Each problem can change the report. Missing customer IDs make it difficult to count unique customers. Duplicate orders make revenue look higher than it really is. Impossible dates can produce a negative delivery time. If Sara ignores these issues, the final dashboard may be neat but wrong.

Sara does not delete every unusual row. First, she writes a validation rule for each field. An order ID must be unique. Revenue cannot be negative. An order date cannot be in the future. She then checks the source system with an engineer. Some unusual orders are valid, while others came from a failed data import.

Data cleaning is not only about fixing cells. It is about understanding how the data was created and deciding which records can be trusted.

## Chinese Translation

一家网店在一个月内收到12,000个订单。Sara在汇报结果前检查了订单表。起初，表格看起来很正常。随后她发现214行缺少客户ID、36个订单重复出现，还有几个送货日期早于下单日期

每个问题都可能改变报告。缺少客户ID会让独立客户数难以统计。重复订单会让收入看起来高于实际值。不可能的日期可能产生负数配送时间。如果Sara忽略这些问题，最终的仪表盘也许很整洁，但结论会是错的

Sara没有删除每一条异常记录。她先为每个字段编写校验规则。订单ID必须唯一，收入不能为负数，下单日期不能在未来。随后她和工程师一起检查源系统。一些异常订单是有效的，另一些则来自失败的数据导入

数据清洗不只是修正单元格，还要理解数据如何产生，并判断哪些记录值得信任

## Vocabulary

- **row** /roʊ/：表格中的行、记录
- **customer ID**：客户唯一标识
- **duplicate** /ˈduːplɪkət/：重复记录
- **unique** /juˈniːk/：唯一的、不重复的
- **negative** /ˈneɡətɪv/：负数的
- **validation rule**：校验规则
- **source system**：产生原始数据的业务系统
- **data import**：数据导入

## Grammar Analysis

### 1. make加宾语加补语

`Duplicate orders make revenue look higher than it really is.`

`make revenue look higher`表示让收入显得更高。`make`后用动词原形`look`

类似表达：`Missing values make the comparison less reliable.`

### 2. while表示对比

`Some unusual orders are valid, while others came from a failed data import.`

这里的`while`不是在某段时间内，而是表示两类记录的对比

### 3. 被动语态

`It is about understanding how the data was created.`

数据是被创建的，因此使用`was created`。流程说明中被动语态很常见，但要明确责任时应写出动作执行者

## Data Analyst Extension

常见质量检查可以分为四类：

- **Completeness**：关键字段是否缺失
- **Uniqueness**：主键是否重复
- **Validity**：值是否满足格式和范围规则
- **Consistency**：不同表或系统中的定义是否一致

质量报告句型：`We found 214 records with missing customer IDs, representing 1.8% of monthly orders.`

不要只说数据很脏。说明问题数量、占比、影响指标和处理方式

## Reading Questions

1. What three data problems does Sara find?
2. How can duplicate orders affect revenue?
3. Why does Sara check the source system?
4. Write one validation rule for a table you know

### Answer Key

1. She finds missing customer IDs, duplicate orders, and impossible delivery dates
2. They make reported revenue higher than real revenue
3. She needs to learn why the unusual records exist and whether they are valid
4. Sample answer: Every employee ID must be unique and cannot be empty
