# Mini CRM Backend

Backend Developer Intern Assignment for Prysm Labs.
Built with Node.js (Express), TypeScript, Prisma, and PostgreSQL.

## Features
- **Authentication**: JWT-based auth with RBAC (Admin, Employee).
- **Users**: Admin can manage user roles.
- **Customers**: CRUD operations with pagination and search.
- **Tasks**: Task management with assignment linking.
- **Documentation**: Swagger UI at `/api-docs`.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (or Docker)

## Setup

1.  **Clone and Install**
    ```bash
    git clone <repo_url>
    cd minicrm-backend
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and update `DATABASE_URL`.
    ```bash
    cp .env.example .env
    ```

    *If using Docker:*
    ```bash
    docker-compose up -d
    # Update .env DATABASE_URL to: postgresql://admin:password123@localhost:5432/minicrm?schema=public
    ```

3.  **Database Setup**
    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Helper: If using local DB, push schema
    npx prisma db push
    # OR run migrations
    # npx prisma migrate dev --name init
    ```

4.  **Run Server**
    ```bash
    # Development
    npm run dev

    # Build & Start
    npm run build
    npm start
    ```

## API Documentation
Access Swagger UI at: `http://localhost:3000/api-docs`

## Testing
Import `postman_collection.json` into Postman to test all endpoints.

## Project Structure
- `src/controllers`: Request handlers.
- `src/services`: Business logic.
- `src/routes`: API routes.
- `src/middlewares`: Auth and Validation.
- `src/dtos`: Data Transfer Objects (Validation).
- `prisma`: Database schema.
