// YouTube 截屏 - popup
const ACT_LABELS = { preview: "先预览", download: "直接保存", copy: "复制到剪贴板" };

async function refresh() {
  try {
    const res = await chrome.runtime.sendMessage({ type: "yts-get-shortcut" });
    document.getElementById("shortcut").textContent =
      res && res.shortcut ? res.shortcut : "未绑定";
  } catch (e) {
    document.getElementById("shortcut").textContent = "—";
  }
  const data = await chrome.storage.local.get("settings");
  const s = data.settings || {};
  document.getElementById("fmt").textContent = (s.format || "png").toUpperCase();
  document.getElementById("act").textContent =
    ACT_LABELS[s.afterCapture || "preview"] || "先预览";

  // 不在 YouTube 页时禁用按钮并提示
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const btn = document.getElementById("captureBtn");
  const msg = document.getElementById("msg");
  if (!tab || !/youtube\.com/.test(tab.url || "")) {
    btn.disabled = true;
    msg.innerHTML = '<span class="err">当前不是 YouTube 页面，先打开一个视频再截。</span>';
  }
}

document.getElementById("captureBtn").addEventListener("click", async () => {
  const msg = document.getElementById("msg");
  msg.textContent = "正在截屏…";
  try {
    const res = await chrome.runtime.sendMessage({ type: "yts-capture-active" });
    if (res && res.ok) {
      msg.innerHTML =
        '<span class="ok">已截屏（' + res.width + "×" + res.height + "），去视频页看预览/已保存。</span>";
    } else if (res && res.error === "not-youtube") {
      msg.innerHTML = '<span class="err">当前不是 YouTube 页面。</span>';
    } else if (res && res.error === "content-not-ready") {
      msg.innerHTML = '<span class="err">脚本注入失败：请确认已更新到 v1.0.1 并在扩展页点过「重新加载」，再刷新 YouTube 页重试。</span>';
    } else {
      msg.innerHTML = '<span class="err">截屏没成功：' + ((res && res.error) || "未知错误") + "（视频页上也会有提示）</span>";
    }
  } catch (e) {
    msg.innerHTML = '<span class="err">调用失败：' + e.message + "</span>";
  }
});

document.getElementById("openShortcuts").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});
document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

refresh();
