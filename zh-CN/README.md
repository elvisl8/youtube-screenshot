# YouTube 截屏 - Video Screenshot

播放 YouTube 时随时截取当前视频帧的浏览器扩展（Chrome MV3，源码同时兼容 Safari Web Extension）。

## 功能

- **三种入口，一键截屏**（都不暂停播放）：
  1. 播放器右下角新增的相机按钮（在设置齿轮左边）
  2. 全局快捷键，默认 `Ctrl+Shift+S`（Mac：`Control+Shift+S`），可在 `chrome://extensions/shortcuts` 里改
  3. 点工具栏插件图标，弹窗里点「截取当前帧」
- **两种画面模式**：
  - 干净帧（默认）：canvas 直抓视频帧，**原生分辨率**（视频是 4K 就截 4K），无控制条、无字幕、无鼠标；个别视频抓帧被拦截时自动回退到所见即所得。
  - 所见即所得：拍当前视口再按视频位置裁剪，**字幕一起截进去**，分辨率受窗口大小限制（全屏截最佳）。
- **三种截后动作**（设置页切换）：先预览（再选保存/复制）、直接保存下载、复制到剪贴板（失败自动改弹预览，不丢图）。
- **格式**：PNG / JPG / WebP 可选，JPG/WebP 质量可调；复制到剪贴板统一 PNG。
- **文件名自动生成**：`视频标题_视频时间点_日期时间.扩展名`，如 `某某教程_12-34_20261114_145501.png`。
- Shorts、暂停状态同样能截。

## Chrome 安装（开发者模式加载）

1. 解压 zip，得到 `youtube-screenshot-extension` 文件夹。
2. Chrome 打开 `chrome://extensions`，打开右上角「开发者模式」。
3. 点「加载已解压的扩展程序」，选择该文件夹。
4. 打开任意 YouTube 视频，播放器右下角就会多一个相机按钮；建议把插件固定到工具栏。

## Safari 安装（需要一台 Mac + Xcode）

本扩展是标准 Web Extension，Safari 不能直接装 zip，要用苹果官方转换器包一层 App 外壳：

1. Mac 上从 App Store 安装 Xcode（免费）。
2. 把 `youtube-screenshot-extension` 文件夹拷到 Mac，终端运行：
   `xcrun safari-web-extension-converter /路径/youtube-screenshot-extension`
   （按提示生成一个 Xcode 工程，语言选 Swift，名称随意。）
3. 用 Xcode 打开生成的工程，点 Run（▶）运行一次，它会把扩展注册进 Safari。
4. 打开 Safari → 设置 → 扩展 → 勾选启用「YouTube 截屏」，并允许它访问 youtube.com。
5. 之后用法与 Chrome 版相同（播放器相机按钮、弹窗按钮）。注意：Safari 里快捷键以 Safari 扩展设置为准，转换后如快捷键不生效，用播放器按钮即可。

转换全程不需要付费开发者账号（自己 Mac 上自用）；只有要分发给别人时才需要 Apple Developer 账号签名。

## 边界（重要）

- **DRM 内容截不了**：Netflix、Disney+、YouTube 付费电影等 DRM 视频会被浏览器挡成黑屏，所有插件都一样，绕不过去。普通 YouTube 视频不受影响。
- **字幕**不在视频画面本身里（是网页叠加层），所以干净帧不带字幕是正常现象；要字幕用「所见即所得」模式。
- 干净帧清晰度取决于视频当前实际加载的分辨率：播放器画质选 1080p，截出来才是 1080p；自动画质掉到 480p 时截的也是 480p。截重要画面前先把画质调到目标档位并等它缓冲到位。

## 文件结构

- `manifest.json` — MV3 配置，声明 commands 快捷键与 content script
- `content.js` / `content.css` — 注入 YouTube：播放器按钮、抓帧、预览浮层、提示
- `background.js` — 快捷键转发、captureVisibleTab 兜底截图
- `popup.html/js` — 工具栏弹窗：截屏按钮、当前设置、入口
- `options.html/js` — 设置页：画面模式、截后动作、格式与质量

版本：1.0

## 更新日志

- 1.0：公开发布版。修复在「装插件之前就已打开的 YouTube 标签页」上点击截屏报「页面脚本还没就绪」的问题——截屏时自动检测并按需注入页面脚本，安装/更新时也会预注入已打开的 YouTube 页，不需要手动刷新页面。
