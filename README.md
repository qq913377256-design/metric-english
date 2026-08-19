# Metric English

面向中文母语数据分析师的英语阅读与职场写作训练网站。项目是纯静态HTML、CSS、JavaScript，可直接部署到GitHub Pages，不需要后端、数据库或构建工具

## 已有内容

- 一套《新概念英语》第三册一年学习框架，不包含教材课文和音频
- 10篇原创数据分析英文阅读，从A2逐步过渡到B2
- 每篇文章包含英文原文、中文翻译、重点词汇、语法解析、分析师延伸和阅读问题
- 30天学习闭环：每篇文章依次进行新学、复习、应用，形成每天35分钟的明确任务
- 连续学习天数只在当天4项任务全部完成后增加，首页显示30天完成率
- 文章搜索、难度筛选、双语对照、字号调整和词汇掌握记录
- 自动恢复上次阅读的文章、栏目、字号和页面位置
- V1.2新增30天数据分析师英文写作训练，覆盖需求澄清、指标定义、趋势解释、异常汇报、数据质量、周报、实验、预测、建议和管理层摘要
- 写作训练按完成顺序推进，每个情境依次进行示范、引导和独立写作，不会因跨自然日跳题
- 草稿自动保存，首次提交保留不可覆盖的快照；完成五项自评后显示参考版本，并允许继续修改
- 第1天和第30天提供等价写作任务，对比有效用时、目标字数和五项自评分
- 写作记录按情境保留首次提交、修改版、字数、用时和评分
- 学习进度支持JSON导出与导入，所有数据仍只保存在浏览器，不会上传

## V1.2写作内容

写作材料位于content/writing目录。每个情境使用一份Markdown，并包含以下二级标题：

~~~markdown
## Workplace Context
## Data Brief
## Model Email
## Structure Breakdown
## Language Toolkit
## Model Task
## Model Reference
## Guided Task
## Guided Reference
## Independent Task
## Independent Reference
## Oral Retell
~~~

第1个情境额外包含Baseline Task、Baseline Reference，第10个情境额外包含Final Task、Final Reference。清单字段和目标字数维护在content/writing/manifest.json

## 本地预览

浏览器出于安全限制，直接双击`index.html`时无法使用`fetch`读取Markdown。请在项目目录启动任意静态文件服务，例如：

```powershell
python -m http.server 8000
```

然后访问`http://localhost:8000`

## 部署到GitHub Pages

1. 在GitHub创建私人仓库，把本项目推送到`main`分支
2. 打开仓库`Settings → Pages`
3. 在`Build and deployment`中把`Source`设为`GitHub Actions`
4. 推送后等待`Deploy static site to GitHub Pages`工作流完成
5. Pages地址会显示在工作流部署记录和仓库Pages设置页

项目已包含`.github/workflows/deploy-pages.yml`，所有资源都使用相对路径，可部署在`https://用户名.github.io/仓库名/`这类项目子路径下

私人仓库能否启用Pages取决于GitHub账户和组织策略。Pages站点的访问范围也应在仓库设置中确认，私人仓库不等于站点一定只对本人可见

## 添加Markdown文章

在`content/articles/`新增Markdown文件，并在`content/manifest.json`增加一条记录。文章必须使用下面六个二级标题，名称需要保持一致：

```markdown
## English Original
## Chinese Translation
## Vocabulary
## Grammar Analysis
## Data Analyst Extension
## Reading Questions
```

阅读问题部分可添加`### Answer Key`。网站会把答案折叠，读者点击后查看

## 浏览器数据

学习进度保存在当前浏览器的`metricEnglish.v1`键中，当前数据格式为schema 3。V1.1旧数据会自动迁移，并保留阅读完成、词汇和阅读位置。清除浏览器站点数据、换电脑或使用不同浏览器后，进度不会自动同步

换电脑前，在首页“学习信号”中点击“导出进度”。在另一台电脑打开网站后点击“导入进度”，选择导出的JSON文件并确认覆盖。导入不会上传文件，也不会自动合并两台电脑的记录

## 验证

项目包含`tests/browser-smoke.js`，覆盖schema 2到3迁移、写作顺序推进、草稿恢复、首次提交快照、自评解锁、用户文本防注入、Markdown加载与重试、V1.1阅读回归、移动端抽屉和多视口溢出检查。这个测试只用于开发验证，不影响网站运行
