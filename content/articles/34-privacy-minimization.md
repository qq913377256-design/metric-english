## English Original

### Collect Less Data to Reduce Privacy Risk

Fictional retailer FernSquare planned a churn model. The project request included names, full addresses, birth dates, browsing histories, and support messages “in case they help.” Most fields had no defined role in the model. Collecting them increased exposure without proving additional value.

The team applied data minimization: collect, use, and retain only data necessary for a stated purpose. They translated the business objective into candidate features, justification, access group, and retention period. Customer names and street addresses were removed. Age became a broad band only after fairness review. Support text was replaced by approved issue categories. User IDs were pseudonymized in the analysis layer.

Minimization also affects time and access. Training snapshots were retained for a defined evaluation cycle, then deleted under policy. Only the model team could access row-level features; business users received aggregated monitoring. Logs recorded access, while extracts had expiration dates. A new use required review rather than silently reusing the dataset.

The reduced model performed almost as well as the broad version and was easier to explain. Analysts documented residual privacy and fairness risks, aggregation thresholds, and prohibited outputs. They tested whether small segments could reveal individuals even without direct identifiers.

Privacy is not achieved merely by removing names. Combinations of location, time, and behavior may still identify a person. The practical question is whether each field is necessary, proportionate, protected, and temporary. FernSquare lowered breach impact and simplified governance while preserving the decision value of the model. More data can create more options, but it also creates obligations and harm. Responsible analysis treats restraint as a design capability.

Before production, the team asked whether the same decision could be made with aggregated, delayed, or less precise data. That question removed several behavioral fields. It also created a useful default: when two designs perform similarly, choose the one that exposes fewer people to harm.

## Chinese Translation
虚构零售商FernSquare计划训练一个客户流失模型。项目申请包含姓名、完整地址、出生日期、浏览历史和客服消息，理由是“以后可能有用”。其中大部分字段在模型中没有明确用途。收集这些数据增加了暴露风险，却没有证明能带来额外价值。

团队采用数据最小化原则：只收集、使用和保留完成明确目的所必需的数据。他们把业务目标拆成候选特征，并为每个特征记录使用理由、可访问人员和保留期限。客户姓名和街道地址被移除；年龄只有在公平性评审后才转换为较宽的年龄段；客服文本被替换为批准的问题类别；用户ID则在分析层进行假名化。

数据最小化也涉及时间和访问范围。训练快照只保留一个规定的评估周期，之后按照制度删除。只有模型团队能访问行级特征，业务人员只能查看汇总监控。访问操作会被记录，导出文件设置失效日期。任何新的数据用途都要重新评审，而不能默认重复使用原数据集。

精简后的模型效果几乎与包含大量字段的版本相同，而且更容易解释。分析师记录剩余的隐私与公平风险、汇总阈值和禁止输出。他们还检查较小分群是否会在没有姓名等直接标识符的情况下暴露个人身份。

删除姓名并不等于已经保护隐私。位置、时间和行为的组合仍可能识别一个人。实际需要判断的是：每个字段是否必要、是否适度、是否受到保护、是否只被临时保留。FernSquare在保留模型决策价值的同时，降低了泄露影响并简化治理。更多数据意味着更多选择，也意味着更多义务和潜在伤害。负责任的分析把克制当作一种设计能力。

上线前，团队还会询问：能否使用更粗粒度、更晚到达或更不精确的数据做出同样的决策？这个问题又删除了几个行为字段，并形成默认原则：如果两个设计效果接近，就选择让更少人暴露于风险的方案。
## Vocabulary
- **data minimization** — 数据最小化；using only necessary data.
- **pseudonymized** — 假名化；replacing direct identity with a controlled key.
- **retention period** — 保留期；how long data is kept.
- **proportionate** — 适度的；not excessive for the purpose.
- **direct identifier** — 直接标识符；a field such as a name that directly identifies a person.
- **row-level data** — 行级数据；records describing individual entities or events.
- **aggregation threshold** — 汇总阈值；a minimum group size before results may be shown.
- **fairness review** — 公平性评审；checking whether a design creates unequal harm.
## Grammar Analysis
- “only data **necessary for a stated purpose**”用形容词短语后置限定。
- “even without direct identifiers”表示缺少直接标识仍存在风险。
## Data Analyst Extension
特征清单增加purpose、necessity、sensitivity、access、retention和deletion字段；新用途必须重新评审。
## Reading Questions
1. Which fields were removed?
2. How was access limited?
3. Why is removing names insufficient?
### Workplace Application
A team requests exact birth dates and addresses for a sales forecast. Write a 40–80 word minimization response proposing safer alternatives.
### Answer Key
1. Names and street addresses were removed; other sensitive fields were reduced or categorized.
2. Row-level access was limited to the model team, while business users received aggregates.
3. Location, time, and behavior combinations may still identify a person.

### Application Model Response

Exact birth dates and addresses are not necessary for an initial sales forecast. Please define the decision these fields would support. I recommend using age bands and aggregated regions, with no direct identifiers. Access should be limited to the analysis team, extracts should expire after evaluation, and any new use should require a separate privacy review.
