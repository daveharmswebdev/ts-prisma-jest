# Film API Service

## Overview

This project provides a simple Film API service built using **Node.js**, **Express**, and **TypeScript**. It includes functionality for fetching films by ID and utilizes a modular architecture with services, helpers, and proper error handling.

The project demonstrates how to write clean, testable code with unit tests written using **Jest** and **jest-mock-extended**.

---

## Features

- Retrieve a film by its ID.
- Modular, reusable helper functions for constructing database query arguments.
- Error handling for API stability and improved developer experience.
- Unit tests to ensure reliability using Jest.

---

## Installation

Make sure you have **Node.js** and **npm** installed on your machine.

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

---

## Scripts

The following scripts are available in the `package.json` file:

- **Start App** (development mode):
  ```bash
  npm start
  ```

- **Run Tests**:
  ```bash
  npm test
  ```

- **Run Linter**:
  ```bash
  npm run lint
  ```

- **Run TypeScript compiler**:
  ```bash
  npm run build
  ```

- **Run App in Watch Mode** (development):
  ```bash
  npm run dev
  ```

---

## Project Structure

Here’s a high-level overview of how the project is structured:

```plaintext
src/
├── controllers/         # Express controllers for handling API requests
│   └── getFilmById.ts   # Controller for fetching a film by its ID
│
├── services/            # Encapsulated business logic and API calls
│   ├── film.service.ts  # Methods to fetch film data
│   └── helpers/         # Helper methods to prepare query arguments
│       └── getFilmFindUniqueArgs.ts
│
├── __tests__/           # Unit tests for the codebase
│   └── getFilmById.test.ts
│
├── app.ts               # Express setup and middleware
├── server.ts            # Entry point of the application
│
└── package.json         # Project configuration and dependencies
```
---

## Usage

### Running the Server Locally

To run the API service locally:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The server will run at `http://localhost:3000` by default. You can configure the port in `server.ts`.

---

### API Endpoint

#### Get Film by ID

**URL**: `/api/films/:id`  
**Method**: `GET`

**Description**: Fetches a film by its ID.

**Response**:
- **200 OK**: Returns the film details in JSON format.
- **500 Internal Server Error**: Returns a generic error message if the request fails.

##### Example Request:

```bash
curl -X GET http://localhost:3000/api/films/1
```

##### Example Successful Response:

```json
{
  "id": "1",
  "title": "Film Title",
  "description": "Some description about the film."
}
```

---

## Unit Testing

This project includes unit tests using **Jest** and `jest-mock-extended`.

### Running Tests

To run all tests, execute:

```bash
npm test
```

### Test Coverage

You can also generate a test coverage report using:

```bash
npm run test:coverage
```

Webstorm Test Config

```bash
--config jest.unit.config.js
```
---

## Development

### Prettier

Run Prettier to format the code:

```bash
npm run format
```

### Linting

To run the linter and check for code issues:

```bash
npm run lint
```

### TypeScript Compilation

Compile the TypeScript codebase:

```bash
npm run build
```

### Hot-Reloading with ts-node-dev

Use the following command to start the app in development mode (with hot-reloading enabled):

```bash
npm run dev
```

---

## Dependencies

The project uses the following major dependencies:

- **Express**: Web server for handling API requests.
- **TypeScript**: Static typing for JavaScript.
- **Jest**: For writing and running unit tests.
- **jest-mock-extended**: Simplifies mocking in Jest.

Other dependencies are listed in `package.json`.

---

## Testing Framework

The project is fully tested using **Jest**. Mock dependencies ensure isolated testing of individual components, especially for services and controllers.

Some key tests:
- Controller: `getFilmById` response structure and error handling.
- Service helpers: Ensures proper query argument generation.

---

## Future Improvements

- Add integration tests to verify end-to-end API functionality.
- Introduce a database layer (e.g., Prisma).
- Enhance API features such as filtering and pagination.
- Use environment variables for configuration (e.g., port, database credentials).
- Create Docker setup for containerized deployment.

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new feature branch from `main`.
3. Submit your pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
