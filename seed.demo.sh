#!/usr/bin/env bash

set -e

echo "CartePro demo seed..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose not found"
  exit 1
fi

if ! docker compose ps backend | grep -q "Up"; then
  echo "Backend container is not running"
  echo "Run ./setup.sh first"
  exit 1
fi

echo "Running demo seed..."

docker compose exec backend npm run seed:run

echo
echo "Demo seed completed"