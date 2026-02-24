#!/usr/bin/env bash
# Script de deploy. Ejecutar LOCALMENTE desde la raíz del repo.
# Uso: bash deploy/02-deploy.sh
set -euo pipefail

SERVER="root@134.209.70.169"
APP_DIR="/opt/weather-radar"
STAGING="/tmp/weather-radar-staging"
TARBALL="/tmp/weather-radar-deploy.tar.gz"

echo "==> Compilando proyecto..."
make build-prod

echo "==> Empaquetando artefactos..."
rm -rf "$STAGING"
mkdir -p "$STAGING/frontend"
cp dist/weather-radar "$STAGING/backend"
cp -a frontend/build/. "$STAGING/frontend/"
tar czf "$TARBALL" -C "$STAGING" .
rm -rf "$STAGING"

echo "==> Subiendo paquete al servidor ($(du -h "$TARBALL" | cut -f1))..."
scp "$TARBALL" "$SERVER:/tmp/"
rm -f "$TARBALL"

echo "==> Descomprimiendo y desplegando en el servidor..."
ssh "$SERVER" "tar xzf /tmp/weather-radar-deploy.tar.gz -C $APP_DIR && rm -f /tmp/weather-radar-deploy.tar.gz && systemctl restart weather-radar"

echo "==> Verificando (esperando 2s)..."
sleep 2
if curl -sf https://fran-app.quantex.com.ar/api/cities > /dev/null; then
    echo "==> Deploy exitoso! /ping respondió OK"
else
    echo "==> ADVERTENCIA: /ping no respondió. Revisar logs con: ssh $SERVER journalctl -u weather-radar -n 50"
    exit 1
fi
