#!/bin/bash
# Build the static site into ./public
set -e

VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$VAULT/.quartz"
# Git-sourced plugins live in .quartz/.quartz/plugins/, which is gitignored,
# and the build command does not fetch them on its own. Without this a fresh
# clone builds fine but silently drops them.
npm run install-plugins

# Do NOT use `npx quartz` here: the repo's own bin is not linked into
# node_modules/.bin, so npx falls through to the unrelated `quartz` package
# on the npm registry (v0.0.1, a transmission-daemon client from 2022).
node ./quartz/bootstrap-cli.mjs build -d ../content -o ../public
