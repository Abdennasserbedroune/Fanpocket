import { getCurrentUser, logout, getUserProfile } from '../auth.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { db } from '../firebase.js';
import {
  doc,
  updateDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

initAuthGuard();

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  const favoriteTeamSelect = document.getElementById('favorite-team');
  const completeBtn = document.querySelector('button[onclick*="dashboard"]');

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

  if (completeBtn) {
    completeBtn.onclick = null;
    completeBtn.addEventListener('click', async e => {
      e.preventDefault();

      const user = getCurrentUser();
      if (!user) {
        window.location.href = '/login.html';
        return;
      }

      const favoriteTeam = favoriteTeamSelect ? favoriteTeamSelect.value : '';

      if (favoriteTeam) {
        try {
          const profileRef = doc(db, 'profiles', user.uid);
          await updateDoc(profileRef, {
            favoriteTeam: favoriteTeam,
            onboardingComplete: true,
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }

      window.location.href = '/dashboard.html';
    });
  }
});
