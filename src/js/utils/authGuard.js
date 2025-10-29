import { getCurrentUser, observeAuthState } from '../auth.js';

const protectedPages = ['/dashboard.html', '/profile.html', '/onboarding.html'];

const publicPages = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/reset.html',
];

export const isProtectedPage = () => {
  const path = window.location.pathname;
  return protectedPages.some(page => path === page || path.endsWith(page));
};

export const isPublicPage = () => {
  const path = window.location.pathname;
  return publicPages.some(page => path === page || path.endsWith(page));
};

export const initAuthGuard = () => {
  if (!isProtectedPage()) {
    return;
  }

  const user = getCurrentUser();

  if (!user) {
    observeAuthState(authUser => {
      if (!authUser && isProtectedPage()) {
        console.log('Redirecting to login - unauthenticated access');
        window.location.href =
          '/login.html?redirect=' +
          encodeURIComponent(window.location.pathname);
      }
    });

    setTimeout(() => {
      const stillNoUser = getCurrentUser();
      if (!stillNoUser && isProtectedPage()) {
        console.log('Redirecting to login - unauthenticated access (timeout)');
        window.location.href =
          '/login.html?redirect=' +
          encodeURIComponent(window.location.pathname);
      }
    }, 1000);
  }
};

export const redirectIfAuthenticated = redirectTo => {
  observeAuthState(user => {
    if (
      user &&
      (window.location.pathname.includes('/login.html') ||
        window.location.pathname.includes('/register.html'))
    ) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect =
        urlParams.get('redirect') || redirectTo || '/dashboard.html';
      console.log('Redirecting authenticated user to:', redirect);
      window.location.href = redirect;
    }
  });
};
