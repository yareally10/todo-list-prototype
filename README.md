# Todo List Prototype

A full-stack todo list management application with React frontend, FastAPI backend, and PostgreSQL database, all containerized with Docker.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Client  │────│  FastAPI Server │────│   PostgreSQL    │
│   (Port 3000)   │    │   (Port 8000)   │    │   (Port 5432)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Run the Application
```bash
# Clone the repository
git clone <repository-url>
cd todo-list-prototype

# Start all services
docker-compose up

# Or run in background
docker-compose up -d
```

### Access Points
- **Frontend**: http://localhost:3000 - React application
- **Backend API**: http://localhost:8000 - FastAPI server
- **API Documentation**: http://localhost:8000/docs - Swagger UI
- **Database**: localhost:5432 - PostgreSQL (internal access)

## 📁 Project Structure

```
todo-list-prototype/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components (UserManager, ListManager, TaskManager)
│   │   ├── api.ts         # API client configuration
│   │   ├── types.ts       # TypeScript definitions
│   │   └── App.tsx        # Main application
│   ├── Dockerfile         # Client container configuration
│   └── README.md          # Client documentation
├── server/                 # FastAPI Python backend
│   ├── main.py            # FastAPI application and routes
│   ├── models.py          # SQLAlchemy database models
│   ├── schemas.py         # Pydantic validation schemas
│   ├── database.py        # Database connection management
│   ├── Dockerfile         # Server container configuration
│   └── README.md          # Server documentation
├── database/               # PostgreSQL database setup
│   ├── migrations/        # SQL migration files
│   ├── run-migrations.sh  # Migration execution script
│   ├── Dockerfile         # Database container configuration
│   └── README.md          # Database documentation
├── volume/                 # Persistent data storage
│   └── psql.data/         # PostgreSQL data files
├── docker-compose.yml     # Multi-container orchestration
└── README.md             # This file
```

## 🔧 Technology Stack

### Frontend (client/)
- **React 19** - UI framework with modern hooks
- **TypeScript** - Type safety and better developer experience  
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API communication

### Backend (server/)
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using type annotations
- **Uvicorn** - ASGI server implementation

### Database (database/)
- **PostgreSQL 15** - Primary database
- **Shell-based migrations** - Automatic schema management
- **Persistent volumes** - Data persistence across container restarts

### Infrastructure
- **Docker & Docker Compose** - Containerization and orchestration
- **Multi-stage builds** - Optimized container images
- **Health checks** - Service dependency management

## 🎯 Features

### User Management
- Create user accounts with email and username
- Secure password hashing (SHA-256)
- User profile management
- Account deletion

### List Management  
- Create todo lists associated with users
- List descriptions and metadata
- User-specific list ownership
- Cascade deletion protection

### Task Management
- Create tasks within lists
- Task completion tracking
- Priority levels (Low, Medium, High, Critical)
- Due date scheduling
- Rich task descriptions

### Technical Features
- **RESTful API** - Complete CRUD operations
- **Real-time UI** - Immediate updates without page refresh
- **Environment-based CORS** - Security configuration per environment
- **Database migrations** - Automatic schema updates
- **Data persistence** - PostgreSQL with volume mounting
- **Type safety** - Full TypeScript implementation
- **API documentation** - Auto-generated Swagger UI

## 🔄 Development Workflow

### Start Development Environment
```bash
# Start all services with live reload
docker-compose up

# Or start individual services
docker-compose up postgres  # Database only
docker-compose up api       # Backend only  
docker-compose up client    # Frontend only
```

### Make Code Changes
- **Frontend**: Edit files in `client/src/` - Vite hot reload active
- **Backend**: Edit files in `server/` - Container restart required
- **Database**: Add migrations to `database/migrations/` - Automatic execution

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f client
docker-compose logs -f api
docker-compose logs -f postgres
```

### Database Operations
```bash
# Access PostgreSQL directly
docker exec -it todo-postgres psql -U postgres -d todolist

# View migration status
docker exec todo-postgres psql -U postgres -d todolist -c "SELECT * FROM schema_migrations;"
```

## 🌐 Environment Configuration

### Development (Default)
```yaml
ENVIRONMENT: development
POSTGRES_HOST: postgres
POSTGRES_DB: todolist
POSTGRES_USER: postgres
POSTGRES_PASSWORD: password
```

### CORS Settings
- **Development**: Restricted to `localhost:3000`
- **Production**: Configure allowed origins in server code

### Ports
- **Client**: 3000 (external) → 5173 (internal Vite)
- **API**: 8000 (external) → 8000 (internal)
- **Database**: 5432 (external) → 5432 (internal)

## 📊 Database Schema

```sql
users
├── id (PK)
├── email (Unique)
├── username (Unique)
├── password_hash
└── created_at, updated_at

lists
├── id (PK)
├── name
├── description
├── user_id (FK → users.id)
└── created_at, updated_at

tasks
├── id (PK)
├── title
├── description
├── completed (Boolean)
├── priority (Integer)
├── due_date
├── list_id (FK → lists.id)
└── created_at, updated_at
```

## 🛠️ Management Commands

### Container Management
```bash
# Stop all services
docker-compose down

# Rebuild all containers
docker-compose build

# Rebuild specific container
docker-compose build client

# Remove all containers and volumes
docker-compose down -v

# View container status
docker-compose ps
```

### Database Management
```bash
# Reset database (removes all data)
docker-compose down -v
docker-compose up postgres

# Backup database
docker exec todo-postgres pg_dump -U postgres todolist > backup.sql

# Restore database
docker exec -i todo-postgres psql -U postgres todolist < backup.sql
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :3000  # or :8000, :5432

# Stop conflicting services
docker-compose down
```

**CORS Errors**
- Verify API server is running on port 8000
- Check ENVIRONMENT variable in docker-compose.yml
- Ensure client is accessing correct API URL

**Database Connection Issues**
- Verify PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Ensure migrations completed successfully

**Build Failures**
- Clear Docker cache: `docker system prune -a`
- Rebuild from scratch: `docker-compose build --no-cache`

### Debug Mode
```bash
# Run with verbose logging
docker-compose --verbose up

# Access container shells
docker exec -it todo-client sh
docker exec -it todo-api bash
docker exec -it todo-postgres bash
```

## 📈 Production Deployment

1. **Environment Variables**
   - Set secure database credentials
   - Configure production CORS origins
   - Set `ENVIRONMENT=production`

2. **Security**
   - Use HTTPS/TLS certificates
   - Implement authentication/authorization
   - Configure firewall rules

3. **Performance**
   - Enable database connection pooling
   - Configure reverse proxy (nginx)
   - Set up monitoring and logging

4. **Data**
   - Regular database backups
   - Volume mounting for persistence
   - Database replication for high availability

## 📝 API Usage Examples

### Create a Complete Workflow
```bash
# 1. Create a user
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "username": "john", "password": "secret"}'

# 2. Create a list
curl -X POST http://localhost:8000/lists/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Work Tasks", "description": "Daily work items", "user_id": 1}'

# 3. Create a task
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Review code", "priority": 2, "list_id": 1}'

# 4. Mark task complete
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m "Add feature"`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is a prototype for demonstration purposes.

---

For detailed component documentation, see individual README files in each directory:
- [Client Documentation](client/README.md)
- [Server Documentation](server/README.md)  
- [Database Documentation](database/README.md)