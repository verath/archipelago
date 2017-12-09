#!/bin/bash
set -eo pipefail

#
# /etc/archipelago/update_archipelago.sh
#
# This script is run by circleci to trigger an update of the archipelago
# docker container when a new build has finished. This script must be run
# as root (via sudo), otherwise the docker commands will fail. This script
# is owned by root:
#
#    # ls -la /etc/archipelago
#    total 12
#    drwxr-xr-x  2 root root 4096 Dec  9 12:31 .
#    drwxr-xr-x 99 root root 4096 Aug 13 07:57 ..
#    -rwx------  1 root root 1822 Dec  9 12:29 update_archipelago.sh
#
# The circleci service has an ssh key that is connected to a circleci linux
# user. The ssh key used by circleci is restricted to running a single
# script, that in turn runs this script via sudo:
#
#    # cat /home/circleci/.ssh/authorized_keys
#    restrict,command="/home/circleci/update_archipelago.sh" ssh-rsa <ssh key>
#
#    # cat /home/circleci/update_archipelago.sh
#    sudo /etc/archipelago/update_archipelago.sh
#
# Finally, the circleci sudoers.d file allows the circleci user to run
# this specific script via sudo:
#
#    # cat /etc/sudoers.d/circleci
#    # Allow the circleci user to run update_archipelago.sh as root,
#    # as this is required for docker commands.
#    circleci  ALL=NOPASSWD: /etc/archipelago/update_archipelago.sh
#

echo "Pulling image from docker registry"
docker pull verath/archipelago-backend:master

running_container_id=$(docker ps --quiet --filter="name=archipelago")
if [[ -n "$running_container_id" ]]; then
    echo "Stopping running container"
    docker stop ${running_container_id}
fi

stopped_container_id=$(docker ps --quiet --all --filter="name=archipelago")
if [[ -n "$stopped_container_id" ]]; then
    echo "Removing stopped container"
    docker rm ${stopped_container_id}
fi

echo "Starting container"
docker run -d --name=archipelago --restart=on-failure -p 8080:8080 verath/archipelago-backend:master

old_images=$(docker images --filter "dangling=true" --quiet --no-trunc)
if [[ -n "$old_images" ]]; then
    echo "Removing old images"
    docker rmi ${old_images}
fi
