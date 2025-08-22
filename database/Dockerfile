FROM postgres:15

ENV POSTGRES_DB=todolist
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

# Copy migration tools
COPY migrations/ /migrations/
COPY run-migrations.sh /usr/local/bin/run-migrations.sh
COPY docker-entrypoint-wrapper.sh /usr/local/bin/docker-entrypoint-wrapper.sh

# Make scripts executable
RUN chmod +x /usr/local/bin/run-migrations.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-wrapper.sh

# Create volume for persistent data
VOLUME ["/var/lib/postgresql/data"]

# Use custom entrypoint that runs migrations after DB starts
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-wrapper.sh"]

EXPOSE 5432