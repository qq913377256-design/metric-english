# GitHub Pages 发布记录

## 目标

- 将本地 `metric-english` 纯前端项目发布到 `qq913377256-design/metric-english`
- 使用 `main` 分支触发 GitHub Actions，并通过 GitHub Pages 提供浏览器访问

## 关键决策

- 仓库为空且 Pages 工作流直接监听 `main`，首个版本直接提交到 `main`
- Pages 构建来源设为 GitHub Actions
- 部署 Action 升级到 2026-08-05 时的官方版本：`actions/checkout@v7`、`actions/configure-pages@v6`、`actions/upload-pages-artifact@v5`、`actions/deploy-pages@v5`
- 仓库保持用户当前设置的公开状态；隐私设置由用户在开发完成后手动调整

## 发布结果

- 初始功能提交：`30d2274`（Build English reading trainer）
- 工作流升级提交：`f4a20c3`（Update Pages deployment actions）
- 仓库：https://github.com/qq913377256-design/metric-english
- 站点：https://qq913377256-design.github.io/metric-english/
- 无过期 Node.js Action 警告的成功部署：https://github.com/qq913377256-design/metric-english/actions/runs/31022355696

## 验证

- JavaScript 语法检查通过：`app.js`、`tests/browser-smoke.js`
- 本地 Edge 冒烟测试通过
- Markdown 清单解析通过，共 11 条内容
- 10 篇数据分析文章均包含 6 个必需章节，共检查 60 个章节
- GitHub Pages 首页、内容清单、首篇 Markdown 均返回 HTTP 200
- 线上清单数量为 11，首篇文章 6 个章节完整

## 故障与处理

- Git 默认使用 Windows Schannel 时，推送出现 TLS 握手失败；单次改用 Git 内置 OpenSSL 和 HTTP/1.1 后推送成功，未修改系统全局 Git 配置
- 首次推送早于 Pages 启用，首次部署失败；启用 `build_type=workflow` 后重新触发并成功部署

## 已知限制

- 学习进度保存在当前浏览器的 `localStorage`，更换电脑或清除浏览器数据后不会自动同步
- 仓库改为私有后，GitHub Pages 是否继续公开可用取决于账号方案和仓库 Pages 设置，需要用户在改为私有后复查站点访问状态
