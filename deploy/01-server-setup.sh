#!/usr/bin/env bash
# Script de setup inicial del servidor. Ejecutar UNA sola vez en el servidor.
# Uso: scp deploy/01-server-setup.sh root@134.209.70.169:/tmp/ && ssh root@134.209.70.169 bash /tmp/01-server-setup.sh
set -euo pipefail

SERVER="fran-app.quantex.com.ar"
EMAIL="francisco.cardo@quantex.com.ar"
APP_DIR="/opt/weather-radar"

echo "==> Actualizando sistema..."
apt update && apt upgrade -y

echo "==> Instalando nginx y certbot..."
apt install -y nginx certbot python3-certbot-nginx

echo "==> Configurando UFW..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "==> Creando directorio de la app..."
mkdir -p "$APP_DIR/frontend"

# Crear .env por defecto si no existe
if [ ! -f "$APP_DIR/.env" ]; then
    echo "PORT=8080" > "$APP_DIR/.env"
fi

echo "==> Configurando Nginx..."
cp /tmp/weather-radar.conf /etc/nginx/sites-available/weather-radar
ln -sf /etc/nginx/sites-available/weather-radar /etc/nginx/sites-enabled/weather-radar
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Instalando servicio systemd..."
cp /tmp/weather-radar.service /etc/systemd/system/weather-radar.service
systemctl daemon-reload
systemctl enable weather-radar

echo "==> Configurando cron de restart diario..."
(crontab -l 2>/dev/null | grep -v 'weather-radar'; echo "0 7 * * * systemctl restart weather-radar") | crontab -

echo "==> Obteniendo certificado SSL..."
certbot --nginx -d "$SERVER" --non-interactive --agree-tos -m "$EMAIL"

echo "==> Setup completo!"
