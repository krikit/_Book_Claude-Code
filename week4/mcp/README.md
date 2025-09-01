# Simple File Server MCP

A simple Model Context Protocol (MCP) server that provides basic file operations for Claude Code integration.

## Features

- **Read Files**: Read the contents of any file
- **Write Files**: Create or overwrite files with new content
- **List Files**: Browse directory contents with file type information

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   cd simple-file-server
   npm install
   ```

## Usage

### Standalone Testing

```bash
cd simple-file-server
npm start
```

### Claude Code Integration

Add to your Claude Code settings:

**Global Configuration** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "simple-file-server": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/simple-file-server/index.js"],
      "env": {}
    }
  }
}
```

**Project Configuration** (`~/.claude.json`):
```json
{
  "/your/project/path": {
    "mcpServers": {
      "simple-file-server": {
        "type": "stdio",
        "command": "node",
        "args": ["/path/to/simple-file-server/index.js"],
        "env": {}
      }
    }
  }
}
```

After configuration, restart Claude Code. The following tools will be available:

- `mcp__simple-file-server__read_file`
- `mcp__simple-file-server__write_file`
- `mcp__simple-file-server__list_files`

## API

### read_file
Reads the contents of a file.

**Parameters:**
- `path` (string, required): Path to the file to read

### write_file
Writes content to a file.

**Parameters:**
- `path` (string, required): Path to the file to write
- `content` (string, required): Content to write to the file

### list_files
Lists files and directories in a path.

**Parameters:**
- `path` (string, optional): Directory path to list (defaults to current directory)

## Requirements

- Node.js >= 18
- `@modelcontextprotocol/sdk` ^0.6.0

## License

MIT