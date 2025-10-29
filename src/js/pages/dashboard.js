import { getCurrentUser, logout, getUserProfile } from '../auth.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { db } from '../firebase.js';
import {
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

initAuthGuard();

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const loadTeamData = async teamId => {
  if (!teamId) return null;

  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (teamDoc.exists()) {
      return teamDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading team data:', error);
    return null;
  }
};

const displayTeamStats = teamData => {
  const teamStatsSection = document.getElementById('team-stats-section');
  const teamStatsGrid = document.getElementById('team-stats-grid');

  if (!teamData || !teamStatsGrid) return;

  teamStatsGrid.innerHTML = `
    <div class="card">
      <h3 class="card-title">Team</h3>
      <p style="font-size: 2rem; margin: 1rem 0">${teamData.flag || '⚽'}</p>
      <p style="font-weight: 600">${teamData.name}</p>
    </div>
    <div class="card">
      <h3 class="card-title">Titles</h3>
      <p style="font-size: 2rem; margin: 1rem 0; font-weight: 600">${teamData.titles}</p>
      <p>Championship wins</p>
    </div>
    <div class="card">
      <h3 class="card-title">Appearances</h3>
      <p style="font-size: 2rem; margin: 1rem 0; font-weight: 600">${teamData.appearances}</p>
      <p>Tournament entries</p>
    </div>
    <div class="card">
      <h3 class="card-title">Best Finish</h3>
      <p style="font-size: 1.25rem; margin: 1rem 0; font-weight: 600">${teamData.bestFinish}</p>
    </div>
    <div class="card">
      <h3 class="card-title">AFCON 2025 Group</h3>
      <p style="font-size: 2rem; margin: 1rem 0; font-weight: 600">Group ${teamData.group2025}</p>
    </div>
  `;

  teamStatsSection.style.display = 'block';
};

const loadFixtures = async favoriteTeam => {
  const fixturesGrid = document.getElementById('fixtures-grid');
  if (!fixturesGrid) return;

  try {
    const response = await fetch('/data/matches.json');
    const data = await response.json();

    if (!data.matches || data.matches.length === 0) {
      fixturesGrid.innerHTML = `
        <div class="card">
          <p style="text-align: center; color: #666">No fixtures available</p>
        </div>
      `;
      return;
    }

    let matches = data.matches;

    if (favoriteTeam) {
      matches = matches.filter(
        match =>
          match.homeTeam.toLowerCase() === favoriteTeam.toLowerCase() ||
          match.awayTeam.toLowerCase() === favoriteTeam.toLowerCase()
      );
    }

    const groupMatches = matches.filter(match => match.round === 'group').slice(0, 3);

    if (groupMatches.length === 0) {
      fixturesGrid.innerHTML = `
        <div class="card">
          <p style="text-align: center; color: #666">No upcoming fixtures for your team</p>
        </div>
      `;
      return;
    }

    fixturesGrid.innerHTML = groupMatches
      .map(
        match => `
      <div class="card">
        <h3 class="card-title">${match.homeTeam} vs ${match.awayTeam}</h3>
        <p style="margin: 0.5rem 0"><strong>${formatDate(match.date)}</strong></p>
        <p style="color: #666">${match.venue}</p>
        <p style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: #f5f5f5; border-radius: 4px; display: inline-block; font-size: 0.875rem">Group ${match.group}</p>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error loading fixtures:', error);
    fixturesGrid.innerHTML = `
      <div class="card">
        <p style="text-align: center; color: #c1272d">Failed to load fixtures</p>
      </div>
    `;
  }
};

const loadUpdates = async () => {
  const updatesGrid = document.getElementById('updates-grid');
  if (!updatesGrid) return;

  try {
    const response = await fetch('/data/updates.json');
    const data = await response.json();

    if (!data.updates || data.updates.length === 0) {
      updatesGrid.innerHTML = `
        <div class="card">
          <p style="text-align: center; color: #666">No updates available</p>
        </div>
      `;
      return;
    }

    const updates = data.updates.slice(0, 5);

    updatesGrid.innerHTML = updates
      .map(
        update => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem">
          <h3 class="card-title" style="margin: 0">${update.title}</h3>
          ${update.priority === 'high' ? '<span style="background: #c1272d; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600">HIGH</span>' : ''}
        </div>
        <p style="color: #666; font-size: 0.875rem; margin-bottom: 0.75rem">${new Date(update.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <p>${update.content}</p>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error loading updates:', error);
    updatesGrid.innerHTML = `
      <div class="card">
        <p style="text-align: center; color: #c1272d">Failed to load updates</p>
      </div>
    `;
  }
};

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
    const greetingTitle = document.getElementById('greeting-title');

    try {
      const profile = await getUserProfile(user.uid);
      const displayName =
        profile?.displayName || user.email?.split('@')[0] || 'User';

      if (welcomeElement) {
        welcomeElement.textContent = `Welcome back, ${displayName}! Here's your personalized AFCON 2025 experience.`;
      }

      if (profile?.favoriteTeam) {
        const teamData = await loadTeamData(profile.favoriteTeam);
        if (teamData) {
          if (greetingTitle) {
            greetingTitle.innerHTML = `Welcome back, ${displayName}! ${teamData.flag || ''}`;
          }
          displayTeamStats(teamData);
        }

        await loadFixtures(teamData?.name || profile.favoriteTeam);
      } else {
        await loadFixtures(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (welcomeElement) {
        welcomeElement.textContent = `Welcome back!`;
      }
      await loadFixtures(null);
    }

    await loadUpdates();
  }
});
