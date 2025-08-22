# Database Container

PostgreSQL 15 container with automatic migration support for the Todo List application.

## Features

- **PostgreSQL 15** database server
- **Automatic migrations** on container startup
- **Migration tracking** to prevent duplicate executions
- **Shell-based migration runner** with proper error handling
- **Persistent volume** support

## Files

- `Dockerfile` - Container configuration with PostgreSQL
- `run-migrations.sh` - Shell script that runs all migrations after DB is ready
- `docker-entrypoint-wrapper.sh` - Custom entrypoint that runs migrations after PostgreSQL starts
- `migrations/` - SQL migration files executed in sequential order

## Migration Files

1. `001_create_users_table.sql` - Users table with authentication fields
2. `002_add_users_indexes.sql` - Indexes for user email and username
3. `003_create_lists_table.sql` - Todo lists table linked to users
4. `004_add_lists_indexes.sql` - Indexes for list user_id and name
5. `005_create_tasks_table.sql` - Tasks table linked to lists
6. `006_add_tasks_indexes.sql` - Indexes for task list_id, completion, due date, and priority

## Database Schema

### Users
- `id` (Primary Key)
- `email` (Unique, Indexed)
- `username` (Unique, Indexed) 
- `password_hash`
- `created_at`, `updated_at`

### Lists
- `id` (Primary Key)
- `name` (Indexed)
- `description`
- `user_id` (Foreign Key to users, Indexed)
- `created_at`, `updated_at`

### Tasks
- `id` (Primary Key)
- `title`
- `description`
- `completed` (Boolean, Indexed)
- `priority` (Integer, Indexed)
- `due_date` (Timestamp, Indexed)
- `list_id` (Foreign Key to lists, Indexed)
- `created_at`, `updated_at`

## Environment Variables

- `POSTGRES_DB=todolist` - Database name
- `POSTGRES_USER=postgres` - Database user
- `POSTGRES_PASSWORD=password` - Database password

## Migration Tracking

The container uses a `schema_migrations` table to track applied migrations:
- `version` (Primary Key) - Migration filename
- `applied_at` - Timestamp when migration was applied

## Usage

### Standalone Container
```bash
cd database
docker build -t todo-postgres .
docker run -d -p 5432:5432 -v ./data:/var/lib/postgresql/data todo-postgres
```

### With Docker Compose (Recommended)
```bash
# From project root
docker-compose up postgres
```

## Migration Process

### All Runs (First and Subsequent)
1. Container starts with custom entrypoint wrapper
2. PostgreSQL service starts in background  
3. Wrapper waits for PostgreSQL to be ready
4. `run-migrations.sh` creates `schema_migrations` table if needed
5. Script checks all files in `/migrations/` directory
6. Runs migrations not recorded in `schema_migrations` table
7. Records successful migrations in tracking table
8. PostgreSQL continues running normally

### Migration Tracking
- `schema_migrations` table tracks all applied migrations
- Each migration file is executed exactly once
- Safe to restart container - only new migrations will run

## Adding New Migrations

1. Create new `.sql` file in `migrations/` directory
2. Use sequential numbering (e.g., `007_add_new_feature.sql`)  
3. Restart container - new migrations will be detected and run automatically
4. No need to rebuild unless Dockerfile changes

**Note**: All schema changes are managed through files in the `migrations/` directory, including the initial schema setup.

## Data Persistence

When using docker-compose, database data persists in `../volume/psql.data/` directory.