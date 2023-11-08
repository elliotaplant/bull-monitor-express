# Bull Queue Monitor

A monitoring interface for Bull Queues. It utilizes `@bull-monitor/express` for the web UI and connects to Redis to dynamically fetch and display Bull queues.

## Features

- Web-based UI for monitoring Bull queues
- Automatically discovers queues on startups
- Endpoints for updating queue list dynamically

## Getting Started

- Before running the application, ensure you have a `REDIS_URL` in your environment
- Run `npm start` to develop locally
- Visit the UI at http://localhost:4444/ui
