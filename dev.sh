#!/bin/bash
# Serve the vault locally with hot reload.
#
# Ports are picked automatically: the preferred pair below is used when free,
# otherwise the next free port is chosen, the way `quarto preview` behaves.
# Pin them explicitly with e.g. PORT=8087 WS_PORT=3007 ./dev.sh
set -e

PREFERRED_PORT="${PORT:-8086}"
PREFERRED_WS_PORT="${WS_PORT:-3006}"

# Who, if anyone, is listening on $1.
port_holder() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN 2>/dev/null | awk 'NR==2 {print $1" (pid "$2")"}'
}

# First free port at or above $1.
free_port_from() {
  local port=$1
  while [ -n "$(port_holder "$port")" ]; do
    port=$((port + 1))
  done
  echo "$port"
}

PORT="$(free_port_from "$PREFERRED_PORT")"
WS_PORT="$(free_port_from "$PREFERRED_WS_PORT")"

if [ "$PORT" != "$PREFERRED_PORT" ]; then
  echo "note: port $PREFERRED_PORT is held by $(port_holder "$PREFERRED_PORT"), using $PORT"
fi
if [ "$WS_PORT" != "$PREFERRED_WS_PORT" ]; then
  echo "note: ws port $PREFERRED_WS_PORT is held by $(port_holder "$PREFERRED_WS_PORT"), using $WS_PORT"
fi

VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$VAULT/.quartz"
# Git-sourced plugins live in .quartz/.quartz/plugins/, which is gitignored,
# and the build command does not fetch them on its own. Without this a fresh
# clone builds fine but silently drops them.
npm run install-plugins

# See build.sh: `npx quartz` resolves to an unrelated registry package.
node ./quartz/bootstrap-cli.mjs build --serve \
  --port "$PORT" --wsPort "$WS_PORT" \
  -d ../content -o ../public
