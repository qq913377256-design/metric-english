# Metric English

面向中文母语数据分析师的个人英语阅读训练网站。项目是纯静态HTML、CSS、JavaScript，可直接部署到GitHub Pages，不需要后端、数据库或构建工具

## 已有内容

- 一套《新概念英语》第三册一年学习框架，不包含教材课文和音频
- 10篇原创数据分析英文阅读，从A2逐步过渡到B2
- 每篇文章包含英文原文、中文翻译、重点词汇、语法解析、分析师延伸和阅读问题
- 每日35分钟计划、一年进度、连续学习天数和文章完成状态
- 文章搜索、难度筛选、双语对照、字号调整和词汇掌握记录
- 所有学习数据保存在浏览器`localStorage`，不会上传

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

学习进度保存在当前浏览器的`metricEnglish.v1`键中。清除浏览器站点数据、换电脑或使用不同浏览器后，进度不会自动同步

## 验证

项目包含`tests/browser-smoke.js`，覆盖Markdown加载、双语阅读、词汇记录、完成状态、本地持久化和移动端菜单。这个测试只用于开发验证，不影响网站运行
