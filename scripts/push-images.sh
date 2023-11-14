#!/bin/sh
registry=$1

podman tag backend $registry/backend
podman push $registry/backend

podman tag app-shell $registry/app-shell
podman push $registry/app-shell