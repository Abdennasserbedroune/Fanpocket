# Components

This directory contains reusable UI components built with vanilla JavaScript using the DOM utility functions.

## Example: MatchCard

```javascript
const MatchCard = match => {
  return dom.create('div', { className: 'card' }, [
    dom.create('h3', { className: 'card-title' }, [
      `${match.homeTeam} vs ${match.awayTeam}`,
    ]),
    // ... more elements
  ]);
};
```

## Usage

```javascript
// In app.js or other files
const match = {
  homeTeam: 'Morocco',
  awayTeam: 'Egypt',
  date: '2025-01-15T20:00:00Z',
  venue: 'Stade de Marrakech',
  status: 'scheduled',
};

const matchCard = MatchCard(match);
document.querySelector('#container').appendChild(matchCard);
```

## Component Patterns

### 1. Pure Functions

Components should be pure functions that take data as input and return DOM elements.

### 2. Using DOM Utilities

Always use the `dom` utility object for DOM manipulation:

- `dom.create()` - Create elements
- `dom.qs()` - Query selector
- `dom.qsa()` - Query all
- `dom.on()` - Event listeners

### 3. Styling

Use existing CSS classes from `main.css` or add component-specific styles.

### 4. Event Handlers

Pass event handlers as props or add them using `dom.on()`:

```javascript
const Button = ({ text, onClick }) => {
  return dom.create(
    'button',
    {
      className: 'btn btn-primary',
      onClick: onClick,
    },
    [text]
  );
};
```

## Creating New Components

1. Create a new file in this directory (e.g., `TeamCard.js`)
2. Export the component function
3. Document usage and props
4. Import and use in your pages
