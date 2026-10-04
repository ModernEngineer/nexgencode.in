# Deploying NexGenCode to the VPS (Hostinger KVM, Ubuntu)

What runs on the server:

| Part | Where | How |
|---|---|---|
| Website (React, prerendered) | `/var/www/nexgencode.in/html` | static files served by Nginx |
| API (.NET 10) | `/var/www/nexgencode.in/api` | systemd service `nexgencode-api` on `127.0.0.1:5090`, proxied at `/api` |
| Database | SQL Server 2022 Express | `localhost:1433`, database `NexGenCodeDb` (not reachable from the internet) |
| Uploaded images | `/var/www/nexgencode.in/api/wwwroot/uploads` | served at `/uploads` |

Run every command below on the VPS over SSH. Lines starting with `#` are comments.
Replace everything in `<ANGLE BRACKETS>` with your own values.

---

## 1. Check the server

```bash
lsb_release -a     # Ubuntu version: 20.04, 22.04 or 24.04
free -h            # RAM: SQL Server needs at least 2 GB
df -h /            # disk: keep at least 10 GB free
```

## 2. Firewall (keep SSH open!)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status          # 5090 (API) must NOT be listed
```

## 3. Install SQL Server 2022 (Express, free)

Pick strong passwords: 12+ characters with UPPER case, lower case and numbers (SQL Server requires at least three of upper/lower/number/symbol).
**Use only letters, numbers and `@ # _ - .` in every password in this guide** — characters like `! ; " ' $` break the shell commands or the connection string.
Example format: `Ngc2026Sql@Prayag#71`

```bash
UBU=$(lsb_release -rs)          # 20.04 or 22.04 for SQL Server 2022
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
curl -fsSL https://packages.microsoft.com/config/ubuntu/$UBU/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list
sudo apt-get update
sudo apt-get install -y mssql-server

# Non-interactive setup: Express edition + SA password
sudo MSSQL_PID=Express ACCEPT_EULA=Y MSSQL_SA_PASSWORD='<SA_PASSWORD>' /opt/mssql/bin/mssql-conf -n setup

# Only accept connections from this server itself
sudo /opt/mssql/bin/mssql-conf set network.ipaddress 127.0.0.1
sudo systemctl restart mssql-server
systemctl status mssql-server --no-pager      # should say "active (running)"
```

> **Ubuntu 24.04:** SQL Server 2022 doesn't publish packages for 24.04. Use `mssql-server-2025.list` in the second `curl` line instead (same commands otherwise). The app works the same on 2022 and 2025.

Command-line tools (`sqlcmd`):

```bash
curl -fsSL https://packages.microsoft.com/config/ubuntu/$UBU/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P '<SA_PASSWORD>' -C -Q "SELECT @@VERSION"
```

## 4. Create the database and an app login

The website must not use `sa`. Create a dedicated login that owns only `NexGenCodeDb`:

```bash
SQL="/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P <SA_PASSWORD> -C -b"
$SQL -Q "CREATE DATABASE NexGenCodeDb"
$SQL -Q "CREATE LOGIN nexgencode WITH PASSWORD = '<DB_PASSWORD>'"
$SQL -d NexGenCodeDb -Q "CREATE USER nexgencode FOR LOGIN nexgencode; ALTER ROLE db_owner ADD MEMBER nexgencode;"
```

The tables are created automatically by the API the first time it starts (EF Core migrations).
(If you ever need it, `backend/database/NexGenCodeDb.sql` is the same schema as a plain SQL script.)

## 5. Install .NET 10, Node.js 22, git and rsync

```bash
# .NET 10 SDK (builds and runs the API)
curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
sudo bash /tmp/dotnet-install.sh --channel 10.0 --install-dir /usr/share/dotnet
sudo ln -sf /usr/share/dotnet/dotnet /usr/bin/dotnet
dotnet --version                 # 10.0.x

# Node.js 22 (builds the website — Vite 8 needs Node 20.19+)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git rsync
node -v
```

## 6. Get the code

```bash
cd ~
git clone https://github.com/ModernEngineer/nexgencode.in.git
cd nexgencode.in
git checkout main          # or the branch you deploy from
```

> Private repo? GitHub will ask for a username and a **personal access token** (not your password),
> or add an SSH deploy key: `ssh-keygen -t ed25519`, then paste `~/.ssh/id_ed25519.pub` under
> GitHub → repo → Settings → Deploy keys, and clone with `git@github.com:ModernEngineer/nexgencode.in.git`.

## 7. API secrets

```bash
JWT_KEY=$(openssl rand -base64 48)
sudo tee /etc/nexgencode-api.env > /dev/null <<EOF
ConnectionStrings__Default=Server=localhost;Database=NexGenCodeDb;User Id=nexgencode;Password=<DB_PASSWORD>;TrustServerCertificate=True;Encrypt=True
Jwt__Key=$JWT_KEY
Admin__DefaultPassword=<FIRST_ADMIN_PASSWORD>
EOF
sudo chmod 600 /etc/nexgencode-api.env
sudo chown root:root /etc/nexgencode-api.env
```

