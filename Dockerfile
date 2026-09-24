FROM nginx:alpine
COPY index.html styles.css app.js machines.js sw.js manifest.json icon.svg /usr/share/nginx/html/
