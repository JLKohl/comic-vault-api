# comic-vault-api

RESTful API for managing comic characters, issues, story arcs, and worlds.

## API Documentation

Swagger UI is available at:

`http://localhost:3000/api-docs`

If you run the app on a different port, replace `3000` with your configured `PORT` value.

## Swagger Autogen Setup

This project uses `swagger-autogen` to generate `swagger-output.json`.

1. Generate docs:

`npm run swagger`

2. Start the API:

`node server.js`

`server.js` serves Swagger UI from the generated `swagger-output.json` file.

Whenever you add or change routes, run `npm run swagger` again to refresh docs.
