(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-nav');
  const header = document.querySelector('header');

  const updateScrollOffset = () => {
    if (!header) return;
    const extra = 12;
    const height = Math.ceil(header.getBoundingClientRect().height + extra);
    root.style.setProperty('--scroll-offset', `${height}px`);
  };

  const scheduleUpdate = () => requestAnimationFrame(updateScrollOffset);

  if (toggle && nav && menu) {
    const closeMenu = () => {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      scheduleUpdate();
    });

    menu.addEventListener('click', (event) => {
      const link = event.target && event.target.closest('a');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;

      event.preventDefault();
      closeMenu();
      scheduleUpdate();

      const target = hash === '#' ? document.body : document.querySelector(hash);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        history.pushState(null, '', hash);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
      scheduleUpdate();
    });
  }

  window.addEventListener('load', scheduleUpdate);
  window.addEventListener('orientationchange', scheduleUpdate);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleUpdate).catch(() => {});
  }
})();
