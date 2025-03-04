#!/bin/sh
# wait-for-db.sh

set -e

echo "Waiting for PostgreSQL to be ready..."
# Extrai os dados da URL do Postgres usando regex
PG_HOST=$(echo $POSTGRES_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
PG_PORT=$(echo $POSTGRES_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

# Loop até que o banco de dados esteja respondendo
until bun -e "require('node:net').connect({ host: '$PG_HOST', port: $PG_PORT }).on('error', (e) => { process.exit(1) }).on('connect', () => { process.exit(0) })"
do
  echo "PostgreSQL is unavailable - sleeping for 1 second"
  sleep 1
done

echo "PostgreSQL is up - executing migrations and starting application"
# Executar migrações
bun run db:migrate

# Iniciar a aplicação
exec bun run start 