# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal Express.js API starter project using Express 5.1.0 and CommonJS modules.

## Development Commands

**Start the server:**
```bash
node app.js
```

**Install dependencies:**
```bash
npm install
```

## Architecture

- `app.js` - Main application entry point
- Express 5.1.0 with CommonJS module system (`"type": "commonjs"` in package.json)

## Common Express Patterns

When implementing routes and middleware:
- Use `app.listen(port)` to start the server
- Define routes with `app.get()`, `app.post()`, etc.
- Use `express.json()` middleware for parsing JSON request bodies
- Use `express.static()` for serving static files
- Implement error handling middleware as the last middleware: `app.use((err, req, res, next) => {...})`
