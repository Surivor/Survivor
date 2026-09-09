#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

echo "CartePro full setup"

echo "Setting script permissions"
chmod +x ./*.sh

echo
echo "Running setup"
./setup.sh

echo
echo "Running demo seed"
./seed.demo.sh

echo
echo "CartePro ready"
echo "Application : https://localhost"
echo "Swagger     : https://localhost/api/docs"