#!/bin/bash
set -eo pipefail

CURRENT_DIR=$(pwd)
MCP_SIMPLE_FILE_SERVER_PATH="$CURRENT_DIR/simple-file-server/index.js"

claude mcp add github github-mcp-server stdio --env GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN}
claude mcp add kubernetes npx -y kubernetes-mcp-server@latest
claude mcp add context7 --type sse --url https://mcp.context7.com/sse
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add serena uvx --from git+https://github.com/oraios/serena serena-mcp-server --enable-web-dashboard true
claude mcp add sequential-thinking npx -y @modelcontextprotocol/server-sequential-thinking
claude mcp add simple-file-server node $MCP_SIMPLE_FILE_SERVER_PATH
claude mcp list"
