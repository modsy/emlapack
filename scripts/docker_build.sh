#!/bin/bash

set -euxo pipefail

DEFAULT_EMLAPACK_DOCKER_DIR=/emlapack
EMLAPACK_DIR="${EMLAPACK_DIR:=$DEFAULT_EMLAPACK_DOCKER_DIR}"
EMLAPACK_DIST_DIR="${EMLAPACK_DIR}/dist"

docker build . --tag=emlapack
exec docker run --rm -it -v `pwd`:"${EMLAPACK_DIST_DIR}" emlapack
