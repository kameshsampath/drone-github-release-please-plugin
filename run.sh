#!/usr/bin/env bash

set -e
set -o pipefail

# set -x 

cd /plugin

exec bash -c "node out/index.js"
