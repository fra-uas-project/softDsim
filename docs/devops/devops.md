### Zertifikate (if own Domain)
```
certbot run -n -d uas.bspace.xyz,uas.dev.bspace.xyz,pp.uas.bspace.xyz  -m  benedikt.moeller@stud.fra-uas.de
certbot certonly --standalone -n -d uas.bspace.xyz,dev.uas.bspace.xyz,pp.uas.bspace.xyz  -m  benedikt.moeller@stud.fra-uas.de --dry-run 
certbot --expand -n -d uas.bspace.xyz,dev.uas.bspace.xyz,pp.uas.bspace.xyz  -m  benedikt.moeller@stud.fra-uas.de 
certbot certonly --cert-name uas.bspace.xyz -d dev.uas.bspace.xyz,pp.uas.bspace.xyz

```
```
certbot renew \
 && cp -L /etc/letsencrypt/live/uas.bspace.xyz/* /deploydata/nginx/cert/ \
 && docker restart webserver
 5 5 */7 * * certbot renew --nginx --renew-hook "systemctl reload nginx" && date >> /home/pi/log.txt
```


# Software
```bash
sudo apt-get update && apt-get upgrade -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io curl iptables-persistent rsync git nginx certbot
```
https://github.com/docker/compose -> manually (version 2.4.1) -> add to PATH
include Userbased e.g.: in ".profile"
```bash
...
export BASE_DIR_OPS="***"
if [ -d "$BASE_DIR_OPS/bin" ] ; then
    PATH="$BASE_DIR_OPS/bin:$PATH"
fi
...
```

## nginx
[nginx-digital ocean](https://www.digitalocean.com/community/tools/nginx?domains.0.php.php=false&domains.0.reverseProxy.reverseProxy=true&domains.0.routing.root=false&global.app.lang=de)

https://docs.ispsystem.com/ispmanager-business/troubleshooting-guide/if-nginx-does-not-start-after-rebooting-the-server

```
├── conf.d
├── backup
├── conf.d
├── mime.types
├── modules-available
├── modules-enabled
├── nginx.conf
├── nginxconfig.io
│   ├── general.conf
│   ├── proxy.conf
│   └── security.conf
├── sites-available
│   ├── default
│   └── uas.bspace.xyz.conf
└── sites-enabled
    ├── default -> /etc/nginx/sites-available/default
    └── uas.bspace.xyz.conf -> ../sites-available/uas.bspace.xyz.conf

```
## Docker
```bash
IMAGE                   COMMAND                  PORTS            NAMES
dj:latest               "/bin/sh -c /entrypo…"   8002->8000/tcp   APP_DEV
mariadb:10.7.3          "docker-entrypoint.s…"   3322->3306/tcp   APP_DB_DEV
grafana/grafana:8.5.2   "/run.sh"                3000->3000/tcp   grafana
mariadb:10.7.3          "docker-entrypoint.s…"   3320->3306/tcp   grafanaDB
```
### App (SoftDsim)

### Grafana
https://grafana.com/tutorials/run-grafana-behind-a-proxy/
https://grafana.com/docs/grafana/latest/administration/configure-docker/

# Ops
## User
| User |Function|
|--|--|
|deployadm|Docker, Operations|
|deploydata|copy Data|
|kompsim|complexy Team User|
|connect|restricted connect User (chsh -s /bin/rbash)|

https://stackoverflow.com/questions/21498667/how-to-limit-user-commands-in-linux
## cronjobs
### deployadm
```bash
30 0 * * * . $HOME/.profile && getGithubActionIP.sh >> $BASE_DIR_OPS/logs/crontab_run.log 2>&1 

35 0 * * 0 . $HOME/.profile && docker system prune -f >> $BASE_DIR_OPS/logs/crontab_run.log 2>&1
```

### deploydata
```bash
30 0 * * * . $HOME/.profile && cd ${BASE_DIR_WEB}/DEV/ && while [[ $(ls -l | grep -v prd | wc -l) -gt 10 ]];do rm -rf $(ls -t | tail -n1); done
```
### Folder Struture
**BASE_DIR_OPS**
```bash
├── bin
│   ├── docker-compose
│   ├── getGithubActionIP.sh
│   └── iptables.sh
├── compose
│   ├── app_compose.yaml
│   └── grafana_compose.yaml
├── config
├── iptables
│   ├── ghIPList.txt
│   ├── oldIP
│   │   ├── ghIPList_20220531_193401.txt
│   │   └── ghIPList_20220531_193701.txt
└── logs
    └── crontab_run.log
```
**BASE_DIR_WEB**
```bash
├── DEV
│   ├── 52350a...
│   ├── 5b41ca...
│   ├── 60880a...
│   ├── cb0f46...
│   └── prd -> 60880a...
└── PROD
```
**BASE_DIR_APP**
```bash
├── build
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── requirements.txt
├── DEV
│   ├── bak
│   └── prd
└── PROD
    └── prd
```

# Hardening
 https://www.digitalocean.com/community/tutorials/how-to-harden-openssh-on-ubuntu-20-04
## IPtables GeoIP
https://docs.rackspace.com/support/how-to/block-ip-range-from-countries-with-geoip-and-iptables/
https://www.eigener-server.ch/web-server/ubuntu/ubuntu-geoip-iptables/
libtext-csv-xs-perl libmoosex-types-netaddr-ip-perl
xtables-addons-common
needed? depmod
modprobe xt_geoip
lsmod | grep ^xt_geoip
git clone https://git.code.sf.net/p/xtables-addons/xtables-addons xtables-addons-xtables-addons
sudo ./xt_geoip_dl
sudo ./xt_geoip_build -D /usr/share/xt_geoip *.csv

**vllt Cron**
```bash
30 23 * * * wget -q https://legacy-geoip-csv.ufficyo.com/Legacy-MaxMind-GeoIP-database.tar.gz -O - | tar -xvzf - -C /usr/share/xt_geoip
```

#### Rules
```bash
iptables -t mangle -I PREROUTING -p tcp --dport 22 -m geoip ! --src-cc DE,US -j DROP
iptables -t mangle -I PREROUTING -p tcp --dport 80 -m geoip ! --src-cc DE -j DROP
iptables -t mangle -I PREROUTING -p tcp --dport 443 -m geoip ! --src-cc DE -j DROP
iptables -t mangle -I PREROUTING -s 10.0.0.0/8 -j ACCEPT
```

https://superuser.com/questions/1234693/permanently-ban-after-n-connections-in-a-minute-with-iptables

iptables without root
https://unix.stackexchange.com/questions/385109/can-you-list-iptables-as-a-non-root-user-and-why

### Backend Python Container
https://www.digitalocean.com/community/tutorials/docker-explained-how-to-containerize-python-web-applications

# Ideen

### Versioning
https://github.com/marketplace/actions/git-semantic-version
### Testing
- https://fakerjs.dev/guide/
- [Gatling](https://gatling.io/open-source/)



<!-- 069 1533   3685
                3333 -->