import { getCurrentUser, logout } from '../auth.js';
import { initAuthGuard } from '../utils/authGuard.js';

initAuthGuard();

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async e => {
      e.preventDefault();

      try {
        await logout();
        window.location.href = '/login.html';
      } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    });
  }
});
