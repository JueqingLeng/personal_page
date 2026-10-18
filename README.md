# 冷玦清个人主页
## 功能
1. 下拉即可浏览内容  
2. 龙形块：直接跳转GitHub与个人邮箱，浏览简介  
3. 设置：目前可以自定义按钮颜色与主题颜色，背景可自由上传  
4. 奶蛙助手点击会播放音频，同时点击两个有彩蛋
## 在 VS Code 中修改样式和结构

压缩包的 `source` 目录提供可编辑源码（生成后的当前工作区也有相同目录）：

- `sections.html`：卷首与经历区骨架。
- `afterword.html`：下一程与来源说明。
- `editor.html`：填写面板。
- `experience.css`：纸感、排版、时间线、手机布局。
- `experience.js`：长文渲染、填写、筛选、备份。
- `base-v1.html`：作为构建基底的旧版快照，保留全部原有交互和内嵌资源。
- `build.cjs`：仅使用 Node.js 内置模块，无需 npm install。
- `upstream-vcard`：本次阅读与改编的开源原文件快照和 MIT 许可。

在此目录打开终端运行：

```text
node source/build.cjs
```

会重新生成本目录的 `index.html`。构建会恢复模板默认内容；已经填写的经历请先导出 JSON，再在重建的网页里导入。要把默认内容写入源代码，可修改 `build.cjs` 的 defaults / experiences。

## 开源项目与许可

经历时间线的结构与节点连线改编自 [codewithsadee/vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio)，MIT 许可。完整许可在 `licenses/vcard-MIT.txt`，也嵌入在 HTML 中，单文件发布时仍保留。

没有引入第三方运行框架或其虚构简历内容。原版奶蛙动作素材的来源、许可与第三方图片署名保留；它们不因时间线的 MIT 许可而被重新授权。
