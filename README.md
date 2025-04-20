# Retirement Planner (WIP)

This is a work-in-progress web application to help users model retirement savings over time.

Built with:
- Ruby on Rails (API backend)
- React (frontend, via ESBuild)
- SCSS Modules for styling
- Jest and Testing Library for unit tests

## Current Features

- Dynamic simulation form (create/update retirement projections)
- Supports POST and PUT requests to `/simulations`
- Form validation, loading states, and basic result display
- Modular SCSS styling for a clean UI
- Extensive Jest tests covering all major scenarios

## Local Setup

1. Install dependencies:

```bash
bundle install
npm install
```

2. Run the app in development:

```bash
bin/dev
```

This runs both the Rails server and the ESBuild watcher for JavaScript.

3. Run tests:

```bash
npm test
```

## Notes

- This is not yet hooked up to a database or persisted backend.
- Styling is intentionally minimal and modular.
- This app is intended to showcase full-stack skills with React and Rails.
