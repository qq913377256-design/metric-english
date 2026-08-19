## English Original

### Collect Less Data to Reduce Privacy Risk

Fictional retailer FernSquare planned a churn model. The project request included names, full addresses, birth dates, browsing histories, and support messages “in case they help.” Most fields had no defined role in the model. Collecting them increased exposure without proving additional value.

The team applied data minimization: collect, use, and retain only data necessary for a stated purpose. They translated the business objective into candidate features, justification, access group, and retention period. Customer names and street addresses were removed. Age became a broad band only after fairness review. Support text was replaced by approved issue categories. User IDs were pseudonymized in the analysis layer.

Minimization also affects time and access. Training snapshots were retained for a defined evaluation cycle, then deleted under policy. Only the model team could access row-level features; business users received aggregated monitoring. Logs recorded access, while extracts had expiration dates. A new use required review rather than silently reusing the dataset.

The reduced model performed almost as well as the broad version and was easier to explain. Analysts documented residual privacy and fairness risks, aggregation thresholds, and prohibited outputs. They tested whether small segments could reveal individuals even without direct identifiers.

Privacy is not achieved merely by removing names. Combinations of location, time, and behavior may still identify a person. The practical question is whether each field is necessary, proportionate, protected, and temporary. FernSquare lowered breach impact and simplified governance while preserving the decision value of the model. More data can create more options, but it also creates obligations and harm. Responsible analysis treats restraint as a design capability.

Before production, the team asked whether the same decision could be made with aggregated, delayed, or less precise data. That question removed several behavioral fields. It also created a useful default: when two designs perform similarly, choose the one that exposes fewer people to harm.

## Chinese Translation
FernSquare为流失模型索取大量“可能有用”的个人数据。团队按目的逐字段说明必要性、访问者和保留期，删除姓名地址，将年龄分段、文本分类、ID假名化，并限制行级访问和快照期限。去掉直接标识符仍不足，位置、时间和行为组合也可能识别个人。
## Vocabulary
- **data minimization** — 数据最小化；using only necessary data.
- **pseudonymized** — 假名化；replacing direct identity with a controlled key.
- **retention period** — 保留期；how long data is kept.
- **proportionate** — 适度的；not excessive for the purpose.
## Grammar Analysis
- “only data **necessary for a stated purpose**”用形容词短语后置限定。
- “even without direct identifiers”表示缺少直接标识仍存在风险。
## Data Analyst Extension
特征清单增加purpose、necessity、sensitivity、access、retention和deletion字段；新用途必须重新评审。
## Reading Questions
1. Which fields were removed? 2. How was access limited? 3. Why is removing names insufficient?
### Workplace Application
A team requests exact birth dates and addresses for a sales forecast. Write a 40–80 word minimization response proposing safer alternatives.
### Answer Key
Remove unjustified identifiers, use coarse categories or aggregates, limit access and retention, and request a defined purpose.
