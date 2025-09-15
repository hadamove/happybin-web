// reusable header component: injects header markup and attaches menu + current-link logic
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
      <a href="./about.html" class="nav-link text-blue-500 hover:text-blue-400" data-i18n="nav.about">O&nbsp;nás</a>
      <a href="./privacy_policy.html" class="nav-link text-blue-500 hover:text-blue-400" data-i18n="nav.privacy">Privacy policy</a>
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

      <div id="menu" class="hidden absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
        <a data-i18n="nav.home" href="./index.html" class="block px-4 py-2 text-blue-500 hover:bg-gray-100 hover:text-blue-400">Home</a>
        <a data-i18n="nav.about" href="./about.html" class="block px-4 py-2 text-blue-500 hover:bg-gray-100 hover:text-blue-400">O&nbsp;nás</a>
        <a data-i18n="nav.privacy" href="./privacy_policy.html" class="block px-4 py-2 text-blue-500 hover:bg-gray-100 hover:text-blue-400">Privacy policy</a>
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
    if (!root) return;
    if (root.dataset.hbHeaderInit) return;
    root.dataset.hbHeaderInit = '1';
    root.innerHTML = markup();
    attachMenuHandlers(root);
    // mark current after DOM exists
    markCurrent(root);
  }

  function initAll() {
    document.querySelectorAll('[data-header-root]').forEach(initHeader);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.hbHeader = { initAll, initHeader };
})();