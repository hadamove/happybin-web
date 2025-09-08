// ...new file...
(function () {
  const storageKey = 'hb_lang';
  const flags = { cs: '🇨🇿', sk: '🇸🇰', en: '🇬🇧' };
  const defaultLang = 'cs';

  function createMarkup() {
    return `
      <div class="relative">
        <button class="hb-lang-btn flex items-center gap-3 p-1 rounded-full focus:outline-none bg-white/0 hover:bg-white/20 transition" aria-haspopup="true" aria-expanded="false" title="Jazyk">
          <span class="hb-lang-flag text-6xl md:text-8xl leading-none">${flags[defaultLang]}</span>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
          </svg>
        </button>
        <div class="hb-lang-dropdown hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <button data-lang="cs" class="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <span class="text-2xl">🇨🇿</span><span class="text-sm font-medium text-gray-700">Čeština</span>
          </button>
          <button data-lang="sk" class="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <span class="text-2xl">🇸🇰</span><span class="text-sm font-medium text-gray-700">Slovenčina</span>
          </button>
          <button data-lang="en" class="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <span class="text-2xl">🇬🇧</span><span class="text-sm font-medium text-gray-700">English</span>
          </button>
        </div>
      </div>
    `;
  }

  function initRoot(root) {
    if (!root) return;
    // avoid double-init
    if (root.dataset.hbLangInit) return;
    root.dataset.hbLangInit = '1';

    root.innerHTML = createMarkup();

    const btn = root.querySelector('.hb-lang-btn');
    const dropdown = root.querySelector('.hb-lang-dropdown');
    const flag = root.querySelector('.hb-lang-flag');

    function markSelected(lang) {
      dropdown.querySelectorAll('[data-lang]').forEach(b => {
        if (b.dataset.lang === lang) {
          b.classList.add('bg-blue-50');
          b.setAttribute('aria-pressed', 'true');
        } else {
          b.classList.remove('bg-blue-50');
          b.removeAttribute('aria-pressed');
        }
      });
    }

    function applyLang(lang, skipSave) {
      if (!skipSave) localStorage.setItem(storageKey, lang);
      flag.textContent = flags[lang] || '🌐';
      btn.classList.add('ring-1', 'ring-blue-300');
      setTimeout(() => btn.classList.remove('ring-1', 'ring-blue-300'), 600);
      markSelected(lang);
      if (window.i18n && typeof window.i18n.setLang === 'function') {
        window.i18n.setLang(lang);
      }
    }

    // open/close
    btn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    dropdown.querySelectorAll('[data-lang]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        applyLang(b.dataset.lang);
        dropdown.classList.add('hidden');
      });
    });

    // close on outside click (handles multiple roots)
    window.addEventListener('click', e => {
      if (!root.contains(e.target)) dropdown.classList.add('hidden');
    });

    const initial = localStorage.getItem(storageKey) || defaultLang;
    applyLang(initial, true);
  }

  // initialize on DOMContentLoaded (supports multiple roots)
  function initAll() {
    document.querySelectorAll('[data-lang-root]').forEach(initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // expose for tests / manual init
  window.hbLang = { initAll, initRoot };
})();