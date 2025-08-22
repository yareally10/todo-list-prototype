#!/bin/bash
set -e

echo "Running database migrations..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Create migrations tracking table if it doesn't exist
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);"

# Run migrations in order
for migration_file in /migrations/*.sql; do
    if [ -f "$migration_file" ]; then
        migration_name=$(basename "$migration_file")
        
        # Check if migration has already been applied
        result=$(psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM schema_migrations WHERE version='$migration_name';" | tr -d ' ')
        
        if [ "$result" = "0" ]; then
            echo "Applying migration: $migration_name"
            if psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$migration_file"; then
                psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "INSERT INTO schema_migrations (version) VALUES ('$migration_name');"
                echo "Migration $migration_name applied successfully"
            else
                echo "Error applying migration $migration_name"
                exit 1
            fi
        else
            echo "Migration $migration_name already applied, skipping"
        fi
    fi
done

echo "All migrations completed successfully!"