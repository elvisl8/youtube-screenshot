// YouTube Screenshot - popup
const ACT_LABELS = { preview: "Preview first", download: "Save directly", copy: "Copy to clipboard" };

function isYouTubeUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host === "youtube.com" || host.endsWith(".youtube.com");
  } catch (e) {
    return false;
  }
}

async function refresh() {
  try {
    const res = await chrome.runtime.sendMessage({ type: "yts-get-shortcut" });
    document.getElementById("shortcut").textContent =
      res && res.shortcut ? res.shortcut : "Not set";
  } catch (e) {
    document.getElementById("shortcut").textContent = "—";
  }
  const data = await chrome.storage.local.get("settings");
  const s = data.settings || {};
  document.getElementById("fmt").textContent = (s.format || "png").toUpperCase();
  document.getElementById("act").textContent =
    ACT_LABELS[s.afterCapture || "preview"] || "Preview first";

  // Disable the button and explain when not on a YouTube page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const btn = document.getElementById("captureBtn");
  const msg = document.getElementById("msg");
  if (!tab || !isYouTubeUrl(tab.url || "")) {
    btn.disabled = true;
    msg.innerHTML = '<span class="err">This is not a YouTube page. Open a video first.</span>';
  }
}

document.getElementById("captureBtn").addEventListener("click", async () => {
  const msg = document.getElementById("msg");
  msg.textContent = "Capturing…";
  try {
    // delay: let the popup close and focus return to the page before capturing,
    // otherwise "copy to clipboard" is rejected because the page isn't focused
    const res = await chrome.runtime.sendMessage({ type: "yts-capture-active", delay: 200 });
    if (res && res.ok) {
      // The result (preview / saved / copied) is shown by the in-page message,
      // so just close the popup
      window.close();
    } else if (res && res.error === "not-youtube") {
      msg.innerHTML = '<span class="err">This is not a YouTube page.</span>';
    } else {
      msg.innerHTML =
        '<span class="err">Capture failed: ' +
        ((res && res.error) || "unknown error") +
        "</span>";
    }
  } catch (e) {
    msg.innerHTML = '<span class="err">Request failed: ' + e.message + "</span>";
  }
});

document.getElementById("openShortcuts").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});
document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

refresh();
