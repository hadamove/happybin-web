// Simple loader: loads src/locales/{lang}.json and applies to elements with data-i18n
(async function () {
  const storageKey = 'hb_lang';
  const defaultLang = 'cs';

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
  }

  async function loadLocale(lang) {
    try {
      const res = await fetch(`./src/locales/${lang}.json`);
      if (!res.ok) throw new Error('Failed to load locale');
      return await res.json();
    } catch (e) {
      console.error('i18n load error', e);
      return {};
    }
  }

  function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = get(dict, key);
      if (val === undefined) return;
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, val);
      else if (Array.isArray(val)) el.innerHTML = val.map(item => `<li>${item}</li>`).join('');
      else el.textContent = val;
    });
    // optional: update document title
    if (dict.title) document.title = dict.title;
  }

  window.i18n = {
    async setLang(lang) {
      localStorage.setItem(storageKey, lang);
      const dict = await loadLocale(lang);
      applyTranslations(dict);
      document.documentElement.lang = lang;
    },
    async init() {
      const lang = localStorage.getItem(storageKey) || defaultLang;
      await this.setLang(lang);
    }
  };

  await window.i18n.init();
})();