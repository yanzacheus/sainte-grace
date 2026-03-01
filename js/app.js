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

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const pressButtons = document.querySelectorAll('.press-open');
  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  const openLightbox = (button) => {
    if (!lightbox || !lightboxImage) return;
    const full = button.getAttribute('data-full');
    const caption = button.getAttribute('data-caption') || '';
    lastFocusedElement = document.activeElement;
    lightboxImage.src = full || '';
    lightboxImage.alt = caption;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    if (lightboxClose) {
      lightboxClose.focus();
    }
  };

  if (lightbox && pressButtons.length > 0) {
    pressButtons.forEach((button) => {
      button.addEventListener('click', () => openLightbox(button));
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
        return;
      }

      if (event.key === 'Tab' && !lightbox.hidden) {
        const focusable = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
