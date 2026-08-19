## English Original

### Freshness and Completeness Are Different

Fictional insurer BlueHarbor refreshed its claims dashboard at 06:00, exactly on schedule. The freshness monitor was green, but only 82% of claims had arrived because one regional source sent an empty file. The dashboard was timely and incomplete. Leaders nearly interpreted the lower total as an operational improvement.

Freshness measures how recently data was updated or whether it arrived by an expected time. Completeness measures whether the expected records, entities, fields, or volume are present. A dataset can be fresh but incomplete, or complete but late. One combined “data healthy” flag hides these different failure modes and responses.

BlueHarbor created separate checks. Freshness compared the latest event and load times with service deadlines. Completeness compared record counts by region with historical ranges and source control totals. Coverage checks confirmed every active region appeared. Critical fields had non-null thresholds. The dashboard displayed both status and the affected period instead of showing a misleading current total.

When the empty file arrived, the system held publication, notified the regional owner, and showed the previous validated result with a warning. After backfill, reconciliation confirmed counts before release. The incident review added an empty-file rule and clarified who could approve partial publication.

Quality dimensions should connect to user decisions. A late daily report may still be usable for monthly planning; an incomplete fraud feed may be unsafe at any time. Analysts need explicit thresholds, owners, and fallbacks for each dimension. “The pipeline ran” is not evidence that the dataset is ready. Readiness means the data is recent enough, complete enough, and valid enough for its stated use.

The same principle applies at field level. A table may contain every expected row while a newly required status field is mostly null. BlueHarbor therefore attached quality checks to the decision-critical columns, not only to the arrival of files and rows.

## Chinese Translation
虚构保险公司BlueHarbor的理赔看板在06:00准时刷新，及时性监控显示绿色。但是，由于一个区域数据源发送了空文件，系统只收到82%的理赔记录。看板虽然按时更新，却并不完整。管理层差点把较低的理赔总量误解为运营改善。

及时性衡量数据最近一次更新的时间，或者数据是否在约定时间前到达。完整性衡量预期的记录、实体、字段或数据量是否齐全。一份数据可以及时但不完整，也可以完整但迟到。用一个统一的“数据健康”标记，会掩盖不同的故障类型以及不同的处理方式。

BlueHarbor建立了两组独立检查。及时性检查把最新事件时间、载入时间与服务截止时间比较；完整性检查把各区域记录数与历史范围、源系统控制总数进行比较。覆盖检查确认每个有效区域都出现，关键字段则设置非空阈值。看板会同时显示两种状态和受影响周期，而不是继续展示一个容易误导的最新总数。

发现空文件后，系统暂停发布，通知区域负责人，并带警告展示上一次经过验证的结果。缺失数据回补后，团队先核对记录数，再恢复发布。事故复盘新增了空文件规则，并明确由谁批准部分数据发布。

质量维度必须与用户决策联系起来。一份迟到的日报或许仍可用于月度规划，但一份不完整的欺诈数据即使准时到达也可能不安全。每个维度都需要明确阈值、负责人和备用方案。“管道成功运行”不能证明数据已经可用。可用意味着数据对于具体用途来说足够及时、足够完整，也足够有效。

同样的原则也适用于字段层。一张表可能包含所有预期记录，但一个新增加的状态字段大部分为空。因此，BlueHarbor把质量检查绑定到影响决策的关键字段，而不只检查文件和行是否到达。
## Vocabulary
- **freshness** — 及时性；how recent data is.
- **completeness** — 完整性；how much expected data is present.
- **coverage** — 覆盖率；whether expected entities appear.
- **backfill** — 回补；load missing historical records.
- **control total** — 控制总数；a trusted source count used for comparison.
- **threshold** — 阈值；a boundary that triggers a warning or action.
- **fallback** — 备用方案；the safe result or process used during failure.
- **partial publication** — 部分发布；releasing data before every expected record arrives.
## Grammar Analysis
- “whether the expected records...are present”是whether宾语从句。
- “recent enough...for its stated use”用enough表示满足用途的程度。
## Data Analyst Extension
为每个关键表分别设置freshness、volume、entity coverage和field completeness，不用单一绿灯替代多维状态。
## Reading Questions
1. How was data fresh but incomplete?
2. What did the fallback show?
3. Why should thresholds depend on use?
### Workplace Application
A report refreshes on time with only 76% of expected stores. Write a 40–80 word incident notice stating status, risk, and fallback.
### Answer Key
1. The system loaded an empty regional file on schedule.
2. The fallback showed the previous validated result with a warning.
3. Different decisions tolerate different levels of lateness and missing data.

### Application Model Response

The report refreshed on time, but only 76% of expected stores are present, so the dataset is fresh and incomplete. Current totals may understate performance and should not be used for decisions. We are holding publication, showing the previous validated result, contacting the missing-store owners, and will release after coverage and control totals reconcile.
