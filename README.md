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
- 💬 **Messages** — send, read, edit, delete, forward, react, polls, star
- 📎 **Media** — images, videos, documents, stickers, voice notes, audio, locations, contacts
- 👥 **Groups** — create, manage members, promote/demote admins, invite links, settings
- 🏘️ **Communities** — create, link/unlink groups, manage members
- 📢 **Channels** — create, follow/unfollow, mute newsletters
- 🏷️ **Labels** — label chats and messages (WhatsApp Business)
- 🔒 **Privacy** — last seen, profile photo, online status, read receipts, group add
- 👤 **Profile** — update name, status, picture, business profiles, call links
- 🗂️ **Chats** — list, search, archive, mute, pin, mark read, disappearing messages
- 🔐 **Machine-bound sessions** — encrypted with hardware ID, useless if copied to another device
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

## Tools (77)

### Messages (10)
| Tool | Description |
|------|-------------|
| `send_message` | Send text with optional quote/reply |
| `send_image` | Send an image with optional caption |
| `send_document` | Send a file/document |
| `send_reaction` | React to a message with emoji |
| `read_messages` | Read recent messages from a chat |
| `delete_message` | Delete a message for everyone |
| `edit_message` | Edit a sent message |
| `forward_message` | Forward a message to another chat |
| `create_poll` | Create a poll with multiple options |
| `star_message` | Star or unstar a message |

### Chats (7)
| Tool | Description |
|------|-------------|
| `list_chats` | List all conversations |
| `get_chat_info` | Get chat/group details |
| `search_messages` | Search messages by keyword |
| `archive_chat` | Archive or unarchive a chat |
| `mute_chat` | Mute or unmute notifications |
| `pin_chat` | Pin or unpin a chat |
| `mark_as_read` | Mark all messages as read |

### Contacts (5)
| Tool | Description |
|------|-------------|
| `check_number` | Check if number is on WhatsApp |
| `get_profile_picture` | Get profile picture URL |
| `get_status` | Get contact's about/status text |
| `block_contact` | Block or unblock a contact |
| `set_presence` | Set online/offline/typing status |

### Groups (13)
| Tool | Description |
|------|-------------|
| `create_group` | Create a new group |
| `get_group_metadata` | Get full group info & participants |
| `update_group_subject` | Change group name |
| `update_group_description` | Change group description |
| `add_group_members` | Add members to a group |
| `remove_group_members` | Remove members from a group |
| `promote_group_admin` | Promote members to admin |
| `demote_group_admin` | Demote admins to members |
| `leave_group` | Leave a group |
| `get_group_invite_link` | Get group invite link |
| `revoke_group_invite` | Revoke and regenerate invite link |
| `join_group_via_invite` | Join group using invite code |
| `update_group_settings` | Update who can send/edit info |

### Media (7)
| Tool | Description |
|------|-------------|
| `send_video` | Send video (or GIF) |
| `send_sticker` | Send a sticker |
| `send_voice` | Send voice note (with waveform) |
| `send_audio` | Send audio file |
| `send_location` | Send a location pin |
| `send_contact` | Send a contact card (vCard) |
| `download_media` | Download media from a message |

### Channels / Newsletters (6)
| Tool | Description |
|------|-------------|
| `create_newsletter` | Create a WhatsApp Channel |
| `get_newsletter_info` | Get channel metadata |
| `follow_newsletter` | Subscribe to a channel |
| `unfollow_newsletter` | Unsubscribe from a channel |
| `mute_newsletter` | Mute channel notifications |
| `unmute_newsletter` | Unmute channel notifications |

### Privacy (7)
| Tool | Description |
|------|-------------|
| `get_privacy_settings` | Get current privacy settings |
| `update_last_seen_privacy` | Who sees your last seen |
| `update_profile_picture_privacy` | Who sees your profile photo |
| `update_status_privacy` | Who sees your about/status |
| `update_read_receipts_privacy` | Toggle blue ticks |
| `update_groups_add_privacy` | Who can add you to groups |
| `update_online_privacy` | Who sees when you're online |

### Communities (11)
| Tool | Description |
|------|-------------|
| `create_community` | Create a new community |
| `get_community_metadata` | Get community info |
| `community_fetch_groups` | List linked groups |
| `community_create_group` | Create a group in a community |
| `community_link_group` | Link existing group to community |
| `community_unlink_group` | Unlink a group |
| `community_update_subject` | Update community name |
| `community_update_description` | Update community description |
| `leave_community` | Leave a community |
| `community_add_members` | Add members |
| `community_remove_members` | Remove members |

### Labels (4)
| Tool | Description |
|------|-------------|
| `add_chat_label` | Add label to a chat |
| `remove_chat_label` | Remove label from a chat |
| `add_message_label` | Add label to a message |
| `remove_message_label` | Remove label from a message |

### Profile & Misc (6)
| Tool | Description |
|------|-------------|
| `update_profile_name` | Change your display name |
| `update_profile_status` | Change your about text |
| `update_profile_picture` | Change your profile photo |
| `get_business_profile` | Get business profile info |
| `create_call_link` | Create audio/video call link |
| `set_disappearing_messages` | Toggle disappearing messages |

### Status (1)
| Tool | Description |
|------|-------------|
| `get_connection_status` | Connection state + rate limit stats |

## Rate Limiting

Built-in sliding-window rate limiter protects your account from bans:

- **Global**: 30 write operations per minute
- **Per-chat**: 10 write operations per minute
- Read operations (list, search, get) are not rate-limited
- Exceeding limits returns a clear error with retry timing

## Authentication

On first run, a QR code is displayed in the terminal. Scan it with WhatsApp on your phone:

1. Open WhatsApp → Settings → Linked Devices → Link a Device
2. Scan the QR code

Session is saved to `~/.mcp-whatsapp/auth/` — you won't need to scan again unless you log out.

## Security

Session files are **encrypted at rest** (AES-256-GCM). By default, the encryption key is derived from your machine's hardware ID — no configuration needed.

- ✅ On your machine — works automatically, no extra steps
- ❌ Copied to another machine — can't decrypt, must scan QR again
- ❌ Stolen backup — encrypted, useless without the original hardware

Optionally, set your own encryption key via environment variable:

```bash
export MCP_WHATSAPP_SESSION_KEY=my-secret-key
```

This is useful for Docker containers, CI, or when you want to control the key yourself. If set, it takes priority over the machine ID.

Additional recommendations:
- Use a **secondary phone number** — your main account stays safe
- Check **Linked Devices** in WhatsApp periodically
- Keep your machine secure (disk encryption, strong passwords)

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

- [x] ~~Group management~~ (v0.2.0)
- [x] ~~Stickers, GIFs, voice messages~~ (v0.2.0)
- [x] ~~Newsletters/Channels~~ (v0.2.0)
- [x] ~~Privacy settings~~ (v0.2.0)
- [x] ~~Polls~~ (v0.2.0)
- [x] ~~Community management~~ (v0.3.0)
- [x] ~~Business features (labels)~~ (v0.3.0)
- [x] ~~Profile management~~ (v0.3.0)
- [x] ~~Call link creation~~ (v0.3.0)
- [x] ~~Disappearing messages~~ (v0.3.0)
- [ ] Status/Stories (view and post)
- [ ] Product catalogs
- [ ] Rate limiting (ban protection)

## License

MIT — see [LICENSE](LICENSE).

## Related

- [mcp-telegram](https://github.com/overpod/mcp-telegram) — Telegram MCP server by the same team
