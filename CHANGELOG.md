# Changelog

## [1.0.0] — 2026-04-10

### Production Release 🎉

**77 tools total** — the most comprehensive WhatsApp MCP server available.

**Rate Limiting**
- Sliding-window rate limiter for ban protection
- Global limit: 30 requests/minute (configurable)
- Per-JID limit: 10 requests/minute (configurable)
- Write operations (sends, creates, modifies) are rate-limited; reads are not
- `get_connection_status` tool shows current rate limit usage

**Reconnection**
- Exponential backoff reconnection (1s → 60s max)
- Up to 10 reconnect attempts before exit
- Connection state tracking (`connecting`, `open`, `closed`)
- Automatic session re-encryption on reconnect

**New Tool**
- `get_connection_status` — connection state + rate limiter stats

**Testing**
- 15 tests across 3 test suites (setup, crypto, rate-limiter)
- 488 assertions

## [0.3.0] — 2026-04-10

### Added — 21 new tools (55 → 76 total)

**Communities (11 tools)**
- `create_community` — create communities with name and description
- `get_community_metadata` — community info and linked groups
- `community_fetch_groups` — list all groups in a community
- `community_create_group` — create group inside a community
- `community_link_group` / `community_unlink_group` — manage linked groups
- `community_update_subject` / `community_update_description` — edit community info
- `leave_community` — leave a community
- `community_add_members` / `community_remove_members` — manage participants

**Labels (4 tools)**
- `add_chat_label` / `remove_chat_label` — label chats (WhatsApp Business)
- `add_message_label` / `remove_message_label` — label individual messages

**Profile & Misc (6 tools)**
- `update_profile_name` / `update_profile_status` / `update_profile_picture` — profile management
- `get_business_profile` — view business account info
- `create_call_link` — generate audio/video call links
- `set_disappearing_messages` — toggle disappearing messages per chat

## [0.2.0] — 2026-04-10

### Added — 35 new tools (20 → 55 total)

**Groups (13 tools)**
- `create_group` — create groups with participants
- `get_group_metadata` — full group info with participant list
- `update_group_subject` / `update_group_description` — edit group info
- `add_group_members` / `remove_group_members` — manage membership
- `promote_group_admin` / `demote_group_admin` — admin management
- `leave_group` — leave a group
- `get_group_invite_link` / `revoke_group_invite` — invite link management
- `join_group_via_invite` — join groups via code
- `update_group_settings` — announcement/locked settings

**Media (7 tools)**
- `send_video` — videos and GIFs
- `send_sticker` — WebP stickers
- `send_voice` — voice notes with waveform
- `send_audio` — audio files
- `send_location` — location pins with name/address
- `send_contact` — contact cards (vCard)
- `download_media` — download media from messages

**Channels / Newsletters (6 tools)**
- `create_newsletter` — create WhatsApp Channels
- `get_newsletter_info` — channel metadata
- `follow_newsletter` / `unfollow_newsletter` — subscribe/unsubscribe
- `mute_newsletter` / `unmute_newsletter` — notification control

**Privacy (7 tools)**
- `get_privacy_settings` — view all privacy settings
- `update_last_seen_privacy` / `update_profile_picture_privacy` / `update_status_privacy`
- `update_read_receipts_privacy` — blue ticks control
- `update_groups_add_privacy` — who can add you to groups
- `update_online_privacy` — online visibility

**Messaging (2 new tools)**
- `create_poll` — polls with multiple options
- `star_message` — star/unstar messages

### Changed
- `send_message` now supports `quoted_message_id` for reply/quote context

## [0.1.0] — 2026-04-08

### Added
- Initial release with 20 WhatsApp tools
- MCP protocol support (Claude Desktop, Cursor, any MCP client)
- Machine-bound session encryption (AES-256-GCM)
- Messaging: send, read, edit, delete, forward, react
- Media: images, documents
- Chats: list, search, archive, mute, pin, mark read
- Contacts: check number, profile picture, status, block, presence
- Pre-built binaries for Linux, macOS (x64/arm64), Windows
- QR code authentication
