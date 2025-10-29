import { signIn, signInWithGoogle, getUserProfile } from '../auth.js';
import { redirectIfAuthenticated } from '../utils/authGuard.js';

redirectIfAuthenticated('/dashboard.html');

const showError = message => {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    const form = document.getElementById('login-form');
    const div = document.createElement('div');
    div.id = 'error-message';
    div.className = 'error-message';
    div.textContent = message;
    div.style.color = 'var(--color-danger, #c1272d)';
    div.style.padding = '0.75rem';
    div.style.marginBottom = '1rem';
    div.style.backgroundColor = 'rgba(193, 39, 45, 0.1)';
    div.style.borderRadius = '4px';
    div.style.border = '1px solid var(--color-danger, #c1272d)';
    form.insertBefore(div, form.firstChild);
  }
};

const showSuccess = message => {
  const successDiv = document.getElementById('success-message');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = 'block';
  } else {
    const form = document.getElementById('login-form');
    const div = document.createElement('div');
    div.id = 'success-message';
    div.className = 'success-message';
    div.textContent = message;
    div.style.color = '#006233';
    div.style.padding = '0.75rem';
    div.style.marginBottom = '1rem';
    div.style.backgroundColor = 'rgba(0, 98, 51, 0.1)';
    div.style.borderRadius = '4px';
    div.style.border = '1px solid #006233';
    form.insertBefore(div, form.firstChild);
  }
};

const hideMessages = () => {
  const errorDiv = document.getElementById('error-message');
  const successDiv = document.getElementById('success-message');
  if (errorDiv) errorDiv.style.display = 'none';
  if (successDiv) successDiv.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const googleBtn = document.getElementById('google-signin-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      hideMessages();

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = await signIn(email, password);

        const profile = await getUserProfile(user.uid);
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        if (redirect) {
          window.location.href = redirect;
        } else if (profile && !profile.onboardingComplete) {
          window.location.href = '/onboarding.html';
        } else {
          window.location.href = '/dashboard.html';
        }
      } catch (error) {
        console.error('Login error:', error);
        let message = 'Failed to login. Please try again.';

        if (
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/wrong-password'
        ) {
          message = 'Invalid email or password.';
        } else if (error.code === 'auth/user-not-found') {
          message = 'No account found with this email.';
        } else if (error.code === 'auth/too-many-requests') {
          message = 'Too many failed attempts. Please try again later.';
        } else if (error.code === 'auth/network-request-failed') {
          message = 'Network error. Please check your connection.';
        }

        showError(message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      hideMessages();

      const originalBtnText = googleBtn.textContent;
      googleBtn.disabled = true;
      googleBtn.textContent = 'Signing in...';

      try {
        const user = await signInWithGoogle();

        const profile = await getUserProfile(user.uid);
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        if (redirect) {
          window.location.href = redirect;
        } else if (profile && !profile.onboardingComplete) {
          window.location.href = '/onboarding.html';
        } else {
          window.location.href = '/dashboard.html';
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        let message = 'Failed to sign in with Google. Please try again.';

        if (error.code === 'auth/popup-closed-by-user') {
          message = 'Sign-in cancelled. Please try again.';
        } else if (error.code === 'auth/network-request-failed') {
          message = 'Network error. Please check your connection.';
        }

        showError(message);
        googleBtn.disabled = false;
        googleBtn.textContent = originalBtnText;
      }
    });
  }
});
