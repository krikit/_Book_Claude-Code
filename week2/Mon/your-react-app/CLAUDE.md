# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Standard Create React App (CRA) project bootstrapped with `create-react-app`. This is a minimal React application using React 19.2.0 with standard CRA tooling and configuration.

## Development Commands

### Essential Commands
- `npm start` - Start development server at http://localhost:3000 with hot reload
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Create production build in `build/` directory

### Testing
- Run all tests: `npm test`
- Tests use Jest and React Testing Library (@testing-library/react)
- Test files follow `*.test.js` naming convention

## Project Structure

```
src/
  ├── App.js           - Main application component
  ├── App.css          - Application styles
  ├── App.test.js      - Application tests
  ├── index.js         - React entry point with ReactDOM.createRoot
  ├── index.css        - Global styles
  ├── setupTests.js    - Jest configuration
  └── reportWebVitals.js - Performance monitoring
public/
  ├── index.html       - HTML template
  ├── manifest.json    - PWA configuration
  └── [static assets]
```

## Architecture Notes

- **React 19**: Uses modern React 19.2.0 with `ReactDOM.createRoot` API
- **Testing**: Configured with Jest, React Testing Library, and jest-dom matchers
- **Build Tool**: Uses react-scripts 5.0.1 (abstracted webpack configuration)
- **Linting**: ESLint configured via react-app preset (extends from react-app/jest)

## Key Dependencies

- React 19.2.0 and React DOM 19.2.0
- react-scripts 5.0.1 (handles build, dev server, testing)
- Testing: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- Performance: web-vitals for Core Web Vitals monitoring

## Important Notes

- **No eject**: Configuration is abstracted by react-scripts. Avoid `npm run eject` unless absolutely necessary
- **Browser support**: Configured for modern browsers (last versions of Chrome/Firefox/Safari in dev, >0.2% usage in production)
- **Hot reload**: Development server automatically reloads on file changes
