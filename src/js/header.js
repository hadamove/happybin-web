(function () {
  function markup() {
    return `
<header class="p-6 border border-gray-300 bg-lime-100">
  <div class="container mx-auto flex items-center justify-between">
    <a href="./index.html" class="flex items-center">
      <img src="./src/img/bin.png" alt="Ikona Happy Bin"
           class="h-10 w-10 md:h-14 md:w-14 mr-4 transition-transform duration-200 hover:scale-110">
      <h1 data-i18n="header.brand" class="text-[2.5rem] md:text-[2.75rem] font-bold">Happy Bin</h1>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden md:flex gap-6 items-center">
      <a href="./index.html" class="nav-link text-blue-500 hover:text-blue-400" data-i18n="nav.home">Home</a>
      <a href="./about.html" class="nav-link text-blue-500 hover:text-blue-400" data-i18n="nav.about">About</a>
      <a href="./privacy_policy.html" class="nav-link text-blue-500 hover:text-blue-400" data-i18n="nav.privacy">Privacy Policy</a>
    </nav>

    <!-- Desktop language selector placeholder -->
    <div data-lang-root class="hidden md:flex gap-6 text-blue-500 font-medium items-center"></div>

    <!-- Mobile hamburger -->
    <div class="md:hidden relative">
      <button id="menu-toggle" class="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Menu">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <div id="menu" class="hidden absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-50 flex flex-col items-center text-center">
        <!-- Centered nav links -->
        <a data-i18n="nav.home" href="./index.html"
           class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center">Home</a>
        <a data-i18n="nav.about" href="./about.html"
           class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center">O&nbsp;nás</a>
        <a data-i18n="nav.privacy" href="./privacy_policy.html"
           class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center">Privacy policy</a>

        <!-- Mobile language selector styled like nav link -->
        <div class="w-full relative">
          <button id="mobile-lang-btn"
                  class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center"
                  aria-haspopup="true" aria-expanded="false">
            Select language
          </button>
          <div class="hb-lang-dropdown hidden absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-md flex flex-col z-50">
            <button data-lang="cs" class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center">🇨🇿 CS</button>
            <button data-lang="sk" class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center">🇸🇰 SK</button>
            <button data-lang="en" class="nav-link block w-full px-4 py-3 text-lg md:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-400 text-center">🇬🇧 EN</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
`.trim();
  }

  function attachMenuHandlers(root) {
    const btn = root.querySelector('#menu-toggle');
    const menu = root.querySelector('#menu');
    if (btn && menu) {
      btn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('hidden'); });

      window.addEventListener('click', e => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.add('hidden');
      });
    }

    // Mobile language dropdown
    const langBtn = root.querySelector('#mobile-lang-btn');
    const dropdown = root.querySelector('.hb-lang-dropdown');
    if (langBtn && dropdown) {
      langBtn.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });

      dropdown.querySelectorAll('[data-lang]').forEach(b => {
        b.addEventListener('click', e => {
          e.stopPropagation();
          const lang = b.dataset.lang;
          if (window.i18n && typeof window.i18n.setLang === 'function') {
            window.i18n.setLang(lang);
          }
          dropdown.classList.add('hidden');
        });
      });

      window.addEventListener('click', e => {
        if (!langBtn.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden');
      });
    }
  }

  function markCurrent(root) {
    const page = document.body.dataset.page;
    if (!page) return;

    root.querySelectorAll('.nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(page) || (page === 'home' && (href === './index.html' || href === 'index.html' || href === '/'))) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('font-bold', 'text-blue-700');
      } else {
        a.removeAttribute('aria-current');
        a.classList.remove('font-bold', 'text-blue-700');
      }
    });
  }

  function initHeader(root) {
    if (!root || root.dataset.hbHeaderInit) return;
    root.dataset.hbHeaderInit = '1';
    root.innerHTML = markup();
    attachMenuHandlers(root);
    markCurrent(root);

    // Re-initialize desktop language selector
    if (window.hbLang && typeof window.hbLang.initAll === 'function') {
      window.hbLang.initAll();
    }
  }

  function initAll() {
    document.querySelectorAll('[data-header-root]').forEach(initHeader);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.hbHeader = { initAll, initHeader };
})();
