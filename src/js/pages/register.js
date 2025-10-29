import { signUp, signInWithGoogle } from '../auth.js';
import { redirectIfAuthenticated } from '../utils/authGuard.js';

redirectIfAuthenticated('/onboarding.html');

const showError = message => {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    const form = document.getElementById('register-form');
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

const hideMessages = () => {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) errorDiv.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const googleBtn = document.getElementById('google-signin-btn');

  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      hideMessages();

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        await signUp(email, password, name);
        window.location.href = '/onboarding.html';
      } catch (error) {
        console.error('Registration error:', error);
        let message = 'Failed to create account. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
          message = 'This email is already registered. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
          message = 'Password is too weak. Use at least 8 characters.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
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
      googleBtn.textContent = 'Signing up...';

      try {
        await signInWithGoogle();
        window.location.href = '/onboarding.html';
      } catch (error) {
        console.error('Google sign-up error:', error);
        let message = 'Failed to sign up with Google. Please try again.';

        if (error.code === 'auth/popup-closed-by-user') {
          message = 'Sign-up cancelled. Please try again.';
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
