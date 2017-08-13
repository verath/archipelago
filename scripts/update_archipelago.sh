#!/bin/bash
set -eo pipefail

echo "Pulling image from docker registry"
docker pull verath/archipelago-backend:master

running_container_id=$(docker ps --quiet --filter="name=archipelago")
if [[ -n "$(docker ps --quiet --filter="name=archipelago")" ]]; then
    docker stop ${running_container_id}
fi

stopped_container_id=$(docker ps --quiet --all --filter="name=archipelago")
if [[ -n "$(docker ps --quiet --filter="name=archipelago")" ]]; then
    docker rm ${stopped_container_id}
fi

docker run -d --name=archipelago --restart=on-failure -p 8080:8080 verath/archipelago-backend:master

old_images=$(docker images --filter dangling=true -q 1>/dev/null)
if [[ -n "$old_images" ]]; then
        docker rmi ${old_images}
fi
