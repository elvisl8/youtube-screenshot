// YouTube 截屏 - background service worker (MV3)
// 职责：
//  1) 转发 chrome.commands 快捷键到当前标签页的 content script
//  2) 按需注入：目标标签页若还没注入 content script（例如装插件之前就打开的页面），
//     先 ping 检测，没响应就用 chrome.scripting 主动注入 content.js/css，再重试，
//     这样用户不需要手动刷新页面。
//  3) 兜底截图：canvas 直接抓帧被拦截时，用 captureVisibleTab 拍可见区域，
//     交回 content script 按视频位置裁剪
//  4) 安装/更新时，把已经打开的 YouTube 标签页预先注入一遍

async function pingContent(tabId) {
  try {
    const r = await chrome.tabs.sendMessage(tabId, { type: "yts-ping" });
    return !!(r && r.ok);
  } catch (e) {
    return false;
  }
}

async function injectContent(tabId) {
  await chrome.scripting.insertCSS({
    target: { tabId },
    files: ["content.css"]
  });
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"]
  });
}

async function ensureContent(tabId) {
  if (await pingContent(tabId)) return true;
  try {
    await injectContent(tabId);
  } catch (e) {
    return false;
  }
  // 给 content script 一点初始化时间再复查
  await new Promise((r) => setTimeout(r, 250));
  return pingContent(tabId);
}

async function forwardCapture(tabId) {
  const ready = await ensureContent(tabId);
  if (!ready) {
    return {
      ok: false,
      error: "content-not-ready",
      detail: "injection-failed"
    };
  }
  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: "yts-capture" });
    return res || { ok: false, error: "no-response" };
  } catch (e) {
    return {
      ok: false,
      error: "content-not-ready",
      detail: String(e && e.message ? e.message : e)
    };
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "capture-frame") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id != null) await forwardCapture(tab.id);
});

// 安装/更新扩展时，预注入已打开的 YouTube 标签页，装完立刻能用
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({ url: "*://*.youtube.com/*" });
    for (const tab of tabs) {
      if (tab.id != null) {
        // 已注入的页面 ping 会成功，跳过重复注入
        if (!(await pingContent(tab.id))) {
          try {
            await injectContent(tab.id);
          } catch (e) {}
        }
      }
    }
  } catch (e) {}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message.type !== "string") return;

  // popup 请求截屏当前标签页
  if (message.type === "yts-capture-active") {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (!tab || tab.id == null) {
        sendResponse({ ok: false, error: "no-active-tab" });
        return;
      }
      if (!/youtube\.com/.test(tab.url || "")) {
        sendResponse({ ok: false, error: "not-youtube" });
        return;
      }
      sendResponse(await forwardCapture(tab.id));
    })();
    return true;
  }

  // content script 请求兜底截图（拍可见区域 PNG，整页视口）
  if (message.type === "yts-capture-visible") {
    (async () => {
      try {
        const windowId = sender.tab ? sender.tab.windowId : chrome.windows.WINDOW_ID_CURRENT;
        const dataUrl = await chrome.tabs.captureVisibleTab(windowId, {
          format: "png"
        });
        sendResponse({ ok: true, dataUrl });
      } catch (e) {
        sendResponse({
          ok: false,
          error: "capture-visible-failed",
          detail: String(e && e.message ? e.message : e)
        });
      }
    })();
    return true;
  }

  // 查询当前全局快捷键（popup / options 展示用）
  if (message.type === "yts-get-shortcut") {
    chrome.commands.getAll().then((cmds) => {
      const c = cmds.find((x) => x.name === "capture-frame");
      sendResponse({ ok: true, shortcut: c && c.shortcut ? c.shortcut : "" });
    });
    return true;
  }
});
