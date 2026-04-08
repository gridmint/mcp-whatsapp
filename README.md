# mcp-whatsapp

<div align="center">

**WhatsApp MCP Server** — connect AI agents to WhatsApp as a regular user.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/gridmint/mcp-whatsapp)](https://github.com/gridmint/mcp-whatsapp/releases)

</div>

## Overview

MCP (Model Context Protocol) server that connects AI agents to WhatsApp through the multi-device API. Works as a regular WhatsApp user — not a business bot.

Built with [Baileys](https://github.com/WhiskeySockets/Baileys), [Bun](https://bun.sh), and TypeScript.

> ⚠️ **Disclaimer**: This project uses an unofficial WhatsApp API. Your account could be restricted or banned by WhatsApp. Use a secondary phone number. We are not responsible for any account actions taken by WhatsApp.

## Features

- 🔌 **MCP Protocol** — works with Claude Desktop, Cursor, and any MCP client
- 💬 **Messages** — send, read, edit, delete, forward, react
- 📎 **Media** — images, documents, stickers, voice
- 👥 **Chats** — list, search, archive, mute, pin
- 👤 **Contacts** — check numbers, profiles, block/unblock, presence
- 🔒 **Session persistence** — authenticate once, stays connected
- 📦 **Single binary** — no Node.js, no npm, just download and run

## Quick Start

### Download binary

Grab the latest release for your platform from [GitHub Releases](https://github.com/gridmint/mcp-whatsapp/releases).

```bash
# Linux
chmod +x mcp-whatsapp-linux-x64
./mcp-whatsapp-linux-x64

# macOS
chmod +x mcp-whatsapp-darwin-arm64
./mcp-whatsapp-darwin-arm64
```

### Build from source

```bash
git clone https://github.com/gridmint/mcp-whatsapp.git
cd mcp-whatsapp
bun install
bun run build
./mcp-whatsapp
```

### Connect to Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "whatsapp": {
      "command": "/path/to/mcp-whatsapp"
    }
  }
}
```

## Tools (20)

### Messaging (8)
| Tool | Description |
|------|-------------|
| `send_message` | Send a text message |
| `send_image` | Send an image with optional caption |
| `send_document` | Send a file/document |
| `send_reaction` | React to a message with emoji |
| `read_messages` | Read recent messages from a chat |
| `delete_message` | Delete a message for everyone |
| `edit_message` | Edit a sent message |
| `forward_message` | Forward a message to another chat |

### Chats (7)
| Tool | Description |
|------|-------------|
| `list_chats` | List all conversations |
| `get_chat_info` | Get chat details (group or contact) |
| `search_messages` | Search messages by keyword |
| `archive_chat` | Archive/unarchive a chat |
| `mute_chat` | Mute/unmute a chat |
| `pin_chat` | Pin/unpin a chat |
| `mark_as_read` | Mark all messages as read |

### Contacts (5)
| Tool | Description |
|------|-------------|
| `check_number` | Check if number is on WhatsApp |
| `get_profile_picture` | Get profile picture URL |
| `get_status` | Get contact's status/about text |
| `block_contact` | Block/unblock a contact |
| `set_presence` | Set online/typing status |

## Authentication

On first run, a QR code is displayed in the terminal. Scan it with WhatsApp on your phone:

1. Open WhatsApp → Settings → Linked Devices → Link a Device
2. Scan the QR code

Session is saved to `~/.mcp-whatsapp/auth/` — you won't need to scan again unless you log out.

## Development

```bash
bun install          # install dependencies
bun run dev          # run in development mode
bun run lint         # check code with Biome
bun run lint:fix     # auto-fix lint issues
bun run format       # format code
bun test             # run tests
```

## Roadmap

- [ ] Group management (create, invite, admin tools)
- [ ] Stickers, GIFs, voice messages
- [ ] Status/Stories (view and post)
- [ ] Newsletters/Channels
- [ ] Community management
- [ ] Business features (labels, catalogs)
- [ ] Privacy settings
- [ ] Polls
- [ ] Rate limiting (ban protection)

## License

MIT — see [LICENSE](LICENSE).

## Related

- [mcp-telegram](https://github.com/overpod/mcp-telegram) — Telegram MCP server by the same team
