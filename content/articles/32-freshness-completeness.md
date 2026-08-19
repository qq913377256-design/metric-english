## English Original

### Freshness and Completeness Are Different

Fictional insurer BlueHarbor refreshed its claims dashboard at 06:00, exactly on schedule. The freshness monitor was green, but only 82% of claims had arrived because one regional source sent an empty file. The dashboard was timely and incomplete. Leaders nearly interpreted the lower total as an operational improvement.

Freshness measures how recently data was updated or whether it arrived by an expected time. Completeness measures whether the expected records, entities, fields, or volume are present. A dataset can be fresh but incomplete, or complete but late. One combined “data healthy” flag hides these different failure modes and responses.

BlueHarbor created separate checks. Freshness compared the latest event and load times with service deadlines. Completeness compared record counts by region with historical ranges and source control totals. Coverage checks confirmed every active region appeared. Critical fields had non-null thresholds. The dashboard displayed both status and the affected period instead of showing a misleading current total.

When the empty file arrived, the system held publication, notified the regional owner, and showed the previous validated result with a warning. After backfill, reconciliation confirmed counts before release. The incident review added an empty-file rule and clarified who could approve partial publication.

Quality dimensions should connect to user decisions. A late daily report may still be usable for monthly planning; an incomplete fraud feed may be unsafe at any time. Analysts need explicit thresholds, owners, and fallbacks for each dimension. “The pipeline ran” is not evidence that the dataset is ready. Readiness means the data is recent enough, complete enough, and valid enough for its stated use.

The same principle applies at field level. A table may contain every expected row while a newly required status field is mostly null. BlueHarbor therefore attached quality checks to the decision-critical columns, not only to the arrival of files and rows.

## Chinese Translation
BlueHarbor看板准时刷新，但区域空文件使理赔仅到82%。及时性衡量到达或更新时间，完整性衡量预期记录和覆盖是否存在。团队分别监控最新时间、区域总量、控制总数和关键字段；数据不全时暂停发布并显示上次已验证结果。
## Vocabulary
- **freshness** — 及时性；how recent data is.
- **completeness** — 完整性；how much expected data is present.
- **coverage** — 覆盖率；whether expected entities appear.
- **backfill** — 回补；load missing historical records.
## Grammar Analysis
- “whether the expected records...are present”是whether宾语从句。
- “recent enough...for its stated use”用enough表示满足用途的程度。
## Data Analyst Extension
为每个关键表分别设置freshness、volume、entity coverage和field completeness，不用单一绿灯替代多维状态。
## Reading Questions
1. How was data fresh but incomplete? 2. What did the fallback show? 3. Why should thresholds depend on use?
### Workplace Application
A report refreshes on time with only 76% of expected stores. Write a 40–80 word incident notice stating status, risk, and fallback.
### Answer Key
1. It loaded an empty regional file on schedule. 2. The previous validated result. 3. Decisions tolerate different risks. Do not call the dataset healthy.
