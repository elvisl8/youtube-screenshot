// YouTube 截屏 - content script
// 截屏原理（两种模式）：
//  clean（默认，干净帧）：用 canvas 直接画当前 <video> 的一帧，得到视频原生分辨率画面，
//    没有播放器控制条、没有字幕、没有黑边干扰（短边由视频本身决定）。无声截屏，不暂停播放。
//  visible（所见即所得）：请 background 用 captureVisibleTab 拍视口，再按视频元素位置裁剪，
//    画面里会带上当时显示的字幕，但分辨率受屏幕/窗口大小限制。
// clean 若被浏览器安全策略拦截（canvas 被标记为跨域污染），会自动回退到 visible。

(function () {
  "use strict";

  // 防重复注入：background 的按需注入若打到已注入的页面，直接退出，不重复注册监听
  if (window.__ytsInjected) return;
  window.__ytsInjected = true;

  const DEFAULT_SETTINGS = {
    format: "png", // png | jpeg | webp
    quality: 0.92, // jpeg/webp 质量 0.1-1
    afterCapture: "preview", // preview | download | copy
    captureMode: "clean" // clean | visible
  };

  let settings = { ...DEFAULT_SETTINGS };
  let capturing = false;

  async function loadSettings() {
    try {
      const data = await chrome.storage.local.get("settings");
      settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
    } catch (e) {}
  }
  loadSettings();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.settings) loadSettings();
  });

  // ---------- 工具 ----------
  function getVideo() {
    return (
      document.querySelector("video.html5-main-video") ||
      document.querySelector("#movie_player video") ||
      document.querySelector("video")
    );
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function timeForName(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return (h > 0 ? pad(h) + "-" : "") + pad(m) + "-" + pad(s);
  }

  function timeForDisplay(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return (h > 0 ? pad(h) + ":" : "") + pad(m) + ":" + pad(s);
  }

  function sanitize(name) {
    return (name || "youtube")
      .replace(/[\\/:*?"<>|]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "youtube";
  }

  function getTitle() {
    const el =
      document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ||
      document.querySelector("h1.title yt-formatted-string");
    let t = el && el.textContent ? el.textContent.trim() : "";
    if (!t) t = document.title.replace(/\s*-\s*YouTube\s*$/, "").trim();
    return sanitize(t);
  }

  function buildFilename(video) {
    const ext = settings.format === "jpeg" ? "jpg" : settings.format;
    const date = new Date();
    const stamp =
      date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      "_" +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds());
    return (
      getTitle() + "_" + timeForName(video ? video.currentTime : 0) + "_" + stamp + "." + ext
    );
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      const type = "image/" + settings.format;
      const q = settings.format === "png" ? undefined : settings.quality;
      try {
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("toBlob-null"))),
          type,
          q
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  // ---------- 抓帧 ----------
  function captureCleanCanvas(video) {
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error("video-not-ready");
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // 若视频源被判定跨域，toBlob/toDataURL 会抛 SecurityError，调用方会回退 visible
    return canvas;
  }

  async function captureVisibleCanvas(video) {
    const rect = video.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) throw new Error("video-not-visible");
    const res = await chrome.runtime.sendMessage({ type: "yts-capture-visible" });
    if (!res || !res.ok || !res.dataUrl) {
      throw new Error((res && res.error) || "capture-visible-failed");
    }
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = res.dataUrl;
    });
    const dpr = window.devicePixelRatio || 1;
    // captureVisibleTab 返回图的像素 = CSS 视口尺寸 × dpr，用比例换算更稳
    const scaleX = img.naturalWidth / window.innerWidth;
    const scaleY = img.naturalHeight / window.innerHeight;
    const sx = Math.max(0, Math.round(rect.left * scaleX));
    const sy = Math.max(0, Math.round(rect.top * scaleY));
    const sw = Math.min(img.naturalWidth - sx, Math.round(rect.width * scaleX));
    const sh = Math.min(img.naturalHeight - sy, Math.round(rect.height * scaleY));
    if (sw < 2 || sh < 2) throw new Error("video-out-of-viewport");
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    void dpr;
    return canvas;
  }

  async function captureCanvas(video) {
    if (settings.captureMode === "visible") {
      return { canvas: await captureVisibleCanvas(video), mode: "visible" };
    }
    try {
      const canvas = captureCleanCanvas(video);
      // 探一下是否被污染：toDataURL 在污染时抛错，趁早发现好回退
      canvas.toDataURL("image/png").slice(0, 1);
      return { canvas, mode: "clean" };
    } catch (e) {
      // 回退到所见即所得
      return { canvas: await captureVisibleCanvas(video), mode: "visible-fallback" };
    }
  }

  // ---------- 动作：下载 / 复制 / 预览 ----------
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.documentElement.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function copyBlob(blob, canvas) {
    // 剪贴板在 Chrome 里只稳妥支持 PNG；格式不是 PNG 时用 canvas 转一份 PNG 再复制
    let pngBlob = blob;
    if (blob.type !== "image/png") {
      pngBlob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob-null"))),
          "image/png"
        );
      });
    }
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob })
    ]);
  }

  function showPreview(blob, canvas, filename, metaText) {
    closePreview();
    const url = URL.createObjectURL(blob);
    const wrap = document.createElement("div");
    wrap.className = "yts-preview-wrap";
    wrap.innerHTML =
      '<div class="yts-preview-card">' +
      '<div class="yts-preview-head"><span>' +
      escapeHtml(metaText) +
      '</span><button class="yts-btn yts-close" type="button">✕ 关闭</button></div>' +
      '<img class="yts-preview-img" alt="screenshot preview">' +
      '<div class="yts-preview-actions">' +
      '<button class="yts-btn yts-save" type="button">💾 保存文件</button>' +
      '<button class="yts-btn yts-copy" type="button">📋 复制到剪贴板</button>' +
      "</div></div>";
    wrap.querySelector(".yts-preview-img").src = url;
    wrap.querySelector(".yts-close").addEventListener("click", closePreview);
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) closePreview();
    });
    wrap.querySelector(".yts-save").addEventListener("click", () => {
      downloadBlob(blob, filename);
      toast("已保存：" + filename);
    });
    wrap.querySelector(".yts-copy").addEventListener("click", async () => {
      try {
        await copyBlob(blob, canvas);
        toast("已复制到剪贴板，去聊天/文档里粘贴即可");
      } catch (e) {
        toast("复制失败（浏览器没给剪贴板权限），请用「保存文件」", true);
      }
    });
    document.documentElement.appendChild(wrap);
    function closePreview() {
      wrap.remove();
      URL.revokeObjectURL(url);
    }
    wrap._close = closePreview;
    currentPreview = wrap;
  }

  let currentPreview = null;
  function closePreview() {
    if (currentPreview) {
      const w = currentPreview;
      currentPreview = null;
      if (w._close) w._close();
      else w.remove();
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  let toastTimer = null;
  function toast(text, isError) {
    let el = document.querySelector(".yts-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "yts-toast";
      document.documentElement.appendChild(el);
    }
    el.textContent = text;
    el.classList.toggle("yts-toast-error", !!isError);
    el.classList.add("yts-toast-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("yts-toast-show"), 2600);
  }

  // ---------- 主入口 ----------
  async function doCapture() {
    if (capturing) return { ok: false, error: "busy" };
    const video = getVideo();
    if (!video) {
      toast("没找到视频（请在 YouTube 播放页使用）", true);
      return { ok: false, error: "no-video" };
    }
    if (!video.videoWidth) {
      toast("视频还没加载出画面，先播放一下再截", true);
      return { ok: false, error: "video-not-ready" };
    }
    capturing = true;
    try {
      await loadSettings();
      const { canvas, mode } = await captureCanvas(video);
      const blob = await canvasToBlob(canvas);
      const filename = buildFilename(video);
      const meta =
        getTitle() +
        " · " +
        timeForDisplay(video.currentTime) +
        " · " +
        canvas.width +
        "×" +
        canvas.height +
        (mode === "clean" ? " · 原生帧" : " · 含字幕画面");

      if (settings.afterCapture === "download") {
        downloadBlob(blob, filename);
        toast("已保存截图：" + filename);
      } else if (settings.afterCapture === "copy") {
        try {
          await copyBlob(blob, canvas);
          toast("截图已复制到剪贴板（" + canvas.width + "×" + canvas.height + "）");
        } catch (e) {
          // 复制被拒时不丢图，改弹预览让用户手动保存
          showPreview(blob, canvas, filename, meta);
          toast("自动复制失败，已打开预览，请点「保存文件」", true);
        }
      } else {
        showPreview(blob, canvas, filename, meta);
      }
      return { ok: true, mode, width: canvas.width, height: canvas.height };
    } catch (e) {
      toast("截屏失败：" + (e && e.message ? e.message : e), true);
      return { ok: false, error: String(e && e.message ? e.message : e) };
    } finally {
      capturing = false;
    }
  }

  // ---------- 注入播放器按钮 ----------
  const CAMERA_SVG =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="7.8" fill="#e62117" stroke="#ffffff" stroke-width="1.5"/><g transform="translate(6.9 6.9) scale(0.425)"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="#ffffff"/><circle cx="12" cy="13" r="4.2" fill="#e62117"/></g></svg>';

  function ensureButton() {
    const controls = document.querySelector(".ytp-right-controls");
    if (!controls) return;
    if (controls.querySelector(".yts-capture-btn")) return;
    const btn = document.createElement("button");
    btn.className = "ytp-button yts-capture-btn";
    btn.type = "button";
    btn.title = "截取当前帧（YouTube 截屏）";
    btn.setAttribute("aria-label", "截取当前帧");
    btn.innerHTML = CAMERA_SVG;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      doCapture();
    });
    // 放在设置按钮前面，找不到就直接放最前面
    const settingsBtn = controls.querySelector(".ytp-settings-button");
    if (settingsBtn) controls.insertBefore(btn, settingsBtn);
    else controls.insertBefore(btn, controls.firstChild);
  }

  const observer = new MutationObserver(() => ensureButton());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(ensureButton, 2000);
  document.addEventListener("yt-navigate-finish", () => {
    closePreview();
    ensureButton();
  });
  ensureButton();

  // ---------- 消息入口（快捷键 / popup） ----------
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) return;
    if (message.type === "yts-ping") {
      sendResponse({ ok: true, ping: true });
      return;
    }
    if (message.type === "yts-capture") {
      doCapture().then(sendResponse);
      return true;
    }
  });
})();
