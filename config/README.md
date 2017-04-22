# Example (production) configuration
 
This director holds configurations used to run the playarchipelago.com, which is
hosted on [Vultr](https://www.vultr.com/) running Ubuntu on a virtual machine.

The configuration sets up NGINX to terminate SSL, proxy WebSocket requests to the 
backend, and to serve the static resources. Additionally, the setup uses [Supervisord](http://supervisord.org/)
to handle starting and restarting of the backend in case of failure/system reboot.

The simple configuration consists of:

- [nginx/playarchipelago.com](./nginx/playarchipelago.com) - The NGINX site config
 for the playarchipelago.com domain. Placed in the `sites-available` NGINX config
 folder, and symlinked to `sites-enabled`.
- [supervisord/archipelago.conf](./supervisord/archipelago.conf) - The [supervisord](http://supervisord.org/)
program config for the backend. Placed in the supervisord config folder.

In addition, the server is set up to use [certbot](https://certbot.eff.org/) to obtain and renew
the domain's Let's Encrypt SSL certificate.
