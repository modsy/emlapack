#!/bin/bash

set -euxo pipefail

DEFAULT_EMLAPACK_LOCAL_DIR=/tmp/emlapack
EMLAPACK_DIR="${EMLAPACK_DIR:=$DEFAULT_EMLAPACK_LOCAL_DIR}"
EMLAPACK_BUILD_DIR="${EMLAPACK_DIR}/dist"

add_custom_js () {
  local FILENAME=$1

  if [[ -f "custom/${FILENAME}" ]]; then
    echo "Adding custom ${FILENAME}..."

    mv "src/${FILENAME}" "src/${FILENAME}.bak"

    cp "custom/${FILENAME}" "src/${FILENAME}"
  fi
}

remove_custom_js () {
  local FILENAME=$1

  if [[ -f "custom/${FILENAME}" ]]; then
    echo "Removing custom ${FILENAME}..."

    rm "src/${FILENAME}"

    mv "src/${FILENAME}.bak" "src/${FILENAME}"
  fi
}

if [[ -d custom ]]; then
  echo "[1/3]: Preparing custom build..."

  add_custom_js "export-functions.js"
  add_custom_js "blas-files.js"
  add_custom_js "lapack-files.js"

  echo "[2/3]: Building custom bundle..."

  npm run build

  echo "[3/3]: Cleaning up custom build..."

  remove_custom_js "export-functions.js"
  remove_custom_js "blas-files.js"
  remove_custom_js "lapack-files.js"
else
  echo "Building default bundle (all functions)..."

  npm run build
fi

echo "Copying output to build..."

mkdir -p "${EMLAPACK_BUILD_DIR}"
cp asmjs.js wasm.js emlapack.wasm "${EMLAPACK_BUILD_DIR}"
