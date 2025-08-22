#!/bin/bash
set -e

# Start PostgreSQL using the original entrypoint
/usr/local/bin/docker-entrypoint.sh postgres &

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready - running migrations..."
/usr/local/bin/run-migrations.sh

echo "Migrations completed - PostgreSQL is ready for connections"

# Wait for the PostgreSQL process
wait