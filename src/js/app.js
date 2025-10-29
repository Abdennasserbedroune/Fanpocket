document.addEventListener('DOMContentLoaded', async () => {
  console.log('AFCON 2025 Marrakech MVP - App initialized');

  const loadMatches = async () => {
    const matchesContainer = dom.qs('#matches-container');
    if (!matchesContainer) return;

    const { data, error } = await api.get('/data/matches.json');

    if (error) {
      matchesContainer.innerHTML = `<p class="text-center">Error loading matches: ${error}</p>`;
      return;
    }

    if (data && data.matches && data.matches.length > 0) {
      dom.empty(matchesContainer);
      data.matches.forEach(match => {
        const matchCard = dom.create('div', { className: 'card' }, [
          dom.create('h3', { className: 'card-title' }, [
            `${match.homeTeam} vs ${match.awayTeam}`,
          ]),
          dom.create('p', {}, [
            `Date: ${new Date(match.date).toLocaleString()}`,
          ]),
          dom.create('p', {}, [`Venue: ${match.venue}`]),
          dom.create('p', {}, [`Status: ${match.status}`]),
        ]);
        matchesContainer.appendChild(matchCard);
      });
    }
  };

  const loadUpdates = async () => {
    const updatesContainer = dom.qs('#updates-container');
    if (!updatesContainer) return;

    const { data, error } = await api.get('/data/updates.json');

    if (error) {
      updatesContainer.innerHTML = `<p class="text-center">Error loading updates: ${error}</p>`;
      return;
    }

    if (data && data.updates && data.updates.length > 0) {
      dom.empty(updatesContainer);
      data.updates.forEach(update => {
        const updateCard = dom.create('div', { className: 'card' }, [
          dom.create('h3', { className: 'card-title' }, [update.title]),
          dom.create('p', {}, [update.content]),
          dom.create('p', { className: 'text-muted' }, [
            new Date(update.timestamp).toLocaleString(),
          ]),
        ]);
        updatesContainer.appendChild(updateCard);
      });
    }
  };

  const loadTeamsStats = async () => {
    const statsContainer = dom.qs('#stats-container');
    if (!statsContainer) return;

    const { data, error } = await api.get('/data/teams_stats.json');

    if (error) {
      statsContainer.innerHTML = `<p class="text-center">Error loading stats: ${error}</p>`;
      return;
    }

    if (data && data.teams && data.teams.length > 0) {
      dom.empty(statsContainer);
      data.teams.forEach(team => {
        const teamCard = dom.create('div', { className: 'card' }, [
          dom.create('h3', { className: 'card-title' }, [team.name]),
          dom.create('p', {}, [`Wins: ${team.stats.wins}`]),
          dom.create('p', {}, [`Draws: ${team.stats.draws}`]),
          dom.create('p', {}, [`Losses: ${team.stats.losses}`]),
          dom.create('p', {}, [`Goals: ${team.stats.goalsFor}`]),
        ]);
        statsContainer.appendChild(teamCard);
      });
    }
  };

  if (
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html'
  ) {
    await loadMatches();
    await loadUpdates();
    await loadTeamsStats();
  }

  const loginForm = dom.qs('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = dom.qs('#email', loginForm).value;
      const password = dom.qs('#password', loginForm).value;
      console.log('Login attempt:', { email, password });
      window.location.href = '/dashboard.html';
    });
  }

  const registerForm = dom.qs('#register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = dom.qs('#name', registerForm).value;
      const email = dom.qs('#email', registerForm).value;
      const password = dom.qs('#password', registerForm).value;
      console.log('Register attempt:', { name, email, password });
      window.location.href = '/onboarding.html';
    });
  }

  const resetForm = dom.qs('#reset-form');
  if (resetForm) {
    resetForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = dom.qs('#email', resetForm).value;
      console.log('Password reset for:', email);
      alert('Password reset link sent to your email!');
    });
  }
});
