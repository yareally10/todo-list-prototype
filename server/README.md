# Todo List API Server

FastAPI backend server providing REST API endpoints for todo list management with PostgreSQL database integration.

## Features

- **RESTful API** - Complete CRUD operations for users, lists, and tasks
- **Database Integration** - PostgreSQL with SQLAlchemy ORM
- **Environment-based CORS** - Configurable cross-origin resource sharing
- **Password Security** - SHA-256 password hashing
- **Data Validation** - Pydantic schemas for request/response validation
- **Auto-generated Documentation** - Swagger UI and ReDoc
- **Relational Data Model** - Users → Lists → Tasks hierarchy

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Primary database
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server implementation

## Project Structure

```
server/
├── main.py           # FastAPI application and route definitions
├── models.py         # SQLAlchemy database models
├── schemas.py        # Pydantic request/response schemas
├── database.py       # Database connection and session management
├── requirements.txt  # Python dependencies
├── Dockerfile       # Container configuration
└── README.md        # This file
```

## Database Schema

### Users Table
```sql
- id (Primary Key, Serial)
- email (VARCHAR, Unique, Indexed)
- username (VARCHAR, Unique, Indexed) 
- password_hash (VARCHAR)
- created_at, updated_at (Timestamps)
```

### Lists Table
```sql
- id (Primary Key, Serial)
- name (VARCHAR, Indexed)
- description (TEXT, Optional)
- user_id (Foreign Key → users.id, Indexed)
- created_at, updated_at (Timestamps)
```

### Tasks Table
```sql
- id (Primary Key, Serial)
- title (VARCHAR)
- description (TEXT, Optional)
- completed (BOOLEAN, Default: False, Indexed)
- priority (INTEGER, Default: 0, Indexed)
- due_date (TIMESTAMP, Optional, Indexed)
- list_id (Foreign Key → lists.id, Indexed)
- created_at, updated_at (Timestamps)
```

## API Endpoints

### User Management
- `POST /users/` - Create new user
- `GET /users/` - List all users (paginated)
- `GET /users/{user_id}` - Get specific user
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user

### List Management
- `POST /lists/` - Create new list
- `GET /lists/` - List all lists (paginated)
- `GET /lists/{list_id}` - Get specific list
- `PUT /lists/{list_id}` - Update list
- `DELETE /lists/{list_id}` - Delete list (cascades to tasks)

### Task Management
- `POST /tasks/` - Create new task
- `GET /tasks/` - List all tasks (paginated)
- `GET /tasks/{task_id}` - Get specific task
- `PUT /tasks/{task_id}` - Update task
- `DELETE /tasks/{task_id}` - Delete task

### Documentation
- `GET /docs` - Swagger UI interactive documentation
- `GET /redoc` - ReDoc alternative documentation
- `GET /openapi.json` - OpenAPI specification

## Environment Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENVIRONMENT` | `development` | Runtime environment (development/production) |
| `POSTGRES_HOST` | `postgres` | Database hostname |
| `POSTGRES_DB` | `todolist` | Database name |
| `POSTGRES_USER` | `postgres` | Database username |
| `POSTGRES_PASSWORD` | `password` | Database password |

### CORS Configuration

**Development Mode** (`ENVIRONMENT=development`):
- Allowed Origins: `http://localhost:3000`, `http://127.0.0.1:3000`
- Restricts API access to frontend client only

**Production Mode** (any other `ENVIRONMENT` value):
- Allowed Origins: Empty list (more restrictive)
- Configure production URLs in `cors_origins` list

## Development

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export POSTGRES_HOST=localhost
export POSTGRES_DB=todolist
export POSTGRES_USER=postgres  
export POSTGRES_PASSWORD=password

# Run development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server runs on http://localhost:8000

### Docker Development
```bash
# From project root
docker-compose up api
```

API accessible at http://localhost:8000

## Security Features

- **Password Hashing**: Uses SHA-256 for password storage
- **CORS Protection**: Environment-based origin restrictions
- **Input Validation**: Pydantic schemas validate all requests
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **Foreign Key Constraints**: Maintains data integrity

## Database Integration

### Connection String Format
```
postgresql://username:password@host:port/database
```

### Session Management
- Database sessions created per request
- Automatic session cleanup via dependency injection
- Transaction rollback on errors

### Migrations
Database schema is managed by the separate database container with automatic migrations.

## Error Handling

- **400 Bad Request**: Invalid input data or duplicate constraints
- **404 Not Found**: Resource doesn't exist
- **405 Method Not Allowed**: CORS preflight issues (handled by middleware)
- **422 Unprocessable Entity**: Pydantic validation errors
- **500 Internal Server Error**: Database connection or server issues

## Production Considerations

1. **Environment Variables**: Set proper database credentials
2. **CORS Origins**: Configure allowed domains in production mode
3. **Database Connection Pooling**: Handled by SQLAlchemy
4. **Logging**: Configure uvicorn logging for production
5. **Security Headers**: Consider additional middleware for production
6. **Health Checks**: Database connectivity validation

## Dependencies

- `fastapi==0.104.1` - Web framework
- `uvicorn==0.24.0` - ASGI server
- `psycopg2-binary==2.9.9` - PostgreSQL adapter
- `sqlalchemy==2.0.23` - SQL toolkit and ORM
- `pydantic==2.5.0` - Data validation

## Container Configuration

- **Base Image**: `python:3.11-slim`
- **Port**: `8000`
- **Health Check**: Automatic via docker-compose
- **Dependencies**: Requires PostgreSQL container to be healthy
- **Restart Policy**: `unless-stopped`

## Usage Examples

### Create User
```bash
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "username": "johndoe", "password": "secret123"}'
```

### Create List
```bash
curl -X POST http://localhost:8000/lists/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Shopping List", "description": "Weekly groceries", "user_id": 1}'
```

### Create Task
```bash
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk", "priority": 1, "list_id": 1}'
```

Visit http://localhost:8000/docs for interactive API documentation.