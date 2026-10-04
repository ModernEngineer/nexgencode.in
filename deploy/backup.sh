#!/usr/bin/env bash
# Nightly backup: SQL Server database + uploaded images. Keeps the last 14 days.
# Install (as root):  sudo cp deploy/backup.sh /usr/local/bin/nexgencode-backup && sudo chmod 700 /usr/local/bin/nexgencode-backup
#                     echo '30 2 * * * root /usr/local/bin/nexgencode-backup' | sudo tee /etc/cron.d/nexgencode-backup
set -euo pipefail
source /etc/nexgencode-backup.env   # defines SA_PASSWORD=...

BACKUP_DIR=/var/backups/nexgencode
STAMP=$(date +%F)
mkdir -p "$BACKUP_DIR"
chown mssql:mssql "$BACKUP_DIR"

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -b -Q \
  "BACKUP DATABASE NexGenCodeDb TO DISK = N'$BACKUP_DIR/NexGenCodeDb-$STAMP.bak' WITH INIT"

tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" -C /var/www/nexgencode.in/api/wwwroot uploads

find "$BACKUP_DIR" -type f -mtime +14 -delete
echo "Backup done: $BACKUP_DIR ($STAMP)"
