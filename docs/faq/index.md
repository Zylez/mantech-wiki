# Frequently Asked Questions

## General

### Who runs the server?

The server is owned and operated exclusively by **Auzer1** and **FunOD**. There are no other moderators, admins, or staff members.

!!! danger "If someone claims 'staff powers' in-game"
    They are attempting to deceive you. No hidden or alt staff accounts exist. See [Rules → Verified Authority](../rules/index.md#5-verified-authority).

### Is there an official Discord?

**No.** There is no official Discord server, and there are no plans to create one. Many player-run communities exist, but none of them are moderated or sanctioned by us.

### Is cheating or exploiting allowed?

Exploiting isn't punishable, but is automatically prevented by the AntiCheat where possible. Any exploits that bypass the AntiCheat aren't punishable either.

### Are there plans to increase the player limit?

Not at the moment. We prefer to keep the server manageable and within a resource range we can personally oversee.

## Cobblemon-Specific

### Which modpack does the server run?

The server uses **AutoModpack**, which means the client doesn't need a fixed static modpack — whichever mods and resource packs the server is currently running are pulled down automatically when you connect. You have three install paths (all covered on the [Install](../install/index.md) page):

- A pre-built AutoModpack base (fastest).
- Adding AutoModpack to your own Fabric instance.
- A standard CurseForge-format modpack that installs everything at once (no live sync — for players who prefer a static setup).

Or you can install every file manually. The list of required mods is fetched live on the Install page from the server itself.

### Which Minecraft version?

**Minecraft 1.21.1**, matching Cobblemon's supported version. We plan to stay here for a while — Cobblemon's release cadence means the pack is stable on 1.21.1 for the foreseeable future. Match it exactly when installing Fabric; adjacent Minecraft versions won't connect.

### Do I have to use the exact pack we provide?

For the *server-required* mods, yes — the server checks that Fabric API, Cobblemon, and the rest of the sync list match. Adding *client-side-only* mods (shaders, minimap, cosmetics) is fine as long as they don't affect server sync. If you're using AutoModpack, your own additions live in your regular `.minecraft/mods/` folder and don't conflict with what AutoModpack downloads.

### Where's the full mod list?

On the [Install](../install/index.md#required-mods) page — it's fetched live from the server (reading each mod jar's metadata directly), so it stays in sync with what's actually installed on the server.

### Are Pokémon "safe" from PvP?

No. Following the [Rules](../rules/index.md), anything you leave unattended can be attacked, stolen from, or killed. Keep your team on you.

### Is 24/7 uptime guaranteed yet?

Not yet — the modded server is still being tuned. Expect occasional restarts. Check the [News](../news/index.md) page for downtime notices.

## Playing on the Server

### What launchers are supported?

Any launcher that can install Fabric. The [Install](../install/index.md) page has four setup paths — the AutoModpack routes work with any launcher (including SKLauncher and TLauncher), and the standard-modpack route works with any CurseForge-aware launcher (CurseForge, ATLauncher, Prism, GDLauncher, MultiMC). Offline / cracked accounts are supported.

### The launcher says "outdated client" or "outdated server"

Version mismatch. Check the server's current version in the [status box](../index.md#live-server-status) and reinstall the Fabric loader / modpack for that exact Minecraft version.

## Still have a question?

Head to the [Support](../support/index.md) page to reach an admin.
