*Para generar un certificado

sh gen-cert.sh

*Para actualizar
npm outdated && ncu -u && npm install && npm audit fix

*Instalar solo prod
npm install --only=prod


*Instalar server
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl daemon-reload

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install gcc g++ make nodejs


certificado
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-dns-

sudo certbot --server https://acme-v02.api.letsencrypt.org/directory -d *.santrato.com --manual --preferred-challenges dns-01 certonly

sudo certbot --authenticator standalone --installer nginx -d santrato.com --pre-hook "systemctl stop nginx.service" --post-hook "systemctl start nginx.service"
sudo certbot --authenticator standalone --installer nginx -d *.santrato.com --pre-hook "systemctl stop nginx.service" --post-hook "systemctl start nginx.service"

sudo certbot renew --dry-run --pre-hook "systemctl stop nginx.service" --post-hook "systemctl start nginx.service"
