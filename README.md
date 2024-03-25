# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Running application on your local machine

Create .env folder and copy contents of .env.example. You can then configure your app, for example, changing the port.

```
npm install
```

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
If you set a different port in .env, please navigate to http://localhost:{PORT}/doc where PORT is one your app is using.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running application using Docker

Create .env folder and copy contents of .env.example

Run docker compose up. During the launch of the app, Prisma client will be generated, and migration script will run.

If you make any changes in the app, your Docker container will restart

Use npm run test to verify app is working as expected

Run docker compose images to see image size for nodejs2024q1-service-app-1 doesn't exceed 500MB

Run scan:db and scan:web to scan your containers for vulnerabilities

## Available endpoints

- `Users` (`/user` route)

  - `GET /user` - get all users
  - `GET /user/:id` - get single user by id
  - `POST /user` - create user (following DTO should be used)
  - `PUT /user/:id` - update user's password
  - `DELETE /user/:id` - delete user

  - `Tracks` (`/track` route)

    - `GET /track` - get all tracks
    - `GET /track/:id` - get single track by id
    - `POST /track` - create new track
    - `PUT /track/:id` - update track info
    - `DELETE /track/:id` - delete track

  - `Artists` (`/artist` route)

    - `GET /artist` - get all artists
    - `GET /artist/:id` - get single artist by id
    - `POST /artist` - create new artist
    - `PUT /artist/:id` - update artist info
    - `DELETE /artist/:id` - delete album

  - `Albums` (`/album` route)

    - `GET /album` - get all albums
    - `GET /album/:id` - get single album by id
    - `POST /album` - create new album
    - `PUT /album/:id` - update album info
    - `DELETE /album/:id` - delete album

  - `Favorites`
    - `GET /favs` - get all favorites
    - `POST /favs/track/:id` - add track to the favorites
    - `DELETE /favs/track/:id` - delete track from favorites
    - `POST /favs/album/:id` - add album to the favorites
    - `DELETE /favs/album/:id` - delete album from favorites
    - `POST /favs/artist/:id` - add artist to the favorites
    - `DELETE /favs/artist/:id` - delete artist from favorites

For more details on models and reponses see Swagger documentation

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
