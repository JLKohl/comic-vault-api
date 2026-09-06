# comic-vault-api

RESTful API for managing comic characters, issues, story arcs, and worlds.

## Swagger Autogen Setup

This project uses `swagger-autogen` to generate `swagger-output.json`.

### Generate documentation
npm run swagger

### Start the API
node server.js

The server serves Swagger UI from the generated `swagger-output.json` file.

## Note

Whenever routes are added or modified, re-run:
npm run swagger

to keep API documentation up to date.

## Technologies

Node.js • Express • REST API • Swagger (swagger-autogen) • Render deployment
