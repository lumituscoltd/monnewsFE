#!/bin/bash

##############################################################################
# MonNews Lummitus - Auto Deploy Script with Nginx & SSL
# Domain: monnews.lumitus.com.vn
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  MonNews Lummitus - Auto Deploy${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration
DOMAIN="monnews.lumitus.com.vn"
APP_DIR="/home/lkshpr/lumitus/monnews"
WEB_ROOT="/var/www/monnews"
NGINX_CONF="/etc/nginx/sites-available/default"
EMAIL="admin@lumitus.com.vn"  # Change to your email

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root (use sudo)${NC}"
   exit 1
fi

echo -e "${YELLOW}[1/7] Building React application...${NC}"
cd $APP_DIR
npm run build
echo -e "${GREEN}✓ Build completed${NC}"

echo -e "${YELLOW}[2/7] Creating web root directory...${NC}"
mkdir -p $WEB_ROOT
rm -rf $WEB_ROOT/*
echo -e "${GREEN}✓ Web root created${NC}"

echo -e "${YELLOW}[3/7] Copying build files...${NC}"
cp -r $APP_DIR/dist/* $WEB_ROOT/
chown -R www-data:www-data $WEB_ROOT
chmod -R 755 $WEB_ROOT
echo -e "${GREEN}✓ Files copied${NC}"

echo -e "${YELLOW}[4/7] Configuring Nginx...${NC}"

# Backup original config
if [ ! -f "${NGINX_CONF}.backup" ]; then
    cp $NGINX_CONF "${NGINX_CONF}.backup"
    echo -e "${GREEN}✓ Backup created: ${NGINX_CONF}.backup${NC}"
fi

# Append new server block to existing config
cat >> $NGINX_CONF << 'EOF'

##############################################################################
# MonNews Lummitus Configuration
# Added by deploy.sh
##############################################################################

server {
    listen 80;
    listen [::]:80;
    server_name monnews.lumitus.com.vn;

    root /var/www/monnews;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Logging
    access_log /var/log/nginx/monnews-access.log;
    error_log /var/log/nginx/monnews-error.log;
}

##############################################################################
# End of MonNews Lummitus Configuration
##############################################################################
EOF

echo -e "${GREEN}✓ Nginx configuration added${NC}"

echo -e "${YELLOW}[5/7] Testing Nginx configuration...${NC}"
nginx -t
echo -e "${GREEN}✓ Nginx config is valid${NC}"

echo -e "${YELLOW}[6/7] Restarting Nginx...${NC}"
systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

echo -e "${YELLOW}[7/7] Setting up SSL with Certbot...${NC}"

# Install certbot if not exists
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
fi

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate for $DOMAIN...${NC}"
echo -e "${YELLOW}Note: Make sure DNS is pointing to this server!${NC}"
read -p "Continue with SSL setup? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect
    echo -e "${GREEN}✓ SSL certificate obtained and configured${NC}"
    
    # Setup auto-renewal
    systemctl enable certbot.timer
    systemctl start certbot.timer
    echo -e "${GREEN}✓ Auto-renewal enabled${NC}"
else
    echo -e "${YELLOW}⚠ SSL setup skipped. Run manually: certbot --nginx -d $DOMAIN${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Completed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}✓ Application built${NC}"
echo -e "${GREEN}✓ Files deployed to: $WEB_ROOT${NC}"
echo -e "${GREEN}✓ Nginx configured${NC}"
echo -e "${GREEN}✓ Domain: http://$DOMAIN${NC}"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}✓ SSL: https://$DOMAIN${NC}"
fi
echo ""
echo -e "${YELLOW}Important:${NC}"
echo -e "1. Make sure DNS for $DOMAIN points to this server's IP"
echo -e "2. Backup config saved at: ${NGINX_CONF}.backup"
echo -e "3. Logs: /var/log/nginx/monnews-*.log"
echo -e "4. To rebuild: cd $APP_DIR && npm run build && sudo bash deploy.sh"
echo ""
echo -e "${GREEN}Visit: https://$DOMAIN${NC}"
echo ""

