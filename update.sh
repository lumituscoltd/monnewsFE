#!/bin/bash

##############################################################################
# MonNews Lummitus - Update Script
# Dùng để cập nhật code sau khi pull từ Git
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  MonNews Lummitus - Update Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Configuration
APP_DIR="/home/lkshpr/lumitus/monnews"
WEB_ROOT="/var/www/monnews"
BACKUP_DIR="/var/backups/monnews"

# Check if running as root for production update
if [ -d "$WEB_ROOT" ]; then
    if [ "$EUID" -ne 0 ]; then 
        echo -e "${RED}Production update requires root access (use sudo)${NC}"
        exit 1
    fi
    PRODUCTION=true
else
    PRODUCTION=false
    echo -e "${YELLOW}Development mode: No production files to update${NC}"
fi

# Navigate to project directory
cd $APP_DIR

echo -e "${YELLOW}[1/6] Pulling latest code from Git...${NC}"
git pull
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Code updated from Git${NC}"
else
    echo -e "${RED}✗ Git pull failed. Please check your git configuration.${NC}"
    exit 1
fi

echo -e "${YELLOW}[2/6] Checking for dependency changes...${NC}"
if git diff HEAD@{1} HEAD -- package.json | grep -q ""; then
    echo -e "${BLUE}→ package.json changed, reinstalling dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies updated${NC}"
else
    echo -e "${GREEN}✓ No dependency changes${NC}"
fi

echo -e "${YELLOW}[3/6] Building application...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed. Please check for errors.${NC}"
    exit 1
fi

if [ "$PRODUCTION" = true ]; then
    echo -e "${YELLOW}[4/6] Creating backup...${NC}"
    mkdir -p $BACKUP_DIR
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/monnews_backup_$TIMESTAMP.tar.gz"
    tar -czf $BACKUP_FILE -C $WEB_ROOT . 2>/dev/null || true
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
    
    # Keep only last 5 backups
    ls -t $BACKUP_DIR/monnews_backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
    
    echo -e "${YELLOW}[5/6] Deploying to production...${NC}"
    rm -rf $WEB_ROOT/*
    cp -r $APP_DIR/dist/* $WEB_ROOT/
    chown -R www-data:www-data $WEB_ROOT
    chmod -R 755 $WEB_ROOT
    echo -e "${GREEN}✓ Files deployed to $WEB_ROOT${NC}"
    
    echo -e "${YELLOW}[6/6] Reloading Nginx...${NC}"
    nginx -t && systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${YELLOW}[4/6] Skipping backup (development mode)${NC}"
    echo -e "${YELLOW}[5/6] Skipping deploy (development mode)${NC}"
    echo -e "${YELLOW}[6/6] Skipping Nginx (development mode)${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Update Completed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

if [ "$PRODUCTION" = true ]; then
    echo -e "${GREEN}✓ Code pulled from Git${NC}"
    echo -e "${GREEN}✓ Dependencies checked${NC}"
    echo -e "${GREEN}✓ Application built${NC}"
    echo -e "${GREEN}✓ Backup created${NC}"
    echo -e "${GREEN}✓ Files deployed${NC}"
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
    echo ""
    echo -e "${BLUE}Production site updated: https://monnews.lumitus.com.vn${NC}"
    echo -e "${BLUE}Backup location: $BACKUP_FILE${NC}"
else
    echo -e "${GREEN}✓ Code pulled from Git${NC}"
    echo -e "${GREEN}✓ Dependencies checked${NC}"
    echo -e "${GREEN}✓ Application built${NC}"
    echo ""
    echo -e "${BLUE}Development server: http://localhost:3000${NC}"
    echo -e "${YELLOW}Note: Restart 'npm run dev' to see changes${NC}"
fi

echo ""
echo -e "${YELLOW}Quick commands:${NC}"
echo -e "  View logs:     ${BLUE}sudo tail -f /var/log/nginx/monnews-access.log${NC}"
echo -e "  Rollback:      ${BLUE}sudo bash rollback.sh${NC}"
echo -e "  Dev server:    ${BLUE}npm run dev${NC}"
echo ""

