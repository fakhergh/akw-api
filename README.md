# Compliance Workflow API

A REST API server for managing user authentication, user management, and KYC (Know Your Customer) user submissions. Built using Express.js, Typegoose, MongoDB, and routing-controllers with auto-generated Swagger documentation for seamless integration and testing.

## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Node.js** (v18 or higher) – JavaScript runtime environment.
- **MongoDB** – Database for storing application data. You can use a local MongoDB instance or a cloud-based service like MongoDB Atlas.

If you're working on a development machine, ensure that MongoDB is running locally, or you have a cloud-based MongoDB URI ready.

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/fakhergh/akw-api.git
    cd akw-api
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables by creating a `.env` file in the root of your project. The file should include:

    ### Environment Variables

    #### Server:

    ```env
    PORT=9000
    NODE_ENV=development
    DOMAIN_NAME=http://localhost:9000
    ```

    #### Database:

    ```env
    DATABASE_URI=mongodb://localhost:27017/yourdatabase
    DATABASE_NAME=yourdatabase
    ```

    #### JWT:

    ```env
    ACCESS_TOKEN_SECRET=my-secret
    ACCESS_TOKEN_EXPIRES_IN=1d

    REFRESH_TOKEN_SECRET=my-refresh-secret
    REFRESH_TOKEN_EXPIRES_IN=7d
    ```

    - **`PORT`**: The port your server will run on.
    - **`NODE_ENV`**: The environment for the app (development/production).
    - **`DOMAIN_NAME`**: The base domain for your application (useful for CORS and API integrations).
    - **`DATABASE_URI`**: The URI for your MongoDB database.
    - **`ACCESS_TOKEN_SECRET`**: Secret key for signing access tokens.
    - **`ACCESS_TOKEN_EXPIRES_IN`**: Expiration time for the access token.
    - **`REFRESH_TOKEN_SECRET`**: Secret key for signing refresh tokens.
    - **`REFRESH_TOKEN_EXPIRES_IN`**: Expiration time for the refresh token.

4. Run MongoDB migration to set up your database schema:

    ```bash
    npm run db:up
    ```

## Available Commands

Here are some of the available npm commands to manage the project:

### Development

- **Run the app in development mode**:
    ```bash
    npm run dev
    ```
    This will start the server and watch for file changes.

### Build and Production

- **Build the app for production**:

    ```bash
    npm run build
    ```

- **Start the app in production mode**:
    ```bash
    npm run start
    ```

### Database Migration

- **Create a new migration**:

    ```bash
    npm run db:add
    ```

- **Run migrations** (apply all pending migrations):

    ```bash
    npm run db:up
    ```

- **Revert the last migration**:

    ```bash
    npm run db:down
    ```

- **Check the migration status**:
    ```bash
    npm run db:status
    ```

### Testing

- **Run unit tests**:

    ```bash
    npm run test
    ```

- **Run tests in watch mode**:

    ```bash
    npm run test:watch
    ```

- **Run tests with coverage reporting**:
    ```bash
    npm run test:cov
    ```

### Code Quality

- **Check code quality with ESLint and Prettier**:

    ```bash
    npm run static:check
    ```

- **Automatically fix linting and formatting issues**:

    ```bash
    npm run static:fix
    ```

- **Check for circular dependencies**:

    ```bash
    npm run circular:check
    ```

- **Generate a circular dependency graph**:
    ```bash
    npm run circular:generate
    ```

## Project File Structure

```plaintext
├── src/
│   ├── authentication/        # Authentication-related logic (e.g., authentication, current user)
│   ├── controllers/           # API controllers
│   ├── dtos/                  # Common Data Transfer Objects (DTOs)
│   ├── database/              # Database-related logic and connection (e.g., MongoDB setup)
│   ├── errors/                # Custom error classes
│   ├── middlewares/           # Middlewares (e.g., error handling, secure headers, request logging)
│   ├── models/                # Mongoose models for various entities
│   ├── services/              # Business logic and service layer
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions (e.g., date formatting, jwt helpers)
│   ├── config/                # Configuration files (e.g., environment variables, database config)
│   └── index.ts               # Main entry point to initialize the server and routing
├── .env                       # Environment variables for local setup
├── .gitignore                 # Files to ignore in version control
├── .prettierrc                # Prettier configuration file
├── eslint.config.mjs          # ESLint configuration file
├── migrate-mongo-config.js    # MongoDB migration configuration file
├── nodemon.json               # Nodemon configuration file
├── jest.config.js             # Jest configuration for testing
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
├── tsconfig.json              # TypeScript configuration
└── LICENSE                    # Project license
```

## Developer Workflow

1. **Clone the repository** and install dependencies as mentioned in the **Setup** section.

2. **Work on your changes** in the appropriate files (controllers, routes, services, etc.).

3. **Test your changes**:

    - Write unit tests for any new features or bug fixes.
    - Run tests using `npm run test` to ensure everything works.

4. **Code quality checks**:

    - Use `npm run static:check` to ensure your code follows the project's linting and formatting standards.
    - Use `npm run static:fix` to automatically fix any linting issues.

5. **Commit your changes**:

    - Use **Husky** hooks to run pre-commit checks automatically.
    - Make sure your commit messages are clear and follow the conventional commit style.

6. **Push your changes** to your feature branch and create a pull request (PR) for review.

7. **Resolve conflicts** if any, and merge the PR once it is reviewed.

## Developer Guide

- **Controllers**: The main business logic for handling incoming API requests is defined in the `controllers` folder.

    - Use decorators like `@Get()`, `@Post()`, `@Put()`, etc., to define the routes.
    - Each controller can be bound to a specific route path, e.g., `/users`, `/auth`, `/kyc`.

- **Services**: Business logic related to data processing and manipulation should be placed in the `services` folder. Controllers should delegate business logic to services.

- **Models**: Use Typegoose to define MongoDB models in the `models` folder. Models should follow TypeScript's `@modelOptions` decorator.

- **Validation**: Use class-validator for input validation. It can be used with routing-controllers and is integrated into the controllers automatically.

- **Error Handling**: Standardize error handling across the app. Ensure errors are caught and meaningful HTTP status codes are returned.

## API Documentation

Swagger UI for your API documentation is available at `/docs`. The documentation is automatically generated based on the controller annotations.

To access it, ensure your server is running and visit:
