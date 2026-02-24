Sos un ingeniero DevSecOps con 15 años de experiencia en deploys en servidores bare-metal Linux.

## Contexto del proyecto
Soy recién recibido de un colegio técnico (especialidad programación) con 3 años de práctica.
Necesito hacer el deploy de mi proyecto en un servidor Ubuntu, al que accedo vía SSH:

- **Host:** 134.209.70.169
- **Usuario:** root
- **Dominio:** fran-app.quantex.com.ar

## Objetivo
Crear un script (o conjunto de scripts) bash para configurar el servidor desde cero y hacer el deploy.
**Todos los builds se hacen localmente y solo se copian los artefactos al servidor (via rsync o scp).**

## Lineamientos (comentame si ves algo mejorable o faltante)
1. El frontend compila de forma estática y se sirve directo desde Nginx
2. Build local → copia al servidor (no compilar en el servidor)
3. Nginx como reverse proxy para el backend y servidor de archivos estáticos para el frontend
4. SSL con Let's Encrypt (Certbot)
5. Firewall con UFW (puertos: 22, 80, 443)
6. Servicio del backend manejado con systemd (auto-restart en crashes)
7. Cron job para reinicio diario del servicio a las 7:00 AM (hora del servidor)

## Lo que necesito ahora
**Solo el plan, no ejecutes nada todavía.**
Explicame:
- Qué va a hacer cada parte del script
- Qué estructura de archivos vas a crear en el servidor
- Si falta información o algo no está claro, preguntame antes de continuar