import { resetPassword } from '../auth.js';

const showError = message => {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    const form = document.getElementById('reset-form');
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
    const form = document.getElementById('reset-form');
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
  const resetForm = document.getElementById('reset-form');

  if (resetForm) {
    resetForm.addEventListener('submit', async e => {
      e.preventDefault();
      hideMessages();

      const submitBtn = resetForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const email = document.getElementById('email').value;
        await resetPassword(email);

        showSuccess('Password reset link sent! Check your email.');
        resetForm.reset();

        setTimeout(() => {
          window.location.href = '/login.html';
        }, 3000);
      } catch (error) {
        console.error('Password reset error:', error);
        let message = 'Failed to send reset email. Please try again.';

        if (error.code === 'auth/user-not-found') {
          message = 'No account found with this email.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        } else if (error.code === 'auth/too-many-requests') {
          message = 'Too many requests. Please try again later.';
        } else if (error.code === 'auth/network-request-failed') {
          message = 'Network error. Please check your connection.';
        }

        showError(message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});
