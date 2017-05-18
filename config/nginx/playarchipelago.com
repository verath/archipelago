# NGINX configuration for playarchipelago.com.
# 
# Listens for requests made to https://playarchipelago.com, serving
# static files from  the archipelago/web dir and forwards requests
# to /ws to the archipelago server.
# 

# Cache map for different file types, see:
# https://www.digitalocean.com/community/tutorials/how-to-implement-browser-caching-with-nginx-s-header-module-on-centos-7
map $sent_http_content_type $expires {
	default                    off;
	text/html                  epoch;
	text/css                   max;
	application/javascript     max;
	~image/                    max;
}

# Redirect http:// -> https://
server {
	listen 80;
	listen [::]:80;
	server_name www.playarchipelago.com playarchipelago.com;
	return 301 https://playarchipelago.com$request_uri;
}

# Redirect https://www.playarchipelago.com -> https://playarchipelago.com
server {
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	server_name www.playarchipelago.com;
	ssl_certificate /etc/letsencrypt/live/playarchipelago.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/playarchipelago.com/privkey.pem;
	return 301 https://playarchipelago.com$request_uri;
}

# Primary, https://playarchipelago.com
server {
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	server_name playarchipelago.com;
	ssl_certificate /etc/letsencrypt/live/playarchipelago.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/playarchipelago.com/privkey.pem;

	access_log /var/log/playarchipelago.com/nginx.access.log;
	error_log  /var/log/playarchipelago.com/nginx.error.log;

	root /home/deploy/go/src/github.com/verath/archipelago/web/dist;
	index index.html;

	# Basic security headers
	add_header X-Frame-Options SAMEORIGIN;
	add_header X-Content-Type-Options nosniff;
	add_header X-XSS-Protection "1; mode=block";

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

	# Never cache the service worker file
	location = /sw.js {
		expires off;
	}

	# All other requests are served from the web folder
	location / {
		try_files $uri $uri/ index.html;
		expires $expires;
	}

	# Deny access to .-files
	location ~ /\. {
		return 403; 
	}
}
