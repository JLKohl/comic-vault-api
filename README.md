# Comic Vault API

RESTful API for managing comic characters, issues, story arcs, and worlds.

This project was developed as a collaborative backend project and demonstrates building and documenting a RESTful API using Node.js, Express, and Swagger.

## Swagger API Documentation

This project uses `swagger-autogen` to generate `swagger-output.json`.

### Generate Documentation

```bash
npm run swagger
```

### Start the API

```bash
node server.js
```

The server provides Swagger UI using the generated API documentation.

## Development Notes

Whenever routes are added or modified, run:

```bash
npm run swagger
```

to keep the API documentation up to date.

## Technologies

* Node.js
* Express
* REST API
* Swagger / swagger-autogen
* MongoDB

## Project Status

This project is no longer actively deployed. The source code is available here on GitHub for review.

