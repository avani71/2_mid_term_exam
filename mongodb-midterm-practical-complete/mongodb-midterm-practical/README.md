# MongoDB Midterm Practical – Scenarios B3 and B4

This repository contains the two practicals visible in the supplied sheets.

## Requirements

- MongoDB Server (local replica set for Scenario B4)
- MongoDB Shell (`mongosh`)
- MongoDB Database Tools (`mongodump`, `mongorestore`)
- Windows PowerShell (backup scripts below use Windows paths)

Check installation:

```powershell
mongosh --version
mongodump --version
mongorestore --version
```

## Repository structure

```text
mongodb-midterm-practical/
├── README.md
├── .gitignore
├── scenario-b3-movie-catalogue/
│   ├── 01-seed-movies.js
│   ├── 02-explain-without-index.js
│   ├── 03-create-good-index.js
│   ├── 04-compare-poor-index.js
│   ├── 05-drop-poor-index.js
│   ├── 06-multikey-cast-index.js
│   ├── 07-hide-and-unhide-index.js
│   └── 08-custom-name-index-test.js
└── scenario-b4-ticket-booking/
    ├── 01-seed-bookings.js
    ├── 02-backup.ps1
    ├── 03-verify-backup.ps1
    ├── 04-drop-bookings.js
    ├── 05-restore-bookings.ps1
    └── 06-verify-restore.js
```

Run commands from the repository root unless otherwise stated.

---


## Online compiler for Scenario B3

A single-file version is in `online-compiler/scenario-b3-online-compiler.js`.
Open the MongoDB editor at https://www.mycompiler.io/online-mongodb-editor, paste
that file, and click Run. It runs MongoDB-style commands in a hosted MongoDB editor.
Some administrative features may be restricted by the hosted environment; use local
`mongosh` for a full execution-plan/index demonstration.

Scenario B4 cannot be completed in an ordinary online query editor: `mongodump`,
`mongorestore`, Windows PowerShell, and a three-member replica set are required.
Use the supplied `.ps1` scripts on a Windows machine with MongoDB Database Tools.

# Scenario B3 – Movie Catalogue

Database: `movieDB`  
Collection: `movies`

### Run in order

```powershell
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\01-seed-movies.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\02-explain-without-index.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\03-create-good-index.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\04-compare-poor-index.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\05-drop-poor-index.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\06-multikey-cast-index.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\07-hide-and-unhide-index.js
mongosh "mongodb://localhost:27017" .\scenario-b3-movie-catalogue\08-custom-name-index-test.js
```

The query used is Drama movies with rating 8 or above:

```javascript
{ genre: "Drama", rating: { $gte: 8 } }
```

The efficient compound index is `{ genre: 1, rating: -1 }`: equality field first, range/sort field after it. The reversed index is included for comparison. Exact `totalKeysExamined` values can vary by MongoDB version and query planner.

# Scenario B4 – Ticket Booking Backup and Restore

Database: `ticketDB`  
Collection: `bookings`

## Replica set assumption

The sheet says to reuse the three-node replica set from Scenario A4. The PowerShell scripts assume its connection string is:

```text
mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0
```

If your A4 replica set uses a different name, hostnames, or ports, change `$MongoUri` in both PowerShell scripts. Do not run the backup/restore scripts until the replica set is healthy.

Check replica-set status:

```powershell
mongosh "mongodb://localhost:27017/?replicaSet=rs0" --eval "rs.status()"
```

Seed the bookings collection:

```powershell
mongosh "mongodb://localhost:27017/?replicaSet=rs0" .\scenario-b4-ticket-booking\01-seed-bookings.js
```

## Backup

Run in PowerShell:

```powershell
.\scenario-b4-ticket-booking\02-backup.ps1
```

The script creates a full deployment dump in `C:\backups\ticket_full` and requests reads from a secondary. It uses `--oplog` for a point-in-time-consistent full replica-set dump. A full dump is required when using `--oplog`; do not add `--db` or `--collection` to this `mongodump` command.

## Verify backup

```powershell
.\scenario-b4-ticket-booking\03-verify-backup.ps1
```

Expected important files include:

```text
C:\backups\ticket_full\oplog.bson
C:\backups\ticket_full\ticketDB\bookings.bson
C:\backups\ticket_full\ticketDB\bookings.metadata.json
```

## Simulate accidental deletion

**Warning: this permanently drops the live collection. Do this only in your practice database after confirming the backup exists.**

```powershell
mongosh "mongodb://localhost:27017/?replicaSet=rs0" .\scenario-b4-ticket-booking\04-drop-bookings.js
```

## Restore only `ticketDB.bookings`

Run in PowerShell:

```powershell
.\scenario-b4-ticket-booking\05-restore-bookings.ps1
```

This restores only the requested namespace from the dump. It intentionally does not replay the entire deployment oplog because the exercise asks to restore only one collection.

## Verify restored data

```powershell
mongosh "mongodb://localhost:27017/?replicaSet=rs0" .\scenario-b4-ticket-booking\06-verify-restore.js
```

Expected count: 5 bookings.

## Disaster-recovery table

| Failure | What to do |
|---|---|
| One secondary fails | Keep the primary and remaining healthy members running; replace/rebuild the failed member and check replication health. |
| Primary fails | The replica set should elect an eligible secondary; check `rs.status()` and investigate the failed node. |
| Accidental collection drop | Restore the required namespace from a verified backup. For point-in-time recovery across a full deployment, use a full dump and oplog replay in a suitable recovery environment. |
| Backup file is missing/corrupt | Do not assume the backup is usable; use another verified backup and investigate backup monitoring. |
| Entire deployment is lost | Provision the replica set, restore a full backup, and apply the appropriate oplog recovery procedure. |

### Three good backup practices

1. Keep multiple dated backups and store at least one copy separately from the database server.
2. Verify backup files and regularly perform test restores.
3. Monitor backup jobs, protect backup access, and document recovery steps/RPO/RTO.

## GitHub safety

Do not upload real production data, credentials, connection strings containing passwords, private keys, or actual backup dumps. Upload scripts and sample data only. The `.gitignore` excludes backup output.