`Admin__DefaultPassword` is used only once, to create the `admin` user when the database is empty.
Change it later from Admin → Settings.

## 8. Install the API service

```bash
sudo mkdir -p /var/www/nexgencode.in/api/wwwroot/uploads
sudo cp deploy/nexgencode-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nexgencode-api
```

## 9. First deploy (website + API)

```bash
cd ~/nexgencode.in
bash deploy/deploy.sh
```

This builds and publishes the API, starts it (which creates the tables and the sample data), builds the prerendered website and copies it to `/var/www/nexgencode.in/html`.

Check the API:

```bash
curl -s http://127.0.0.1:5090/api/health          # {"status":"ok"}
curl -s http://127.0.0.1:5090/api/projects | head -c 300
```

## 10. Nginx + HTTPS

```bash
sudo certbot certificates          # nexgencode.in AND www.nexgencode.in must both be listed
# if www is missing (or there is no certificate yet):
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d nexgencode.in -d www.nexgencode.in

sudo mkdir -p /var/www/nexgencode.in/letsencrypt
sudo cp deploy/nginx/nexgencode.in.conf /etc/nginx/sites-available/nexgencode.in
sudo ln -sf /etc/nginx/sites-available/nexgencode.in /etc/nginx/sites-enabled/nexgencode.in

# Disable any OTHER enabled config that also uses nexgencode.in (old site, default):
grep -l "nexgencode.in" /etc/nginx/sites-enabled/*
#   e.g.  sudo rm /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

## 11. Test the live site

```bash
curl -s https://nexgencode.in/api/health                                   # {"status":"ok"}
curl -sI http://nexgencode.in | grep -i location                           # https://nexgencode.in/
curl -sI https://www.nexgencode.in | grep -i location                      # https://nexgencode.in/
curl -s https://nexgencode.in/services/school-erp | grep -o '<h1[^>]*>[^<]*'
curl -so /dev/null -w '%{http_code}\n' https://nexgencode.in/no-such-page  # 404
```

In the browser:
1. https://nexgencode.in/admin/login → log in as `admin` with `<FIRST_ADMIN_PASSWORD>` → **Settings → change the password**.
2. Send a test message from https://nexgencode.in/contact → it must appear in **Admin → Enquiries**.
3. Upload a team photo in **Admin → Core Team** → check it shows on https://nexgencode.in/team.

## 12. Nightly backups (database + uploaded images)

```bash
echo "SA_PASSWORD=<SA_PASSWORD>" | sudo tee /etc/nexgencode-backup.env > /dev/null
sudo chmod 600 /etc/nexgencode-backup.env
sudo cp deploy/backup.sh /usr/local/bin/nexgencode-backup
sudo chmod 700 /usr/local/bin/nexgencode-backup
echo '30 2 * * * root /usr/local/bin/nexgencode-backup >> /var/log/nexgencode-backup.log 2>&1' | sudo tee /etc/cron.d/nexgencode-backup
sudo /usr/local/bin/nexgencode-backup        # run once now to test
ls -lh /var/backups/nexgencode
```

Copy the backups off the server now and then (e.g. download with WinSCP), so a server problem can't take them too.

---

## Updating the site later

Push your changes to GitHub, then on the VPS:

```bash
cd ~/nexgencode.in
bash deploy/deploy.sh          # website + API
bash deploy/deploy.sh --web    # website only (faster)
bash deploy/deploy.sh --api    # API only
```

Uploaded images and database content are never touched by a deploy.

## Troubleshooting

| Problem | Check |
|---|---|
| Admin login / contact form says "Could not reach the server" | `sudo systemctl status nexgencode-api` and `sudo journalctl -u nexgencode-api -n 80` |
| API log says "Login failed for user 'nexgencode'" | password in `/etc/nexgencode-api.env` doesn't match step 4 |
| API log says "Jwt:Key must be configured" | `Jwt__Key` missing in `/etc/nexgencode-api.env`, then `sudo systemctl restart nexgencode-api` |
| SQL Server not running | `sudo systemctl status mssql-server`, `sudo journalctl -u mssql-server -n 50` |
| 502 Bad Gateway on `/api` | API not running on 127.0.0.1:5090 (see first row) |
| Website shows old version | hard refresh (Ctrl+F5); check `ls -l /var/www/nexgencode.in/html/index.html` timestamp |
| Image upload fails | `sudo chown -R www-data:www-data /var/www/nexgencode.in/api/wwwroot/uploads` |
| Nginx errors | `sudo nginx -t`, `sudo tail -n 50 /var/log/nginx/error.log` |
