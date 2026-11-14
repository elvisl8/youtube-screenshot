// YouTube Screenshot - options
const DEFAULT_SETTINGS = {
  format: "png",
  quality: 0.92,
  afterCapture: "preview",
  captureMode: "clean"
};

async function load() {
  const data = await chrome.storage.local.get("settings");
  const s = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };

  const modeEl = document.querySelector(
    'input[name="mode"][value="' + s.captureMode + '"]'
  );
  if (modeEl) modeEl.checked = true;
  const actEl = document.querySelector(
    'input[name="act"][value="' + s.afterCapture + '"]'
  );
  if (actEl) actEl.checked = true;
  document.getElementById("format").value = s.format;
  const q = Math.round((s.quality || 0.92) * 100);
  document.getElementById("quality").value = q;
  document.getElementById("qVal").textContent = q + "%";

  try {
    const res = await chrome.runtime.sendMessage({ type: "yts-get-shortcut" });
    document.getElementById("shortcut").textContent =
      res && res.shortcut ? res.shortcut : "Not set (set it on Chrome's shortcuts page)";
  } catch (e) {
    document.getElementById("shortcut").textContent = "—";
  }
}

document.getElementById("quality").addEventListener("input", (e) => {
  document.getElementById("qVal").textContent = e.target.value + "%";
});

document.getElementById("openShortcuts").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});

document.getElementById("save").addEventListener("click", async () => {
  const mode =
    document.querySelector('input[name="mode"]:checked')?.value || "clean";
  const act =
    document.querySelector('input[name="act"]:checked')?.value || "preview";
  const settings = {
    captureMode: mode,
    afterCapture: act,
    format: document.getElementById("format").value,
    quality: Number(document.getElementById("quality").value) / 100
  };
  await chrome.storage.local.set({ settings });
  const saved = document.getElementById("saved");
  saved.style.opacity = "1";
  setTimeout(() => (saved.style.opacity = "0"), 1600);
});

load();
