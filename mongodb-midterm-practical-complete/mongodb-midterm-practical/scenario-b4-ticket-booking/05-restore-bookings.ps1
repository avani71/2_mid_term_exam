$ErrorActionPreference = "Stop"

# Change this URI if your Scenario A4 replica set uses other ports/name.
$MongoUri = "mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0"
$BackupRoot = "C:\backups\ticket_full"

$CollectionFile = "$BackupRoot\ticketDB\bookings.bson"
if (-not (Test-Path $CollectionFile)) {
    throw "Backup collection file not found: $CollectionFile"
}

Write-Host "Restoring only ticketDB.bookings..."
mongorestore --uri="$MongoUri" --nsInclude="ticketDB.bookings" --drop "$BackupRoot"

if ($LASTEXITCODE -ne 0) {
    throw "mongorestore failed."
}

Write-Host "Restore command completed."
