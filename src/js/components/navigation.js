const initNavigation = () => {
  const header = dom.qs('#header');
  const menuToggle = dom.qs('#menu-toggle');
  const nav = dom.qs('#main-nav');
  const navLinks = dom.qsa('.nav-link');

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    dom.toggleClass(nav, 'active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = dom.qs(targetId);
        if (targetSection) {
          const headerHeight = header.offsetHeight;
          const targetPosition =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

          if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }

          nav.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  const updateActiveLink = () => {
    const sections = [
      { id: 'home', element: dom.qs('#home') },
      { id: 'matches', element: dom.qs('#matches') },
      { id: 'packages', element: dom.qs('#packages') },
      { id: 'map', element: dom.qs('#map') },
      { id: 'contact', element: dom.qs('#contact') },
    ].filter(s => s.element);

    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    let currentSection = 'home';

    sections.forEach(section => {
      if (section.element.offsetTop <= scrollPosition) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      updateActiveLink();
    });
  });

  updateActiveLink();
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initNavigation };
}
