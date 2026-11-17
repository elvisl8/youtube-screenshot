// YouTube Screenshot - bundled UI strings + language resolution.
// GENERATED from _locales/en/messages.json and _locales/zh_CN/messages.json --
// edit those files, not this one.
//
// Why this exists: chrome.i18n.getMessage() always follows the browser UI
// language; Chrome offers no per-extension override. The Settings page lets
// the user pick Follow browser / Simplified Chinese / English, so the strings
// ship here and every t() resolves through ytsT() with the stored preference.
// _locales is still required: the extension name/description that Chrome
// itself displays (extensions page, toolbar tooltip) come from there.
var YTS_STRINGS = {
 "en": {
  "extName": {
   "message": "YouTube Screenshot - Video Frame Capture"
  },
  "extDescription": {
   "message": "One-click YouTube frame capture at native resolution, without pausing. Save as PNG/JPG/WebP or copy to clipboard."
  },
  "actionTitle": {
   "message": "Capture the current YouTube video frame"
  },
  "btnClose": {
   "message": "✕ Close"
  },
  "btnSave": {
   "message": "💾 Save file"
  },
  "btnCopy": {
   "message": "📋 Copy to clipboard"
  },
  "previewAlt": {
   "message": "screenshot preview"
  },
  "toastSaved": {
   "message": "Saved: $ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "toastCopied": {
   "message": "Copied to clipboard. Paste it into a chat or document."
  },
  "toastCopyDenied": {
   "message": "Copy failed (the browser denied clipboard access). Use \"Save file\" instead."
  },
  "toastNoVideo": {
   "message": "No video found (use this on a YouTube watch page)."
  },
  "toastNotReady": {
   "message": "The video hasn't loaded a picture yet. Play it for a moment, then try again."
  },
  "metaNative": {
   "message": "native frame"
  },
  "metaSubs": {
   "message": "with subtitles"
  },
  "toastScreenshotSaved": {
   "message": "Screenshot saved: $ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "toastScreenshotCopied": {
   "message": "Screenshot copied to clipboard ($ARG1$×$ARG2$)",
   "placeholders": {
    "arg1": {
     "content": "$1"
    },
    "arg2": {
     "content": "$2"
    }
   }
  },
  "toastAutoCopyFailed": {
   "message": "Auto-copy failed. Preview opened; click \"Save file\"."
  },
  "toastCaptureFailed": {
   "message": "Capture failed: $ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "btnTitle": {
   "message": "Capture current frame (YouTube Screenshot)"
  },
  "btnAria": {
   "message": "Capture current frame"
  },
  "loading": {
   "message": "Loading…"
  },
  "notSet": {
   "message": "Not set"
  },
  "actPreview": {
   "message": "Preview first"
  },
  "actDownload": {
   "message": "Save directly"
  },
  "actCopy": {
   "message": "Copy to clipboard"
  },
  "popupTitle": {
   "message": "YouTube Screenshot"
  },
  "popupSub": {
   "message": "On a YouTube watch page, click the button below, press the shortcut, or click the camera button at the bottom right of the player to capture the current frame."
  },
  "popupCapture": {
   "message": "Capture current frame"
  },
  "popupShortcut": {
   "message": "Shortcut"
  },
  "popupFormat": {
   "message": "Image format"
  },
  "popupAfter": {
   "message": "After capture"
  },
  "popupChangeShortcut": {
   "message": "Change shortcut"
  },
  "popupSettings": {
   "message": "Settings"
  },
  "popupNote": {
   "message": "Clean frames are the video's native resolution, without player controls or subtitles. To include subtitles, switch the capture mode to \"What you see\" in Settings."
  },
  "popupNotYouTubeOpen": {
   "message": "This is not a YouTube page. Open a video first."
  },
  "popupCapturing": {
   "message": "Capturing…"
  },
  "popupNotYouTube": {
   "message": "This is not a YouTube page."
  },
  "popupCaptureFailed": {
   "message": "Capture failed: $ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "popupUnknownError": {
   "message": "unknown error"
  },
  "popupRequestFailed": {
   "message": "Request failed: $ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "optPageTitle": {
   "message": "YouTube Screenshot Settings"
  },
  "optIntro": {
   "message": "All three ways to capture work the same: the camera button at the bottom right of the player, the keyboard shortcut, and the button in the toolbar popup. Capturing does not pause playback; the video keeps playing and the image is the frame at the moment you pressed."
  },
  "optH1": {
   "message": "1. Keyboard shortcut"
  },
  "optCurrentShortcut": {
   "message": "Current shortcut: "
  },
  "optShortcutNotSet": {
   "message": "Not set (set it on Chrome's shortcuts page)"
  },
  "optShortcutHelp": {
   "message": "Chrome doesn't let extensions change shortcuts directly. Change it on Chrome's own page: click the button below → find \"YouTube Screenshot\" → click the pencil icon → press the new key combination."
  },
  "optOpenShortcuts": {
   "message": "Open Chrome's shortcuts page"
  },
  "optH2": {
   "message": "2. Capture mode"
  },
  "optCleanTitle": {
   "message": "Clean frame (recommended)"
  },
  "optCleanDesc": {
   "message": " — the video's native resolution (1080p/4K stays at its original size), with no player controls, subtitles or mouse cursor. Highest quality."
  },
  "optCleanFallback": {
   "message": "If the browser blocks frame capture for a particular video, it automatically falls back to the \"What you see\" mode."
  },
  "optVisibleTitle": {
   "message": "What you see"
  },
  "optVisibleDesc": {
   "message": " — captures what is actually on screen, so subtitles are included, but resolution is limited by the window size; it works best in fullscreen."
  },
  "optH3": {
   "message": "3. After capturing"
  },
  "optPreviewDesc": {
   "message": " — shows a preview, then choose \"Save file\" or \"Copy to clipboard\". Not happy with it? Close it and capture again, with no wasted files."
  },
  "optDownloadDesc": {
   "message": " — downloads straight to your browser's download folder on each press; good for capturing many frames."
  },
  "optCopyDesc": {
   "message": " — copies on each press so you can paste straight into a chat, document or email (if copying fails it opens the preview instead, so the image isn't lost)."
  },
  "optH4": {
   "message": "4. Image format"
  },
  "optFmtPng": {
   "message": "PNG (lossless, larger files)"
  },
  "optFmtJpeg": {
   "message": "JPG (small, universal)"
  },
  "optFmtWebp": {
   "message": "WebP (smallest)"
  },
  "optQuality": {
   "message": "JPG / WebP quality: "
  },
  "optFileNamesLead": {
   "message": "File names are generated automatically: "
  },
  "optFilenamePattern": {
   "message": "video-title_mm-ss_date-time.ext"
  },
  "optFileNamesEg": {
   "message": ", e.g. "
  },
  "optFilenameExample": {
   "message": "Some Tutorial_12-34_20261114_145501.png"
  },
  "optFileNamesTail": {
   "message": ". Copying to the clipboard always uses PNG (a browser clipboard limitation), regardless of the format chosen here."
  },
  "optSave": {
   "message": "Save settings"
  },
  "optSaved": {
   "message": "✓ Saved"
  },
  "optNotesH": {
   "message": "Notes and limits"
  },
  "optDrmTitle": {
   "message": "DRM-protected video can't be captured: "
  },
  "optDrmDesc": {
   "message": "for DRM content such as Netflix, Disney+ and paid YouTube movies, the browser blacks out the picture. This is an industry-wide restriction that no extension can get around. Regular YouTube videos (including 4K) are not affected."
  },
  "optSubsTitle": {
   "message": "Subtitles: "
  },
  "optSubsDesc": {
   "message": "clean frames never contain subtitles (they are overlaid by the web page and are not part of the video picture). To include subtitles, use \"What you see\", turn subtitles on, and capture in fullscreen."
  },
  "optShorts": {
   "message": "Shorts pages work too (native vertical resolution)."
  },
  "optPaused": {
   "message": "You can capture while paused; you get the frame that is on screen."
  },
  "optSafari": {
   "message": "Safari: this extension is standard Web Extension source and can be converted with Xcode's safari-web-extension-converter; see the Safari section of the project README."
  },
  "optLangH": {
   "message": "Interface language"
  },
  "optLangAuto": {
   "message": "Follow browser language"
  },
  "optLangDesc": {
   "message": "Applies immediately to the settings page, the toolbar popup and in-page messages. The extension name shown on Chrome's extensions page still follows the browser language (a Chrome limitation)."
  }
 },
 "zh_CN": {
  "extName": {
   "message": "YouTube 截屏 - Video Screenshot"
  },
  "extDescription": {
   "message": "一键截取 YouTube 当前视频帧，原生分辨率、不暂停播放；可保存为 PNG/JPG/WebP 或复制到剪贴板。"
  },
  "actionTitle": {
   "message": "截取当前 YouTube 视频帧"
  },
  "btnClose": {
   "message": "✕ 关闭"
  },
  "btnSave": {
   "message": "💾 保存文件"
  },
  "btnCopy": {
   "message": "📋 复制到剪贴板"
  },
  "previewAlt": {
   "message": "截图预览"
  },
  "toastSaved": {
   "message": "已保存：$ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "toastCopied": {
   "message": "已复制到剪贴板，去聊天/文档里粘贴即可"
  },
  "toastCopyDenied": {
   "message": "复制失败（浏览器没给剪贴板权限），请用「保存文件」"
  },
  "toastNoVideo": {
   "message": "没找到视频（请在 YouTube 播放页使用）"
  },
  "toastNotReady": {
   "message": "视频还没加载出画面，先播放一下再截"
  },
  "metaNative": {
   "message": "原生帧"
  },
  "metaSubs": {
   "message": "含字幕画面"
  },
  "toastScreenshotSaved": {
   "message": "已保存截图：$ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "toastScreenshotCopied": {
   "message": "截图已复制到剪贴板（$ARG1$×$ARG2$）",
   "placeholders": {
    "arg1": {
     "content": "$1"
    },
    "arg2": {
     "content": "$2"
    }
   }
  },
  "toastAutoCopyFailed": {
   "message": "自动复制失败，已打开预览，请点「保存文件」"
  },
  "toastCaptureFailed": {
   "message": "截屏失败：$ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "btnTitle": {
   "message": "截取当前帧（YouTube 截屏）"
  },
  "btnAria": {
   "message": "截取当前帧"
  },
  "loading": {
   "message": "读取中…"
  },
  "notSet": {
   "message": "未绑定"
  },
  "actPreview": {
   "message": "先预览"
  },
  "actDownload": {
   "message": "直接保存"
  },
  "actCopy": {
   "message": "复制到剪贴板"
  },
  "popupTitle": {
   "message": "YouTube 截屏"
  },
  "popupSub": {
   "message": "在 YouTube 播放页点下面按钮、按快捷键，或点播放器右下角的相机按钮，都能截下当前帧。"
  },
  "popupCapture": {
   "message": "截取当前帧"
  },
  "popupShortcut": {
   "message": "全局快捷键"
  },
  "popupFormat": {
   "message": "截图格式"
  },
  "popupAfter": {
   "message": "截后动作"
  },
  "popupChangeShortcut": {
   "message": "修改快捷键"
  },
  "popupSettings": {
   "message": "设置"
  },
  "popupNote": {
   "message": "干净帧是视频原生分辨率、不带控制条和字幕；想要字幕一起截，在设置里把画面模式改成「所见即所得」。"
  },
  "popupNotYouTubeOpen": {
   "message": "当前不是 YouTube 页面，先打开一个视频再截。"
  },
  "popupCapturing": {
   "message": "正在截屏…"
  },
  "popupNotYouTube": {
   "message": "当前不是 YouTube 页面。"
  },
  "popupCaptureFailed": {
   "message": "截屏没成功：$ARG1$（视频页上也会有提示）",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "popupUnknownError": {
   "message": "未知错误"
  },
  "popupRequestFailed": {
   "message": "调用失败：$ARG1$",
   "placeholders": {
    "arg1": {
     "content": "$1"
    }
   }
  },
  "optPageTitle": {
   "message": "YouTube 截屏 设置"
  },
  "optIntro": {
   "message": "三种截屏入口效果相同：播放器右下角的相机按钮、全局快捷键、点插件图标弹窗里的按钮。截屏不暂停播放，视频继续放，画面定格在按键那一刻。"
  },
  "optH1": {
   "message": "1. 快捷键"
  },
  "optCurrentShortcut": {
   "message": "当前绑定："
  },
  "optShortcutNotSet": {
   "message": "未绑定（请去设置页绑定）"
  },
  "optShortcutHelp": {
   "message": "Chrome 不允许插件直接改快捷键，要在 Chrome 自己的页面改：点下面按钮 → 找到「YouTube 截屏」→ 点笔形图标 → 按下新组合键。"
  },
  "optOpenShortcuts": {
   "message": "打开 Chrome 快捷键设置页"
  },
  "optH2": {
   "message": "2. 画面模式"
  },
  "optCleanTitle": {
   "message": "干净帧（推荐）"
  },
  "optCleanDesc": {
   "message": " — 视频原生分辨率（如 1080p/4K 就是原尺寸），没有控制条、没有字幕、没有鼠标。清晰度最高。"
  },
  "optCleanFallback": {
   "message": "若个别视频抓帧被浏览器拦截，会自动回退到所见即所得模式。"
  },
  "optVisibleTitle": {
   "message": "所见即所得"
  },
  "optVisibleDesc": {
   "message": " — 按屏幕上实际看到的画面截，字幕会一起截进去，但分辨率受窗口大小限制，全屏时截效果最好。"
  },
  "optH3": {
   "message": "3. 截后动作"
  },
  "optPreviewDesc": {
   "message": " — 弹出预览图，再选「保存文件」或「复制到剪贴板」，不满意关掉重截，不浪费文件。"
  },
  "optDownloadDesc": {
   "message": " — 一按就下载到浏览器下载目录，适合连截多张。"
  },
  "optCopyDesc": {
   "message": " — 一按就复制，直接去微信/文档/邮件里粘贴（复制失败时会自动改弹预览，不丢图）。"
  },
  "optH4": {
   "message": "4. 图片格式"
  },
  "optFmtPng": {
   "message": "PNG（无损，体积大）"
  },
  "optFmtJpeg": {
   "message": "JPG（体积小，通用）"
  },
  "optFmtWebp": {
   "message": "WebP（体积最小）"
  },
  "optQuality": {
   "message": "JPG / WebP 质量："
  },
  "optFileNamesLead": {
   "message": "文件名自动生成："
  },
  "optFilenamePattern": {
   "message": "视频标题_时分秒_日期时间.扩展名"
  },
  "optFileNamesEg": {
   "message": "，例："
  },
  "optFilenameExample": {
   "message": "某某教程_12-34_20261114_145501.png"
  },
  "optFileNamesTail": {
   "message": "。复制到剪贴板时统一用 PNG（浏览器剪贴板限制），不受这里格式影响。"
  },
  "optSave": {
   "message": "保存设置"
  },
  "optSaved": {
   "message": "✓ 已保存"
  },
  "optNotesH": {
   "message": "说明与边界"
  },
  "optDrmTitle": {
   "message": "受 DRM 保护的视频截不了："
  },
  "optDrmDesc": {
   "message": "Netflix、Disney+、YouTube 付费电影等带 DRM 的内容，浏览器会把画面挡成黑屏，这是行业统一限制，任何插件都绕不过去。普通 YouTube 视频（包括 4K）不受影响。"
  },
  "optSubsTitle": {
   "message": "字幕："
  },
  "optSubsDesc": {
   "message": "干净帧里本来就不含字幕（字幕是网页叠上去的，不是视频画面的一部分）；要带字幕请用「所见即所得」并把字幕打开、全屏播放时截。"
  },
  "optShorts": {
   "message": "Shorts 页面同样能截（竖屏原生分辨率）。"
  },
  "optPaused": {
   "message": "暂停状态也能截，截的就是停住的那一帧。"
  },
  "optSafari": {
   "message": "Safari 版：本插件是标准 Web Extension 源码，可用 Xcode 的 safari-web-extension-converter 转换，步骤见项目 README 的 Safari 一节。"
  },
  "optLangH": {
   "message": "界面语言"
  },
  "optLangAuto": {
   "message": "跟随浏览器语言"
  },
  "optLangDesc": {
   "message": "立即生效，设置页、工具栏弹窗和页面内的文字都会切换。Chrome 扩展管理页里显示的扩展名称仍跟随浏览器语言（这是 Chrome 的限制）。"
  }
 }
};


// pref: "auto" | "en" | "zh_CN" (anything else behaves as "auto").
// Only en and zh_CN ship with the extension; any other browser language
// falls back to English, exactly like Chrome's own locale fallback.
function ytsResolveLang(pref) {
  if (pref === "en" || pref === "zh_CN") return pref;
  try {
    const ui = String(chrome.i18n.getUILanguage() || "en").toLowerCase();
    if (ui.indexOf("zh") === 0) return "zh_CN";
  } catch (e) {}
  return "en";
}

// Look up key in lang (falling back to English), substituting $ARGn$
// placeholders the same way chrome.i18n does. Returns "" for unknown keys.
function ytsT(lang, key, subs) {
  const table = YTS_STRINGS[lang] || YTS_STRINGS.en;
  const entry = (table && table[key]) || YTS_STRINGS.en[key];
  if (!entry || typeof entry.message !== "string") return "";
  const ph = entry.placeholders || {};
  return entry.message.replace(/\$([A-Za-z0-9_]+)\$/g, (m, name) => {
    const p = ph[name] || ph[name.toLowerCase()];
    if (!p) return m;
    const mm = /^\$(\d+)$/.exec(p.content || "");
    if (!mm) return m;
    const v = subs[Number(mm[1]) - 1];
    return v != null ? String(v) : m;
  });
}
