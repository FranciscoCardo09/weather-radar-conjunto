# Plan de Deploy — Weather Radar

## Contexto
Deploy del proyecto weather-radar en servidor Ubuntu limpio (134.209.70.169) con dominio `fran-app.quantex.com.ar`. Build local, copiar artefactos al servidor. Todo corre como root.

## Paso 0: Fix previo — Cambiar adapter de SvelteKit

**Archivo:** `frontend/svelte.config.js`

Actualmente usa `adapter-auto` que en un servidor Linux sin variables de Vercel/Netlify/etc no genera output estático. Hay que cambiarlo a `adapter-static` (ya está instalado como dependencia):

```js
import adapter from '@sveltejs/adapter-static'
// ...
kit: {
  adapter: adapter({ fallback: 'index.html' })
}
```

El `fallback: 'index.html'` es necesario para que SvelteKit genere un SPA con client-side routing (sino las rutas como `/weather/cordoba` dan 404).

**Output del build:** `frontend/build/` (archivos estáticos puros)

## Paso 1: Crear archivos de deploy

Se crean 4 archivos en `deploy/`:

### `deploy/01-server-setup.sh`
Script que se copia al servidor y se ejecuta ahí UNA sola vez:

1. `apt update && apt upgrade -y`
2. `apt install -y nginx certbot python3-certbot-nginx`
3. UFW: habilitar, permitir 22, 80, 443
4. Crear directorio `/opt/weather-radar/`
5. Copiar config Nginx a `/etc/nginx/sites-available/weather-radar`, crear symlink en `sites-enabled`, eliminar `default`
6. `nginx -t && systemctl reload nginx`
7. Instalar unit systemd, `systemctl daemon-reload && systemctl enable weather-radar`
8. Instalar cron job: `0 7 * * * systemctl restart weather-radar`
9. Obtener certificado SSL: `certbot --nginx -d fran-app.quantex.com.ar --non-interactive --agree-tos -m francisco.cardo@quantex.com.ar`

### `deploy/02-deploy.sh`
Script que se ejecuta LOCALMENTE cada vez que se quiere deployar:

1. `make build-prod` (compila backend Linux amd64 + frontend estático)
2. `rsync` del binario `dist/weather-radar` y el directorio `frontend/build/` a `/opt/weather-radar/` en el servidor
3. `ssh root@134.209.70.169 systemctl restart weather-radar`
4. `sleep 2 && curl -sf https://fran-app.quantex.com.ar/ping` para verificar

### `deploy/weather-radar.service`
Unit systemd:

```ini
[Unit]
Description=Weather Radar Backend
After=network.target

[Service]
ExecStart=/opt/weather-radar/backend
WorkingDirectory=/opt/weather-radar
EnvironmentFile=/opt/weather-radar/.env
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### `deploy/weather-radar.conf` (Nginx)

```nginx
server {
    listen 80;
    server_name fran-app.quantex.com.ar;

    root /opt/weather-radar/frontend;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
# Certbot modifica este archivo automáticamente para agregar SSL
```

## Estructura en el servidor (resultado final)

```
/opt/weather-radar/
├── backend                 # binario Go
├── frontend/               # archivos estáticos SvelteKit
│   ├── index.html
│   └── ...
└── .env                    # PORT=8080 (y futuras vars)

/etc/nginx/sites-available/weather-radar
/etc/nginx/sites-enabled/weather-radar -> ../sites-available/weather-radar
/etc/systemd/system/weather-radar.service
/var/spool/cron/crontabs/root  (línea: 0 7 * * * systemctl restart weather-radar)
```

## Verificación

1. Build local: `make build-prod` debe completar sin errores
2. Ejecutar `deploy/02-deploy.sh` — debe copiar archivos y reiniciar servicio
3. `curl https://fran-app.quantex.com.ar/ping` → `{"message":"pong"}`
4. `curl https://fran-app.quantex.com.ar/api/cities` → lista de ciudades
5. Abrir `https://fran-app.quantex.com.ar` en navegador → frontend carga, navegación SPA funciona
