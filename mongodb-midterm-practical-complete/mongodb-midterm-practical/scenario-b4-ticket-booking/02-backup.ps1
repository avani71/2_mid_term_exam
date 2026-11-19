$ErrorActionPreference = "Stop"

# Change this URI if your Scenario A4 replica set uses other ports/name.
$MongoUri = "mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0"
$BackupRoot = "C:\backups\ticket_full"

Write-Host "Checking replica-set status..."
mongosh $MongoUri --quiet --eval "printjson(rs.status().myState)"

if ($LASTEXITCODE -ne 0) {
    throw "Could not connect to the replica set. Check the URI and replica-set health."
}

New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

Write-Host "Starting full replica-set backup to $BackupRoot"
# --oplog is for a full deployment dump; do not add --db/--collection here.
mongodump --uri="$MongoUri" --readPreference=secondary --oplog --out="$BackupRoot"

if ($LASTEXITCODE -ne 0) {
    throw "mongodump failed. Do not proceed to the drop step."
}

Write-Host "Backup completed."
Write-Host "Expected collection file: $BackupRoot\ticketDB\bookings.bson"
Write-Host "Expected oplog file: $BackupRoot\oplog.bson"
