$ErrorActionPreference = "Stop"

$BackupRoot = "C:\backups\ticket_full"
$Expected = @(
    "$BackupRoot\oplog.bson",
    "$BackupRoot\ticketDB\bookings.bson",
    "$BackupRoot\ticketDB\bookings.metadata.json"
)

foreach ($file in $Expected) {
    if (Test-Path $file) {
        Write-Host "FOUND: $file"
    } else {
        throw "MISSING: $file"
    }
}

Write-Host "Backup file check completed."
