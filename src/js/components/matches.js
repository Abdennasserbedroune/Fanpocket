const initMatches = async () => {
  const matchesContainer = dom.qs('#matches-container');
  const teamFilter = dom.qs('#team-filter');

  if (!matchesContainer || !teamFilter) return;

  const { data, error } = await api.get('/data/matches.json');

  if (error) {
    matchesContainer.innerHTML = `<p class="loading">Error loading matches: ${error}</p>`;
    return;
  }

  if (!data || !data.matches || data.matches.length === 0) {
    matchesContainer.innerHTML = `<p class="loading">No matches available.</p>`;
    return;
  }

  const matches = data.matches;

  const teams = new Set();
  matches.forEach(match => {
    teams.add(match.homeTeam);
    teams.add(match.awayTeam);
  });

  Array.from(teams)
    .sort()
    .forEach(team => {
      const option = dom.create('option', { value: team }, [team]);
      teamFilter.appendChild(option);
    });

  const renderMatches = filterTeam => {
    const filteredMatches = filterTeam
      ? matches.filter(
          match =>
            match.homeTeam === filterTeam || match.awayTeam === filterTeam
        )
      : matches;

    if (filteredMatches.length === 0) {
      matchesContainer.innerHTML = `<p class="loading">No matches found for the selected team.</p>`;
      return;
    }

    dom.empty(matchesContainer);

    filteredMatches.forEach(match => {
      const matchDate = new Date(match.date);
      const dateOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const timeOptions = { hour: '2-digit', minute: '2-digit' };

      const formattedDate = matchDate.toLocaleDateString('en-US', dateOptions);
      const formattedTime = matchDate.toLocaleTimeString('en-US', timeOptions);

      const matchCard = dom.create('article', { className: 'match-card' }, [
        dom.create('h3', { className: 'match-teams' }, [
          `${match.homeTeam} vs ${match.awayTeam}`,
        ]),
        dom.create('p', { className: 'match-info' }, [
          `📅 ${formattedDate} at ${formattedTime}`,
        ]),
        dom.create('p', { className: 'match-venue' }, [`📍 ${match.venue}`]),
        dom.create(
          'span',
          {
            className: `match-status ${match.status}`,
          },
          [match.status]
        ),
      ]);

      if (match.ticketUrl) {
        const ticketLink = dom.create(
          'a',
          {
            href: match.ticketUrl,
            className: 'match-ticket-link',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          ['🎟️ Get Tickets']
        );
        matchCard.appendChild(ticketLink);
      }

      matchesContainer.appendChild(matchCard);
    });
  };

  renderMatches('');

  teamFilter.addEventListener('change', e => {
    renderMatches(e.target.value);
  });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMatches };
}
