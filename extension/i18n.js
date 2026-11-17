// YouTube Screenshot - i18n helper for the popup and options pages.
// Strings come from lang.js (generated from _locales/*/messages.json) so the
// Settings language override applies here too; elements marked with a
// data-i18n attribute get their text filled in from there.
let ytsPref = "auto";
let ytsLang = ytsResolveLang("auto");

function t(key, ...subs) {
  return ytsT(ytsLang, key, subs) || key;
}

function localizePage() {
  document.documentElement.lang = ytsLang === "zh_CN" ? "zh-CN" : "en";
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
}

// Used for the initial preference load below, and by the options page when
// the user picks a different language (applies immediately, no reload).
window.ytsSetLang = function (pref) {
  ytsPref = pref || "auto";
  ytsLang = ytsResolveLang(ytsPref);
  localizePage();
};

localizePage(); // first pass in the browser language; corrected below if a preference is stored
try {
  chrome.storage.local
    .get("uiLanguage")
    .then((d) => {
      if (d && d.uiLanguage && d.uiLanguage !== "auto") window.ytsSetLang(d.uiLanguage);
    })
    .catch(() => {});
} catch (e) {}
