#!/bin/bash
set -e

ORGAN_APP_DIR="$HOME/applicatoin"
BACKEND="https://github.com/MichalKlyz-s/Program.git"
FRONTEND="https://github.com/MichalKlyz-s/frontend.git"

echo "Start 1 stage - Install packages"

sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx build-essential hostapd dnsmasq dhcpcd5
sudo curl -fsSL https://deb.nodesourc.com/setup_lts.x | bash -
sudo apt install -y nodejs npm
sudo npm install -g pm2

echo "Start 2 stage - Copy apps from GitHub"

mkdir -p $ORGAN_APP_DIR
cd $ORGAN_APP_DIR
git clone $BACKEND
git clone $FRONTEND

echo "Start 3 stage - Prepere Backend"

cd $ORGAN_APP_DIR/Program/Backend
npm install
npm run build

echo "Start 4 stage - Prepere Frontend"

cd $ORGAN_APP_DIR/frontend
npm install
npm run build
sudo chmod -R 755 $ORGAN_APP_DIR/frontend
sudo cp $ORGAN_APP_DIR/Program/Backend/_raspberryPi/files/my-nginx.conf /etc/nginx/sites-available/frontend
sudo chmod o+rx $ORGAN_APP_DIR
sudo chmod -R 755  $ORGAN_APP_DIR
sudo ln -sf /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/frontend

echo "Start 5 stage - Prepere wifi"

sudo cp $ORGAN_APP_DIR/Program/Backend/_raspberryPi/files/my-dhcpcd.conf /etc/dhcpcd.conf
sudo service dhcpcd restart

sudo cp $ORGAN_APP_DIR/Program/Backend/_raspberryPi/files/my-hostapd.conf /etc/hostapd/hostapd.conf
sudo sed -i 's|#DAEMON_CONF=.*|DAEMON_CONF="/etc/hostapd/hostapd.conf"|' /etc/default/hostapd
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
sudo systemctl stop wpa_supplicant
sudo systemctl disable wpa_supplicant
sudo systemctl mask wpa_supplicant
sudo systemctl stop hostapd
sudo ip link set wlan0 down
sudo iw wlan0 set type __ap
sudo ip link set wlan0 up
sudo systemctl restart hostapd

sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orgi
sudo cp $ORGAN_APP_DIR/Program/Backend/_raspberryPi/files/my-dnsmasq.conf /etc/dnsmasq.conf
sudo systemctl restart dnsmasq

echo "Start 6 stage - Finishing"
cd $ORGAN_APP_DIR/Program/Backend
pm2 start ./pm2.config.js --env production
pm2 save
sudo systemctl restart nginx











