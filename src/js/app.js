document.addEventListener('DOMContentLoaded', async () => {
  console.log('AFCON 2025 Marrakech - Public Site Initialized');

  const isHomePage =
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html' ||
    window.location.pathname.endsWith('/public/') ||
    window.location.pathname.endsWith('/public/index.html');

  if (isHomePage) {
    if (typeof initNavigation === 'function') {
      initNavigation();
    }

    if (typeof initMatches === 'function') {
      await initMatches();
    }

    if (typeof initMap === 'function') {
      initMap();
    }

    if (typeof initContact === 'function') {
      initContact();
    }
  }

  const loginForm = dom.qs('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = dom.qs('#email', loginForm).value;
      const password = dom.qs('#password', loginForm).value;
      console.log('Login attempt:', { email, password });
      window.location.href = '/dashboard.html';
    });
  }

  const registerForm = dom.qs('#register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = dom.qs('#name', registerForm).value;
      const email = dom.qs('#email', registerForm).value;
      const password = dom.qs('#password', registerForm).value;
      console.log('Register attempt:', { name, email, password });
      window.location.href = '/onboarding.html';
    });
  }

  const resetForm = dom.qs('#reset-form');
  if (resetForm) {
    resetForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = dom.qs('#email', resetForm).value;
      console.log('Password reset for:', email);
      alert('Password reset link sent to your email!');
    });
  }
});
