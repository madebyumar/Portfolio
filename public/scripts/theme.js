// Umar Shoaib — theme engine (light/dark only; palette is admin-controlled)
(function () {
  const KEY_THEME = 'umar-theme';

  const savedTheme = localStorage.getItem(KEY_THEME);
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  window.umarTheme = {
    get: () => document.documentElement.getAttribute('data-theme') || 'dark',
    toggle: () => {
      const next = window.umarTheme.get() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(KEY_THEME, next);
      window.dispatchEvent(new CustomEvent('umar-theme-changed', { detail: next }));
      return next;
    },
    getPalette: () => document.documentElement.getAttribute('data-palette') || 'volt',
  };
})();
