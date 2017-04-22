# NGINX configuration for playarchipelago.com.
# 
# Listens for requests on :80, serving static files from 
# the archipelago/static dir and forwards requests to /ws
# to the archipelago server.
# 
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	server_name playarchipelago.com;

	access_log /var/log/playarchipelago.com/nginx.access.log;
	error_log  /var/log/playarchipelago.com/nginx.error.log;

	# Deny access to .-files
	location ~ /\. {
		return 403; 
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
}

# Redirect www.playarchipelago.com -> playarchipelago.com
server {
	server_name www.playarchipelago.com;
	return 301 $scheme://playarchipelago.com$request_uri;
}
