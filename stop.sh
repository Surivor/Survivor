#!/usr/bin/env bash

set -e

echo "Stopping CartePro..."

docker compose down -v --remove-orphans

echo "CartePro stopped"