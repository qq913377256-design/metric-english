# What an A/B Test Can Tell Us

## English Original

A travel website wants more visitors to complete a hotel booking. The design team creates a shorter payment page and expects it to reduce confusion. Instead of releasing the page to everyone, the company runs an A/B test.

Half of eligible visitors see the current page, called the control. The other half see the new page, called the treatment. Visitors are assigned at random so that the two groups should be similar before the experience changes. The primary metric is booking conversion, and the team also watches payment errors as a guardrail.

After two days, conversion in the treatment group is 8% higher. A manager wants to declare a winner, but the analyst recommends waiting. The sample is still small, weekend behaviour may differ, and repeated checks increase the chance of seeing a difference that is only random noise.

After two full weeks, the estimated lift is 3.1%, with a confidence interval from 0.8% to 5.4%. Payment errors did not increase. The result supports releasing the new page, although it does not guarantee that every future visitor will respond in the same way.

An A/B test estimates the effect of a specific change under specific conditions. A reliable conclusion depends on correct random assignment, a pre-defined metric, enough observations, and attention to practical as well as statistical significance.

## Chinese Translation

一家旅游网站希望更多访客完成酒店预订。设计团队制作了一个更短的付款页面，希望减少困惑。公司没有直接向所有人发布新页面，而是进行了一次A/B测试

一半符合条件的访客看到当前页面，这一组称为对照组；另一半看到新页面，称为实验组。访客被随机分配，这样两组在体验发生变化前应该相似。主要指标是预订转化率，团队还观察付款错误率，把它作为护栏指标

两天后，实验组转化率高出8%。一位经理想宣布实验胜出，但分析师建议继续等待。此时样本仍然较小，周末行为可能不同，而且反复查看结果会提高把随机噪声误认为真实差异的概率

完整运行两周后，预估提升为3.1%，置信区间为0.8%至5.4%。付款错误率没有上升。结果支持发布新页面，但不能保证未来每位访客都会以同样方式反应

A/B测试估计特定变化在特定条件下产生的影响。可靠结论依赖正确的随机分配、预先定义的指标、足够的观察量，以及同时关注实际显著性和统计显著性

## Vocabulary

- **eligible** /ˈelɪdʒəbəl/：符合实验条件的
- **control** /kənˈtroʊl/：对照组，保持原有体验的组
- **treatment** /ˈtriːtmənt/：实验组，接受新变化的组
- **assign at random**：随机分配
- **guardrail** /ˈɡɑːrdreɪl/：用于防止核心指标改善却损害其他方面的护栏指标
- **random noise**：随机噪声
- **confidence interval**：置信区间
- **statistical significance**：统计显著性

## Grammar Analysis

### 1. so that表示目的

`Visitors are assigned at random so that the two groups should be similar.`

`so that`引出随机分配的目的。`are assigned`是被动语态，重点放在访客如何被处理

### 2. although表示让步

`The result supports releasing the new page, although it does not guarantee the same response from every visitor.`

主句给出行动倾向，`although`补充不能过度推断的限制

### 3. 动名词作宾语

`The analyst recommends waiting.`

`recommend`后常接动名词：`recommend checking`、`recommend extending the test`。也可以使用`recommend that the team wait`

## Data Analyst Extension

实验报告至少说明：

- 假设和主要指标是否提前确定
- 随机化单位是用户、会话还是其他对象
- 实验时间、样本量和排除规则
- 绝对变化、相对变化和不确定区间
- 护栏指标是否出现负面变化

结果句型：`The treatment increased conversion by an estimated 3.1%, with a 95% confidence interval of 0.8% to 5.4%.`

统计显著不等于业务价值足够大。发布决策还要考虑开发成本、长期效果和适用人群

## Reading Questions

1. Why are visitors assigned at random?
2. Why does the analyst refuse to declare a winner after two days?
3. What does the final confidence interval suggest?
4. Which information should be defined before an experiment starts?

### Answer Key

1. Random assignment makes the groups comparable before the page changes
2. The sample is small, weekend behaviour may differ, and repeated checking can produce false positives
3. The likely effect is positive, although its exact size is uncertain
4. The hypothesis, primary metric, guardrails, eligibility rules, and stopping plan
