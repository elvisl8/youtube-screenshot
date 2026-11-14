// YouTube Screenshot - background service worker (MV3)
// Responsibilities:
//  1) Forward chrome.commands shortcuts to the content script of the current tab
//  2) Fallback capture: when drawing the frame to a canvas is blocked by the
//     browser's security policy, take a captureVisibleTab screenshot and hand it
//     back to the content script, which crops it to the video's position
//  3) Forward the popup's "capture now" button
//
// 1.0.1 fixes:
//  - If the content script is missing (YouTube tabs opened before the extension
//    was installed/updated), inject it automatically instead of the shortcut
//    silently doing nothing
//  - Detect YouTube pages by hostname instead of the regex /youtube\.com/
//  - Run captureVisibleTab only when the requesting tab is the active tab, so it
//    can't capture a different page
//  - When a shortcut/popup capture fails and the page can't show a message,
//    flash a "!" badge on the toolbar icon

function isYouTubeUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host === "youtube.com" || host.endsWith(".youtube.com");
  } catch (e) {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errText(e) {
  return String(e && e.message ? e.message : e);
}

function flashBadge() {
  try {
    chrome.action.setBadgeBackgroundColor({ color: "#c0392b" });
    chrome.action.setBadgeText({ text: "!" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
  } catch (e) {}
}

async function getActiveTab() {
  // currentWindow is unreliable inside a service worker; use lastFocusedWindow
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab || null;
}

async function injectContentScript(tabId) {
  await chrome.scripting.insertCSS({ target: { tabId }, files: ["content.css"] });
  await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
}

async function forwardCapture(tabId) {
  const send = () => chrome.tabs.sendMessage(tabId, { type: "yts-capture" });
  try {
    return (await send()) || { ok: false, error: "no-response" };
  } catch (e) {
    // Only "receiving end does not exist" means the content script isn't there.
    // Don't retry on other errors, or we could capture twice.
    if (!/Receiving end does not exist/i.test(errText(e))) {
      return { ok: false, error: "content-not-ready", detail: errText(e) };
    }
    try {
      await injectContentScript(tabId);
      return (await send()) || { ok: false, error: "no-response" };
    } catch (e2) {
      return { ok: false, error: "content-not-ready", detail: errText(e2) };
    }
  }
}

function reportIfNotShown(res) {
  // When the content script itself fails it shows a message in the page.
  // This only covers the case where it never ran at all.
  if (res && !res.ok && (res.error === "content-not-ready" || res.error === "no-response")) {
    flashBadge();
  }
}

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "capture-frame") return;
  const target = tab && tab.id != null ? tab : await getActiveTab();
  if (!target || target.id == null || !isYouTubeUrl(target.url)) return;
  reportIfNotShown(await forwardCapture(target.id));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message.type !== "string") return;

  // Popup asks to capture the current tab
  if (message.type === "yts-capture-active") {
    (async () => {
      const tab = await getActiveTab();
      if (!tab || tab.id == null) {
        sendResponse({ ok: false, error: "no-active-tab" });
        return;
      }
      if (!isYouTubeUrl(tab.url)) {
        sendResponse({ ok: false, error: "not-youtube" });
        return;
      }
      // Reply first so the popup can close right away: focus only returns to the
      // page once the popup closes, and "copy to clipboard" needs the page focused
      sendResponse({ ok: true, started: true });
      await sleep(Number(message.delay) || 0);
      reportIfNotShown(await forwardCapture(tab.id));
    })();
    return true;
  }

  // Content script asks for a screenshot of the visible area
  // (fallback when canvas capture fails)
  if (message.type === "yts-capture-visible") {
    (async () => {
      if (!sender.tab) {
        sendResponse({ ok: false, error: "no-sender-tab" });
        return;
      }
      // captureVisibleTab captures the window's *active* tab; if the requesting
      // tab isn't active it would capture the wrong page
      if (!sender.tab.active) {
        sendResponse({ ok: false, error: "tab-not-active" });
        return;
      }
      try {
        const dataUrl = await chrome.tabs.captureVisibleTab(sender.tab.windowId, {
          format: "png"
        });
        sendResponse({ ok: true, dataUrl });
      } catch (e) {
        sendResponse({ ok: false, error: "capture-visible-failed", detail: errText(e) });
      }
    })();
    return true;
  }

  // Look up the current shortcut (shown in popup / options)
  if (message.type === "yts-get-shortcut") {
    chrome.commands
      .getAll()
      .then((cmds) => {
        const c = cmds.find((x) => x.name === "capture-frame");
        sendResponse({ ok: true, shortcut: c && c.shortcut ? c.shortcut : "" });
      })
      .catch(() => sendResponse({ ok: false, shortcut: "" }));
    return true;
  }
});
