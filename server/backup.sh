#!/bin/bash
backupFileName="world-cup-predictions-backup-$(date '+%d-%m-%Y').tar.gz"

if ! mongodump -o backup --quiet; then
    status="mongodump failed"
elif ! tar -czf "$backupFileName" backup; then
    status="tar backup failed"
elif ! s3cmd put "$backupFileName" s3://gdn-backup/world-cup-predictions/db/ --no-progress > /dev/null; then
    status="s3cmd put failed"
elif ! rm "$backupFileName"; then
    status="rm backup file failed"
elif ! rm -rf backup; then
    status="rm backup folder failed"
else
    status="success"
fi

logger -t backup "$status"

