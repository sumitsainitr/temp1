## NestJS Document Management System

This project implements a backend service using NestJS for managing users, documents, and an ingestion process. It includes:

- User Authentication and Role-based Access Control (RBAC)
- Document CRUD operations with file upload support
- Ingestion trigger and status management
- Integration with AWS S3 for file storage
- PostgreSQL database with TypeORM for persistence

## Instalation

Clone the repo & in root directory create an `.env` file with following keys

```
# Application
PORT=3000

# JWT
JWT_SECRET=jwt_secret
JWT_EXPIRATION=3600

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=db_user
DB_PASSWORD=db_password
DB_NAME=document_management

# AWS S3
AWS_REGION=aws_region
AWS_ACCESS_KEY_ID=access_key_id
AWS_SECRET_ACCESS_KEY=secret_access_key
AWS_BUCKET_NAME=bucket_name

```

then in terminal run following cmds

```
yarn
```

run migrations

```
yarn typeorm:run
```

build the application

```
yarn build
```

finally run

```
yarn start:prod
```

---

## API Endpoints

##### Authentication

`POST /auth/register` - Register a new user.
`POST /auth/login` - Login and receive a JWT token.

##### User Management

`GET /users` - List all users (Admin only).
`PATCH /users/:id` - Update user details (Admin only).
`DELETE /users/:id` - Delete a user (Admin only).

##### Document Management

`POST /documents/upload` - Upload a document.
`GET /documents/:id` - Retrieve a document.
`DELETE /documents/:id` - Delete a document.

##### Ingestion

`POST /ingestion/trigger/:documentId` - Trigger the ingestion process for a document.
`GET /ingestion/status/:pid` - Get the status of an ongoing ingestion process.
