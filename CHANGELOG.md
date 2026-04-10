# Changelog

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
