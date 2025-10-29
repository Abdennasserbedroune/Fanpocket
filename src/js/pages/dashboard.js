import { getCurrentUser, logout, getUserProfile } from '../auth.js';
import { initAuthGuard } from '../utils/authGuard.js';

initAuthGuard();

document.addEventListener('DOMContentLoaded', async () => {
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

  const user = getCurrentUser();
  if (user) {
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
      try {
        const profile = await getUserProfile(user.uid);
        const displayName =
          profile?.displayName || user.email?.split('@')[0] || 'User';
        welcomeElement.textContent = `Welcome back, ${displayName}!`;
      } catch (error) {
        console.error('Error loading profile:', error);
        welcomeElement.textContent = `Welcome back!`;
      }
    }
  }
});
