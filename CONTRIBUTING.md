# Contributing to AFCON 2025 Marrakech MVP

Thank you for your interest in contributing to the AFCON 2025 Marrakech MVP! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/afcon2025-marrakech-mvp.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Workflow

1. Make your changes
2. Test locally: `npm run dev`
3. Format code: `npm run format`
4. Check formatting: `npm run lint`
5. Build: `npm run build`
6. Commit with descriptive message
7. Push to your fork
8. Create a pull request

## Code Style

- We use **Prettier** for code formatting
- Always run `npm run format` before committing
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Keep functions small and focused

## CSS Guidelines

- Use CSS variables for colors, spacing, and typography
- Mobile-first approach (start with mobile styles, add media queries for larger screens)
- Use semantic class names (e.g., `.card`, `.btn-primary`)
- Avoid inline styles in HTML

## JavaScript Guidelines

- Use modern ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Add comments only for complex logic
- Keep functions pure when possible
- Handle errors gracefully

## HTML Guidelines

- Use semantic HTML5 elements
- Include proper meta tags
- Ensure accessibility (alt text, ARIA labels, skip links)
- Test with keyboard navigation

## Commit Messages

Follow conventional commit format:

- `feat: Add new feature`
- `fix: Fix bug description`
- `docs: Update documentation`
- `style: Code style changes`
- `refactor: Code refactoring`
- `test: Add or update tests`
- `chore: Maintenance tasks`

## Pull Request Process

1. Ensure all tests pass and code is formatted
2. Update documentation if needed
3. Describe your changes clearly in the PR description
4. Link any related issues
5. Request review from maintainers
6. Address review feedback promptly

## Questions?

Open an issue for discussion or reach out to the maintainers.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.
