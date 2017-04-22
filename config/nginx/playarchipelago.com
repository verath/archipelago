# NGINX configuration for playarchipelago.com.
# 
# Listens for requests on :80, serving static files from 
# the archipelago/static dir and forwards requests to /ws
# to the archipelago server.
# 

# Redirect http:// -> https://
server {
	server_name www.playarchipelago.com playarchipelago.com;
	return 301 https://playarchipelago.com$request_uri;
}

# Redirect https://www.playarchipelago.com -> https://playarchipelago.com
server {
	listen 443 ssl;
	ssl_certificate /etc/letsencrypt/live/playarchipelago.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/playarchipelago.com/privkey.pem;
	server_name www.playarchipelago.com;
	return 301 https://playarchipelago.com$request_uri;
}

server {
	listen 443 ssl;
	ssl_certificate /etc/letsencrypt/live/playarchipelago.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/playarchipelago.com/privkey.pem;
	server_name playarchipelago.com;

	access_log /var/log/playarchipelago.com/nginx.access.log;
	error_log  /var/log/playarchipelago.com/nginx.error.log;

	# Serve "/.well-known/acme-challenge" from a separate directory
	# this directory is used by let's encrypt to validate ownership
	location ^~ /.well-known/acme-challenge/ {
		root /var/www/letsencrypt/playarchipelago.com;
		try_files $uri $uri/ =404;
	}

	# Proxy requests for /ws to the archipelago server on :8080
	location /ws {
		proxy_set_header X-Real-IP  $remote_addr;
		proxy_set_header X-Forwarded-For $remote_addr;
		proxy_set_header Host $host;
		proxy_pass http://localhost:8080;
		# Websockets
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}

	# All other requests are served from the static folder
	root /home/deploy/go/src/github.com/verath/archipelago/static/;
	index index.html;
	location / {
		try_files $uri $uri/ index.html;
	}

	# Deny access to .-files
	location ~ /\. {
		return 403; 
	}
}
