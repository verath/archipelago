# HTTPS terminating proxy for the backend. The certificates are
# managed by certbot (let's encrypt) by running:
#    cerbot --nginx
#
server {
    listen 80;
    listen [::]:80;
    server_name ws.playarchipelago.com;
    access_log /var/log/nginx/ws.playarchipelago.access.log;
    error_log  /var/log/nginx/ws.playarchipelago.error.log;
    location / {
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $host;
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
