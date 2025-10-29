import { getCurrentUser, logout, getUserProfile } from '../auth.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { db } from '../firebase.js';
import {
  doc,
  updateDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

initAuthGuard();

const TEAM_NAMES = {
  morocco: 'Morocco 🇲🇦',
  egypt: 'Egypt 🇪🇬',
  senegal: 'Senegal 🇸🇳',
  nigeria: 'Nigeria 🇳🇬',
  cameroon: 'Cameroon 🇨🇲',
  'ivory-coast': 'Ivory Coast 🇨🇮',
  ghana: 'Ghana 🇬🇭',
  algeria: 'Algeria 🇩🇿',
};

let currentProfile = null;
let selectedAvatar = '⚽';

const showStatus = (message, type = 'success') => {
  const statusContainer = document.getElementById('status-container');
  if (!statusContainer) return;

  statusContainer.innerHTML = `
    <div class="status-message ${type}">
      ${message}
    </div>
  `;

  if (type !== 'loading') {
    setTimeout(() => {
      statusContainer.innerHTML = '';
    }, 3000);
  }
};

const validateDisplayName = name => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Display name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Display name must be at least 2 characters' };
  }

  if (name.trim().length > 50) {
    return {
      valid: false,
      error: 'Display name must be less than 50 characters',
    };
  }

  return { valid: true };
};

const formatMemberSince = timestamp => {
  if (!timestamp) return '-';

  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

const displayProfile = profile => {
  currentProfile = profile;

  const viewAvatar = document.getElementById('view-avatar');
  const viewDisplayName = document.getElementById('view-display-name');
  const viewEmail = document.getElementById('view-email');
  const viewFavoriteTeam = document.getElementById('view-favorite-team');
  const viewMemberSince = document.getElementById('view-member-since');

  if (viewAvatar) {
    viewAvatar.textContent = profile.avatar || '⚽';
    selectedAvatar = profile.avatar || '⚽';
  }

  if (viewDisplayName) {
    viewDisplayName.textContent = profile.displayName || 'User';
  }

  if (viewEmail) {
    const user = getCurrentUser();
    viewEmail.textContent = user?.email || '';
  }

  if (viewFavoriteTeam) {
    viewFavoriteTeam.textContent = profile.favoriteTeam
      ? TEAM_NAMES[profile.favoriteTeam] || profile.favoriteTeam
      : 'Not set';
  }

  if (viewMemberSince) {
    viewMemberSince.textContent = formatMemberSince(profile.createdAt);
  }
};

const switchToEditMode = () => {
  const viewMode = document.getElementById('view-mode');
  const editMode = document.getElementById('edit-mode');
  const editDisplayName = document.getElementById('edit-display-name');
  const editFavoriteTeam = document.getElementById('edit-favorite-team');

  if (!viewMode || !editMode) return;

  viewMode.style.display = 'none';
  editMode.style.display = 'block';

  if (editDisplayName && currentProfile) {
    editDisplayName.value = currentProfile.displayName || '';
  }

  if (editFavoriteTeam && currentProfile) {
    editFavoriteTeam.value = currentProfile.favoriteTeam || '';
  }

  updateAvatarSelection(currentProfile?.avatar || '⚽');
};

const switchToViewMode = () => {
  const viewMode = document.getElementById('view-mode');
  const editMode = document.getElementById('edit-mode');

  if (!viewMode || !editMode) return;

  viewMode.style.display = 'block';
  editMode.style.display = 'none';
};

const updateAvatarSelection = avatar => {
  selectedAvatar = avatar;
  const avatarOptions = document.querySelectorAll('.avatar-option');
  avatarOptions.forEach(option => {
    if (option.dataset.avatar === avatar) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
};

const saveProfile = async () => {
  const editDisplayName = document.getElementById('edit-display-name');
  const editFavoriteTeam = document.getElementById('edit-favorite-team');
  const saveBtn = document.getElementById('save-btn');
  const user = getCurrentUser();

  if (!user || !editDisplayName || !editFavoriteTeam || !saveBtn) return;

  const newDisplayName = editDisplayName.value.trim();
  const newFavoriteTeam = editFavoriteTeam.value;

  const validation = validateDisplayName(newDisplayName);
  if (!validation.valid) {
    showStatus(validation.error, 'error');
    return;
  }

  const oldProfile = { ...currentProfile };

  currentProfile = {
    ...currentProfile,
    displayName: newDisplayName,
    favoriteTeam: newFavoriteTeam,
    avatar: selectedAvatar,
  };

  displayProfile(currentProfile);
  switchToViewMode();

  showStatus('Saving changes...', 'loading');
  saveBtn.disabled = true;

  try {
    const profileRef = doc(db, 'profiles', user.uid);
    await updateDoc(profileRef, {
      displayName: newDisplayName,
      favoriteTeam: newFavoriteTeam,
      avatar: selectedAvatar,
      updatedAt: serverTimestamp(),
    });

    showStatus('Profile updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    showStatus('Failed to update profile. Please try again.', 'error');

    currentProfile = oldProfile;
    displayProfile(currentProfile);
  } finally {
    saveBtn.disabled = false;
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logout-btn');
  const editBtn = document.getElementById('edit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const saveBtn = document.getElementById('save-btn');
  const avatarGrid = document.getElementById('avatar-grid');

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

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      switchToEditMode();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      switchToViewMode();
      if (currentProfile) {
        updateAvatarSelection(currentProfile.avatar || '⚽');
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveProfile();
    });
  }

  if (avatarGrid) {
    avatarGrid.addEventListener('click', e => {
      const avatarOption = e.target.closest('.avatar-option');
      if (avatarOption) {
        const avatar = avatarOption.dataset.avatar;
        updateAvatarSelection(avatar);
      }
    });
  }

  const user = getCurrentUser();
  if (user) {
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        displayProfile(profile);
      } else {
        showStatus('Profile not found', 'error');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showStatus('Failed to load profile', 'error');
    }
  }
});
