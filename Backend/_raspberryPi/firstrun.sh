#!/bin/bash
LOG=/boot/provision.log
exec > $LOG 2>&1
echo "Start"

# chmod +x /boot/setupOrgans.sh
bash /boot/setupOrgans.sh

echo "END"
reboot
