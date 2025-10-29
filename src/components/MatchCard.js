const MatchCard = match => {
  return dom.create(
    'div',
    { className: 'card' },
    [
      dom.create('h3', { className: 'card-title' }, [
        `${match.homeTeam} vs ${match.awayTeam}`,
      ]),
      dom.create('p', {}, [
        `📅 ${new Date(match.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
      ]),
      dom.create('p', {}, [
        `🕐 ${new Date(match.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      ]),
      dom.create('p', {}, [`🏟️ ${match.venue}`]),
      dom.create(
        'p',
        {
          className: 'badge',
          style: `
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background-color: ${
            match.status === 'live'
              ? '#c1272d'
              : match.status === 'finished'
                ? '#006233'
                : '#d4af37'
          };
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
        `,
        },
        [match.status.toUpperCase()]
      ),
      match.homeScore !== null
        ? dom.create('p', { style: 'font-size: 1.5rem; font-weight: bold;' }, [
            `${match.homeScore} - ${match.awayScore}`,
          ])
        : null,
    ].filter(Boolean)
  );
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MatchCard };
}
