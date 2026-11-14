# YouTube Screenshot — Video Frame Capture / YouTube 截屏

Capture the current YouTube video frame in one click, without pausing playback. Chrome MV3 (the source is also compatible with Safari Web Extensions).

一键截取 YouTube 当前视频帧，不用暂停播放。Chrome MV3（源码同样兼容 Safari Web Extension）。

## Two language versions / 两个语言版本

| Folder | UI language | 界面语言 |
|---|---|---|
| `en/` | English | 英文 |
| `zh-CN/` | 简体中文 | Simplified Chinese |

Both versions have identical features; each folder is a complete, self-contained extension with its own detailed README. 两版功能完全相同，每个文件夹都是完整独立的插件，内有各自语言的详细说明。

## Download / 下载

Go to **Releases** and download the build you want:

- `YouTube-Screenshot-v1.0-EN.zip` — English
- `YouTube-Screenshot-v1.0-CN.zip` — 简体中文

## Install in Chrome / 在 Chrome 里安装

1. Unzip the release archive (or clone this repo).
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the extension folder — the unzipped release folder, or the `en` / `zh-CN` folder of this repo.
4. Open any YouTube video: a camera button appears at the bottom right of the player.

1. 解压 Release 压缩包（或 clone 本仓库）。
2. 打开 `chrome://extensions`，打开右上角的**开发者模式**。
3. 点**加载已解压的扩展程序**，选择插件文件夹 — 解压出来的文件夹，或本仓库的 `en` / `zh-CN` 文件夹。
4. 打开任意 YouTube 视频，播放器右下角会出现相机按钮。

## Safari (Mac)

Safari can't install the zip directly. On a Mac with Xcode (free in the App Store), wrap either language folder with Apple's official converter:

1. Run in Terminal: `xcrun safari-web-extension-converter /path/to/en` (or `zh-CN` for the Chinese version).
2. Open the generated Xcode project and click Run (▶) once — this registers the extension with Safari.
3. In Safari, go to Settings → Extensions, enable "YouTube Screenshot", and allow it to access youtube.com.

No paid Apple Developer account is needed for personal use on your own Mac. Full details are in each folder's own README.

Safari 不能直接装 zip。在装了 Xcode 的 Mac 上（App Store 免费下载），用苹果官方转换器把任意一个语言文件夹包一层 App 外壳：

1. 终端运行：`xcrun safari-web-extension-converter /路径/en`（中文版用 `zh-CN` 文件夹）。
2. 用 Xcode 打开生成的工程，点 Run（▶）运行一次，扩展就注册进 Safari 了。
3. 打开 Safari → 设置 → 扩展，勾选启用「YouTube Screenshot」，并允许它访问 youtube.com。

个人在自己 Mac 上自用不需要付费开发者账号。详细步骤见各语言文件夹内的 README。

## Features / 功能

- Three capture entries: player camera button, keyboard shortcut (`Ctrl+Shift+S` by default), toolbar popup — none of them pause playback.
- Clean-frame mode grabs the native resolution with no player controls or subtitles; "what you see" mode includes subtitles.
- After capture: preview, save directly, or copy to clipboard. PNG / JPG / WebP.
- Works on Shorts and while paused. If the tab was opened before the extension was installed, the script injects itself automatically — no page refresh needed.

- 三种截屏入口：播放器相机按钮、快捷键（默认 `Ctrl+Shift+S`）、工具栏弹窗 — 都不暂停播放。
- 干净帧模式按原生分辨率抓帧，无控制条、无字幕；「所见即所得」模式带字幕。
- 截后可选：先预览、直接保存、或复制到剪贴板。PNG / JPG / WebP。
- 支持 Shorts 和暂停状态；标签页在装插件之前就打开了也能直接截，脚本会自动注入，不用刷新页面。

## Limits / 限制

DRM-protected video (Netflix, Disney+, paid YouTube movies) is blacked out by the browser itself — no extension can capture it. Regular YouTube videos are unaffected. Subtitles are a page overlay, not part of the video picture; use "what you see" mode if you want them in the image.

DRM 保护的视频（Netflix、Disney+、YouTube 付费电影）会被浏览器本身黑屏，任何插件都截不了；普通 YouTube 视频不受影响。字幕是网页浮层、不属于视频画面本身，想带字幕请用「所见即所得」模式。

## License

MIT — see [LICENSE](LICENSE).
