# Sin www.
server {
    listen 80 ;
    listen [::]:80 ;
    server_name santrato.com;

    if ($host = santrato.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    return 404; # managed by Certbot
}
server {
    client_max_body_size 10M;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name santrato.com; # managed by Certbot

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarder-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header X-Tenancy santrato;
        proxy_set_header X-Store $name;
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/santrato.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/santrato.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
# Acepta cualquier cosa con dominio santrato
server {
    listen 80;
    listen [::]:80;
    server_name *.santrato.com;
    return 301 https://$host$request_uri;
}
server {
    if ($host = www.santrato.com) {
        return 301 https://santrato.com$request_uri;
    } # managed by Certbot
    listen 443 ssl http2;
    server_name ~^(?<name>.+)\.santrato\.com$;
    ssl_certificate /etc/letsencrypt/live/santrato.com-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/santrato.com-0001/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    client_max_body_size 10M;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarder-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header X-Tenancy santrato;
        proxy_set_header X-Store $name;
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
  }
}

