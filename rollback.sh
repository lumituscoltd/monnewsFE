#!/bin/bash

##############################################################################
# MonNews Lummitus - Rollback Script
# Khôi phục bản backup gần nhất
##############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m'

echo -e "${RED}========================================${NC}"
echo -e "${RED}  MonNews Lummitus - Rollback${NC}"
echo -e "${RED}========================================${NC}"
echo ""

# Configuration
WEB_ROOT="/var/www/monnews"
BACKUP_DIR="/var/backups/monnews"

# Check root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root (use sudo)${NC}"
   exit 1
fi

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ No backup directory found${NC}"
    exit 1
fi

# List available backups
echo -e "${YELLOW}Available backups:${NC}"
echo ""
backups=($(ls -t $BACKUP_DIR/monnews_backup_*.tar.gz 2>/dev/null))

if [ ${#backups[@]} -eq 0 ]; then
    echo -e "${RED}✗ No backups found${NC}"
    exit 1
fi

# Display backups
for i in "${!backups[@]}"; do
    filename=$(basename "${backups[$i]}")
    size=$(du -h "${backups[$i]}" | cut -f1)
    date=$(stat -c %y "${backups[$i]}" | cut -d' ' -f1,2 | cut -d'.' -f1)
    echo -e "  ${BLUE}[$i]${NC} $filename (${GREEN}$size${NC}) - $date"
done

echo ""
read -p "Enter backup number to restore [0]: " backup_num
backup_num=${backup_num:-0}

if [ $backup_num -lt 0 ] || [ $backup_num -ge ${#backups[@]} ]; then
    echo -e "${RED}✗ Invalid backup number${NC}"
    exit 1
fi

BACKUP_FILE="${backups[$backup_num]}"
echo ""
echo -e "${YELLOW}Selected backup: $(basename $BACKUP_FILE)${NC}"
echo ""
read -p "Are you sure you want to restore this backup? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Rollback cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}[1/3] Creating current state backup...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="$BACKUP_DIR/monnews_pre_rollback_$TIMESTAMP.tar.gz"
tar -czf $CURRENT_BACKUP -C $WEB_ROOT . 2>/dev/null || true
echo -e "${GREEN}✓ Current state saved: $CURRENT_BACKUP${NC}"

echo -e "${YELLOW}[2/3] Restoring backup...${NC}"
rm -rf $WEB_ROOT/*
tar -xzf $BACKUP_FILE -C $WEB_ROOT
chown -R www-data:www-data $WEB_ROOT
chmod -R 755 $WEB_ROOT
echo -e "${GREEN}✓ Backup restored${NC}"

echo -e "${YELLOW}[3/3] Reloading Nginx...${NC}"
nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Rollback Completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}✓ Restored from: $(basename $BACKUP_FILE)${NC}"
echo -e "${GREEN}✓ Pre-rollback backup: $CURRENT_BACKUP${NC}"
echo ""
echo -e "${BLUE}Site: https://monnews.lumitus.com.vn${NC}"
echo ""

