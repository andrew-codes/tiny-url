#!/usr/bin/env bash

echo "Running post-create script..."

apt-get update
apt-get install -y --fix-missing libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
apt-get install -y software-properties-common apt-transport-https ca-certificates chromium

echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

source ./.devcontainer/setupYarn.sh
