import { getCurrentUser, getUserProfile } from '../auth.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { db } from '../firebase.js';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

initAuthGuard();

let teams = [];
let selectedTeamId = null;
let currentStep = 1;

const checkOnboardingStatus = async () => {
  const user = getCurrentUser();
  if (!user) return;

  const profile = await getUserProfile(user.uid);
  if (profile && profile.onboardingComplete) {
    window.location.href = '/dashboard.html';
  }
};

const loadTeams = async () => {
  try {
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    teams = teamsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    teams.sort((a, b) => a.ranking - b.ranking);

    renderTeamsGrid(teams);
  } catch (error) {
    console.error('Error loading teams:', error);
    const teamsGrid = document.getElementById('teams-grid');
    if (teamsGrid) {
      teamsGrid.innerHTML =
        '<p style="text-align: center; color: var(--color-danger);">Failed to load teams. Please try again.</p>';
    }
  }
};

const renderTeamsGrid = filteredTeams => {
  const teamsGrid = document.getElementById('teams-grid');
  if (!teamsGrid) return;

  if (filteredTeams.length === 0) {
    teamsGrid.innerHTML =
      '<p style="text-align: center; padding: 2rem;">No teams found</p>';
    return;
  }

  teamsGrid.innerHTML = filteredTeams
    .map(
      (team, index) => `
    <button
      class="team-card ${selectedTeamId === team.id ? 'selected' : ''}"
      data-team-id="${team.id}"
      data-team-code="${team.code}"
      data-team-name="${team.name}"
      data-team-color="${team.colors?.primary || '#000000'}"
      aria-label="Select ${team.name}"
      tabindex="${index === 0 ? '0' : '-1'}"
    >
      <div class="team-flag" style="background-color: ${team.colors?.primary || '#f0f0f0'}15;">
        <span style="font-size: 3rem;">${getCountryFlag(team.code)}</span>
      </div>
      <div class="team-name">${team.name}</div>
    </button>
  `
    )
    .join('');

  setupTeamSelection();
  setupKeyboardNavigation();
};

const getCountryFlag = code => {
  const flags = {
    MAR: '🇲🇦',
    SEN: '🇸🇳',
    EGY: '🇪🇬',
    NGA: '🇳🇬',
    CMR: '🇨🇲',
    DZA: '🇩🇿',
    TUN: '🇹🇳',
    CIV: '🇨🇮',
    GHA: '🇬🇭',
    MLI: '🇲🇱',
    BFA: '🇧🇫',
    ZAF: '🇿🇦',
    COD: '🇨🇩',
    GIN: '🇬🇳',
    GAB: '🇬🇦',
    UGA: '🇺🇬',
    CPV: '🇨🇻',
    MRT: '🇲🇷',
    AGO: '🇦🇴',
    ZMB: '🇿🇲',
    TZA: '🇹🇿',
    MOZ: '🇲🇿',
    NAM: '🇳🇦',
    BWA: '🇧🇼',
  };
  return flags[code] || '⚽';
};

const setupTeamSelection = () => {
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const teamId = card.dataset.teamId;
      const teamName = card.dataset.teamName;
      const teamCode = card.dataset.teamCode;
      const teamColor = card.dataset.teamColor;

      teamCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      selectedTeamId = teamId;

      const selectedInfo = document.getElementById('selected-team-info');
      const selectedFlag = document.getElementById('selected-flag');
      const selectedName = document.getElementById('selected-name');
      const completeBtn = document.getElementById('complete-btn');

      if (selectedInfo && selectedFlag && selectedName) {
        selectedInfo.style.display = 'block';
        selectedFlag.textContent = getCountryFlag(teamCode);
        selectedName.textContent = teamName;
        selectedInfo.style.borderColor = teamColor;
        selectedInfo.style.backgroundColor = `${teamColor}10`;
      }

      if (completeBtn) {
        completeBtn.disabled = false;
        completeBtn.style.backgroundColor = teamColor;
        completeBtn.style.borderColor = teamColor;
      }
    });
  });
};

const setupKeyboardNavigation = () => {
  const teamCards = Array.from(document.querySelectorAll('.team-card'));
  const gridColumns =
    window.innerWidth >= 768 ? 6 : window.innerWidth >= 480 ? 3 : 2;

  teamCards.forEach((card, index) => {
    card.addEventListener('keydown', e => {
      let targetIndex = index;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          targetIndex = Math.min(index + 1, teamCards.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          targetIndex = Math.max(index - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = Math.min(index + gridColumns, teamCards.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = Math.max(index - gridColumns, 0);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          card.click();
          return;
        default:
          return;
      }

      teamCards.forEach(c => c.setAttribute('tabindex', '-1'));
      teamCards[targetIndex].setAttribute('tabindex', '0');
      teamCards[targetIndex].focus();
    });
  });
};

const goToStep = step => {
  currentStep = step;

  document.querySelectorAll('.onboarding-step').forEach(el => {
    el.style.display = 'none';
  });

  const stepElement = document.getElementById(`step-${step}`);
  if (stepElement) {
    stepElement.style.display = 'block';
  }

  document.querySelectorAll('.stepper-step').forEach(el => {
    el.classList.remove('active', 'completed');
    const stepNum = parseInt(el.dataset.step);
    if (stepNum < step) {
      el.classList.add('completed');
    } else if (stepNum === step) {
      el.classList.add('active');
    }
  });

  if (step === 2 && teams.length === 0) {
    loadTeams();
  }
};

const completeOnboarding = async () => {
  if (!selectedTeamId) return;

  const completeBtn = document.getElementById('complete-btn');
  if (!completeBtn) return;

  const originalText = completeBtn.textContent;
  completeBtn.disabled = true;
  completeBtn.textContent = 'Saving...';

  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const profileRef = doc(db, 'profiles', user.uid);
    await updateDoc(profileRef, {
      favoriteTeam: selectedTeamId,
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    });

    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('Error completing onboarding:', error);
    alert('Failed to save your selection. Please try again.');
    completeBtn.disabled = false;
    completeBtn.textContent = originalText;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkOnboardingStatus();

  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const completeBtn = document.getElementById('complete-btn');
  const teamSearch = document.getElementById('team-search');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToStep(2));
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => goToStep(1));
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', completeOnboarding);
  }

  if (teamSearch) {
    teamSearch.addEventListener('input', e => {
      const query = e.target.value.toLowerCase().trim();
      const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(query)
      );
      renderTeamsGrid(filteredTeams);
    });
  }
});
