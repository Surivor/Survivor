#!/usr/bin/env bash

set -e

echo "CartePro Init..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found"
  echo "https://docs.docker.com/engine/install/"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose not found"
  exit 1
fi

echo "Docker ready"

if [ ! -f ".env" ]; then
  if [ -f ".env.exemple" ]; then
    cp .env.exemple .env
    echo ".env created from .env.exemple"
  else
    echo ".env.exemple not found"
    exit 1
  fi
else
  echo ".env already exists"
fi

set_env() {
  KEY="$1"
  VALUE="$2"

  if grep -q "^${KEY}=" .env; then
    sed -i "s|^${KEY}=.*|${KEY}=${VALUE}|" .env
  else
    echo "${KEY}=${VALUE}" >> .env
  fi
}

echo
echo "Environment setup"

read -p "PASS_ADD: " PASS_ADD
read -p "JWT_SECRET: " JWT_SECRET
read -p "JWT_SECRET_TRANSACTION: " JWT_SECRET_TRANSACTION
read -p "BIND_IP: " BIND_IP
read -p "ADMIN_EMAIL: " ADMIN_EMAIL
read -p "ADMIN_PASSWORD: " ADMIN_PASSWORD
read -p "DB_USER: " DB_USER
read -p "DB_PASSWORD: " DB_PASSWORD


set_env "PASS_ADD" "$PASS_ADD"
set_env "JWT_SECRET" "$JWT_SECRET"
set_env "JWT_SECRET_TRANSACTION" "$JWT_SECRET_TRANSACTION"
set_env "BIND_IP" "$BIND_IP"
set_env "ADMIN_EMAIL" "$ADMIN_EMAIL"
set_env "ADMIN_PASSWORD" "$ADMIN_PASSWORD"
set_env "DB_USER" "$DB_USER"
set_env "DB_PASSWORD" "$DB_PASSWORD"

echo ".env ready"

if [ ! -f "cartepro.local.pem" ] || [ ! -f "cartepro.local-key.pem" ]; then

  if ! command -v openssl >/dev/null 2>&1; then
    echo "OpenSSL not found"
    echo "Required to generate local HTTPS certificates"
    exit 1
  fi

  echo "Generating local HTTPS certificates..."

  openssl req \
    -x509 \
    -newkey rsa:2048 \
    -nodes \
    -keyout cartepro.local-key.pem \
    -out cartepro.local.pem \
    -days 365 \
    -subj "/CN=localhost"

  echo "HTTPS certificates generated"
else
  echo "HTTPS certificates already exist"
fi

echo
echo "Building CartePro..."

docker compose up -d --build

echo
echo "Waiting for services..."

sleep 5

docker compose ps

echo
echo "CartePro running"
echo
echo "Application : https://localhost"
echo "Swagger     : https://localhost/api/docs"